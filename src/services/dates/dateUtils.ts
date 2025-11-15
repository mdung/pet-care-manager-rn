import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { VaccineStatus } from '@/types/vaccine';

dayjs.extend(relativeTime);

/**
 * Calculate vaccine status based on dates
 */
export const calculateVaccineStatus = (
  nextDueDate: string,
  dateAdministered?: string
): VaccineStatus => {
  const now = dayjs();
  const dueDate = dayjs(nextDueDate);

  // If vaccine has been administered, it's completed
  if (dateAdministered) {
    return 'completed';
  }

  // If due date is in the past, it's overdue
  if (dueDate.isBefore(now, 'day')) {
    return 'overdue';
  }

  // Otherwise, it's upcoming
  return 'upcoming';
};

/**
 * Get reminder status (past, today, upcoming)
 */
export const getReminderStatus = (reminderDate: string, reminderTime: string): 'past' | 'today' | 'upcoming' => {
  const reminderDateTime = dayjs(`${reminderDate} ${reminderTime}`);
  const now = dayjs();

  if (reminderDateTime.isBefore(now, 'minute')) {
    return 'past';
  }

  if (reminderDateTime.isSame(now, 'day')) {
    return 'today';
  }

  return 'upcoming';
};

/**
 * Get days until date
 */
export const getDaysUntil = (date: string): number => {
  return dayjs(date).diff(dayjs(), 'day');
};

/**
 * Get age from date of birth
 */
export const getAge = (dateOfBirth: string): string => {
  const birthDate = dayjs(dateOfBirth);
  const now = dayjs();
  const years = now.diff(birthDate, 'year');
  const months = now.diff(birthDate, 'month') % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'}, ${months} ${months === 1 ? 'month' : 'months'}`;
};

