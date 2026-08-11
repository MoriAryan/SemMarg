import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db } from "../lib/db.js";
import { getOrCreateUser, getNextAccentColor } from "../lib/auth.js";

const router = Router();

// All routes require authentication
router.use(requireAuth());

/**
 * GET /api/subjects - List all subjects for the current user
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getOrCreateUser(
      auth.userId,
      (auth as any).sessionClaims?.email || `${auth.userId}@clerk.dev`,
      (auth as any).sessionClaims?.name
    );

    const subjects = await db.subject.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

/**
 * POST /api/subjects - Create a new subject
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getOrCreateUser(
      auth.userId,
      (auth as any).sessionClaims?.email || `${auth.userId}@clerk.dev`,
      (auth as any).sessionClaims?.name
    );

    const { name, type } = req.body;

    if (!name || !type) {
      res.status(400).json({ error: "Name and type are required" });
      return;
    }

    if (!["LAB", "TUTORIAL"].includes(type)) {
      res.status(400).json({ error: "Type must be LAB or TUTORIAL" });
      return;
    }

    const color = await getNextAccentColor(user.id);

    const subject = await db.subject.create({
      data: {
        name,
        type,
        color,
        userId: user.id,
      },
    });

    res.status(201).json(subject);
  } catch (error: any) {
    if (error?.code === "P2002") {
      res.status(409).json({ error: "Subject with this name already exists" });
      return;
    }
    console.error("Error creating subject:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

/**
 * DELETE /api/subjects/:id - Delete a subject and cascade-delete its tasks
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = req.params.id as string;

    const user = await getOrCreateUser(
      auth.userId,
      (auth as any).sessionClaims?.email || `${auth.userId}@clerk.dev`,
      (auth as any).sessionClaims?.name
    );

    const subject = await db.subject.findFirst({
      where: { id, userId: user.id },
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    await db.subject.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Failed to delete subject" });
  }
});

export default router;
