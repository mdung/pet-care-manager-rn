export type VaccineStatus = 'upcoming' | 'completed' | 'overdue';

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  dateAdministered?: string; // ISO date string, optional for scheduled vaccines
  nextDueDate: string; // ISO date string
  vetClinicName?: string;
  notes?: string;
  status: VaccineStatus; // Calculated based on dates
  createdAt: string;
  updatedAt: string;
}

