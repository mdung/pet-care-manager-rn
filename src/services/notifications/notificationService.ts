import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { Reminder } from '@/types/reminder';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Notification Service
 * Handles scheduling and canceling local notifications for reminders
 */
export const notificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  /**
   * Schedule a notification for a reminder
   * Handles recurring reminders (weekly, monthly)
   */
  async scheduleReminder(reminder: Reminder): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return null;
      }

      const reminderDateTime = dayjs(`${reminder.reminderDate} ${reminder.reminderTime}`);
      
      // Don't schedule if the reminder is in the past (unless it's recurring)
      if (reminderDateTime.isBefore(dayjs()) && reminder.repeat === 'none') {
        console.warn('Cannot schedule notification for past date');
        return null;
      }

      // For recurring reminders, schedule multiple notifications
      if (reminder.repeat === 'weekly' || reminder.repeat === 'monthly') {
        return await this.scheduleRecurringReminder(reminder);
      }

      // Single notification for non-recurring reminders
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description || `Reminder for ${reminder.type}`,
          data: { reminderId: reminder.id, petId: reminder.petId },
        },
        trigger: reminderDateTime.toDate(),
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  /**
   * Schedule recurring notifications (weekly or monthly)
   * Schedules up to 52 weeks or 12 months ahead
   */
  async scheduleRecurringReminder(reminder: Reminder): Promise<string | null> {
    try {
      const reminderDateTime = dayjs(`${reminder.reminderDate} ${reminder.reminderTime}`);
      const now = dayjs();
      const notificationIds: string[] = [];
      const maxOccurrences = reminder.repeat === 'weekly' ? 52 : 12;
      
      // Start from the reminder date, or next occurrence if in the past
      let currentDate = reminderDateTime.isBefore(now) 
        ? (reminder.repeat === 'weekly' 
            ? now.add(1, 'week').day(reminderDateTime.day()).hour(reminderDateTime.hour()).minute(reminderDateTime.minute())
            : now.add(1, 'month').date(reminderDateTime.date()).hour(reminderDateTime.hour()).minute(reminderDateTime.minute()))
        : reminderDateTime;

      // Schedule multiple notifications
      for (let i = 0; i < maxOccurrences; i++) {
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.description || `Reminder for ${reminder.type}`,
            data: { reminderId: reminder.id, petId: reminder.petId, occurrence: i },
          },
          trigger: currentDate.toDate(),
        });
        
        notificationIds.push(notificationId);
        
        // Calculate next occurrence
        if (reminder.repeat === 'weekly') {
          currentDate = currentDate.add(1, 'week');
        } else {
          currentDate = currentDate.add(1, 'month');
        }
      }

      // Return the first notification ID as the main ID
      // Note: In a production app, you might want to store all IDs
      return notificationIds[0] || null;
    } catch (error) {
      console.error('Error scheduling recurring reminder:', error);
      return null;
    }
  },

  /**
   * Cancel a notification by ID
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  /**
   * Get all scheduled notifications
   */
  async getAllScheduled(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },
};

