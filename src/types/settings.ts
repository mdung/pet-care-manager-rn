export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';

export interface Settings {
  defaultCurrency: Currency;
  defaultReminderTime: string; // HH:mm format
  notificationsEnabled: boolean;
}

