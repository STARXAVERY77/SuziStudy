import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Coffee,
  Target,
  Volume2,
  VolumeX,
  Settings,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TimerState = "idle" | "running" | "paused";
type SessionType = "focus" | "shortBreak" | "longBreak";

interface TimerSettings {
  focusTime: number; // in minutes
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number; // after how many pomodoros
}

const defaultSettings: TimerSettings = {
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
};

export default function Focus() {
  const [settings] = useState<TimerSettings>(defaultSettings);
  const [currentSession, setCurrentSession] = useState<SessionType>("focus");
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("DBMS");

  const intervalRef = useRef<NodeJS.Timeout>();

  const subjects = ["DBMS", "DSA", "OS", "Mathematics", "General Study"];

  const sessionConfig = {
    focus: {
      time: settings.focusTime * 60,
      label: "Focus Time",
      color: "bg-primary",
      icon: Target,
      description: "Time to concentrate and be productive",
    },
    shortBreak: {
      time: settings.shortBreakTime * 60,
      label: "Short Break",
      color: "bg-green-500",
      icon: Coffee,
      description: "Take a quick break and recharge",
    },
    longBreak: {
      time: settings.longBreakTime * 60,
      label: "Long Break",
      color: "bg-blue-500",
      icon: Coffee,
      description: "Enjoy a longer break - you've earned it!",
    },
  };

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState]);

  const handleSessionComplete = () => {
    setTimerState("idle");

    if (soundEnabled) {
      // Play completion sound (in a real app, you'd use actual audio)
      console.log("🔔 Session completed!");
    }

    if (currentSession === "focus") {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);

      // Determine next session type
      if (newCompletedPomodoros % settings.longBreakInterval === 0) {
        setCurrentSession("longBreak");
        setTimeLeft(sessionConfig.longBreak.time);
      } else {
        setCurrentSession("shortBreak");
        setTimeLeft(sessionConfig.shortBreak.time);
      }
    } else {
      // Break completed, return to focus
      setCurrentSession("focus");
      setTimeLeft(sessionConfig.focus.time);
    }
  };

  const startTimer = () => {
    setTimerState("running");
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeLeft(sessionConfig[currentSession].time);
  };

  const skipSession = () => {
    handleSessionComplete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const totalTime = sessionConfig[currentSession].time;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const config = sessionConfig[currentSession];
  const SessionIcon = config.icon;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Focus Timer</h1>
          <p className="text-muted-foreground">
            Use the Pomodoro Technique to boost your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <Card className="text-center">
              <CardHeader>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div
                    className={`p-2 rounded-lg ${config.color.replace("bg-", "bg-")}/10`}
                  >
                    <SessionIcon
                      className={`w-6 h-6 ${config.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      config.color.replace("bg-", "bg-") + " text-white"
                    }
                  >
                    {config.label}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{config.description}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="relative">
                  <div className="text-8xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={getProgress()} className="mt-4 h-2" />
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {timerState === "idle" || timerState === "paused" ? (
                    <Button size="lg" onClick={startTimer} className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      {timerState === "idle" ? "Start" : "Resume"}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={pauseTimer}
                      variant="outline"
                      className="px-8"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}

                  <Button size="lg" onClick={resetTimer} variant="outline">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Reset
                  </Button>

                  <Button size="lg" onClick={skipSession} variant="outline">
                    Skip
                  </Button>
                </div>

                {/* Subject Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Studying:</label>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={
                          selectedSubject === subject ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Today's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {completedPomodoros}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pomodoros completed
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        i < completedPomodoros
                          ? "bg-primary border-primary"
                          : "border-muted",
                      )}
                    />
                  ))}
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    {Math.floor((completedPomodoros * 25) / 60)}h{" "}
                    {(completedPomodoros * 25) % 60}m focused today
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quick Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sound notifications</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Session lengths</label>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Focus: {settings.focusTime} minutes</div>
                    <div>Short break: {settings.shortBreakTime} minutes</div>
                    <div>Long break: {settings.longBreakTime} minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Focus Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Remove distractions from your workspace</p>
                  <p>• Set a specific goal for each session</p>
                  <p>• Take breaks seriously - they help you recharge</p>
                  <p>• Stay hydrated and maintain good posture</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
