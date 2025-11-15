import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense } from '@/types/expense';
import { expenseStorage } from '@/services/storage/expenseStorage';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  getExpensesByPetId: (petId: string) => Expense[];
  refreshExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshExpenses = async () => {
    try {
      const allExpenses = await expenseStorage.getAll();
      setExpenses(allExpenses);
    } catch (error) {
      console.error('Error refreshing expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshExpenses();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await expenseStorage.save(newExpense);
    await refreshExpenses();
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    const existingExpense = expenses.find(e => e.id === id);
    if (!existingExpense) throw new Error('Expense not found');

    const updatedExpense: Expense = {
      ...existingExpense,
      ...expenseData,
      id,
      updatedAt: new Date().toISOString(),
    };
    await expenseStorage.save(updatedExpense);
    await refreshExpenses();
  };

  const deleteExpense = async (id: string) => {
    await expenseStorage.delete(id);
    await refreshExpenses();
  };

  const getExpensesByPetId = (petId: string) => {
    return expenses.filter(e => e.petId === petId);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByPetId,
        refreshExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

