import * as Sharing from 'expo-sharing';
import { Pet } from '@/types/pet';
import { Vaccine } from '@/types/vaccine';
import { Expense } from '@/types/expense';
import { formatDate, formatCurrency } from '@/utils/formatters';
import dayjs from 'dayjs';

export const shareService = {
  /**
   * Share pet profile as text
   */
  async sharePetProfile(pet: Pet, vaccines: Vaccine[], expenses: Expense[]): Promise<void> {
    try {
      const petVaccines = vaccines.filter(v => v.petId === pet.id);
      const petExpenses = expenses.filter(e => e.petId === pet.id);
      const totalSpent = petExpenses.reduce((sum, e) => sum + e.amount, 0);

      const profileText = `
🐾 ${pet.name} - Pet Profile

Species: ${pet.species}
Breed: ${pet.breed || 'N/A'}
Date of Birth: ${formatDate(pet.dateOfBirth)}
Sex: ${pet.sex}

Vaccines: ${petVaccines.length}
Total Expenses: ${formatCurrency(totalSpent)}

${pet.notes ? `Notes: ${pet.notes}` : ''}
      `.trim();

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // For text sharing, we'll use a simple approach
        // In a real app, you might want to create a file or use a different method
        await Sharing.shareAsync(profileText as any);
      }
    } catch (error) {
      console.error('Error sharing pet profile:', error);
      throw error;
    }
  },

  /**
   * Share vaccine records
   */
  async shareVaccineRecords(pet: Pet, vaccines: Vaccine[]): Promise<void> {
    try {
      const petVaccines = vaccines.filter(v => v.petId === pet.id);
      
      let vaccineText = `📋 Vaccine Records for ${pet.name}\n\n`;
      petVaccines.forEach(vaccine => {
        vaccineText += `${vaccine.name}\n`;
        if (vaccine.dateAdministered) {
          vaccineText += `Administered: ${formatDate(vaccine.dateAdministered)}\n`;
        }
        vaccineText += `Next Due: ${formatDate(vaccine.nextDueDate)}\n`;
        vaccineText += `Status: ${vaccine.status}\n`;
        if (vaccine.vetClinicName) {
          vaccineText += `Vet: ${vaccine.vetClinicName}\n`;
        }
        vaccineText += '\n';
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(vaccineText as any);
      }
    } catch (error) {
      console.error('Error sharing vaccine records:', error);
      throw error;
    }
  },

  /**
   * Share expense report
   */
  async shareExpenseReport(
    pet: Pet,
    expenses: Expense[],
    currency: string
  ): Promise<void> {
    try {
      const petExpenses = expenses.filter(e => e.petId === pet.id);
      const totalSpent = petExpenses.reduce((sum, e) => sum + e.amount, 0);

      let reportText = `💰 Expense Report for ${pet.name}\n\n`;
      reportText += `Total Spent: ${formatCurrency(totalSpent, currency)}\n`;
      reportText += `Total Expenses: ${petExpenses.length}\n\n`;
      reportText += `Details:\n`;
      
      petExpenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(expense => {
          reportText += `${formatDate(expense.date)} - ${expense.category}: ${formatCurrency(expense.amount, currency)}\n`;
          if (expense.description) {
            reportText += `  ${expense.description}\n`;
          }
        });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(reportText as any);
      }
    } catch (error) {
      console.error('Error sharing expense report:', error);
      throw error;
    }
  },
};

