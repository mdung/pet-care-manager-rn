import { Expense } from '@/types/expense';
import { Vaccine } from '@/types/vaccine';
import { Pet } from '@/types/pet';
import dayjs from 'dayjs';

export interface PetStatistics {
  petId: string;
  totalSpent: number;
  averageMonthlyExpense: number;
  mostExpensiveCategory: string;
  totalExpenses: number;
  healthComplianceRate: number; // Percentage of vaccines up to date
}

export interface OverallStatistics {
  totalPets: number;
  totalSpentAll: number;
  averageMonthlyExpenseAll: number;
  mostExpensiveCategoryAll: string;
  totalExpensesAll: number;
  overallHealthCompliance: number;
  petStatistics: PetStatistics[];
}

export const statisticsService = {
  /**
   * Calculate statistics for a specific pet
   */
  calculatePetStatistics(
    petId: string,
    expenses: Expense[],
    vaccines: Vaccine[]
  ): PetStatistics {
    const petExpenses = expenses.filter(e => e.petId === petId);
    const petVaccines = vaccines.filter(v => v.petId === petId);

    const totalSpent = petExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = petExpenses.length;

    // Calculate average monthly expense (last 12 months)
    const last12Months = dayjs().subtract(12, 'month');
    const recentExpenses = petExpenses.filter(e => 
      dayjs(e.date).isAfter(last12Months)
    );
    const monthsWithExpenses = new Set(
      recentExpenses.map(e => dayjs(e.date).format('YYYY-MM'))
    ).size;
    const averageMonthlyExpense = monthsWithExpenses > 0
      ? recentExpenses.reduce((sum, e) => sum + e.amount, 0) / monthsWithExpenses
      : 0;

    // Find most expensive category
    const categoryTotals: Record<string, number> = {};
    petExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const mostExpensiveCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    // Calculate health compliance rate
    const totalVaccines = petVaccines.length;
    const upToDateVaccines = petVaccines.filter(v => 
      v.status === 'completed' || v.status === 'upcoming'
    ).length;
    const healthComplianceRate = totalVaccines > 0
      ? (upToDateVaccines / totalVaccines) * 100
      : 100;

    return {
      petId,
      totalSpent,
      averageMonthlyExpense,
      mostExpensiveCategory,
      totalExpenses,
      healthComplianceRate,
    };
  },

  /**
   * Calculate overall statistics
   */
  calculateOverallStatistics(
    pets: Pet[],
    expenses: Expense[],
    vaccines: Vaccine[]
  ): OverallStatistics {
    const totalPets = pets.length;
    const totalSpentAll = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpensesAll = expenses.length;

    // Average monthly expense (all pets, last 12 months)
    const last12Months = dayjs().subtract(12, 'month');
    const recentExpenses = expenses.filter(e => 
      dayjs(e.date).isAfter(last12Months)
    );
    const monthsWithExpenses = new Set(
      recentExpenses.map(e => dayjs(e.date).format('YYYY-MM'))
    ).size;
    const averageMonthlyExpenseAll = monthsWithExpenses > 0
      ? recentExpenses.reduce((sum, e) => sum + e.amount, 0) / monthsWithExpenses
      : 0;

    // Most expensive category overall
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const mostExpensiveCategoryAll = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    // Overall health compliance
    const totalVaccines = vaccines.length;
    const upToDateVaccines = vaccines.filter(v => 
      v.status === 'completed' || v.status === 'upcoming'
    ).length;
    const overallHealthCompliance = totalVaccines > 0
      ? (upToDateVaccines / totalVaccines) * 100
      : 100;

    // Per-pet statistics
    const petStatistics = pets.map(pet =>
      this.calculatePetStatistics(pet.id, expenses, vaccines)
    );

    return {
      totalPets,
      totalSpentAll,
      averageMonthlyExpenseAll,
      mostExpensiveCategoryAll,
      totalExpensesAll,
      overallHealthCompliance,
      petStatistics,
    };
  },
};

