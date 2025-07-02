import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { EnhancedStudyBuddy } from "../ai/EnhancedStudyBuddy";
import { SmartNotificationManager } from "../notifications/SmartNotificationManager";
import { FocusMode } from "../focus/FocusMode";
import { Button } from "@/components/ui/button";
import { Focus, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [showFocusPanel, setShowFocusPanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false); // Auto-close mobile sidebar on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "transition-transform duration-300 ease-in-out z-50",
          isMobile ? "fixed inset-y-0 left-0" : "relative",
          isMobile && !sidebarOpen && "-translate-x-full",
        )}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg">StudyFlow</h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          <div className={cn("h-full", isMobile ? "p-3" : "p-6")}>
            {children}
          </div>

          {/* Focus Mode Toggle Button (when panel is hidden) */}
          {!showFocusPanel && !isMobile && (
            <Button
              onClick={() => setShowFocusPanel(true)}
              className="fixed bottom-4 left-72 z-40 hidden lg:flex"
              size="sm"
              variant="outline"
            >
              <Focus className="w-4 h-4 mr-2" />
              Focus Mode
            </Button>
          )}

          {/* Mobile Focus Mode Toggle */}
          {!showFocusPanel && isMobile && (
            <Button
              onClick={() => setShowFocusPanel(true)}
              className="fixed bottom-4 right-4 z-40 lg:hidden"
              size="sm"
            >
              <Focus className="w-4 h-4" />
            </Button>
          )}
        </main>
      </div>

      {/* Focus Mode Panel */}
      {showFocusPanel && (
        <div
          className={cn(
            "relative",
            isMobile && "fixed inset-0 z-50 bg-background",
          )}
        >
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Focus Mode</h2>
              <Button
                onClick={() => setShowFocusPanel(false)}
                size="sm"
                variant="ghost"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className={cn(isMobile ? "h-full overflow-auto" : "")}>
            <FocusMode />
          </div>
          {!isMobile && (
            <Button
              onClick={() => setShowFocusPanel(false)}
              className="absolute top-2 right-2 z-50"
              size="sm"
              variant="ghost"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* AI Study Buddy - Hide on mobile or when focus panel is open */}
      {!isMobile && !showFocusPanel && <EnhancedStudyBuddy />}

      {/* Smart Notifications */}
      <SmartNotificationManager />
    </div>
  );
}
