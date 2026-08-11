import { useData } from "@/contexts/DataContext";
import { CompletedSubjectCard } from "@/components/completed/CompletedSubjectCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";

export function CompletedPage() {
  const { completedSubjects, loading } = useData();

  return (
    <div className="w-full">
      <div className="mb-8 pb-3 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">Completed</h1>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : completedSubjects.length === 0 ? (
        <EmptyState
          title="No completed tasks yet"
          description="When you complete tasks, they will show up here grouped by subject. They also stay on the home screen until midnight!"
        />
      ) : (
        <div className="flex flex-col gap-8">
          {completedSubjects.map((subject, index) => (
            <CompletedSubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  );
}
