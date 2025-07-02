import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { StudyBuddy } from "../ai/StudyBuddy";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <StudyBuddy />
    </div>
  );
}
