export type NotificationCategory = 'reminder' | 'vaccine' | 'health' | 'expense' | 'general';

export type NotificationSound = 'default' | 'gentle' | 'urgent' | 'silent';

export interface NotificationSettings {
  categories: {
    [key in NotificationCategory]: {
      enabled: boolean;
      sound: NotificationSound;
      vibrate: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
  };
  grouping: boolean;
  customSounds: {
    [key: string]: string; // category -> sound file path
  };
}

