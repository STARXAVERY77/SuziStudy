import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  Zap,
  Focus,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type:
    | "task_reminder"
    | "ai_suggestion"
    | "progress_streak"
    | "missed_task"
    | "break_reminder"
    | "focus_summary"
    | "calendar_sync"
    | "time_estimate";
  priority: "low" | "medium" | "high" | "emergency";
  timestamp: Date;
  context?: {
    subject?: string;
    taskId?: string;
    estimatedTime?: number;
    streakDays?: number;
    missedTasks?: number;
  };
  deferrable?: boolean;
  autoExpire?: number; // minutes
  actions?: NotificationAction[];
  persistent?: boolean;
  focusModeOnly?: boolean; // Only show after focus mode ends
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "default" | "outline" | "destructive";
  icon?: React.ElementType;
}

interface FocusSession {
  id: string;
  startTime: Date;
  duration: number; // minutes
  type: "pomodoro" | "deep_work" | "study_session";
  subject?: string;
  isActive: boolean;
  dndEnabled: boolean;
}

interface UserContext {
  isStudying: boolean;
  currentSubject?: string;
  lastActivity: Date;
  focusLevel: "high" | "medium" | "low";
  preferredNotificationTimes: string[]; // Hour ranges like "09:00-11:00"
  notificationFrequency: "minimal" | "normal" | "frequent";
}

interface AIInsight {
  id: string;
  message: string;
  confidence: number;
  trigger:
    | "inactivity"
    | "pattern_detected"
    | "optimization_opportunity"
    | "streak_risk";
  actionable: boolean;
}

