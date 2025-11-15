export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type PetSex = 'male' | 'female' | 'unknown';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  dateOfBirth: string; // ISO date string
  sex: PetSex;
  avatarUri?: string;
  notes?: string;
  // Additional fields
  microchipNumber?: string;
  registrationNumber?: string;
  insuranceId?: string; // Link to insurance record
  emergencyContact?: {
    name: string;
    phone: string;
    relationship?: string;
  };
  preferredVetId?: string; // Link to vet record
  createdAt: string;
  updatedAt: string;
}

