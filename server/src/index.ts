import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import subjectsRouter from "./routes/subjects.js";
import tasksRouter from "./routes/tasks.js";
import attendanceRouter from "./routes/attendance.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use("/api/subjects", subjectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/attendance", attendanceRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server only if not running in a serverless environment like Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 SemMarg API running on http://localhost:${PORT}`);
  });
}

export default app;
