export interface PetInsurance {
  id: string;
  petId: string;
  providerName: string;
  policyNumber: string;
  startDate: string; // ISO date string
  renewalDate: string; // ISO date string
  monthlyPremium: number;
  coverageDetails?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceClaim {
  id: string;
  insuranceId: string;
  claimNumber: string;
  date: string; // ISO date string
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

