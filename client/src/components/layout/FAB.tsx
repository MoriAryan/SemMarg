import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden fixed bottom-[72px] right-4 z-50 w-12 h-12 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      aria-label="Add new task"
    >
      <Plus size={20} strokeWidth={2} />
    </button>
  );
}
