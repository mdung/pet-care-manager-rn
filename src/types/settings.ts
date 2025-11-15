export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface Settings {
  defaultCurrency: Currency;
  defaultReminderTime: string; // HH:mm format
  notificationsEnabled: boolean;
  language?: string;
  themeMode?: 'light' | 'dark' | 'system';
  fontSize?: 'small' | 'medium' | 'large';
  highContrast?: boolean;
  autoBackup?: boolean;
  autoBackupFrequency?: 'daily' | 'weekly' | 'monthly';
}

