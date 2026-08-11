import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db } from "../lib/db.js";
import { getOrCreateUser } from "../lib/auth.js";

const router = Router();

// All routes require authentication
router.use(requireAuth());

/**
 * GET /api/tasks - Get all pending tasks sorted by deadline
 * Also includes tasks completed today (they remain visible until midnight)
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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tasks = await db.task.findMany({
      where: {
        userId: user.id,
        OR: [
          { completed: false },
          {
            completed: true,
            completedAt: { gte: todayStart },
          },
        ],
      },
      include: {
        subject: { select: { id: true, name: true, color: true, type: true } },
      },
      orderBy: { deadline: "asc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/**
 * GET /api/tasks/completed - Get completed tasks grouped by subject
 * Excludes tasks completed today (those are still on the Tasks page)
 */
router.get("/completed", async (req: Request, res: Response) => {
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
      where: {
        userId: user.id,
        tasks: {
          some: {
            completed: true,
          },
        },
      },
      include: {
        tasks: {
          where: {
            completed: true,
          },
          select: { id: true, name: true, completedAt: true },
          orderBy: { completedAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(subjects);
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    res.status(500).json({ error: "Failed to fetch completed tasks" });
  }
});

/**
 * POST /api/tasks - Create a new task
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

    const { subjectId, name, deadline, description } = req.body;

    if (!subjectId || !name || !deadline) {
      res.status(400).json({ error: "subjectId, name, and deadline are required" });
      return;
    }

    const subject = await db.subject.findFirst({
      where: { id: subjectId, userId: user.id },
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    const task = await db.task.create({
      data: {
        name,
        description: description || null,
        deadline: new Date(deadline),
        subjectId,
        userId: user.id,
      },
      include: {
        subject: { select: { id: true, name: true, color: true, type: true } },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/**
 * PATCH /api/tasks/:id/toggle - Toggle task completed state
 */
router.patch("/:id/toggle", async (req: Request, res: Response) => {
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

    const task = await db.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: {
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : null,
      },
      include: {
        subject: { select: { id: true, name: true, color: true, type: true } },
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error toggling task:", error);
    res.status(500).json({ error: "Failed to toggle task" });
  }
});

/**
 * DELETE /api/tasks/:id - Delete a task
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

    const task = await db.task.findFirst({
      where: { id, userId: user.id },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    await db.task.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
