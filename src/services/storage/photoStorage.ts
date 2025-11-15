import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetPhoto } from '@/types/photo';
import { STORAGE_KEYS } from '@/utils/constants';

export const photoStorage = {
  async getAll(): Promise<PetPhoto[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PHOTOS || '@pet_care_manager:photos');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting photos:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<PetPhoto[]> {
    try {
      const photos = await this.getAll();
      return photos.filter(p => p.petId === petId).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error getting photos by pet ID:', error);
      return [];
    }
  },

  async save(photo: PetPhoto): Promise<void> {
    try {
      const photos = await this.getAll();
      const index = photos.findIndex(p => p.id === photo.id);
      if (index >= 0) {
        photos[index] = { ...photo, updatedAt: new Date().toISOString() };
      } else {
        photos.push(photo);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS || '@pet_care_manager:photos', JSON.stringify(photos));
    } catch (error) {
      console.error('Error saving photo:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const photos = await this.getAll();
      const filtered = photos.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS || '@pet_care_manager:photos', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw error;
    }
  },
};

