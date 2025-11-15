export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export interface RecurringExpense {
  id: string;
  petId: string;
  category: string;
  amount: number;
  frequency: RecurringFrequency;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string (optional)
  description?: string;
  vendor?: string;
  nextDueDate: string; // ISO date string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

