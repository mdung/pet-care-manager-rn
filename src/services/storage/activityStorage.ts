import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityLog } from '@/types/activity';

export const activityStorage = {
  async getAll(): Promise<ActivityLog[]> {
    try {
      const data = await AsyncStorage.getItem('@pet_care_manager:activities');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activities:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<ActivityLog[]> {
    try {
      const activities = await this.getAll();
      return activities.filter(a => a.petId === petId).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error getting activities by pet ID:', error);
      return [];
    }
  },

  async save(activity: ActivityLog): Promise<void> {
    try {
      const activities = await this.getAll();
      const index = activities.findIndex(a => a.id === activity.id);
      if (index >= 0) {
        activities[index] = { ...activity, updatedAt: new Date().toISOString() };
      } else {
        activities.push(activity);
      }
      await AsyncStorage.setItem('@pet_care_manager:activities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const activities = await this.getAll();
      const filtered = activities.filter(a => a.id !== id);
      await AsyncStorage.setItem('@pet_care_manager:activities', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },
};

