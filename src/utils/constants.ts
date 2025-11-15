// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  PETS: '@pet_care_manager:pets',
  VACCINES: '@pet_care_manager:vaccines',
  REMINDERS: '@pet_care_manager:reminders',
  EXPENSES: '@pet_care_manager:expenses',
  SETTINGS: '@pet_care_manager:settings',
  SEED_DATA_LOADED: '@pet_care_manager:seed_data_loaded',
  WEIGHTS: '@pet_care_manager:weights',
  MEDICAL_RECORDS: '@pet_care_manager:medical_records',
  VETS: '@pet_care_manager:vets',
  PHOTOS: '@pet_care_manager:photos',
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  defaultCurrency: 'USD' as const,
  defaultReminderTime: '09:00',
  notificationsEnabled: true,
};

// Pet species options
export const PET_SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'] as const;

// Expense categories
export const EXPENSE_CATEGORIES = [
  'vet',
  'food',
  'grooming',
  'toys',
  'medicine',
  'other',
] as const;

// Reminder types
export const REMINDER_TYPES = [
  'vet_visit',
  'medicine',
  'grooming',
  'custom',
] as const;

// Repeat options
export const REPEAT_OPTIONS = ['none', 'weekly', 'monthly'] as const;

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
};

// Grooming service types
export const GROOMING_SERVICE_TYPES = [
  'full_groom',
  'bath',
  'nail_trim',
  'haircut',
  'teeth_cleaning',
  'other',
] as const;

// Activity types
export const ACTIVITY_TYPES = [
  'exercise',
  'play',
  'feeding',
  'training',
  'social',
  'other',
] as const;

// Mood types
export const MOOD_TYPES = [
  'happy',
  'calm',
  'energetic',
  'anxious',
  'sick',
  'tired',
  'other',
] as const;
