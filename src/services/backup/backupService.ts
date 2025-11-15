import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';
import dayjs from 'dayjs';

export const backupService = {
  /**
   * Create a complete backup of all app data
   */
  async createBackup(): Promise<string> {
    try {
      const backupData: any = {
        version: '1.0.0',
        backupDate: new Date().toISOString(),
        data: {},
      };

      // Backup all storage keys
      const keys = [
        STORAGE_KEYS.PETS,
        STORAGE_KEYS.VACCINES,
        STORAGE_KEYS.REMINDERS,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.SETTINGS,
      ];

      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          backupData.data[key] = JSON.parse(data);
        }
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const fileName = `pet-care-backup-${dayjs().format('YYYY-MM-DD-HHmmss')}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      return fileUri;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  },

  /**
   * Restore data from backup file
   */
  async restoreFromBackup(fileUri: string): Promise<void> {
    try {
      const content = await FileSystem.readAsStringAsync(fileUri);
      const backupData = JSON.parse(content);

      if (!backupData.data) {
        throw new Error('Invalid backup file format');
      }

      // Restore all data
      for (const [key, value] of Object.entries(backupData.data)) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  },

  /**
   * Share backup file
   */
  async shareBackup(fileUri: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing backup:', error);
      throw error;
    }
  },

  /**
   * Get backup file info
   */
  async getBackupInfo(fileUri: string): Promise<any> {
    try {
      const content = await FileSystem.readAsStringAsync(fileUri);
      const backupData = JSON.parse(content);
      return {
        version: backupData.version,
        backupDate: backupData.backupDate,
        dataKeys: Object.keys(backupData.data || {}),
      };
    } catch (error) {
      console.error('Error getting backup info:', error);
      throw error;
    }
  },
};

