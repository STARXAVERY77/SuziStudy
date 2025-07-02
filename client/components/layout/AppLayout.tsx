import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedStudyBuddy } from "../ai/EnhancedStudyBuddy";
import { SmartNotificationManager } from "../notifications/SmartNotificationManager";
import { FocusMode } from "../focus/FocusMode";
import { Button } from "@/components/ui/button";
import { Focus, X } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [showFocusPanel, setShowFocusPanel] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        {children}

        {/* Focus Mode Toggle Button (when panel is hidden) */}
        {!showFocusPanel && (
          <Button
            onClick={() => setShowFocusPanel(true)}
            className="fixed bottom-4 left-72 z-40"
            size="sm"
            variant="outline"
          >
            <Focus className="w-4 h-4 mr-2" />
            Focus Mode
          </Button>
        )}
      </main>

      {/* Focus Mode Panel */}
      {showFocusPanel && (
        <div className="relative">
          <FocusMode />
          <Button
            onClick={() => setShowFocusPanel(false)}
            className="absolute top-2 right-2 z-50"
            size="sm"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <EnhancedStudyBuddy />
      <SmartNotificationManager />
    </div>
  );
}
