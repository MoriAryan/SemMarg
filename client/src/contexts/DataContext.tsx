import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getTasks, getSubjects, getCompletedTasks, getAttendanceSummary, type Task, type Subject, type CompletedSubject, type AttendanceSummary } from "@/lib/api";

interface DataContextType {
  tasks: Task[];
  subjects: Subject[];
  completedSubjects: CompletedSubject[];
  attendanceSummary: AttendanceSummary[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  refreshSubjects: () => Promise<void>;
  refreshCompleted: () => Promise<void>;
  refreshAttendance: () => Promise<void>;
  refreshAll: () => Promise<void>;
  setTasksOptimistic: (tasks: Task[]) => void;
  setSubjectsOptimistic: (subjects: Subject[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [completedSubjects, setCompletedSubjects] = useState<CompletedSubject[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  }, []);

  const refreshSubjects = useCallback(async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  }, []);

  const refreshCompleted = useCallback(async () => {
    try {
      const data = await getCompletedTasks();
      setCompletedSubjects(data);
    } catch (err) {
      console.error("Failed to fetch completed tasks", err);
    }
  }, []);

  const refreshAttendance = useCallback(async () => {
    try {
      const data = await getAttendanceSummary();
      setAttendanceSummary(data);
    } catch (err) {
      console.error("Failed to fetch attendance summary", err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      refreshTasks(),
      refreshSubjects(),
      refreshCompleted(),
      refreshAttendance()
    ]);
    setLoading(false);
  }, [refreshTasks, refreshSubjects, refreshCompleted, refreshAttendance]);

  // Initial fetch
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Expose an optimistic setter for instant UI updates
  const setTasksOptimistic = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const setSubjectsOptimistic = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
  }, []);

  return (
    <DataContext.Provider value={{ 
      tasks, 
      subjects, 
      completedSubjects, 
      attendanceSummary,
      loading, 
      refreshTasks, 
      refreshSubjects, 
      refreshCompleted, 
      refreshAttendance,
      refreshAll,
      setTasksOptimistic,
      setSubjectsOptimistic
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
