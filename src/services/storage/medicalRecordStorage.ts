import AsyncStorage from '@react-native-async-storage/async-storage';
import { MedicalRecord } from '@/types/medicalRecord';
import { STORAGE_KEYS } from '@/utils/constants';

export const medicalRecordStorage = {
  async getAll(): Promise<MedicalRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS || '@pet_care_manager:medical_records');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting medical records:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<MedicalRecord[]> {
    try {
      const records = await this.getAll();
      return records.filter(r => r.petId === petId);
    } catch (error) {
      console.error('Error getting medical records by pet ID:', error);
      return [];
    }
  },

  async save(record: MedicalRecord): Promise<void> {
    try {
      const records = await this.getAll();
      const index = records.findIndex(r => r.id === record.id);
      if (index >= 0) {
        records[index] = { ...record, updatedAt: new Date().toISOString() };
      } else {
        records.push(record);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS || '@pet_care_manager:medical_records', JSON.stringify(records));
    } catch (error) {
      console.error('Error saving medical record:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const records = await this.getAll();
      const filtered = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.MEDICAL_RECORDS || '@pet_care_manager:medical_records', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting medical record:', error);
      throw error;
    }
  },
};

