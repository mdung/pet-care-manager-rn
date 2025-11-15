import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vaccine } from '@/types/vaccine';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Vaccine Storage Service
 * Handles all CRUD operations for vaccines using AsyncStorage
 */
export const vaccineStorage = {
  /**
   * Get all vaccines
   */
  async getAll(): Promise<Vaccine[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VACCINES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting vaccines:', error);
      return [];
    }
  },

  /**
   * Get vaccines by pet ID
   */
  async getByPetId(petId: string): Promise<Vaccine[]> {
    try {
      const vaccines = await this.getAll();
      return vaccines.filter(v => v.petId === petId);
    } catch (error) {
      console.error('Error getting vaccines by pet ID:', error);
      return [];
    }
  },

  /**
   * Get a single vaccine by ID
   */
  async getById(id: string): Promise<Vaccine | null> {
    try {
      const vaccines = await this.getAll();
      return vaccines.find(v => v.id === id) || null;
    } catch (error) {
      console.error('Error getting vaccine by ID:', error);
      return null;
    }
  },

  /**
   * Save a vaccine (create or update)
   */
  async save(vaccine: Vaccine): Promise<void> {
    try {
      const vaccines = await this.getAll();
      const index = vaccines.findIndex(v => v.id === vaccine.id);
      
      if (index >= 0) {
        vaccines[index] = { ...vaccine, updatedAt: new Date().toISOString() };
      } else {
        vaccines.push(vaccine);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(vaccines));
    } catch (error) {
      console.error('Error saving vaccine:', error);
      throw error;
    }
  },

  /**
   * Delete a vaccine by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const vaccines = await this.getAll();
      const filtered = vaccines.filter(v => v.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vaccine:', error);
      throw error;
    }
  },

  /**
   * Delete all vaccines for a pet
   */
  async deleteByPetId(petId: string): Promise<void> {
    try {
      const vaccines = await this.getAll();
      const filtered = vaccines.filter(v => v.petId !== petId);
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vaccines by pet ID:', error);
      throw error;
    }
  },
};

