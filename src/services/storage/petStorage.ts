import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '@/types/pet';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Pet Storage Service
 * Handles all CRUD operations for pets using AsyncStorage
 */
export const petStorage = {
  /**
   * Get all pets
   */
  async getAll(): Promise<Pet[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pets:', error);
      return [];
    }
  },

  /**
   * Get a single pet by ID
   */
  async getById(id: string): Promise<Pet | null> {
    try {
      const pets = await this.getAll();
      return pets.find(pet => pet.id === id) || null;
    } catch (error) {
      console.error('Error getting pet by ID:', error);
      return null;
    }
  },

  /**
   * Save a pet (create or update)
   */
  async save(pet: Pet): Promise<void> {
    try {
      const pets = await this.getAll();
      const index = pets.findIndex(p => p.id === pet.id);
      
      if (index >= 0) {
        pets[index] = { ...pet, updatedAt: new Date().toISOString() };
      } else {
        pets.push(pet);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    } catch (error) {
      console.error('Error saving pet:', error);
      throw error;
    }
  },

  /**
   * Delete a pet by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const pets = await this.getAll();
      const filtered = pets.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  },

  /**
   * Clear all pets (for testing/reset)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PETS);
    } catch (error) {
      console.error('Error clearing pets:', error);
      throw error;
    }
  },
};

