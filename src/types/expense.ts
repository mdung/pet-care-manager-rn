export type ExpenseCategory = 'vet' | 'food' | 'grooming' | 'toys' | 'medicine' | 'other';

export interface Expense {
  id: string;
  petId: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // ISO date string
  description?: string;
  vendor?: string;
  createdAt: string;
  updatedAt: string;
}

