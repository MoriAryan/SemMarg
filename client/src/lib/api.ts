const API_URL = import.meta.env.PROD ? "/api" : (import.meta.env.VITE_API_URL || "/api");

/**
 * Fetch wrapper that automatically includes Clerk auth token
 */
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from Clerk - we'll pass it from components
  const token = await (window as any).__clerk_token?.();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response;
}

// ==========================================
// Types
// ==========================================

export interface Subject {
  id: string;
  name: string;
  type: "LAB" | "TUTORIAL";
  color: string;
  createdAt: string;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  name: string;
  description: string | null;
  deadline: string;
  completed: boolean;
  completedAt: string | null;
  subjectId: string;
  subject: {
    id: string;
    name: string;
    color: string;
    type: "LAB" | "TUTORIAL";
  };
  createdAt: string;
  updatedAt: string;
}

export interface QuickTask {
  id: string;
  content: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedSubject extends Subject {
  tasks: { id: string; name: string; completedAt: string }[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: "P" | "A";
  subjectId: string;
  userId: string;
}

export interface AttendanceSummary {
  id: string;
  name: string;
  type: "LAB" | "TUTORIAL";
  color: string;
  totalPresent: number;
  totalAbsent: number;
  totalClasses: number;
  percentage: number;
}

// ==========================================
// Subjects API
// ==========================================

export async function getSubjects(): Promise<Subject[]> {
  const res = await fetchWithAuth("/subjects");
  return res.json();
}

export async function createSubject(data: {
  name: string;
  type: "LAB" | "TUTORIAL";
}): Promise<Subject> {
  const res = await fetchWithAuth("/subjects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSubject(id: string): Promise<void> {
  await fetchWithAuth(`/subjects/${id}`, { method: "DELETE" });
}

// ==========================================
// Tasks API
// ==========================================

export async function getTasks(): Promise<Task[]> {
  const res = await fetchWithAuth("/tasks");
  return res.json();
}

export async function getCompletedTasks(): Promise<CompletedSubject[]> {
  const res = await fetchWithAuth("/tasks/completed");
  return res.json();
}

export async function createTask(data: {
  subjectId: string;
  name: string;
  deadline: string;
  description?: string;
}): Promise<Task> {
  const res = await fetchWithAuth("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleTask(id: string): Promise<Task> {
  const res = await fetchWithAuth(`/tasks/${id}/toggle`, { method: "PATCH" });
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  await fetchWithAuth(`/tasks/${id}`, { method: "DELETE" });
}

// ==========================================
// Quick Tasks API
// ==========================================

export async function getQuickTasks(): Promise<QuickTask[]> {
  const res = await fetchWithAuth("/quick-tasks");
  return res.json();
}

export async function createQuickTask(data: { content: string }): Promise<QuickTask> {
  const res = await fetchWithAuth("/quick-tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function toggleQuickTask(id: string): Promise<QuickTask> {
  const res = await fetchWithAuth(`/quick-tasks/${id}`, { method: "PATCH" });
  return res.json();
}

export async function deleteQuickTask(id: string): Promise<void> {
  await fetchWithAuth(`/quick-tasks/${id}`, { method: "DELETE" });
}

// ==========================================
// Attendance API
// ==========================================

export async function getAttendanceSummary(): Promise<AttendanceSummary[]> {
  const res = await fetchWithAuth("/attendance");
  return res.json();
}

export async function getSubjectAttendance(subjectId: string): Promise<{
  subject: Subject;
  records: AttendanceRecord[];
}> {
  const res = await fetchWithAuth(`/attendance/subject/${subjectId}`);
  return res.json();
}

export async function markAttendance(data: {
  subjectId: string;
  date: string;
  status: "P" | "A";
}): Promise<AttendanceRecord> {
  const res = await fetchWithAuth("/attendance", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteAttendance(id: string): Promise<void> {
  await fetchWithAuth(`/attendance/${id}`, { method: "DELETE" });
}

/**
 * Initialize the auth token getter for API calls.
 * Call this once when Clerk is ready.
 */
export function initApiAuth(getToken: () => Promise<string | null>) {
  (window as any).__clerk_token = getToken;
}
