import type { CompletedSubject } from "@/lib/api";

interface CompletedSubjectCardProps {
  subject: CompletedSubject;
}

export function CompletedSubjectCard({ subject }: CompletedSubjectCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-[#0a0a0b]/40 backdrop-blur-xl shadow-lg transition-all hover:border-zinc-700/50 p-5 group">
      {/* Accent Line */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
        style={{ backgroundColor: subject.color || '#3f3f46' }}
      />
      
      {/* Subject header */}
      <h3 className="text-base font-bold text-white mb-4 tracking-wide pl-2">
        {subject.name}
      </h3>

      {/* Completed task list (Numbered) */}
      <div className="flex flex-col gap-3 pl-2">
        {subject.tasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-start gap-3"
          >
            <span className="text-sm font-bold text-zinc-500 w-5 text-right shrink-0 mt-0.5">
              {index + 1}.
            </span>
            <span className="text-sm text-zinc-400 font-medium line-through decoration-zinc-600">
              {task.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
