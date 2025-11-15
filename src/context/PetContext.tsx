import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet } from '@/types/pet';
import { petStorage } from '@/services/storage/petStorage';

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  refreshPets: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPets = async () => {
    try {
      const allPets = await petStorage.getAll();
      setPets(allPets);
    } catch (error) {
      console.error('Error refreshing pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPets();
  }, []);

  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await petStorage.save(newPet);
    await refreshPets();
  };

  const updatePet = async (id: string, petData: Partial<Pet>) => {
    const existingPet = pets.find(p => p.id === id);
    if (!existingPet) throw new Error('Pet not found');

    const updatedPet: Pet = {
      ...existingPet,
      ...petData,
      id,
      updatedAt: new Date().toISOString(),
    };
    await petStorage.save(updatedPet);
    await refreshPets();
  };

  const deletePet = async (id: string) => {
    // Cascade delete: remove all related vaccines, reminders, and expenses
    const { vaccineStorage } = require('@/services/storage/vaccineStorage');
    const { reminderStorage } = require('@/services/storage/reminderStorage');
    const { expenseStorage } = require('@/services/storage/expenseStorage');
    const { notificationService } = require('@/services/notifications/notificationService');

    try {
      // Get all related data before deletion
      const vaccines = await vaccineStorage.getByPetId(id);
      const reminders = await reminderStorage.getByPetId(id);

      // Cancel all notifications for reminders
      for (const reminder of reminders) {
        if (reminder.notificationId) {
          await notificationService.cancelNotification(reminder.notificationId);
        }
      }

      // Delete all related data
      await vaccineStorage.deleteByPetId(id);
      await reminderStorage.deleteByPetId(id);
      await expenseStorage.deleteByPetId(id);
      
      // Finally, delete the pet
      await petStorage.delete(id);
      await refreshPets();
    } catch (error) {
      console.error('Error deleting pet with cascade:', error);
      throw error;
    }
  };

  const getPetById = (id: string) => {
    return pets.find(p => p.id === id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        loading,
        addPet,
        updatePet,
        deletePet,
        getPetById,
        refreshPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

