import { Priority } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case Priority.HIGH:
      return 'bg-lemon text-primary'; // Lemon for High
    case Priority.MEDIUM:
      return 'bg-eucalyptus text-primary'; // Eucalyptus for Medium
    case Priority.LOW:
      return 'bg-primary/10 text-primary dark:text-white'; // Subtle for Low
    default:
      return 'bg-primary/5 text-ash';
  }
};

export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const isOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};

export const isToday = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};