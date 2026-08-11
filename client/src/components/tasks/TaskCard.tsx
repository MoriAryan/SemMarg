import { Check, Trash2 } from "lucide-react";
import type { Task } from "@/lib/api";
import { formatDeadline } from "@/lib/utils";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export function TaskCard({ task, onToggle, onDelete, isLast }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`group py-4 px-3 flex items-start gap-4 rounded-xl transition-all duration-300 ${
        !isLast ? "border-b border-zinc-800/40" : ""
      } ${task.completed ? "opacity-50" : ""} hover:bg-white/5 hover:scale-[1.01] hover:shadow-lg hover:z-10`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 border shadow-sm hover:scale-110"
        style={{
          borderColor: task.completed ? "#10B981" : "#52525b",
          backgroundColor: task.completed ? "#10B981" : "transparent",
        }}
      >
        {task.completed && <Check size={12} strokeWidth={3} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-base font-semibold leading-tight mb-1.5 transition-colors ${
          task.completed ? "line-through text-zinc-500" : "text-white"
        }`}>
          {task.name}
        </p>

        <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: task.subject.color, boxShadow: `0 0 8px ${task.subject.color}80` }}
            />
            {task.subject.name}
          </span>
          <span>·</span>
          <span>{formatDeadline(task.deadline)}</span>
        </div>

        {task.description && (
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Delete on hover */}
      {hovered && !task.completed && (
        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
