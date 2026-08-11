import { Router, Request, Response } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db } from "../lib/db.js";
import { getOrCreateUser } from "../lib/auth.js";

const router = Router();

// All routes require authentication
router.use(requireAuth());

/**
 * GET /api/attendance - Get attendance summary for all subjects
 * Returns subjects with their attendance counts
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
        attendance: {
          orderBy: { date: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform into summary format
    const summary = subjects.map((subject) => {
      const totalP = subject.attendance.filter((a) => a.status === "P").length;
      const totalA = subject.attendance.filter((a) => a.status === "A").length;
      const total = totalP + totalA;
      const percentage = total === 0 ? 0 : Math.round((totalP / total) * 100);

      return {
        id: subject.id,
        name: subject.name,
        type: subject.type,
        color: subject.color,
        totalPresent: totalP,
        totalAbsent: totalA,
        totalClasses: total,
        percentage,
      };
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/**
 * GET /api/attendance/subject/:subjectId - Get attendance log for a subject
 */
router.get("/subject/:subjectId", async (req: Request, res: Response) => {
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

    const subjectId = req.params.subjectId;

    // Verify subject belongs to user
    const subject = await db.subject.findFirst({
      where: { id: subjectId, userId: user.id },
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    const records = await db.attendance.findMany({
      where: { subjectId, userId: user.id },
      orderBy: { date: "desc" },
    });

    res.json({
      subject: {
        id: subject.id,
        name: subject.name,
        color: subject.color,
        type: subject.type,
      },
      records,
    });
  } catch (error) {
    console.error("Error fetching attendance log:", error);
    res.status(500).json({ error: "Failed to fetch attendance log" });
  }
});

/**
 * POST /api/attendance - Mark attendance
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

    const { subjectId, date, status } = req.body;

    if (!subjectId || !date || !status) {
      res.status(400).json({ error: "subjectId, date, and status are required" });
      return;
    }

    if (!["P", "A"].includes(status)) {
      res.status(400).json({ error: "Status must be 'P' or 'A'" });
      return;
    }

    // Verify subject belongs to user
    const subject = await db.subject.findFirst({
      where: { id: subjectId, userId: user.id },
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    const record = await db.attendance.create({
      data: {
        date: new Date(date),
        status,
        subjectId,
        userId: user.id,
      },
    });

    res.status(201).json(record);
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

/**
 * DELETE /api/attendance/:id - Remove an attendance entry
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = req.params.id;

    const user = await getOrCreateUser(
      auth.userId,
      (auth as any).sessionClaims?.email || `${auth.userId}@clerk.dev`,
      (auth as any).sessionClaims?.name
    );

    const record = await db.attendance.findFirst({
      where: { id, userId: user.id },
    });

    if (!record) {
      res.status(404).json({ error: "Attendance record not found" });
      return;
    }

    await db.attendance.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({ error: "Failed to delete attendance" });
  }
});

export default router;
