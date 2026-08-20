import { useState, useMemo } from "react";
import { Check, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { createQuickTask, toggleQuickTask, deleteQuickTask, QuickTask } from "@/lib/api";

function isToday(dateString: string | null) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function StickyNote() {
  const { quickTasks, setQuickTasksOptimistic, refreshQuickTasks } = useData();
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Split tasks into active (uncompleted OR completed today) and archive (completed before today)
  const { activeTasks, archivedTasks } = useMemo(() => {
    const active: QuickTask[] = [];
    const archived: QuickTask[] = [];

    quickTasks.forEach((task) => {
      if (!task.completed || isToday(task.completedAt)) {
        active.push(task);
      } else {
        archived.push(task);
      }
    });

    return { activeTasks: active, archivedTasks: archived };
  }, [quickTasks]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    const newTask: QuickTask = {
      id: tempId,
      content: inputValue.trim(),
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setQuickTasksOptimistic([newTask, ...quickTasks]);
    setInputValue("");

    try {
      await createQuickTask({ content: newTask.content });
      refreshQuickTasks();
    } catch (err) {
      console.error("Failed to create quick task", err);
      // Revert on error
      refreshQuickTasks();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    // Optimistic UI
    const updated = quickTasks.map((t) =>
      t.id === id ? { ...t, completed: !completed, completedAt: !completed ? new Date().toISOString() : null } : t
    );
    setQuickTasksOptimistic(updated);

    try {
      await toggleQuickTask(id);
      refreshQuickTasks();
    } catch (err) {
      console.error("Failed to toggle quick task", err);
      refreshQuickTasks();
    }
  };

  const handleDelete = async (id: string) => {
    setQuickTasksOptimistic(quickTasks.filter((t) => t.id !== id));
    try {
      await deleteQuickTask(id);
      refreshQuickTasks();
    } catch (err) {
      console.error("Failed to delete quick task", err);
      refreshQuickTasks();
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto font-sans">
      {/* Sticky Note Container */}
      <div className="relative bg-gradient-to-br from-[#fef08a] to-[#fde047] rounded-br-2xl shadow-lg p-5 pb-0 text-zinc-800 transition-all duration-300">
        
        {/* Tape Effect at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-5 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm rounded-sm z-10" />

        <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2 text-yellow-900 border-b border-yellow-400/50 pb-2">
          Quick Notes
        </h2>

        {/* Input */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Remind me to..."
            className="flex-1 bg-white/50 border-none rounded placeholder:text-zinc-500 focus:ring-2 focus:ring-yellow-500/50 text-sm py-1.5 px-3 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="bg-yellow-500 hover:bg-yellow-600 text-white rounded p-1.5 transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </form>

        {/* Active Tasks */}
        <div className="space-y-1 mb-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {activeTasks.length === 0 ? (
            <p className="text-sm text-yellow-700/70 italic py-2 text-center">Nothing urgent right now.</p>
          ) : (
            activeTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-1.5 hover:bg-yellow-500/10 rounded transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button
                    onClick={() => handleToggle(task.id, task.completed)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "border-yellow-600 bg-yellow-600 text-yellow-100"
                        : "border-yellow-600/50 hover:border-yellow-600"
                    }`}
                  >
                    {task.completed && <Check size={12} strokeWidth={3} />}
                  </button>
                  <span
                    className={`text-sm font-medium truncate ${
                      task.completed ? "line-through text-yellow-700/60" : "text-zinc-800"
                    }`}
                  >
                    {task.content}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1 flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Archive Button */}
        {archivedTasks.length > 0 && (
          <div className="border-t border-yellow-400/50 mx-[-1.25rem] px-5 py-2">
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-yellow-700 hover:text-yellow-900 transition-colors py-1"
            >
              {showArchive ? (
                <>Hide Archive <ChevronUp size={14} /></>
              ) : (
                <>Show Archive ({archivedTasks.length}) <ChevronDown size={14} /></>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Archive Fold - beautifully expands below */}
      <div
        className={`relative -mt-2 bg-gradient-to-b from-[#fde047] to-[#fef08a] rounded-b-2xl shadow-lg transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
          showArchive ? "max-h-[300px] opacity-100 border-t border-dashed border-yellow-500/30" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-4 space-y-1 overflow-y-auto max-h-[300px] custom-scrollbar">
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-1 hover:bg-yellow-500/10 rounded transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0 w-4 h-4 rounded-full border border-yellow-700/30 bg-yellow-700/10 flex items-center justify-center">
                  <Check size={10} className="text-yellow-700/50" />
                </div>
                <span className="text-xs line-through text-yellow-700/50 truncate">
                  {task.content}
                </span>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1 flex-shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
