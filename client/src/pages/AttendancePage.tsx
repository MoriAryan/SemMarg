import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { AttendanceSubjectCard } from "@/components/attendance/AttendanceSubjectCard";
import { AttendanceDetail } from "@/components/attendance/AttendanceDetail";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export function AttendancePage() {
  const { attendanceSummary, loading, refreshAttendance } = useData();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  if (selectedSubjectId) {
    return (
      <div className="w-full">
        <AttendanceDetail 
          subjectId={selectedSubjectId} 
          onBack={() => setSelectedSubjectId(null)} 
          onUpdate={refreshAttendance}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 pb-3 border-b border-white/10">
        <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">Attendance</h1>
        <p className="text-sm text-zinc-500 mt-1">Track your 75% benchmark</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : attendanceSummary.length === 0 ? (
        <EmptyState
          title="No subjects found"
          description="You need to create subjects before you can track attendance."
          action={
            <Link
              to="/subjects"
              className="flex items-center justify-center gap-2 h-10 px-6 rounded-full text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors mt-4"
            >
              <BookOpen size={16} /> Go to Subjects
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {attendanceSummary.map((summary) => (
            <AttendanceSubjectCard 
              key={summary.id} 
              summary={summary} 
              onClick={() => setSelectedSubjectId(summary.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
