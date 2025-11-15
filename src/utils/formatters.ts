import dayjs from 'dayjs';
import { CURRENCY_SYMBOLS } from './constants';

export const formatDate = (date: string | Date): string => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatDateTime = (date: string | Date, time?: string): string => {
  if (time) {
    return `${formatDate(date)} at ${time}`;
  }
  return formatDate(date);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

export const formatTime = (time: string): string => {
  // time is in HH:mm format
  return time;
};
