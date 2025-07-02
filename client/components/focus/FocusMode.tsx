import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Focus,
  Timer,
  Bell,
  BellOff,
  Play,
  Pause,
  Square,
  Clock,
  Target,
  Zap,
  Moon,
  Sun,
  Coffee,
  Settings as SettingsIcon,
  BookOpen,
  Brain,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FocusSession {
  id: string;
  type: "pomodoro" | "deep_work" | "study_session" | "custom";
  duration: number; // minutes
  breakDuration: number; // minutes
  currentPhase: "focus" | "break" | "completed";
  timeRemaining: number; // seconds
  cycles: number;
  completedCycles: number;
  subject?: string;
  task?: string;
  startTime: Date;
  dndEnabled: boolean;
  blockingLevel: "soft" | "hard"; // soft = defer notifications, hard = block all
}

interface FocusPreset {
  name: string;
  type: FocusSession["type"];
  duration: number;
  breakDuration: number;
  cycles: number;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface FocusStats {
  totalSessions: number;
  totalFocusTime: number; // minutes
  averageSessionTime: number;
  longestStreak: number;
  currentStreak: number;
  favoriteSubject?: string;
  productivityScore: number; // 0-100
}

const focusPresets: FocusPreset[] = [
  {
    name: "Pomodoro Classic",
    type: "pomodoro",
    duration: 25,
    breakDuration: 5,
    cycles: 4,
    description: "25min focus + 5min break, 4 cycles",
    icon: Timer,
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Deep Work",
    type: "deep_work",
    duration: 90,
    breakDuration: 20,
    cycles: 2,
    description: "90min intense focus + 20min break",
    icon: Brain,
    color: "bg-purple-100 text-purple-700",
  },
  {
    name: "Study Session",
    type: "study_session",
    duration: 45,
    breakDuration: 15,
    cycles: 3,
    description: "45min study + 15min break, perfect for lectures",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Quick Sprint",
    type: "custom",
    duration: 15,
    breakDuration: 3,
    cycles: 6,
    description: "Short bursts for quick tasks",
    icon: Zap,
    color: "bg-green-100 text-green-700",
  },
];

export function FocusMode() {
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(
    null,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<FocusPreset>(
    focusPresets[0],
  );
  const [customDuration, setCustomDuration] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [focusStats, setFocusStats] = useState<FocusStats>({
    totalSessions: 23,
    totalFocusTime: 1247, // minutes
    averageSessionTime: 54,
    longestStreak: 12,
    currentStreak: 5,
    favoriteSubject: "DBMS",
    productivityScore: 87,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [deferredNotifications, setDeferredNotifications] = useState<any[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && currentSession) {
      interval = setInterval(() => {
        setCurrentSession((prev) => {
          if (!prev) return null;

          const newTimeRemaining = prev.timeRemaining - 1;

          if (newTimeRemaining <= 0) {
            // Phase completed
            if (prev.currentPhase === "focus") {
              // Switch to break
              playNotificationSound("break");
              return {
                ...prev,
                currentPhase: "break",
                timeRemaining: prev.breakDuration * 60,
              };
            } else if (prev.currentPhase === "break") {
              // Check if all cycles completed
              if (prev.completedCycles + 1 >= prev.cycles) {
                // Session completed
                playNotificationSound("completed");
                setIsRunning(false);
                showSessionSummary();
                return {
                  ...prev,
                  currentPhase: "completed",
                  completedCycles: prev.completedCycles + 1,
                  timeRemaining: 0,
                };
              } else {
                // Start next cycle
                playNotificationSound("focus");
                return {
                  ...prev,
                  currentPhase: "focus",
                  timeRemaining: prev.duration * 60,
                  completedCycles: prev.completedCycles + 1,
                };
              }
            }
          }

          return {
            ...prev,
            timeRemaining: newTimeRemaining,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, currentSession]);

  const startSession = (preset?: FocusPreset, customTask?: string) => {
    const sessionPreset = preset || selectedPreset;
    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      type: sessionPreset.type,
      duration: sessionPreset.duration,
      breakDuration: sessionPreset.breakDuration,
      currentPhase: "focus",
      timeRemaining: sessionPreset.duration * 60,
      cycles: sessionPreset.cycles,
      completedCycles: 0,
      task: customTask,
      startTime: new Date(),
      dndEnabled: true,
      blockingLevel: "soft",
    };

    setCurrentSession(newSession);
    setIsRunning(true);

    // Enable Do Not Disturb mode
    enableDND();

    playNotificationSound("start");
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const stopSession = () => {
    if (currentSession) {
      // Save partial session stats
      const focusTimeCompleted = Math.floor(
        (currentSession.duration * 60 - currentSession.timeRemaining) / 60,
      );
      updateFocusStats(focusTimeCompleted, false);
    }

    setCurrentSession(null);
    setIsRunning(false);
    disableDND();
    showDeferredNotificationsSummary();
  };

  const enableDND = () => {
    // This would integrate with the notification system to defer notifications
    console.log("Do Not Disturb enabled");
  };

  const disableDND = () => {
    console.log("Do Not Disturb disabled");
    // Show deferred notifications summary
    showDeferredNotificationsSummary();
  };

  const showSessionSummary = () => {
    if (currentSession) {
      const totalFocusTime =
        currentSession.duration * currentSession.completedCycles;
      updateFocusStats(totalFocusTime, true);

      // This would show a summary dialog
      console.log(
        `Session completed! Total focus time: ${totalFocusTime} minutes`,
      );
    }
  };

  const showDeferredNotificationsSummary = () => {
    if (deferredNotifications.length > 0) {
      // This would show deferred notifications similar to iOS Focus Summary
      console.log(
        `You had ${deferredNotifications.length} notifications while focusing`,
      );
    }
  };

  const updateFocusStats = (focusTime: number, completed: boolean) => {
    setFocusStats((prev) => ({
      ...prev,
      totalSessions: prev.totalSessions + (completed ? 1 : 0),
      totalFocusTime: prev.totalFocusTime + focusTime,
      currentStreak: completed
        ? prev.currentStreak + 1
        : Math.max(0, prev.currentStreak - 1),
      longestStreak: completed
        ? Math.max(prev.longestStreak, prev.currentStreak + 1)
        : prev.longestStreak,
    }));
  };

  const playNotificationSound = (
    type: "start" | "break" | "focus" | "completed",
  ) => {
    const audio = new Audio();
    audio.volume = 0.7;

    switch (type) {
      case "start":
        // Gentle start sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      case "break":
        // Break time chime
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      case "focus":
        // Back to focus sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
      case "completed":
        // Success completion sound
        audio.src =
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAS2Nzw==";
        break;
    }

    audio.play().catch(() => {});
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseIcon = () => {
    if (!currentSession) return Focus;

    switch (currentSession.currentPhase) {
      case "focus":
        return Focus;
      case "break":
        return Coffee;
      case "completed":
        return Target;
      default:
        return Timer;
    }
  };

  const getProgressPercentage = (): number => {
    if (!currentSession) return 0;

    const totalTime =
      currentSession.currentPhase === "focus"
        ? currentSession.duration * 60
        : currentSession.breakDuration * 60;

    return ((totalTime - currentSession.timeRemaining) / totalTime) * 100;
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Focus className="w-5 h-5 text-primary" />
            <span className="font-semibold">Focus Mode</span>
          </div>
          <div className="flex items-center space-x-1">
            {currentSession?.dndEnabled && (
              <Badge variant="secondary" className="text-xs">
                <BellOff className="w-3 h-3 mr-1" />
                DND
              </Badge>
            )}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <SettingsIcon className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Focus Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Default Session Type</Label>
                    <Select
                      value={selectedPreset.name}
                      onValueChange={(value) => {
                        const preset = focusPresets.find(
                          (p) => p.name === value,
                        );
                        if (preset) setSelectedPreset(preset);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {focusPresets.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Custom Duration (min)</Label>
                      <Input
                        type="number"
                        value={customDuration}
                        onChange={(e) =>
                          setCustomDuration(parseInt(e.target.value) || 25)
                        }
                        min="5"
                        max="180"
                      />
                    </div>
                    <div>
                      <Label>Break Duration (min)</Label>
                      <Input
                        type="number"
                        value={customBreak}
                        onChange={(e) =>
                          setCustomBreak(parseInt(e.target.value) || 5)
                        }
                        min="1"
                        max="30"
                      />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Current Session */}
      {currentSession ? (
        <div className="p-4 space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div
                className={cn(
                  "p-2 rounded-full",
                  currentSession.currentPhase === "focus"
                    ? "bg-primary/10"
                    : "bg-orange-100",
                )}
              >
                {(() => {
                  const PhaseIcon = getPhaseIcon();
                  return (
                    <PhaseIcon
                      className={cn(
                        "w-5 h-5",
                        currentSession.currentPhase === "focus"
                          ? "text-primary"
                          : "text-orange-600",
                      )}
                    />
                  );
                })()}
              </div>
              <Badge
                variant={
                  currentSession.currentPhase === "focus"
                    ? "default"
                    : "secondary"
                }
              >
                {currentSession.currentPhase === "focus"
                  ? "Focus Time"
                  : "Break Time"}
              </Badge>
            </div>

            <div className="text-4xl font-mono font-bold mb-2">
              {formatTime(currentSession.timeRemaining)}
            </div>

            <Progress value={getProgressPercentage()} className="mb-4" />

            <div className="text-sm text-muted-foreground">
              Cycle {currentSession.completedCycles + 1} of{" "}
              {currentSession.cycles}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-2">
            {isRunning ? (
              <Button onClick={pauseSession} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button onClick={resumeSession}>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            <Button onClick={stopSession} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>

          {currentSession.task && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Current Task:</div>
              <div className="text-sm text-muted-foreground">
                {currentSession.task}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Preset Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Choose Focus Mode:
            </Label>
            <div className="space-y-2">
              {focusPresets.map((preset) => {
                const PresetIcon = preset.icon;
                return (
                  <div
                    key={preset.name}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors",
                      selectedPreset.name === preset.name
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", preset.color)}>
                        <PresetIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={() => startSession()} className="w-full" size="lg">
            <Play className="w-4 h-4 mr-2" />
            Start Focus Session
          </Button>

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Actions:</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => startSession(focusPresets[0])}
                className="text-xs"
              >
                <Timer className="w-3 h-3 mr-1" />
                25min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  startSession({ ...focusPresets[0], duration: 15 })
                }
                className="text-xs"
              >
                <Zap className="w-3 h-3 mr-1" />
                15min
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="text-sm font-medium mb-3">Focus Stats</div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">
              {Math.floor(focusStats.totalFocusTime / 60)}h
            </div>
            <div className="text-xs text-muted-foreground">Total Time</div>
          </div>
          <div>
            <div className="text-lg font-bold">{focusStats.currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold">{focusStats.totalSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {focusStats.productivityScore}%
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>

        {focusStats.favoriteSubject && (
          <div className="mt-3 p-2 bg-muted rounded text-center">
            <div className="text-xs text-muted-foreground">
              Favorite Subject
            </div>
            <div className="text-sm font-medium">
              {focusStats.favoriteSubject}
            </div>
          </div>
        )}
      </div>

      {/* Deferred Notifications */}
      {deferredNotifications.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Deferred</div>
            <Badge variant="secondary">{deferredNotifications.length}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Notifications waiting for you
          </div>
        </div>
      )}
    </div>
  );
}
