import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedStudyBuddy } from "../ai/EnhancedStudyBuddy";
import { NotificationSystem } from "../notifications/NotificationSystem";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
      <EnhancedStudyBuddy />
      <NotificationSystem />
    </div>
  );
}
