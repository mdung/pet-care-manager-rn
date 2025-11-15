import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vet } from '@/types/vet';
import { STORAGE_KEYS } from '@/utils/constants';

export const vetStorage = {
  async getAll(): Promise<Vet[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VETS || '@pet_care_manager:vets');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting vets:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Vet | null> {
    try {
      const vets = await this.getAll();
      return vets.find(v => v.id === id) || null;
    } catch (error) {
      console.error('Error getting vet by ID:', error);
      return null;
    }
  },

  async save(vet: Vet): Promise<void> {
    try {
      const vets = await this.getAll();
      const index = vets.findIndex(v => v.id === vet.id);
      if (index >= 0) {
        vets[index] = { ...vet, updatedAt: new Date().toISOString() };
      } else {
        vets.push(vet);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.VETS || '@pet_care_manager:vets', JSON.stringify(vets));
    } catch (error) {
      console.error('Error saving vet:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const vets = await this.getAll();
      const filtered = vets.filter(v => v.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.VETS || '@pet_care_manager:vets', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting vet:', error);
      throw error;
    }
  },
};

