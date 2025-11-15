// Storage keys for AsyncStorage
export const STORAGE_KEYS = {
  PETS: '@pet_care_manager:pets',
  VACCINES: '@pet_care_manager:vaccines',
  REMINDERS: '@pet_care_manager:reminders',
  EXPENSES: '@pet_care_manager:expenses',
  SETTINGS: '@pet_care_manager:settings',
  SEED_DATA_LOADED: '@pet_care_manager:seed_data_loaded',
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

