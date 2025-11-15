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
  createdAt: string;
  updatedAt: string;
}

