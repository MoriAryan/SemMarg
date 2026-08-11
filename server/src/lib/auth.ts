import { db } from "./db.js";

// Curated accent colors for subjects — soft, pleasing, distinct
const ACCENT_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#a855f7", // Purple
];

/**
 * Find or create a Prisma User from Clerk session data.
 */
export async function getOrCreateUser(clerkUserId: string, email: string, name?: string) {
  let user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId: clerkUserId,
        email,
        name: name || null,
      },
    });
  }

  return user;
}

/**
 * Get the next accent color for a new subject.
 * Cycles through the palette based on how many subjects the user already has.
 */
export async function getNextAccentColor(userId: string): Promise<string> {
  const count = await db.subject.count({ where: { userId } });
  return ACCENT_COLORS[count % ACCENT_COLORS.length];
}
