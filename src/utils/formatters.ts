import dayjs from 'dayjs';
import { CURRENCY_SYMBOLS } from './constants';

/**
 * Format currency amount with symbol
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date, format: string = 'MMM DD, YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date and time together
 */
export const formatDateTime = (date: string, time: string): string => {
  const dateTime = dayjs(`${date} ${time}`);
  return dateTime.format('MMM DD, YYYY [at] hh:mm A');
};

/**
 * Get relative time (e.g., "in 3 days", "2 days ago")
 */
export const getRelativeTime = (date: string): string => {
  return dayjs(date).fromNow();
};

/**
 * Check if date is today
 */
export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day');
};

/**
 * Check if date is in the past
 */
export const isPast = (date: string): boolean => {
  return dayjs(date).isBefore(dayjs(), 'day');
};

/**
 * Check if date is in the future
 */
export const isFuture = (date: string): boolean => {
  return dayjs(date).isAfter(dayjs(), 'day');
};

