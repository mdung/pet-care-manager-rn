import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types/expense';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Expense Storage Service
 * Handles all CRUD operations for expenses using AsyncStorage
 */
export const expenseStorage = {
  /**
   * Get all expenses
   */
  async getAll(): Promise<Expense[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },

  /**
   * Get expenses by pet ID
   */
  async getByPetId(petId: string): Promise<Expense[]> {
    try {
      const expenses = await this.getAll();
      return expenses.filter(e => e.petId === petId);
    } catch (error) {
      console.error('Error getting expenses by pet ID:', error);
      return [];
    }
  },

  /**
   * Get a single expense by ID
   */
  async getById(id: string): Promise<Expense | null> {
    try {
      const expenses = await this.getAll();
      return expenses.find(e => e.id === id) || null;
    } catch (error) {
      console.error('Error getting expense by ID:', error);
      return null;
    }
  },

  /**
   * Save an expense (create or update)
   */
  async save(expense: Expense): Promise<void> {
    try {
      const expenses = await this.getAll();
      const index = expenses.findIndex(e => e.id === expense.id);
      
      if (index >= 0) {
        expenses[index] = { ...expense, updatedAt: new Date().toISOString() };
      } else {
        expenses.push(expense);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expense:', error);
      throw error;
    }
  },

  /**
   * Delete an expense by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const expenses = await this.getAll();
      const filtered = expenses.filter(e => e.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  /**
   * Delete all expenses for a pet
   */
  async deleteByPetId(petId: string): Promise<void> {
    try {
      const expenses = await this.getAll();
      const filtered = expenses.filter(e => e.petId !== petId);
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting expenses by pet ID:', error);
      throw error;
    }
  },
};

