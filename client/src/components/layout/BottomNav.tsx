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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-x-0 border-b-0 border-t border-white/5 pb-6 pt-2 px-2 shadow-2xl">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-all duration-300 ${
                isActive ? "text-white scale-105" : "text-zinc-500 hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-white/10' : 'bg-transparent'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'drop-shadow-md' : ''}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
