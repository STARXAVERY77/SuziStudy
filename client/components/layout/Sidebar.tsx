import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
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

export function Sidebar() {
  const location = useLocation();
  const [focusModeActive, setFocusModeActive] = useState(false);

  const toggleFocusMode = () => {
    setFocusModeActive(!focusModeActive);
    // This would integrate with the notification system
    console.log(`Focus mode ${!focusModeActive ? "enabled" : "disabled"}`);
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">
            StudyFlow
          </span>
        </div>
      </div>

      {/* Focus Mode Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={toggleFocusMode}
          variant={focusModeActive ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {focusModeActive ? (
            <>
              <BellOff className="w-4 h-4 mr-2" />
              Focus Mode ON
            </>
          ) : (
            <>
              <Focus className="w-4 h-4 mr-2" />
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
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
