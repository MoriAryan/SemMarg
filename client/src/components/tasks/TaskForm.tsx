import { useState, useEffect } from "react";
import { createTask, getSubjects, type Subject } from "@/lib/api";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function TaskForm({ open, onClose, onCreated }: TaskFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      getSubjects().then(setSubjects).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !name || !deadline) return;

    setLoading(true);
    setError("");

    try {
      await createTask({
        subjectId,
        name,
        deadline: new Date(deadline).toISOString(),
        description: description || undefined,
      });
      setName("");
      setDeadline("");
      setDescription("");
      setSubjectId("");
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative z-10 w-full sm:max-w-[400px] sm:mx-4 bg-[#141414] border border-zinc-800 rounded-t-xl sm:rounded-xl shadow-2xl">
        <div className="px-5 pt-5 pb-4">
          <h2 className="text-base font-bold text-white mb-6">New Task</h2>

          <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">Subject</label>
              <Select.Root value={subjectId} onValueChange={setSubjectId} required>
                <Select.Trigger className="w-full flex items-center justify-between h-10 px-3 rounded-md text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 transition-colors data-[placeholder]:text-zinc-500">
                  <Select.Value placeholder="Select subject..." />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-[#18181b] border border-zinc-800 rounded-md shadow-2xl z-[70]">
                    <Select.Viewport className="p-1">
                      {subjects.map((s) => (
                        <Select.Item
                          key={s.id}
                          value={s.id}
                          className="relative flex items-center h-8 px-8 text-sm text-zinc-300 rounded-sm select-none outline-none data-[highlighted]:bg-zinc-800 data-[highlighted]:text-white cursor-pointer transition-colors"
                        >
                          <Select.ItemText>{s.name}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 flex items-center justify-center">
                            <Check className="h-4 w-4 text-brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">Task name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-md text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-md text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 transition-colors [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">
                Notes <span className="text-zinc-600 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-md text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 resize-none transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
        </div>

        <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-md text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            disabled={loading || !subjectId || !name || !deadline}
            className="h-10 px-5 rounded-md text-sm font-bold bg-white text-zinc-900 hover:bg-zinc-200 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 shadow-md"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
