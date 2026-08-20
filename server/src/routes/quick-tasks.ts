import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db } from "../lib/db.js";
import { getOrCreateUser } from "../lib/auth.js";

const router = Router();

// All routes require authentication
router.use(requireAuth());

/**
 * GET /api/quick-tasks - List all quick tasks for the current user
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

    const quickTasks = await db.quickTask.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(quickTasks);
  } catch (error) {
    console.error("Error fetching quick tasks:", error);
    res.status(500).json({ error: "Failed to fetch quick tasks" });
  }
});

/**
 * POST /api/quick-tasks - Create a new quick task
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

    const { content } = req.body;

    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    const quickTask = await db.quickTask.create({
      data: {
        content,
        userId: user.id,
      },
    });

    res.status(201).json(quickTask);
  } catch (error) {
    console.error("Error creating quick task:", error);
    res.status(500).json({ error: "Failed to create quick task" });
  }
});

/**
 * PATCH /api/quick-tasks/:id - Toggle quick task completion
 */
router.patch("/:id", async (req: Request, res: Response) => {
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

    const existingTask = await db.quickTask.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const updatedTask = await db.quickTask.update({
      where: { id },
      data: {
        completed: !existingTask.completed,
        completedAt: !existingTask.completed ? new Date() : null,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating quick task:", error);
    res.status(500).json({ error: "Failed to update quick task" });
  }
});

/**
 * DELETE /api/quick-tasks/:id - Delete a quick task
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

    const existingTask = await db.quickTask.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await db.quickTask.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting quick task:", error);
    res.status(500).json({ error: "Failed to delete quick task" });
  }
});

export default router;
