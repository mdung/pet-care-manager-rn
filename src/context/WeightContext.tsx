import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WeightRecord } from '@/types/weight';
import { weightStorage } from '@/services/storage/weightStorage';

interface WeightContextType {
  weights: WeightRecord[];
  loading: boolean;
  addWeight: (weight: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWeight: (id: string, weight: Partial<WeightRecord>) => Promise<void>;
  deleteWeight: (id: string) => Promise<void>;
  getWeightsByPetId: (petId: string) => WeightRecord[];
  refreshWeights: () => Promise<void>;
}

const WeightContext = createContext<WeightContextType | undefined>(undefined);

export const WeightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [weights, setWeights] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWeights = async () => {
    try {
      const allWeights = await weightStorage.getAll();
      setWeights(allWeights);
    } catch (error) {
      console.error('Error refreshing weights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWeights();
  }, []);

  const addWeight = async (weightData: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWeight: WeightRecord = {
      ...weightData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await weightStorage.save(newWeight);
    await refreshWeights();
  };

  const updateWeight = async (id: string, weightData: Partial<WeightRecord>) => {
    const existingWeight = weights.find(w => w.id === id);
    if (!existingWeight) throw new Error('Weight record not found');

    const updatedWeight: WeightRecord = {
      ...existingWeight,
      ...weightData,
      id,
      updatedAt: new Date().toISOString(),
    };
    await weightStorage.save(updatedWeight);
    await refreshWeights();
  };

  const deleteWeight = async (id: string) => {
    await weightStorage.delete(id);
    await refreshWeights();
  };

  const getWeightsByPetId = (petId: string) => {
    return weights.filter(w => w.petId === petId);
  };

  return (
    <WeightContext.Provider
      value={{
        weights,
        loading,
        addWeight,
        updateWeight,
        deleteWeight,
        getWeightsByPetId,
        refreshWeights,
      }}
    >
      {children}
    </WeightContext.Provider>
  );
};

export const useWeights = () => {
  const context = useContext(WeightContext);
  if (!context) {
    throw new Error('useWeights must be used within a WeightProvider');
  }
  return context;
};

