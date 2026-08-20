import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toggleTask, deleteTask } from "@/lib/api";
import { useData } from "@/contexts/DataContext";
import { TaskList } from "@/components/tasks/TaskList";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { FAB } from "@/components/layout/FAB";
import { WelcomeOnboarding } from "@/components/WelcomeOnboarding";
import { StickyNote } from "@/components/StickyNote/StickyNote";

interface LayoutContext {
  openTaskForm: () => void;
}

export function TasksPage() {
  const { openTaskForm } = useOutletContext<LayoutContext>();
  const { tasks, subjects, loading, refreshTasks, setTasksOptimistic, refreshCompleted } = useData();

  useEffect(() => {
    const handleCreated = () => refreshTasks();
    window.addEventListener("task-created", handleCreated);
    return () => window.removeEventListener("task-created", handleCreated);
  }, [refreshTasks]);

  const handleToggle = async (id: string) => {
    const previousTasks = [...tasks];
    setTasksOptimistic(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await toggleTask(id);
      setTasksOptimistic(tasks.map((t) => (t.id === id ? updated : t)));
      refreshCompleted();
    } catch (err) {
      console.error("Failed to toggle task:", err);
      setTasksOptimistic(previousTasks);
    }
  };

  const handleDelete = async (id: string) => {
    setTasksOptimistic(tasks.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      refreshCompleted();
    } catch (err) {
      console.error("Failed to delete task:", err);
      refreshTasks();
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Main Task List */}
      <div className="lg:col-span-8 xl:col-span-8 w-full max-w-3xl mx-auto lg:mx-0">
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : subjects.length === 0 && tasks.length === 0 ? (
          <WelcomeOnboarding />
        ) : (
          <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </div>
      
      {/* Sticky Note Widget (Right side on desktop, bottom on mobile) */}
      <div className="lg:col-span-4 xl:col-span-4 w-full flex justify-center lg:sticky lg:top-24 mt-8 lg:mt-0">
        <StickyNote />
      </div>

      <FAB onClick={openTaskForm} />
    </div>
  );
}
