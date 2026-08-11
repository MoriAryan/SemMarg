import { BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function WelcomeOnboarding() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-800/50 bg-[#0a0a0b]/40 mt-4">
      {/* Fake Background Data (Blurred) */}
      <div className="absolute inset-0 p-6 opacity-30 blur-[4px] pointer-events-none select-none flex flex-col gap-6 z-0">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="w-5 h-5 rounded border border-zinc-500/50 mt-1" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-zinc-700 rounded" />
              <div className="h-3 w-1/2 bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Foreground Call to Action */}
      <div className="relative flex flex-col items-center justify-center p-10 text-center z-10 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/80 to-transparent">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-rose-700 flex items-center justify-center mb-6 shadow-xl shadow-[var(--color-brand-glow)]">
          <Sparkles className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-md">
          Welcome to SemMarg
        </h2>
        <p className="text-base text-zinc-400 max-w-sm mb-8 leading-relaxed">
          The minimal academic utility. To start adding your coursework and tasks, you first need to create a Subject.
        </p>
        <Link
          to="/subjects"
          className="flex items-center gap-2 h-12 px-8 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[var(--color-brand)] to-rose-600 hover:scale-105 hover:shadow-lg hover:shadow-[var(--color-brand-glow)] transition-all duration-300"
        >
          <BookOpen size={18} />
          Create First Subject
        </Link>
      </div>
    </div>
  );
}
