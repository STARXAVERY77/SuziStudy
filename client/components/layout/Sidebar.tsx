import { Link, useLocation } from "react-router-dom";
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
  { name: "Mind Maps", href: "/mindmap", icon: GitBranch },
  { name: "Focus Timer", href: "/focus", icon: Timer },
  { name: "Progress", href: "/progress", icon: BarChart3 },
  { name: "Voice Assistant", href: "/voice", icon: Mic },
  { name: "Goals", href: "/goals", icon: Target },
];

const bottomNavigation = [
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
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
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
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
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
