"use client";

import { useEffect, type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Force dark mode — remove any stale light mode from localStorage
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    localStorage.setItem("semmarg-theme", "dark");
  }, []);

  return <>{children}</>;
}

