export type ActivityType = 'exercise' | 'play' | 'feeding' | 'training' | 'social' | 'other';
export type MoodType = 'happy' | 'calm' | 'energetic' | 'anxious' | 'sick' | 'tired' | 'other';

export interface ActivityLog {
  id: string;
  petId: string;
  type: ActivityType;
  date: string; // ISO date string
  time?: string; // HH:mm format
  duration?: number; // in minutes
  description?: string;
  mood?: MoodType;
  behaviorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

