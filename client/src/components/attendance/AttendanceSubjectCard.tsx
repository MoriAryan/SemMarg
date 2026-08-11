import type { AttendanceSummary } from "@/lib/api";

interface AttendanceSubjectCardProps {
  summary: AttendanceSummary;
  onClick: () => void;
}

export function AttendanceSubjectCard({ summary, onClick }: AttendanceSubjectCardProps) {
  const isGood = summary.percentage >= 75;

  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-[#0a0a0b]/40 backdrop-blur-xl shadow-lg transition-all hover:border-zinc-700/50 p-5 group cursor-pointer"
    >
      {/* Accent Line */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
        style={{ backgroundColor: summary.color || '#3f3f46' }}
      />
      
      {/* Subject header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-bold text-white tracking-wide pl-2 max-w-[70%] truncate">
          {summary.name}
        </h3>
        
        {/* Percentage Badge */}
        {summary.totalClasses > 0 && (
          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
            isGood ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                   : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {summary.percentage}%
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="pl-2 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-400 font-semibold">Present</span>
          <span className="text-zinc-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {summary.totalPresent}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-rose-400 font-semibold">Absent</span>
          <span className="text-zinc-300 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            {summary.totalAbsent}
          </span>
        </div>
      </div>
      
      {/* Benchmark Indicator */}
      <div className="pl-2 mt-4">
        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${summary.percentage}%`,
              backgroundColor: summary.totalClasses === 0 ? '#3f3f46' : (isGood ? '#10b981' : '#f43f5e') 
            }}
          />
        </div>
      </div>
    </div>
  );
}
