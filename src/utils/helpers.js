// ═══════════════════════════════════════════════════════════════
// Helper Utilities
// ═══════════════════════════════════════════════════════════════

/**
 * Format a Firestore timestamp or date string into a readable date
 */
export const formatDate = (date) => {
  if (!date) return '';

  // Handle Firestore Timestamp objects
  const d = date?.toDate ? date.toDate() : new Date(date);

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Get user's initials from their display name (e.g., "John Doe" → "JD")
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get a greeting based on the current time of day
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Check if a task is overdue
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  const due = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate);
  const now = new Date();
  // Set times to midnight to only compare calendar days, or keep exact time. 
  // Comparing exact timestamps:
  return due.getTime() < now.getTime();
};

/**
 * Format due date nicely (e.g., Today, Tomorrow, Oct 15)
 */
export const formatDueDate = (dueDate) => {
  if (!dueDate) return '';
  const d = dueDate?.toDate ? dueDate.toDate() : new Date(dueDate);
  const now = new Date();
  
  // Reset time part to do day calculations
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  const diffTime = dueDay - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Map priorities to visual colors
 */
export const getPriorityDetails = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'critical':
      return {
        label: 'Critical',
        color: 'text-red-700 bg-red-100 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50',
        glow: 'glow-critical',
        emoji: '🚨'
      };
    case 'high':
      return {
        label: 'High',
        color: 'text-orange-700 bg-orange-100 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
        glow: 'glow-high',
        emoji: '🔺'
      };
    case 'medium':
      return {
        label: 'Medium',
        color: 'text-indigo-700 bg-indigo-100 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50',
        glow: 'glow-medium',
        emoji: '🔸'
      };
    case 'low':
    default:
      return {
        label: 'Low',
        color: 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
        glow: 'glow-low',
        emoji: '🔹'
      };
  }
};

/**
 * Map categories to styles and emojis (replaces Lucide icons for high-performance responsive UI)
 */
export const getCategoryDetails = (category) => {
  switch (category?.toLowerCase()) {
    case 'work':
      return { label: 'Work', emoji: '💼', bg: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' };
    case 'personal':
      return { label: 'Personal', emoji: '👤', bg: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400' };
    case 'coding':
      return { label: 'Coding', emoji: '💻', bg: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' };
    case 'shopping':
      return { label: 'Shopping', emoji: '🛒', bg: 'bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400' };
    case 'health':
      return { label: 'Health', emoji: '❤️', bg: 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400' };
    case 'finance':
      return { label: 'Finance', emoji: '💵', bg: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' };
    default:
      return { label: category || 'Other', emoji: '📁', bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
  }
};
