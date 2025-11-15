import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types/settings';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/utils/constants';

/**
 * Settings Storage Service
 * Handles settings persistence using AsyncStorage
 */
export const settingsStorage = {
  /**
   * Get settings (returns defaults if not set)
   */
  async get(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Save settings
   */
  async save(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  /**
   * Reset to default settings
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },
};

