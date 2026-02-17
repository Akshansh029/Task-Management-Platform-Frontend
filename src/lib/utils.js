import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility for conditional class names (from shadcn)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format ISO date to readable format (e.g., "Jan 15, 2026")
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Format date to relative time (e.g., "2 hours ago")
export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

// Extract initials from full name (e.g., "John Doe" -> "JD")
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Check if a task is overdue
export function isOverdue(dueDateStr, status) {
  if (!dueDateStr || status === 'DONE') return false;
  const dueDate = new Date(dueDateStr);
  const now = new Date();
  return dueDate < now;
}

// Get Tailwind class for status badge
export function getStatusColor(status) {
  const colors = {
    TODO: 'bg-slate-100 text-slate-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-700',
    DONE: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

// Get Tailwind class for priority badge
export function getPriorityColor(priority) {
  const colors = {
    LOW: 'bg-slate-100 text-slate-600',
    MEDIUM: 'bg-amber-100 text-amber-700',
    HIGH: 'bg-red-100 text-red-700',
    URGENT: 'bg-red-100 text-red-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-600';
}

// Get Tailwind class for role badge
export function getRoleColor(role) {
  const colors = {
    ADMIN: 'bg-purple-100 text-purple-700',
    MEMBER: 'bg-blue-100 text-blue-700',
    VIEWER: 'bg-gray-100 text-gray-600',
  };
  return colors[role] || 'bg-gray-100 text-gray-600';
}

// Constants
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export const USER_ROLES = ['ADMIN', 'MEMBER', 'VIEWER'];
