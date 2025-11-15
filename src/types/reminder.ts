export type ReminderType = 'vet_visit' | 'medicine' | 'grooming' | 'custom';
export type RepeatOption = 'none' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  petId: string;
  type: ReminderType;
  title: string;
  description?: string;
  reminderDate: string; // ISO date string
  reminderTime: string; // HH:mm format
  repeat: RepeatOption;
  notificationId?: string; // ID from notification service
  createdAt: string;
  updatedAt: string;
}