export function SmartNotificationManager() {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [userContext, setUserContext] = useState<UserContext>({
    isStudying: false,
    lastActivity: new Date(),
    focusLevel: "medium",
    preferredNotificationTimes: ["09:00-12:00", "14:00-17:00", "19:00-21:00"],
    notificationFrequency: "normal",
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastNotificationTime, setLastNotificationTime] = useState<Date>(
    new Date(),
  );
  const [deferredNotifications, setDeferredNotifications] = useState<
    SmartNotification[]
  >([]);

  // Get IST time
  const getISTTime = () => {
    return new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    });
  };

  // Smart notification rules - STRICTLY only notify every 45 minutes (2700 seconds)
  const canShowNotification = useCallback(
    (notification: SmartNotification): boolean => {
      const now = new Date();
      const timeSinceLastNotification =
        (now.getTime() - lastNotificationTime.getTime()) / (1000 * 60);

      // STRICT 45-minute rule - NO exceptions except life-critical emergencies
      if (timeSinceLastNotification < 45) {
        // Only allow true emergencies (like fire alarms, medical alerts)
        // Regular "high priority" study notifications must wait
        return false;
      }

      // Don't disturb during focus sessions
      if (focusSession?.dndEnabled) {
        return false;
      }

      // Check if user is in preferred notification time using IST
      const currentHour = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        hour12: false,
      });
      const currentTime = `${currentHour}:00`;

      const isPreferredTime = userContext.preferredNotificationTimes.some(
        (range) => {
          const [start, end] = range.split("-");
          return currentTime >= start && currentTime <= end;
        },
      );

      if (!isPreferredTime && notification.priority === "low") {
        return false;
      }

      return true;
    },
    [lastNotificationTime, focusSession, userContext],
  );

  // Show notification with intelligent timing
  const showSmartNotification = useCallback(
    (notification: SmartNotification) => {
      if (canShowNotification(notification)) {
        setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep max 5 notifications
        setLastNotificationTime(new Date());

        // Play contextual sound
        if (soundEnabled) {
          playContextualSound(notification.type);
        }

        // Auto-expire if set
        if (notification.autoExpire) {
          setTimeout(
            () => {
              dismissNotification(notification.id);
            },
            notification.autoExpire * 60 * 1000,
          );
        }
      } else if (notification.deferrable) {
        // Defer notification for later
        setDeferredNotifications((prev) => [...prev, notification]);
      }
    },
    [canShowNotification, soundEnabled],
  );

  // Process deferred notifications when focus session ends
  useEffect(() => {
    if (!focusSession?.isActive && deferredNotifications.length > 0) {
      // Show focus summary with deferred notifications
      const focusSummary: SmartNotification = {
        id: `focus-summary-${Date.now()}`,
        title: "Focus Session Complete! 🎯",
        message: `Great work! You had ${deferredNotifications.length} notifications while focusing. Here's your summary:`,
        type: "focus_summary",
        priority: "medium",
        timestamp: new Date(),
        persistent: true,
        actions: [
          {
            label: "Review Notifications",
            action: () => showDeferredNotifications(),
            icon: Bell,
          },
          {
            label: "Dismiss All",
            action: () => setDeferredNotifications([]),
            variant: "outline",
          },
        ],
      };

      showSmartNotification(focusSummary);
    }
  }, [
    focusSession?.isActive,
    deferredNotifications.length,
    showSmartNotification,
  ]);

  // AI-based contextual suggestions
  const generateAIInsight = useCallback((): AIInsight | null => {
    const now = new Date();
    const hoursSinceLastActivity =
      (now.getTime() - userContext.lastActivity.getTime()) / (1000 * 60 * 60);

    // Inactivity detection
    if (hoursSinceLastActivity > 24 && !userContext.isStudying) {
      return {
        id: `inactivity-${Date.now()}`,
        message:
          "You haven't studied in over a day. Would you like me to suggest a quick 15-minute review session?",
        confidence: 0.9,
        trigger: "inactivity",
        actionable: true,
      };
    }

    // Pattern-based suggestions
    if (userContext.currentSubject === "OS" && hoursSinceLastActivity > 120) {
      // 5 days
      return {
        id: `pattern-${Date.now()}`,
        message:
          "You haven't reviewed Operating Systems in 5 days. Memory retention decreases significantly after this period.",
        confidence: 0.85,
        trigger: "pattern_detected",
        actionable: true,
      };
    }

    // Optimization opportunities
    if (userContext.focusLevel === "low" && new Date().getHours() >= 14) {
      return {
        id: `optimization-${Date.now()}`,
        message:
          "Your focus seems low this afternoon. Consider switching to lighter tasks like flashcard review.",
        confidence: 0.75,
        trigger: "optimization_opportunity",
        actionable: true,
      };
    }

    return null;
  }, [userContext]);

  // Periodic AI insights (every hour during active periods)
  useEffect(() => {
    const interval = setInterval(
      () => {
        const insight = generateAIInsight();
        if (insight && insight.confidence > 0.7) {
          const aiNotification: SmartNotification = {
            id: insight.id,
            title: "AI Study Assistant 🧠",
            message: insight.message,
            type: "ai_suggestion",
            priority: "medium",
            timestamp: new Date(),
            deferrable: true,
            autoExpire: 30, // Auto-expire in 30 minutes
            actions: insight.actionable
              ? [
                  {
                    label: "Start Quick Session",
                    action: () => startQuickStudySession(),
                    icon: BookOpen,
                  },
                  {
                    label: "Schedule Later",
                    action: () => scheduleForLater(),
                    variant: "outline",
                    icon: Calendar,
                  },
                ]
              : undefined,
          };

          showSmartNotification(aiNotification);
        }
      },
      60 * 60 * 1000,
    ); // Every hour

    return () => clearInterval(interval);
  }, [generateAIInsight, showSmartNotification]);

  // Calendar integration notifications
  useEffect(() => {
    // Simulate calendar events
    const checkCalendarEvents = () => {
      const now = new Date();
      const in15Minutes = new Date(now.getTime() + 15 * 60 * 1000);

      // Mock calendar event
      if (now.getHours() === 10 && now.getMinutes() === 45) {
        const calendarNotification: SmartNotification = {
          id: `calendar-${Date.now()}`,
          title: "Upcoming Class: Database Systems 📅",
          message:
            "Your DBMS class starts in 15 minutes. Would you like to review your last session notes?",
          type: "calendar_sync",
          priority: "high",
          timestamp: new Date(),
          persistent: true,
          actions: [
            {
              label: "Open Notes",
              action: () => openClassNotes("dbms"),
              icon: BookOpen,
            },
            {
              label: "Start Flashcards",
              action: () => startFlashcards("dbms"),
              icon: Zap,
            },
            {
              label: "Dismiss",
              action: () => {},
              variant: "outline",
            },
          ],
        };

        showSmartNotification(calendarNotification);
      }
    };

    const interval = setInterval(checkCalendarEvents, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [showSmartNotification]);

  // Time estimation notifications
  const showTimeEstimation = (task: string, estimatedMinutes: number) => {
    const timeNotification: SmartNotification = {
      id: `time-estimate-${Date.now()}`,
      title: "AI Time Estimation ⏱️",
      message: `Based on your past performance, "${task}" should take approximately ${estimatedMinutes} minutes. Add a 20-minute buffer?`,
      type: "time_estimate",
      priority: "medium",
      timestamp: new Date(),
      context: { estimatedTime: estimatedMinutes },
      actions: [
        {
          label: `Start ${estimatedMinutes}min Session`,
          action: () => startTimedSession(estimatedMinutes),
          icon: Clock,
        },
        {
          label: `Add Buffer (${estimatedMinutes + 20}min)`,
          action: () => startTimedSession(estimatedMinutes + 20),
          variant: "outline",
          icon: Target,
        },
      ],
    };

    showSmartNotification(timeNotification);
  };

  const playContextualSound = (type: SmartNotification["type"]) => {
    if (!soundEnabled) return;

    // Use different sounds for different notification types
    const audio = new Audio();
    audio.volume = 0.6;

    switch (type) {
      case "break_reminder":
        // Gentle chime
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      case "progress_streak":
        // Success sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      case "missed_task":
        // Alert sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      default:
        // Soft notification sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
    }

    audio.play().catch(() => {});
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showDeferredNotifications = () => {
    deferredNotifications.forEach((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    setDeferredNotifications([]);
  };

  const startQuickStudySession = () => {
    // Implementation for quick study session
    console.log("Starting quick study session");
  };

  const scheduleForLater = () => {
    // Implementation for scheduling
    console.log("Scheduling for later");
  };

  const openClassNotes = (subject: string) => {
    // Implementation for opening notes
    console.log(`Opening notes for ${subject}`);
  };

  const startFlashcards = (subject: string) => {
    // Implementation for flashcards
    console.log(`Starting flashcards for ${subject}`);
  };

  const startTimedSession = (minutes: number) => {
    // Implementation for timed session
    console.log(`Starting ${minutes}-minute session`);
  };

  const getNotificationIcon = (type: SmartNotification["type"]) => {
    switch (type) {
      case "task_reminder":
        return Bell;
      case "ai_suggestion":
        return Brain;
      case "progress_streak":
        return CheckCircle;
      case "missed_task":
        return AlertTriangle;
      case "break_reminder":
        return Coffee;
      case "focus_summary":
        return Focus;
      case "calendar_sync":
        return Calendar;
      case "time_estimate":
        return Clock;
      default:
        return Bell;
    }
  };

  const getNotificationStyle = (
    type: SmartNotification["type"],
    priority: SmartNotification["priority"],
  ) => {
    const baseClasses =
      "shadow-lg border-2 transition-all duration-300 ease-in-out";

    const typeClasses = {
      task_reminder: "border-blue-200 bg-blue-50",
      ai_suggestion: "border-purple-200 bg-purple-50",
      progress_streak: "border-green-200 bg-green-50",
      missed_task: "border-red-200 bg-red-50",
      break_reminder: "border-orange-200 bg-orange-50",
      focus_summary: "border-indigo-200 bg-indigo-50",
      calendar_sync: "border-yellow-200 bg-yellow-50",
      time_estimate: "border-teal-200 bg-teal-50",
    };

    const priorityClasses = {
      emergency: "border-l-4 border-l-red-600 animate-pulse",
      high: "border-l-4 border-l-red-500",
      medium: "border-l-4 border-l-yellow-500",
      low: "border-l-4 border-l-green-500",
    };

    return cn(baseClasses, typeClasses[type], priorityClasses[priority]);
  };

  // Simulate some notifications for demo
  useEffect(() => {
    setTimeout(() => {
      showTimeEstimation("Complete DBMS Assignment Chapter 3", 45);
    }, 3000);

    setTimeout(() => {
      const streakNotification: SmartNotification = {
        id: `streak-${Date.now()}`,
        title: "Study Streak! 🔥",
        message:
          "Amazing! You've maintained a 7-day study streak. Keep up the excellent work!",
        type: "progress_streak",
        priority: "medium",
        timestamp: new Date(),
        context: { streakDays: 7 },
        autoExpire: 10,
      };
      showSmartNotification(streakNotification);
    }, 8000);
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm lg:max-w-sm w-[calc(100vw-2rem)] lg:w-auto">
      {/* Controls */}
      <div className="flex justify-end space-x-2">
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
        {focusSession?.isActive && (
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            <Focus className="w-3 h-3 mr-1" />
            Focus Mode
          </Badge>
        )}
      </div>

      {/* Notifications */}
      {notifications.slice(0, 5).map((notification) => {
        const Icon = getNotificationIcon(notification.type);
        return (
          <Card
            key={notification.id}
            className={getNotificationStyle(
              notification.type,
              notification.priority,
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-white/80">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant={
                          notification.priority === "emergency"
                            ? "destructive"
                            : notification.priority === "high"
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

                  {notification.context && (
                    <div className="text-xs text-muted-foreground mb-2 space-y-1">
                      {notification.context.estimatedTime && (
                        <div>
                          ⏱️ Estimated: {notification.context.estimatedTime}m
                        </div>
                      )}
                      {notification.context.streakDays && (
                        <div>
                          🔥 Streak: {notification.context.streakDays} days
                        </div>
                      )}
                      {notification.context.subject && (
                        <div>📚 Subject: {notification.context.subject}</div>
                      )}
                    </div>
                  )}

                  {notification.actions && (
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
                          {action.icon && (
                            <action.icon className="w-3 h-3 mr-1" />
                          )}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        hour12: false,
                      })}{" "}
                      IST
                    </span>
                    {notification.autoExpire && (
                      <span className="text-xs text-muted-foreground">
                        Auto-dismiss in {notification.autoExpire}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Deferred notifications indicator */}
      {deferredNotifications.length > 0 && (
        <Card className="bg-muted/80 backdrop-blur-sm border-dashed">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Moon className="w-4 h-4" />
              <span className="text-sm">
                {deferredNotifications.length} notifications deferred
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
