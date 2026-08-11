import { UserButton } from "@clerk/clerk-react";
import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Tasks" },
  { to: "/completed", label: "Completed" },
  { to: "/attendance", label: "Attendance" },
  { to: "/subjects", label: "Subjects" },
];

interface AppHeaderProps {
  onNewTask?: () => void;
}

export function AppHeader({ onNewTask }: AppHeaderProps) {

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-x-0 border-t-0 border-b border-white/5">
      <div className="w-full max-w-4xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">

        {/* Left: Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0 transition-transform hover:scale-105 duration-300">
          <img src="/logo.png" alt="SemMarg" className="w-7 h-7 object-contain drop-shadow-md" />
          <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">SemMarg</span>
        </NavLink>

        {/* Center: Nav (desktop only) */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-base font-medium transition-all duration-300 px-3 py-1.5 rounded-full ${
                  isActive ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-md text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-200 hover:scale-105 transition-all shadow-md"
            >
              <Plus size={16} strokeWidth={2.5} />
              Task
            </button>
          )}



          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 shadow-md" } }} />
        </div>
      </div>
    </header>
  );
}
