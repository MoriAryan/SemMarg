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
