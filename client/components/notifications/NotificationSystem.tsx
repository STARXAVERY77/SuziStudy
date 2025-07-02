import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  X,
  Clock,
  BookOpen,
  Brain,
  Coffee,
  Target,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "break" | "achievement" | "warning" | "info";
  priority: "low" | "medium" | "high";
  timestamp: Date;
  duration?: number; // auto-dismiss time in ms
  actionable?: boolean;
  actions?: NotificationAction[];
  sound?: boolean;
  persistent?: boolean;
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "default" | "outline" | "destructive";
}

interface StudySession {
  startTime: Date;
  subject: string;
  duration: number; // minutes
  isActive: boolean;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null,
  );
  const [sessionTimer, setSessionTimer] = useState(0); // minutes
  const audioRef = useRef<HTMLAudioElement>(null);

  // 45-minute study timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentSession?.isActive) {
      interval = setInterval(() => {
        setSessionTimer((prev) => {
          const newTime = prev + 1;

          // 45-minute reminder
          if (newTime === 45) {
            showNotification({
              id: `break-reminder-${Date.now()}`,
              title: "Time for a Break! 🕐",
              message:
                "You've been studying for 45 minutes. Taking a break helps improve retention and prevents fatigue.",
              type: "break",
              priority: "high",
              sound: true,
              persistent: true,
              actionable: true,
              actions: [
                {
                  label: "Take 15-min Break",
                  action: () => startBreak(15),
                },
                {
                  label: "Take 5-min Break",
                  action: () => startBreak(5),
                },
                {
                  label: "Continue Studying",
                  action: () => dismissBreakReminder(),
                  variant: "outline",
                },
              ],
            });
          }

          // 60-minute warning
          if (newTime === 60) {
            showNotification({
              id: `extended-study-${Date.now()}`,
              title: "Extended Study Session ⚠️",
              message:
                "You've been studying for over an hour without a break. Consider taking a longer break to maintain effectiveness.",
              type: "warning",
              priority: "high",
              sound: true,
              persistent: true,
              actionable: true,
              actions: [
                {
                  label: "Take 20-min Break",
                  action: () => startBreak(20),
                },
                {
                  label: "End Session",
                  action: () => endStudySession(),
                  variant: "destructive",
                },
              ],
            });
          }

          return newTime;
        });
      }, 60000); // Every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession?.isActive]);

  // Simulate starting a study session
  useEffect(() => {
    // Auto-start session for demo
    setTimeout(() => {
      setCurrentSession({
        startTime: new Date(),
        subject: "DBMS",
        duration: 0,
        isActive: true,
      });
      setSessionTimer(0);

      showNotification({
        id: `session-start-${Date.now()}`,
        title: "Study Session Started 📚",
        message: `Started studying ${currentSession?.subject || "DBMS"}. I'll remind you to take breaks!`,
        type: "info",
        priority: "medium",
        duration: 5000,
      });
    }, 2000);
  }, []);

  const showNotification = (notification: Notification) => {
    // Ensure timestamp is always set
    const notificationWithTimestamp = {
      ...notification,
      timestamp: notification.timestamp || new Date(),
    };

    setNotifications((prev) => [notificationWithTimestamp, ...prev]);

    // Play sound if enabled
    if (notification.sound && soundEnabled) {
      playNotificationSound(notification.type);
    }

    // Auto-dismiss if duration is set
    if (notification.duration && !notification.persistent) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, notification.duration);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const playNotificationSound = (type: Notification["type"]) => {
    if (!soundEnabled) return;

    // In a real app, you'd have different sounds for different types
    try {
      const audio = new Audio();
      audio.volume = 0.5;

      switch (type) {
        case "break":
          // Gentle chime for break reminders
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
          break;
        case "achievement":
          // Success sound
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
          break;
        case "warning":
          // Alert sound
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
          break;
        default:
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
      }

      audio.play().catch(() => {
        // Ignore errors - browser might block autoplay
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  const startBreak = (minutes: number) => {
    // End current session
    if (currentSession) {
      setCurrentSession({ ...currentSession, isActive: false });
    }

    // Clear break reminders
    setNotifications((prev) =>
      prev.filter((n) => !n.id.includes("break-reminder")),
    );

    showNotification({
      id: `break-start-${Date.now()}`,
      title: `Break Started ☕`,
      message: `Taking a ${minutes}-minute break. I'll let you know when it's time to resume studying.`,
      type: "info",
      priority: "medium",
      duration: 3000,
    });

    // Set break timer
    setTimeout(
      () => {
        showNotification({
          id: `break-end-${Date.now()}`,
          title: "Break Over! 📚",
          message: "Ready to get back to studying? You're doing great!",
          type: "reminder",
          priority: "medium",
          persistent: true,
          actionable: true,
          actions: [
            {
              label: "Resume Studying",
              action: () => resumeStudySession(),
            },
            {
              label: "Extend Break",
              action: () => startBreak(5),
              variant: "outline",
            },
          ],
        });
      },
      minutes * 60 * 1000,
    );
  };

  const resumeStudySession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, isActive: true });
      setSessionTimer(0); // Reset timer
    }

    // Clear break-related notifications
    setNotifications((prev) => prev.filter((n) => !n.id.includes("break-")));

    showNotification({
      id: `session-resume-${Date.now()}`,
      title: "Welcome Back! 🎯",
      message:
        "Study session resumed. Stay focused and keep up the great work!",
      type: "info",
      priority: "medium",
      duration: 3000,
    });
  };

  const endStudySession = () => {
    if (currentSession) {
      const totalMinutes = sessionTimer;
      setCurrentSession(null);
      setSessionTimer(0);

      showNotification({
        id: `session-end-${Date.now()}`,
        title: "Study Session Complete! 🎉",
        message: `Great job! You studied for ${totalMinutes} minutes. Your dedication is paying off!`,
        type: "achievement",
        priority: "medium",
        duration: 8000,
      });
    }

    // Clear all session-related notifications
    setNotifications((prev) =>
      prev.filter(
        (n) => !n.id.includes("break-") && !n.id.includes("extended-study"),
      ),
    );
  };

  const dismissBreakReminder = () => {
    setNotifications((prev) =>
      prev.filter((n) => !n.id.includes("break-reminder")),
    );

    showNotification({
      id: `continue-study-${Date.now()}`,
      title: "Continuing Study Session 💪",
      message: "Remember to stay hydrated and take a break when you need it!",
      type: "info",
      priority: "low",
      duration: 3000,
    });
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return Bell;
      case "break":
        return Coffee;
      case "achievement":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return BookOpen;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "reminder":
        return "border-blue-200 bg-blue-50";
      case "break":
        return "border-green-200 bg-green-50";
      case "achievement":
        return "border-purple-200 bg-purple-50";
      case "warning":
        return "border-red-200 bg-red-50";
      case "info":
        return "border-gray-200 bg-gray-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getPriorityIndicator = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-4 border-l-red-500";
      case "medium":
        return "border-l-4 border-l-yellow-500";
      case "low":
        return "border-l-4 border-l-green-500";
      default:
        return "";
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {/* Sound Toggle */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Notifications */}
      {notifications.slice(0, 5).map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        return (
          <Card
            key={notification.id}
            className={cn(
              "shadow-lg border-2 transition-all duration-300 ease-in-out transform hover:scale-105",
              getNotificationColor(notification.type),
              getPriorityIndicator(notification.priority),
              notification.priority === "high" && "animate-pulse",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    notification.type === "break" && "bg-green-100",
                    notification.type === "achievement" && "bg-purple-100",
                    notification.type === "warning" && "bg-red-100",
                    notification.type === "reminder" && "bg-blue-100",
                    notification.type === "info" && "bg-gray-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      notification.type === "break" && "text-green-600",
                      notification.type === "achievement" && "text-purple-600",
                      notification.type === "warning" && "text-red-600",
                      notification.type === "reminder" && "text-blue-600",
                      notification.type === "info" && "text-gray-600",
                    )}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant={
                          notification.priority === "high"
                            ? "destructive"
                            : notification.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {notification.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {notification.message}
                  </p>

                  {notification.actionable && notification.actions && (
                    <div className="flex flex-wrap gap-2">
                      {notification.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || "default"}
                          size="sm"
                          onClick={() => {
                            action.action();
                            if (!notification.persistent) {
                              dismissNotification(notification.id);
                            }
                          }}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    {currentSession?.isActive && (
                      <span className="text-xs text-muted-foreground">
                        Studying: {sessionTimer}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Session Status */}
      {currentSession && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Studying {currentSession.subject}
              </span>
              <Badge variant="outline" className="text-xs">
                {sessionTimer}m
              </Badge>
            </div>
            {sessionTimer >= 40 && sessionTimer < 45 && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground">
                  Break reminder in {45 - sessionTimer} minutes
                </div>
                <Progress
                  value={(sessionTimer / 45) * 100}
                  className="h-1 mt-1"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Notification count indicator */}
      {notifications.length > 5 && (
        <Card className="bg-muted/80 backdrop-blur-sm">
          <CardContent className="p-2 text-center">
            <span className="text-xs text-muted-foreground">
              +{notifications.length - 5} more notifications
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
