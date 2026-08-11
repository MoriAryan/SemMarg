import { useState } from "react";
import { createSubject } from "@/lib/api";

interface SubjectFormProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function SubjectForm({ open, onClose, onCreated }: SubjectFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"LAB" | "TUTORIAL">("LAB");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      await createSubject({ name: name.trim(), type });
      setName("");
      setType("LAB");
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create subject");
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
          <h2 className="text-base font-bold text-white mb-6">New Subject</h2>

          <form id="subject-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">Subject name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="w-full h-10 px-3 rounded-md text-sm bg-[#0a0a0b] border border-zinc-800 text-white outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-400 mb-1">Type</label>
              <div className="flex p-0.5 rounded bg-[#0a0a0b] border border-zinc-800">
                {(["LAB", "TUTORIAL"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 h-9 rounded text-sm font-medium transition-all duration-300 ${
                      type === t
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {t === "LAB" ? "Lab" : "Tutorial"}
                  </button>
                ))}
              </div>
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
            form="subject-form"
            disabled={loading || !name.trim()}
            className="h-10 px-5 rounded-md text-sm font-bold bg-white text-zinc-900 hover:bg-zinc-200 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 shadow-md"
          >
            {loading ? "Adding..." : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
}
