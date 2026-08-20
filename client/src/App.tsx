import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { AppHeader } from "./components/layout/AppHeader";
import { BottomNav } from "./components/layout/BottomNav";
import { TasksPage } from "./pages/TasksPage";
import { CompletedPage } from "./pages/CompletedPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { TaskForm } from "./components/tasks/TaskForm";
import { initApiAuth } from "./lib/api";
import { DataProvider } from "./contexts/DataContext";

/**
 * This component initializes auth, then renders DataProvider + layout.
 * The key insight: initApiAuth MUST complete before DataProvider mounts,
 * otherwise the initial fetch will fail (no auth token).
 */
function AuthenticatedLayout() {
  const { getToken } = useAuth();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initApiAuth(getToken);
    setAuthReady(true);
  }, [getToken]);

  if (!authReady) return null;

  return (
    <DataProvider>
      <div className="min-h-screen flex flex-col">
        <AppHeader onNewTask={() => setIsTaskFormOpen(true)} />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 md:pb-12">
          <Outlet context={{ openTaskForm: () => setIsTaskFormOpen(true) }} />
        </main>

        <BottomNav />

        <TaskForm
          open={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onCreated={() => window.dispatchEvent(new Event("task-created"))}
        />
      </div>
    </DataProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          element={
            <>
              <SignedIn>
                <AuthenticatedLayout />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        >
          <Route path="/" element={<TasksPage />} />
          <Route path="/completed" element={<CompletedPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
