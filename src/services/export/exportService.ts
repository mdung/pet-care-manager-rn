import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Pet } from '@/types/pet';
import { Expense } from '@/types/expense';
import { Vaccine } from '@/types/vaccine';
import { Reminder } from '@/types/reminder';
import dayjs from 'dayjs';

export const exportService = {
  /**
   * Export all data to JSON
   */
  async exportToJSON(data: {
    pets: Pet[];
    expenses: Expense[];
    vaccines: Vaccine[];
    reminders: Reminder[];
  }): Promise<string> {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        ...data,
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const fileName = `pet-care-backup-${dayjs().format('YYYY-MM-DD')}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonString);
      return fileUri;
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw error;
    }
  },

  /**
   * Export expenses to CSV
   */
  async exportExpensesToCSV(expenses: Expense[], pets: Pet[]): Promise<string> {
    try {
      const headers = ['Date', 'Pet', 'Category', 'Amount', 'Description', 'Vendor'];
      const rows = expenses.map(expense => {
        const pet = pets.find(p => p.id === expense.petId);
        return [
          dayjs(expense.date).format('YYYY-MM-DD'),
          pet?.name || 'Unknown',
          expense.category,
          expense.amount.toString(),
          expense.description || '',
          expense.vendor || '',
        ];
      });
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const fileName = `expenses-${dayjs().format('YYYY-MM-DD')}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      return fileUri;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },

  /**
   * Share file
   */
  async shareFile(fileUri: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri);
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  },

  /**
   * Import data from JSON
   */
  async importFromJSON(fileUri: string): Promise<any> {
    try {
      const content = await FileSystem.readAsStringAsync(fileUri);
      return JSON.parse(content);
    } catch (error) {
      console.error('Error importing from JSON:', error);
      throw error;
    }
  },
};

