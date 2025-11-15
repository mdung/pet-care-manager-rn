import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecurringExpense } from '@/types/recurringExpense';

export const recurringExpenseStorage = {
  async getAll(): Promise<RecurringExpense[]> {
    try {
      const data = await AsyncStorage.getItem('@pet_care_manager:recurring_expenses');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recurring expenses:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<RecurringExpense[]> {
    try {
      const expenses = await this.getAll();
      return expenses.filter(e => e.petId === petId && e.isActive);
    } catch (error) {
      console.error('Error getting recurring expenses by pet ID:', error);
      return [];
    }
  },

  async save(expense: RecurringExpense): Promise<void> {
    try {
      const expenses = await this.getAll();
      const index = expenses.findIndex(e => e.id === expense.id);
      if (index >= 0) {
        expenses[index] = { ...expense, updatedAt: new Date().toISOString() };
      } else {
        expenses.push(expense);
      }
      await AsyncStorage.setItem('@pet_care_manager:recurring_expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving recurring expense:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const expenses = await this.getAll();
      const filtered = expenses.filter(e => e.id !== id);
      await AsyncStorage.setItem('@pet_care_manager:recurring_expenses', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
      throw error;
    }
  },
};

