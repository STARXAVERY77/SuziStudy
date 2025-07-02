import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookOpen,
  Calendar,
  Target,
  Brain,
  Timer,
  BarChart3,
  Settings,
  MessageCircle,
  Mic,
  FileText,
  GitBranch,
  Zap,
  Code,
  GraduationCap,
  Cpu,
  Database,
  FileSearch,
  Play,
  Focus,
  BellOff,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "AI Tutor", href: "/ai-tutor", icon: Brain },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Flashcards", href: "/flashcards", icon: Zap },
  { name: "LeetCode", href: "/leetcode", icon: Code },
  { name: "Viva Practice", href: "/viva", icon: GraduationCap },
  { name: "Materials", href: "/materials", icon: FileText },
  { name: "Documents", href: "/documents", icon: FileSearch },
  { name: "Video Learning", href: "/video-learning", icon: Play },
  { name: "Mind Maps", href: "/mindmap", icon: GitBranch },
  { name: "Focus Timer", href: "/focus", icon: Timer },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Voice Assistant", href: "/voice", icon: Mic },
  { name: "Goals", href: "/goals", icon: Target },
];

const bottomNavigation = [
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Smart Schedule", href: "/smart-scheduler", icon: Cpu },
  { name: "AI Memory", href: "/memory", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation();
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleFocusMode = () => {
    setFocusModeActive(!focusModeActive);
    console.log(`Focus mode ${!focusModeActive ? "enabled" : "disabled"}`);
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col h-screen",
        isMobile ? "w-72" : "w-64",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "border-b border-sidebar-border",
          isMobile ? "p-4" : "p-6",
        )}
      >
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center",
              isMobile ? "w-10 h-10" : "w-8 h-8",
            )}
          >
            <Brain
              className={cn("text-white", isMobile ? "w-6 h-6" : "w-5 h-5")}
            />
          </div>
          <span
            className={cn(
              "font-bold text-sidebar-foreground",
              isMobile ? "text-2xl" : "text-xl",
            )}
          >
            StudyFlow
          </span>
        </div>
      </div>

      {/* Focus Mode Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={toggleFocusMode}
          variant={focusModeActive ? "default" : "outline"}
          size={isMobile ? "default" : "sm"}
          className="w-full"
        >
          {focusModeActive ? (
            <>
              <BellOff
                className={cn("mr-2", isMobile ? "w-5 h-5" : "w-4 h-4")}
              />
              Focus Mode ON
            </>
          ) : (
            <>
              <Focus className={cn("mr-2", isMobile ? "w-5 h-5" : "w-4 h-4")} />
              Enable Focus Mode
            </>
          )}
        </Button>
        {focusModeActive && (
          <div className="mt-2 flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
              DND Active
            </Badge>
          </div>
        )}
      </div>

      {/* Main Navigation - Scrollable */}
      <nav
        className={cn(
          "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent",
          isMobile ? "px-3 py-3 space-y-1" : "px-4 py-4 space-y-1",
        )}
      >
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center space-x-3 rounded-lg font-medium transition-colors",
                isMobile ? "px-4 py-3 text-base" : "px-3 py-2 text-sm",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                isMobile && "active:bg-sidebar-accent/70", // Touch feedback
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  isMobile ? "w-5 h-5" : "w-4 h-4",
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div
        className={cn(
          "border-t border-sidebar-border",
          isMobile ? "p-3 space-y-1" : "p-4 space-y-1",
        )}
      >
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center space-x-3 rounded-lg font-medium transition-colors",
                isMobile ? "px-4 py-3 text-base" : "px-3 py-2 text-sm",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                isMobile && "active:bg-sidebar-accent/70", // Touch feedback
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  isMobile ? "w-5 h-5" : "w-4 h-4",
                )}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
