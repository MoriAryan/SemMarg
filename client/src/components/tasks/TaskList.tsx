import { ListTodo } from "lucide-react";
import type { Task } from "@/lib/api";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "@/components/EmptyState";
import {
  getDeadlineCategory,
  getDeadlineSectionLabel,
  CATEGORY_ORDER,
  type DeadlineCategory,
} from "@/lib/utils";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="All clear"
        description="No pending coursework. Enjoy the break."
      />
    );
  }

  const grouped = tasks.reduce<Record<DeadlineCategory, Task[]>>(
    (acc, task) => {
      const cat = getDeadlineCategory(task.deadline);
      acc[cat].push(task);
      return acc;
    },
    { overdue: [], today: [], tomorrow: [], upcoming: [] }
  );

  for (const cat of CATEGORY_ORDER) {
    grouped[cat].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {CATEGORY_ORDER.map((category) => {
        const categoryTasks = grouped[category];
        if (categoryTasks.length === 0) return null;

        return (
          <section key={category}>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 px-1 ${
              category === "overdue" ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]" : "text-zinc-400"
            }`}>
              {getDeadlineSectionLabel(category)}
            </h2>

            <div className="flex flex-col">
              {categoryTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  isLast={index === categoryTasks.length - 1}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
