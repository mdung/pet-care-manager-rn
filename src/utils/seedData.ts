import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';
import { Pet } from '@/types/pet';
import { Vaccine } from '@/types/vaccine';
import { Reminder } from '@/types/reminder';
import { Expense } from '@/types/expense';
import dayjs from 'dayjs';

/**
 * Seed data for demo purposes
 * This creates sample pets, vaccines, reminders, and expenses
 */
export const seedData = async (): Promise<void> => {
  try {
    const seedDataLoaded = await AsyncStorage.getItem(STORAGE_KEYS.SEED_DATA_LOADED);
    if (seedDataLoaded === 'true') {
      return; // Already seeded
    }

    const now = dayjs();
    const pet1DOB = now.subtract(3, 'year').toISOString();
    const pet2DOB = now.subtract(1, 'year').toISOString();

    // Sample Pets
    const pets: Pet[] = [
      {
        id: 'pet1',
        name: 'Max',
        species: 'dog',
        breed: 'Golden Retriever',
        dateOfBirth: pet1DOB,
        sex: 'male',
        notes: 'Friendly and energetic. Loves playing fetch.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'pet2',
        name: 'Luna',
        species: 'cat',
        breed: 'Persian',
        dateOfBirth: pet2DOB,
        sex: 'female',
        notes: 'Calm and affectionate. Prefers quiet environments.',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    // Sample Vaccines
    const vaccines: Vaccine[] = [
      {
        id: 'vac1',
        petId: 'pet1',
        name: 'Rabies',
        dateAdministered: now.subtract(6, 'month').toISOString(),
        nextDueDate: now.add(6, 'month').toISOString(),
        vetClinicName: 'ABC Vet Clinic',
        status: 'upcoming',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'vac2',
        petId: 'pet1',
        name: 'Parvo',
        dateAdministered: now.subtract(1, 'year').toISOString(),
        nextDueDate: now.subtract(1, 'month').toISOString(),
        vetClinicName: 'ABC Vet Clinic',
        status: 'overdue',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'vac3',
        petId: 'pet2',
        name: 'FVRCP',
        dateAdministered: now.subtract(3, 'month').toISOString(),
        nextDueDate: now.add(9, 'month').toISOString(),
        vetClinicName: 'XYZ Animal Hospital',
        status: 'upcoming',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    // Sample Reminders
    const reminders: Reminder[] = [
      {
        id: 'rem1',
        petId: 'pet1',
        type: 'vet_visit',
        title: 'Annual Checkup',
        description: 'Yearly health examination',
        reminderDate: now.add(1, 'week').format('YYYY-MM-DD'),
        reminderTime: '10:00',
        repeat: 'none',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'rem2',
        petId: 'pet2',
        type: 'medicine',
        title: 'Flea Treatment',
        description: 'Apply monthly flea treatment',
        reminderDate: now.add(5, 'day').format('YYYY-MM-DD'),
        reminderTime: '09:00',
        repeat: 'monthly',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    // Sample Expenses
    const expenses: Expense[] = [
      {
        id: 'exp1',
        petId: 'pet1',
        category: 'vet',
        amount: 150.00,
        date: now.subtract(1, 'month').toISOString(),
        description: 'Annual checkup and vaccinations',
        vendor: 'ABC Vet Clinic',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'exp2',
        petId: 'pet1',
        category: 'food',
        amount: 45.99,
        date: now.subtract(2, 'week').toISOString(),
        description: 'Premium dog food',
        vendor: 'Pet Store',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'exp3',
        petId: 'pet2',
        category: 'grooming',
        amount: 75.00,
        date: now.subtract(1, 'week').toISOString(),
        description: 'Full grooming service',
        vendor: 'Paw Spa',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'exp4',
        petId: 'pet2',
        category: 'toys',
        amount: 25.50,
        date: now.subtract(3, 'day').toISOString(),
        description: 'Cat toys and scratching post',
        vendor: 'Pet Store',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    // Save to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    await AsyncStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(vaccines));
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    await AsyncStorage.setItem(STORAGE_KEYS.SEED_DATA_LOADED, 'true');

    console.log('Seed data loaded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

