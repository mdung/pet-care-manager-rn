import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vaccine } from '@/types/vaccine';
import { vaccineStorage } from '@/services/storage/vaccineStorage';
import { calculateVaccineStatus } from '@/services/dates/dateUtils';

interface VaccineContextType {
  vaccines: Vaccine[];
  loading: boolean;
  addVaccine: (vaccine: Omit<Vaccine, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVaccine: (id: string, vaccine: Partial<Vaccine>) => Promise<void>;
  deleteVaccine: (id: string) => Promise<void>;
  getVaccinesByPetId: (petId: string) => Vaccine[];
  refreshVaccines: () => Promise<void>;
}

const VaccineContext = createContext<VaccineContextType | undefined>(undefined);

export const VaccineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshVaccines = async () => {
    try {
      const allVaccines = await vaccineStorage.getAll();
      // Recalculate status for all vaccines
      const vaccinesWithStatus = allVaccines.map(v => ({
        ...v,
        status: calculateVaccineStatus(v.nextDueDate, v.dateAdministered),
      }));
      setVaccines(vaccinesWithStatus);
    } catch (error) {
      console.error('Error refreshing vaccines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVaccines();
  }, []);

  const addVaccine = async (vaccineData: Omit<Vaccine, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const status = calculateVaccineStatus(vaccineData.nextDueDate, vaccineData.dateAdministered);
    const newVaccine: Vaccine = {
      ...vaccineData,
      status,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await vaccineStorage.save(newVaccine);
    await refreshVaccines();
  };

  const updateVaccine = async (id: string, vaccineData: Partial<Vaccine>) => {
    const existingVaccine = vaccines.find(v => v.id === id);
    if (!existingVaccine) throw new Error('Vaccine not found');

    const updatedVaccine: Vaccine = {
      ...existingVaccine,
      ...vaccineData,
      id,
      status: calculateVaccineStatus(
        vaccineData.nextDueDate || existingVaccine.nextDueDate,
        vaccineData.dateAdministered !== undefined ? vaccineData.dateAdministered : existingVaccine.dateAdministered
      ),
      updatedAt: new Date().toISOString(),
    };
    await vaccineStorage.save(updatedVaccine);
    await refreshVaccines();
  };

  const deleteVaccine = async (id: string) => {
    await vaccineStorage.delete(id);
    await refreshVaccines();
  };

  const getVaccinesByPetId = (petId: string) => {
    return vaccines.filter(v => v.petId === petId);
  };

  return (
    <VaccineContext.Provider
      value={{
        vaccines,
        loading,
        addVaccine,
        updateVaccine,
        deleteVaccine,
        getVaccinesByPetId,
        refreshVaccines,
      }}
    >
      {children}
    </VaccineContext.Provider>
  );
};

export const useVaccines = () => {
  const context = useContext(VaccineContext);
  if (!context) {
    throw new Error('useVaccines must be used within a VaccineProvider');
  }
  return context;
};

