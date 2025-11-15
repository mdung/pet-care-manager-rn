import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetInsurance, InsuranceClaim } from '@/types/insurance';

export const insuranceStorage = {
  async getAll(): Promise<PetInsurance[]> {
    try {
      const data = await AsyncStorage.getItem('@pet_care_manager:insurance');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting insurance:', error);
      return [];
    }
  },

  async getByPetId(petId: string): Promise<PetInsurance | null> {
    try {
      const insurances = await this.getAll();
      return insurances.find(i => i.petId === petId) || null;
    } catch (error) {
      console.error('Error getting insurance by pet ID:', error);
      return null;
    }
  },

  async save(insurance: PetInsurance): Promise<void> {
    try {
      const insurances = await this.getAll();
      const index = insurances.findIndex(i => i.id === insurance.id);
      if (index >= 0) {
        insurances[index] = { ...insurance, updatedAt: new Date().toISOString() };
      } else {
        insurances.push(insurance);
      }
      await AsyncStorage.setItem('@pet_care_manager:insurance', JSON.stringify(insurances));
    } catch (error) {
      console.error('Error saving insurance:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const insurances = await this.getAll();
      const filtered = insurances.filter(i => i.id !== id);
      await AsyncStorage.setItem('@pet_care_manager:insurance', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting insurance:', error);
      throw error;
    }
  },
};

export const claimStorage = {
  async getAll(): Promise<InsuranceClaim[]> {
    try {
      const data = await AsyncStorage.getItem('@pet_care_manager:insurance_claims');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting claims:', error);
      return [];
    }
  },

  async getByInsuranceId(insuranceId: string): Promise<InsuranceClaim[]> {
    try {
      const claims = await this.getAll();
      return claims.filter(c => c.insuranceId === insuranceId);
    } catch (error) {
      console.error('Error getting claims by insurance ID:', error);
      return [];
    }
  },

  async save(claim: InsuranceClaim): Promise<void> {
    try {
      const claims = await this.getAll();
      const index = claims.findIndex(c => c.id === claim.id);
      if (index >= 0) {
        claims[index] = { ...claim, updatedAt: new Date().toISOString() };
      } else {
        claims.push(claim);
      }
      await AsyncStorage.setItem('@pet_care_manager:insurance_claims', JSON.stringify(claims));
    } catch (error) {
      console.error('Error saving claim:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const claims = await this.getAll();
      const filtered = claims.filter(c => c.id !== id);
      await AsyncStorage.setItem('@pet_care_manager:insurance_claims', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting claim:', error);
      throw error;
    }
  },
};

