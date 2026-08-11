import { useState, useEffect } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getSubjectAttendance, markAttendance, deleteAttendance, type AttendanceRecord, type Subject } from "@/lib/api";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface AttendanceDetailProps {
  subjectId: string;
  onBack: () => void;
  onUpdate: () => void;
}

export function AttendanceDetail({ subjectId, onBack, onUpdate }: AttendanceDetailProps) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Default to today
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    loadData();
  }, [subjectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSubjectAttendance(subjectId);
      setSubject(data.subject);
      setRecords(data.records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMark = async (status: "P" | "A") => {
    if (!selectedDate || marking) return;
    setMarking(true);
    try {
      const newRecord = await markAttendance({ subjectId, date: selectedDate, status });
      setRecords([newRecord, ...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      onUpdate();
    } catch (err) {
      console.error("Failed to mark attendance", err);
    } finally {
      setMarking(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setRecords(records.filter(r => r.id !== id));
      await deleteAttendance(id);
      onUpdate();
    } catch (err) {
      console.error("Failed to delete attendance", err);
      loadData(); // Revert on error
    }
  };

  if (loading || !subject) {
    return (
      <div className="w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6">
          <ArrowLeft size={18} /> Back
        </button>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="w-full animate-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-3 h-8 rounded-full" style={{ backgroundColor: subject.color }} />
        <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">{subject.name}</h2>
      </div>

      <div className="glass-panel p-5 rounded-2xl mb-8">
        <label className="block text-sm font-medium text-zinc-400 mb-2">Select Date</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full h-11 px-4 rounded-lg text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 transition-colors [color-scheme:dark] mb-6"
        />
        
        <div className="flex gap-4">
          <button 
            onClick={() => handleMark("P")}
            disabled={marking}
            className="flex-1 h-12 rounded-lg font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Present
          </button>
          <button 
            onClick={() => handleMark("A")}
            disabled={marking}
            className="flex-1 h-12 rounded-lg font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Absent
          </button>
        </div>
      </div>

      <h3 className="text-sm font-bold text-zinc-500 tracking-wider uppercase mb-4 pl-1">History</h3>
      
      {records.length === 0 ? (
        <div className="text-center p-8 border border-zinc-800/50 border-dashed rounded-xl text-zinc-500">
          No attendance records yet
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map(record => {
            const dateStr = new Date(record.date).toLocaleDateString(undefined, { 
              weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' 
            });
            return (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-800/50 bg-[#0a0a0b]/40">
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                    record.status === "P" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {record.status}
                  </span>
                  <span className="text-sm font-medium text-zinc-300">{dateStr}</span>
                </div>
                <button 
                  onClick={() => handleDelete(record.id)}
                  className="text-zinc-600 hover:text-rose-400 transition-colors p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
