import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Reminder } from '@/types/reminder';
import { reminderStorage } from '@/services/storage/reminderStorage';
import { notificationService } from '@/services/notifications/notificationService';

interface ReminderContextType {
  reminders: Reminder[];
  loading: boolean;
  addReminder: (reminder: Omit<Reminder, 'id' | 'notificationId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getRemindersByPetId: (petId: string) => Reminder[];
  refreshReminders: () => Promise<void>;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshReminders = async () => {
    try {
      const allReminders = await reminderStorage.getAll();
      setReminders(allReminders);
    } catch (error) {
      console.error('Error refreshing reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshReminders();
  }, []);

  const addReminder = async (reminderData: Omit<Reminder, 'id' | 'notificationId' | 'createdAt' | 'updatedAt'>) => {
    // Schedule notification - use recurring for weekly/monthly
    const notificationId = reminderData.repeat === 'weekly' || reminderData.repeat === 'monthly'
      ? await notificationService.scheduleRecurringReminder(reminderData as Reminder)
      : await notificationService.scheduleReminder(reminderData as Reminder);

    const newReminder: Reminder = {
      ...reminderData,
      notificationId: notificationId || undefined,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await reminderStorage.save(newReminder);
    await refreshReminders();
  };

  const updateReminder = async (id: string, reminderData: Partial<Reminder>) => {
    const existingReminder = reminders.find(r => r.id === id);
    if (!existingReminder) throw new Error('Reminder not found');

    // Cancel old notification if exists
    if (existingReminder.notificationId) {
      await notificationService.cancelNotification(existingReminder.notificationId);
    }

    // Schedule new notification if date/time changed - use recurring for weekly/monthly
    const updatedReminderData = { ...existingReminder, ...reminderData };
    const notificationId = updatedReminderData.repeat === 'weekly' || updatedReminderData.repeat === 'monthly'
      ? await notificationService.scheduleRecurringReminder(updatedReminderData)
      : await notificationService.scheduleReminder(updatedReminderData);

    const updatedReminder: Reminder = {
      ...existingReminder,
      ...reminderData,
      notificationId: notificationId || undefined,
      id,
      updatedAt: new Date().toISOString(),
    };
    await reminderStorage.save(updatedReminder);
    await refreshReminders();
  };

  const deleteReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder?.notificationId) {
      await notificationService.cancelNotification(reminder.notificationId);
    }
    await reminderStorage.delete(id);
    await refreshReminders();
  };

  const getRemindersByPetId = (petId: string) => {
    return reminders.filter(r => r.petId === petId);
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        loading,
        addReminder,
        updateReminder,
        deleteReminder,
        getRemindersByPetId,
        refreshReminders,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
};

