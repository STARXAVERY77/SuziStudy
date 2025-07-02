import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Flame,
  BookOpen,
  Brain,
  Award,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyData {
  date: string;
  subject: string;
  duration: number; // in minutes
  completed: boolean;
  type: "study" | "quiz" | "review";
}

const studyData: StudyData[] = [
  {
    date: "2024-01-08",
    subject: "DBMS",
    duration: 90,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-08",
    subject: "DSA",
    duration: 60,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-09",
    subject: "DBMS",
    duration: 45,
    completed: true,
    type: "quiz",
  },
  {
    date: "2024-01-09",
    subject: "OS",
    duration: 75,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-10",
    subject: "Math",
    duration: 60,
    completed: true,
    type: "review",
  },
  {
    date: "2024-01-11",
    subject: "DSA",
    duration: 90,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-11",
    subject: "DBMS",
    duration: 30,
    completed: false,
    type: "quiz",
  },
  {
    date: "2024-01-12",
    subject: "OS",
    duration: 120,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-13",
    subject: "DBMS",
    duration: 60,
    completed: true,
    type: "review",
  },
  {
    date: "2024-01-14",
    subject: "Math",
    duration: 45,
    completed: true,
    type: "study",
  },
  {
    date: "2024-01-15",
    subject: "DSA",
    duration: 75,
    completed: true,
    type: "study",
  },
];

const subjects = [
  { name: "DBMS", progress: 85, totalHours: 32, color: "bg-red-500" },
  { name: "DSA", progress: 67, totalHours: 28, color: "bg-blue-500" },
  { name: "OS", progress: 42, totalHours: 18, color: "bg-purple-500" },
  { name: "Math", progress: 78, totalHours: 24, color: "bg-green-500" },
];

const weeklyStats = [
  { week: "Week 1", hours: 12, completion: 85 },
  { week: "Week 2", hours: 18, completion: 92 },
  { week: "Week 3", hours: 15, completion: 78 },
  { week: "Week 4", hours: 22, completion: 88 },
  { week: "This Week", hours: 16, completion: 75 },
];

export default function Progress() {
  const generateHeatmapData = () => {
    const data = [];
    const startDate = new Date("2024-01-01");

    for (let i = 0; i < 105; i++) {
      // 15 weeks
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayData = studyData.filter(
        (d) => new Date(d.date).toDateString() === date.toDateString(),
      );

      const totalMinutes = dayData.reduce((sum, d) => sum + d.duration, 0);
      const intensity = Math.min(Math.floor(totalMinutes / 30), 4); // 0-4 intensity levels

      data.push({
        date: date.toISOString().split("T")[0],
        intensity,
        minutes: totalMinutes,
        sessions: dayData.length,
      });
    }

    return data;
  };

  const heatmapData = generateHeatmapData();

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-muted";
      case 1:
        return "bg-green-200";
      case 2:
        return "bg-green-300";
      case 3:
        return "bg-green-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  const totalStudyTime = studyData.reduce((sum, d) => sum + d.duration, 0);
  const completedSessions = studyData.filter((d) => d.completed).length;
  const completionRate = Math.round(
    (completedSessions / studyData.length) * 100,
  );
  const currentStreak = 7; // Mock streak data

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Progress Analytics</h1>
            <p className="text-muted-foreground">
              Track your learning journey with detailed insights
            </p>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter Period
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Study Time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{currentStreak}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{studyData.length}</div>
                  <p className="text-sm text-muted-foreground">
                    Study Sessions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Heatmap */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Study Activity Heatmap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Less</span>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-3 h-3 rounded-sm",
                            getIntensityColor(i),
                          )}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>

                  <div className="grid grid-cols-15 gap-1">
                    {heatmapData.map((day, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary",
                          getIntensityColor(day.intensity),
                        )}
                        title={`${day.date}: ${day.minutes} minutes, ${day.sessions} sessions`}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last 15 weeks of study activity
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Weekly Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyStats.map((week, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{week.week}</span>
                        <div className="flex items-center space-x-4">
                          <span>{week.hours}h</span>
                          <span>{week.completion}%</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <Progress
                            value={(week.hours / 25) * 100}
                            className="h-2"
                          />
                        </div>
                        <div className="flex-1">
                          <Progress value={week.completion} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Subject Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn("w-3 h-3 rounded-full", subject.color)}
                        />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {subject.progress}%
                      </span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {subject.totalHours} hours completed
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Flame className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">7-Day Streak</div>
                    <div className="text-xs text-muted-foreground">
                      Keep it up!
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Quiz Master</div>
                    <div className="text-xs text-muted-foreground">
                      10 quizzes completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Time Tracker</div>
                    <div className="text-xs text-muted-foreground">
                      100+ hours logged
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Avg. Session Length</span>
                  <span className="font-medium">67 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most Productive Day</span>
                  <span className="font-medium">Tuesday</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Favorite Subject</span>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    DBMS
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Study Goal</span>
                  <span className="font-medium">3h/day</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
