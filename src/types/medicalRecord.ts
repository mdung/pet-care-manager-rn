export type MedicalRecordType = 'vet_visit' | 'medication' | 'lab_result' | 'surgery' | 'condition';

export interface MedicalRecord {
  id: string;
  petId: string;
  type: MedicalRecordType;
  title: string;
  date: string; // ISO date string
  vetId?: string; // Link to vet
  description?: string;
  notes?: string;
  // For medications
  medicationName?: string;
  dosage?: string;
  frequency?: string;
  endDate?: string;
  // For lab results
  testName?: string;
  results?: string;
  // For conditions
  conditionName?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  isChronic?: boolean;
  createdAt: string;
  updatedAt: string;
}

