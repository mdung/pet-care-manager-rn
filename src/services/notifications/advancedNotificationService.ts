import * as Notifications from 'expo-notifications';
import { NotificationSettings, NotificationCategory, NotificationSound } from '@/types/notification';
import dayjs from 'dayjs';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const advancedNotificationService = {
  /**
   * Check if current time is within quiet hours
   */
  isQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHours.enabled) return false;

    const now = dayjs();
    const start = dayjs(settings.quietHours.startTime, 'HH:mm');
    const end = dayjs(settings.quietHours.endTime, 'HH:mm');

    // Handle quiet hours that span midnight
    if (start.isAfter(end)) {
      return now.isAfter(start) || now.isBefore(end);
    }
    return now.isAfter(start) && now.isBefore(end);
  },

  /**
   * Get notification sound for category
   */
  getNotificationSound(category: NotificationCategory, settings: NotificationSettings): NotificationSound {
    const categorySettings = settings.categories[category];
    if (categorySettings.customSounds && categorySettings.customSounds[category]) {
      return categorySettings.customSounds[category] as NotificationSound;
    }
    return categorySettings.sound;
  },

  /**
   * Schedule notification with advanced settings
   */
  async scheduleNotification(
    content: Notifications.NotificationContentInput,
    trigger: Notifications.NotificationTriggerInput,
    category: NotificationCategory,
    settings: NotificationSettings
  ): Promise<string> {
    // Check if category is enabled
    if (!settings.categories[category].enabled) {
      throw new Error(`Notification category ${category} is disabled`);
    }

    // Check quiet hours
    if (this.isQuietHours(settings)) {
      // Schedule for after quiet hours
      const quietEnd = dayjs(settings.quietHours.endTime, 'HH:mm');
      const now = dayjs();
      if (now.isBefore(quietEnd)) {
        const delay = quietEnd.diff(now, 'millisecond');
        trigger = { seconds: delay / 1000 };
      }
    }

    // Get sound setting
    const sound = this.getNotificationSound(category, settings);
    const shouldPlaySound = sound !== 'silent';

    // Configure notification with category grouping
    const notificationContent: Notifications.NotificationContentInput = {
      ...content,
      sound: shouldPlaySound,
      categoryIdentifier: settings.grouping ? category : undefined,
      data: {
        ...content.data,
        category,
      },
    };

    return await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger,
    });
  },

  /**
   * Configure notification categories for grouping
   */
  async configureNotificationCategories(settings: NotificationSettings): Promise<void> {
    if (!settings.grouping) return;

    const categories: Notifications.NotificationCategory[] = Object.keys(settings.categories).map(
      (key: string) => ({
        identifier: key,
        actions: [],
        options: {
          customDismissAction: true,
        },
      })
    );

    await Notifications.setNotificationCategoryAsync(categories);
  },
};

