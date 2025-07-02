import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import {
  Brain,
  Battery,
  Heart,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Calendar,
  RefreshCcw,
  Lightbulb,
  Activity,
  Coffee,
  Moon,
  Sun,
  CloudRain,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnergyPattern {
  hour: number;
  energy: number;
  productivity: number;
  mood: number;
}

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  scheduledTime: Date;
  duration: number; // minutes
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: "new_concept" | "practice" | "revision" | "assessment";
  priority: number; // 1-10
  adaptiveFactors: {
    energyRequired: number;
    moodSensitive: boolean;
    focusIntensive: boolean;
    creativityRequired: boolean;
  };
  aiRecommendations: string[];
}

interface UserBiorhythm {
  morningPeak: boolean;
  eveningPeak: boolean;
  postLunchDip: boolean;
  weekendPattern: "similar" | "different";
  sleepSchedule: {
    bedtime: string;
    wakeup: string;
    quality: number; // 1-10
  };
}

export default function SmartScheduler() {
  const [currentEnergy, setCurrentEnergy] = useState(75);
  const [currentMood, setCurrentMood] = useState<
    "excellent" | "good" | "neutral" | "low" | "stressed"
  >("good");
  const [currentFocus, setCurrentFocus] = useState(80);
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy">("sunny");
  const [isWeekend, setIsWeekend] = useState(false);

  // AI-predicted energy pattern for today
  const [energyPattern] = useState<EnergyPattern[]>([
    { hour: 6, energy: 30, productivity: 20, mood: 40 },
    { hour: 7, energy: 50, productivity: 40, mood: 60 },
    { hour: 8, energy: 75, productivity: 80, mood: 80 },
    { hour: 9, energy: 90, productivity: 95, mood: 85 },
    { hour: 10, energy: 85, productivity: 90, mood: 80 },
    { hour: 11, energy: 80, productivity: 85, mood: 75 },
    { hour: 12, energy: 70, productivity: 70, mood: 70 },
    { hour: 13, energy: 45, productivity: 40, mood: 60 }, // Post-lunch dip
    { hour: 14, energy: 50, productivity: 45, mood: 65 },
    { hour: 15, energy: 65, productivity: 70, mood: 75 },
    { hour: 16, energy: 75, productivity: 80, mood: 80 },
    { hour: 17, energy: 70, productivity: 75, mood: 75 },
    { hour: 18, energy: 60, productivity: 65, mood: 70 },
    { hour: 19, energy: 55, productivity: 50, mood: 65 },
    { hour: 20, energy: 40, productivity: 30, mood: 60 },
    { hour: 21, energy: 30, productivity: 20, mood: 55 },
  ]);

  const [biorhythm] = useState<UserBiorhythm>({
    morningPeak: true,
    eveningPeak: false,
    postLunchDip: true,
    weekendPattern: "different",
    sleepSchedule: {
      bedtime: "23:00",
      wakeup: "07:00",
      quality: 7,
    },
  });

  const [adaptiveSessions, setAdaptiveSessions] = useState<StudySession[]>([
    {
      id: "1",
      subject: "DBMS",
      topic: "Complex Query Optimization",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 90,
      difficulty: 5,
      type: "new_concept",
      priority: 9,
      adaptiveFactors: {
        energyRequired: 90,
        moodSensitive: false,
        focusIntensive: true,
        creativityRequired: true,
      },
      aiRecommendations: [
        "Scheduled during your peak focus hours (9-11 AM)",
        "High energy required - matches your morning peak",
        "Complex topic - aligned with your analytical thinking time",
      ],
    },
    {
      id: "2",
      subject: "DSA",
      topic: "Dynamic Programming Practice",
      scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      duration: 60,
      difficulty: 4,
      type: "practice",
      priority: 7,
      adaptiveFactors: {
        energyRequired: 70,
        moodSensitive: true,
        focusIntensive: true,
        creativityRequired: false,
      },
      aiRecommendations: [
        "Scheduled after energy dip recovery",
        "Practice session - good for building muscle memory",
        "Avoid during post-lunch dip",
      ],
    },
    {
      id: "3",
      subject: "Math",
      topic: "Linear Algebra Review",
      scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      duration: 45,
      difficulty: 2,
      type: "revision",
      priority: 5,
      adaptiveFactors: {
        energyRequired: 40,
        moodSensitive: false,
        focusIntensive: false,
        creativityRequired: false,
      },
      aiRecommendations: [
        "Light revision during energy decline",
        "Good time for consolidating existing knowledge",
        "Low cognitive load matches evening energy",
      ],
    },
  ]);

  const getCurrentHour = () => new Date().getHours();
  const currentHourData = energyPattern.find(
    (p) => p.hour === getCurrentHour(),
  ) || { energy: 50, productivity: 50, mood: 50 };

  const getMoodIcon = (mood: typeof currentMood) => {
    switch (mood) {
      case "excellent":
        return Star;
      case "good":
        return Smile;
      case "neutral":
        return Meh;
      case "low":
        return Frown;
      case "stressed":
        return AlertCircle;
    }
  };

  const getMoodColor = (mood: typeof currentMood) => {
    switch (mood) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "neutral":
        return "text-gray-600 bg-gray-100";
      case "low":
        return "text-yellow-600 bg-yellow-100";
      case "stressed":
        return "text-red-600 bg-red-100";
    }
  };

  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return Sun;
      case "cloudy":
        return CloudRain;
      case "rainy":
        return CloudRain;
    }
  };

  const generateAdaptiveSchedule = () => {
    // AI algorithm to reschedule based on current state
    const now = new Date();
    const currentHour = now.getHours();

    const rescheduledSessions = adaptiveSessions.map((session) => {
      // Find optimal time slot based on energy requirements
      const optimalHours = energyPattern.filter(
        (p) =>
          p.energy >= session.adaptiveFactors.energyRequired &&
          p.hour > currentHour,
      );

      if (optimalHours.length > 0) {
        const bestHour = optimalHours.reduce((best, current) =>
          current.productivity > best.productivity ? current : best,
        );

        const newTime = new Date(now);
        newTime.setHours(bestHour.hour, 0, 0, 0);

        return {
          ...session,
          scheduledTime: newTime,
          aiRecommendations: [
            ...session.aiRecommendations,
            `Rescheduled to ${bestHour.hour}:00 for optimal energy match`,
            `Predicted productivity: ${bestHour.productivity}%`,
          ],
        };
      }

      return session;
    });

    setAdaptiveSessions(rescheduledSessions);
  };

  const updateCurrentState = () => {
    // Simulate real-time state updates
    const hour = getCurrentHour();
    const hourData = energyPattern.find((p) => p.hour === hour);

    if (hourData) {
      // Add some randomness to simulate real variation
      const energyVariation = (Math.random() - 0.5) * 20;
      const focusVariation = (Math.random() - 0.5) * 15;

      setCurrentEnergy(
        Math.max(0, Math.min(100, hourData.energy + energyVariation)),
      );
      setCurrentFocus(
        Math.max(0, Math.min(100, hourData.productivity + focusVariation)),
      );
    }
  };

  useEffect(() => {
    // Update state every minute
    const interval = setInterval(updateCurrentState, 60000);
    return () => clearInterval(interval);
  }, []);

  const MoodIcon = getMoodIcon(currentMood);
  const WeatherIcon = getWeatherIcon();

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Smart Scheduler</h1>
            <p className="text-muted-foreground">
              Adaptive scheduling based on energy, mood, and behavior patterns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={generateAdaptiveSchedule}>
              <RefreshCcw className="w-4 h-4 mr-2" />
              Optimize Schedule
            </Button>
            <Button>
              <Zap className="w-4 h-4 mr-2" />
              Auto-Schedule
            </Button>
          </div>
        </div>

        {/* Current State Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Current State & Environment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Battery className="w-4 h-4 mr-1" />
                    Energy
                  </span>
                  <span className="text-sm font-bold">{currentEnergy}%</span>
                </div>
                <Progress value={currentEnergy} className="h-3" />
                <Slider
                  value={[currentEnergy]}
                  onValueChange={(value) => setCurrentEnergy(value[0])}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    Focus
                  </span>
                  <span className="text-sm font-bold">{currentFocus}%</span>
                </div>
                <Progress value={currentFocus} className="h-3" />
                <Slider
                  value={[currentFocus]}
                  onValueChange={(value) => setCurrentFocus(value[0])}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  Mood
                </span>
                <div className="flex flex-wrap gap-1">
                  {["excellent", "good", "neutral", "low", "stressed"].map(
                    (mood) => (
                      <Button
                        key={mood}
                        variant={currentMood === mood ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setCurrentMood(mood as typeof currentMood)
                        }
                        className="text-xs"
                      >
                        {mood}
                      </Button>
                    ),
                  )}
                </div>
                <Badge className={getMoodColor(currentMood)}>
                  <MoodIcon className="w-3 h-3 mr-1" />
                  {currentMood}
                </Badge>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium flex items-center">
                  <WeatherIcon className="w-4 h-4 mr-1" />
                  Environment
                </span>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {["sunny", "cloudy", "rainy"].map((w) => (
                      <Button
                        key={w}
                        variant={weather === w ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWeather(w as typeof weather)}
                        className="text-xs"
                      >
                        {w}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isWeekend}
                      onChange={(e) => setIsWeekend(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs">Weekend</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium">AI Prediction</span>
                <div className="text-xs space-y-1">
                  <div>
                    Peak hours: 9-11 AM
                    <div className="w-full bg-green-200 h-1 rounded"></div>
                  </div>
                  <div>
                    Energy dip: 1-2 PM
                    <div className="w-full bg-yellow-200 h-1 rounded"></div>
                  </div>
                  <div>
                    Low energy: 8+ PM
                    <div className="w-full bg-red-200 h-1 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Energy Pattern Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Today's Energy Pattern (AI Predicted)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-16 gap-1 mb-4">
              {energyPattern.map((pattern, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {pattern.hour}
                  </div>
                  <div
                    className={cn(
                      "h-16 rounded-sm relative",
                      pattern.hour === getCurrentHour()
                        ? "ring-2 ring-primary"
                        : "",
                    )}
                    style={{
                      background: `linear-gradient(to top, 
                      hsl(${pattern.energy > 70 ? "120" : pattern.energy > 40 ? "60" : "0"}, 70%, 50%) 0%, 
                      hsl(${pattern.energy > 70 ? "120" : pattern.energy > 40 ? "60" : "0"}, 70%, 50%) ${pattern.energy}%, 
                      transparent ${pattern.energy}%)`,
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 text-xs text-center text-white font-bold">
                      {pattern.energy}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>9 PM</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Adaptive Sessions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>AI-Optimized Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adaptiveSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full",
                            session.priority >= 8
                              ? "bg-red-500"
                              : session.priority >= 6
                                ? "bg-yellow-500"
                                : "bg-green-500",
                          )}
                        />
                        <div>
                          <h3 className="font-medium">{session.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            {session.subject} • {session.duration} minutes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {session.scheduledTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            session.difficulty >= 4
                              ? "border-red-300 text-red-700"
                              : session.difficulty >= 3
                                ? "border-yellow-300 text-yellow-700"
                                : "border-green-300 text-green-700"
                          }
                        >
                          Level {session.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Battery className="w-3 h-3" />
                        <span>
                          Energy: {session.adaptiveFactors.energyRequired}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        <span>
                          {session.adaptiveFactors.focusIntensive
                            ? "High"
                            : "Low"}{" "}
                          Focus
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>
                          {session.adaptiveFactors.moodSensitive
                            ? "Mood+"
                            : "Mood-"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="w-3 h-3" />
                        <span>
                          {session.adaptiveFactors.creativityRequired
                            ? "Creative"
                            : "Routine"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded">
                      <h4 className="text-xs font-medium mb-2 flex items-center">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Recommendations:
                      </h4>
                      <ul className="text-xs space-y-1">
                        {session.aiRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Insights & Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biorhythm Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sleep Quality</span>
                    <span className="font-medium">
                      {biorhythm.sleepSchedule.quality}/10
                    </span>
                  </div>
                  <Progress
                    value={biorhythm.sleepSchedule.quality * 10}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span>
                      Morning Peak: {biorhythm.morningPeak ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-blue-500" />
                    <span>
                      Evening Peak: {biorhythm.eveningPeak ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-4 h-4 text-orange-500" />
                    <span>
                      Post-lunch Dip: {biorhythm.postLunchDip ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>
                    Sleep: {biorhythm.sleepSchedule.bedtime} -{" "}
                    {biorhythm.sleepSchedule.wakeup}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <div className="text-sm font-medium text-blue-800">
                    Optimal Study Time
                  </div>
                  <div className="text-xs text-blue-600">
                    Your peak productivity is in 2 hours (9 AM). Schedule
                    complex topics then.
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                  <div className="text-sm font-medium text-yellow-800">
                    Energy Warning
                  </div>
                  <div className="text-xs text-yellow-600">
                    Post-lunch dip expected at 1 PM. Schedule light review or
                    break.
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <div className="text-sm font-medium text-green-800">
                    Mood Boost
                  </div>
                  <div className="text-xs text-green-600">
                    Sunny weather detected! Great for creative and challenging
                    tasks.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Energy Goal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Log Break
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Mood Check-in
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Energy Boost Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
