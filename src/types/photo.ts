export interface PetPhoto {
  id: string;
  petId: string;
  uri: string;
  caption?: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

