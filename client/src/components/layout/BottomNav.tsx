import { NavLink } from "react-router-dom";
import { ListTodo, CheckCircle2, BookOpen, ClipboardCheck } from "lucide-react";

const navItems = [
  { to: "/", icon: ListTodo, label: "Tasks" },
  { to: "/completed", icon: CheckCircle2, label: "Done" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attnd." },
  { to: "/subjects", icon: BookOpen, label: "Subjects" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-x-0 border-b-0 border-t border-white/5 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs font-medium transition-all duration-300 ${
                isActive ? "text-white scale-110 drop-shadow-md" : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
