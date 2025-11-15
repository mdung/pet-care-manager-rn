export type GroomingServiceType = 'full_groom' | 'bath' | 'nail_trim' | 'haircut' | 'teeth_cleaning' | 'other';

export interface GroomingRecord {
  id: string;
  petId: string;
  serviceType: GroomingServiceType;
  date: string; // ISO date string
  nextGroomingDate?: string; // ISO date string
  groomerName?: string;
  groomerPhone?: string;
  groomerEmail?: string;
  cost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

