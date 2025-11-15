import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeightRecord } from '@/types/weight';
import { STORAGE_KEYS } from '@/utils/constants';

export const weightStorage = {
  async getAll(): Promise<WeightRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS || '@pet_care_manager:weights');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting weights:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<WeightRecord[]> {
    try {
      const weights = await this.getAll();
      return weights.filter(w => w.petId === petId).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } catch (error) {
      console.error('Error getting weights by pet ID:', error);
      return [];
    }
  },

  async save(weight: WeightRecord): Promise<void> {
    try {
      const weights = await this.getAll();
      const index = weights.findIndex(w => w.id === weight.id);
      if (index >= 0) {
        weights[index] = { ...weight, updatedAt: new Date().toISOString() };
      } else {
        weights.push(weight);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS || '@pet_care_manager:weights', JSON.stringify(weights));
    } catch (error) {
      console.error('Error saving weight:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const weights = await this.getAll();
      const filtered = weights.filter(w => w.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS || '@pet_care_manager:weights', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting weight:', error);
      throw error;
    }
  },
};

