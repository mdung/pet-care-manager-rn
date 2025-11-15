import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroomingRecord } from '@/types/grooming';

export const groomingStorage = {
  async getAll(): Promise<GroomingRecord[]> {
    try {
      const data = await AsyncStorage.getItem('@pet_care_manager:grooming');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting grooming records:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<GroomingRecord[]> {
    try {
      const records = await this.getAll();
      return records.filter(r => r.petId === petId).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error getting grooming records by pet ID:', error);
      return [];
    }
  },

  async save(record: GroomingRecord): Promise<void> {
    try {
      const records = await this.getAll();
      const index = records.findIndex(r => r.id === record.id);
      if (index >= 0) {
        records[index] = { ...record, updatedAt: new Date().toISOString() };
      } else {
        records.push(record);
      }
      await AsyncStorage.setItem('@pet_care_manager:grooming', JSON.stringify(records));
    } catch (error) {
      console.error('Error saving grooming record:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const records = await this.getAll();
      const filtered = records.filter(r => r.id !== id);
      await AsyncStorage.setItem('@pet_care_manager:grooming', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting grooming record:', error);
      throw error;
    }
  },
};

