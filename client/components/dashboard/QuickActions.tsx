import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  Brain,
  Timer,
  Upload,
  MessageSquare,
  Target,
  BarChart3,
} from "lucide-react";

const quickActions = [
  {
    title: "Add Subject",
    description: "Create a new study subject",
    icon: Plus,
    action: "/subjects",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Schedule Study",
    description: "Plan your next session",
    icon: Calendar,
    action: "/schedule",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "AI Quiz",
    description: "Test your knowledge",
    icon: Brain,
    action: "/ai-tutor",
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Focus Timer",
    description: "Start a Pomodoro session",
    icon: Timer,
    action: "/focus",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Upload Materials",
    description: "Add study resources",
    icon: Upload,
    action: "/upload",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Chat with AI",
    description: "Get instant help",
    icon: MessageSquare,
    action: "/chat",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-sm transition-shadow"
              asChild
            >
              <a href={action.action}>
                <div className={`p-2 rounded-lg ${action.bgColor} mb-2`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
