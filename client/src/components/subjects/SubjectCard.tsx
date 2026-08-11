import { Trash2 } from "lucide-react";
import type { Subject } from "@/lib/api";
import { useState } from "react";

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onDelete: (id: string) => void;
  isLast?: boolean;
}

export function SubjectCard({ subject, index, onDelete, isLast }: SubjectCardProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={`group py-4 px-4 flex items-center justify-between rounded-xl transition-all duration-300 ${
        !isLast ? "border-b border-zinc-800/40" : ""
      } hover:bg-white/5 hover:scale-[1.01] hover:shadow-lg hover:z-10`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
          style={{ backgroundColor: subject.color, boxShadow: `0 0 8px ${subject.color}80` }}
        />
        <div className="min-w-0">
          <p className="text-base font-semibold text-white truncate leading-tight mb-0.5">
            {subject.name}
          </p>
          <p className="text-sm text-zinc-400 font-medium">
            {subject.type === "LAB" ? "Lab" : "Tutorial"}
          </p>
        </div>
      </div>

      {showDelete && (
        <button
          onClick={() => onDelete(subject.id)}
          className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          aria-label="Delete subject"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
