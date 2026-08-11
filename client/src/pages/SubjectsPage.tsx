import { useState } from "react";
import { deleteSubject } from "@/lib/api";
import { useData } from "@/contexts/DataContext";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { SubjectForm } from "@/components/subjects/SubjectForm";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";

export function SubjectsPage() {
  const { subjects, loading, refreshSubjects } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      refreshSubjects();
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  return (
    <div className="w-full">
      {/* Header section with add button */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
        <h1 className="text-base font-bold text-white tracking-tight drop-shadow-sm">Subjects</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center h-8 px-3 rounded-md text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 hover:scale-105 transition-all shadow-sm"
        >
          + Add
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : subjects.length === 0 ? (
        <EmptyState
          title="No subjects created"
          description="Create your labs and tutorial subjects first so you can organize your coursework tasks."
        />
      ) : (
        <div className="flex flex-col">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={index}
              onDelete={handleDelete}
              isLast={index === subjects.length - 1}
            />
          ))}
        </div>
      )}

      <SubjectForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onCreated={refreshSubjects}
      />
    </div>
  );
}
