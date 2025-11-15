export interface WeightRecord {
  id: string;
  petId: string;
  weight: number; // in kg or lbs (based on settings)
  date: string; // ISO date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

