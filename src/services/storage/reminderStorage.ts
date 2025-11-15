import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reminder } from '@/types/reminder';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Reminder Storage Service
 * Handles all CRUD operations for reminders using AsyncStorage
 */
export const reminderStorage = {
  /**
   * Get all reminders
   */
  async getAll(): Promise<Reminder[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting reminders:', error);
      return [];
    }
  },

  /**
   * Get reminders by pet ID
   */
  async getByPetId(petId: string): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      return reminders.filter(r => r.petId === petId);
    } catch (error) {
      console.error('Error getting reminders by pet ID:', error);
      return [];
    }
  },

  /**
   * Get a single reminder by ID
   */
  async getById(id: string): Promise<Reminder | null> {
    try {
      const reminders = await this.getAll();
      return reminders.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error getting reminder by ID:', error);
      return null;
    }
  },

  /**
   * Save a reminder (create or update)
   */
  async save(reminder: Reminder): Promise<void> {
    try {
      const reminders = await this.getAll();
      const index = reminders.findIndex(r => r.id === reminder.id);
      
      if (index >= 0) {
        reminders[index] = { ...reminder, updatedAt: new Date().toISOString() };
      } else {
        reminders.push(reminder);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminder:', error);
      throw error;
    }
  },

  /**
   * Delete a reminder by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const reminders = await this.getAll();
      const filtered = reminders.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  },

  /**
   * Delete all reminders for a pet
   */
  async deleteByPetId(petId: string): Promise<void> {
    try {
      const reminders = await this.getAll();
      const filtered = reminders.filter(r => r.petId !== petId);
      await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting reminders by pet ID:', error);
      throw error;
    }
  },
};

