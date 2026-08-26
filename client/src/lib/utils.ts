import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  isToday,
  isTomorrow,
  isPast,
  format,
  formatDistanceToNow,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get deadline category for sorting and styling
 */
export type DeadlineCategory = "overdue" | "today" | "tomorrow" | "upcoming";

export function getDeadlineCategory(deadline: string | Date): DeadlineCategory {
  const date = new Date(deadline);

  if (isPast(date)) return "overdue";
  if (isToday(date)) return "today";
  if (isTomorrow(date)) return "tomorrow";
  return "upcoming";
}

/**
 * Format deadline for display
 */
export function formatDeadline(deadline: string | Date): string {
  const date = new Date(deadline);
  const category = getDeadlineCategory(date);

  switch (category) {
    case "overdue":
      return `Overdue · ${formatDistanceToNow(date, { addSuffix: true })}`;
    case "today":
      return `Today · ${format(date, "h:mm a")}`;
    case "tomorrow":
      return `Tomorrow · ${format(date, "h:mm a")}`;
    default:
      return format(date, "MMM d · h:mm a");
  }
}

/**
 * Get the section label for deadline grouping
 */
export function getDeadlineSectionLabel(category: DeadlineCategory): string {
  switch (category) {
    case "overdue":
      return "Overdue";
    case "today":
      return "Due Today";
    case "tomorrow":
      return "Due Tomorrow";
    case "upcoming":
      return "Upcoming";
  }
}

/**
 * Category display order
 */
export const CATEGORY_ORDER: DeadlineCategory[] = [
  "overdue",
  "today",
  "tomorrow",
  "upcoming",
];

/**
 * Calculate attendance margins (how many present to reach 75% or how many absent allowed to stay above 75%)
 */
export function getAttendanceMargin(present: number, total: number, targetPercentage: number = 75) {
  if (total === 0) return { type: 'none', count: 0 };
  
  const currentPercentage = (present / total) * 100;
  
  if (currentPercentage < targetPercentage) {
    // How many more present needed
    // (present + x) / (total + x) = 0.75
    // x = (0.75 * total - present) / 0.25
    const needed = Math.ceil(( (targetPercentage / 100) * total - present ) / (1 - targetPercentage / 100));
    return { type: 'need_present', count: needed };
  } else {
    // How many absent allowed
    // present / (total + y) = 0.75
    // y = (present - 0.75 * total) / 0.75
    const allowed = Math.floor(( present - (targetPercentage / 100) * total ) / (targetPercentage / 100));
    return { type: 'can_absent', count: allowed };
  }
}
