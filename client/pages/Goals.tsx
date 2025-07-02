import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Plus,
  Trophy,
  Award,
  BookOpen,
  Brain,
  Zap,
  BarChart3,
  ChevronRight,
  Flame,
  Medal,
  Users,
  Code,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "academic" | "skill" | "personal" | "project";
  priority: "low" | "medium" | "high";
  period: "week" | "month" | "year" | "custom";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: "active" | "completed" | "paused" | "overdue";
  createdAt: Date;
  completedAt?: Date;
  milestones: Milestone[];
  tags: string[];
  relatedSubjects: string[];
}

interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completed: boolean;
  completedAt?: Date;
  reward?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "streak" | "completion" | "skill" | "improvement";
  icon: string;
  earnedAt: Date;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface SkillProgress {
  skill: string;
  subject: string;
  currentLevel: number;
  progress: number; // 0-100 towards next level
  totalExp: number;
  recentGains: { date: Date; exp: number; activity: string }[];
}

interface WeeklyProgress {
  week: string;
  goalsCompleted: number;
  studyHours: number;
  tasksFinished: number;
  skillsImproved: string[];
  averageScore: number;
}

// Get IST time
const getISTTime = () => {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
};

const getISTDate = () => {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sampleGoals: Goal[] = [
  {
    id: "1",
    title: "Complete 50 LeetCode Problems",
    description:
      "Master algorithmic problem solving by completing 50 problems across different difficulty levels",
    category: "skill",
    priority: "high",
    period: "month",
    targetValue: 50,
    currentValue: 23,
    unit: "problems",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "active",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    milestones: [
      {
        id: "1a",
        title: "First 10 problems",
        targetValue: 10,
        completed: true,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "1b",
        title: "Reach 25 problems",
        targetValue: 25,
        completed: false,
      },
      {
        id: "1c",
        title: "Complete all 50",
        targetValue: 50,
        completed: false,
        reward: "Advanced Problem Solver Badge",
      },
    ],
    tags: ["coding", "algorithms", "practice"],
    relatedSubjects: ["DSA", "Programming"],
  },
  {
    id: "2",
    title: "Study 20 Hours This Week",
    description:
      "Maintain consistent study schedule with focused learning sessions",
    category: "academic",
    priority: "high",
    period: "week",
    targetValue: 20,
    currentValue: 12,
    unit: "hours",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    milestones: [
      {
        id: "2a",
        title: "First 5 hours",
        targetValue: 5,
        completed: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      { id: "2b", title: "Reach 15 hours", targetValue: 15, completed: false },
    ],
    tags: ["study", "consistency", "time-management"],
    relatedSubjects: ["DBMS", "OS", "Networks"],
  },
  {
    id: "3",
    title: "Master Database Concepts",
    description:
      "Complete comprehensive study of database systems including normalization, indexing, and query optimization",
    category: "academic",
    priority: "medium",
    period: "month",
    targetValue: 100,
    currentValue: 75,
    unit: "% completion",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "active",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    milestones: [
      {
        id: "3a",
        title: "Basic concepts",
        targetValue: 25,
        completed: true,
        completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3b",
        title: "Normalization mastery",
        targetValue: 50,
        completed: true,
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3c",
        title: "Advanced queries",
        targetValue: 75,
        completed: true,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: "3d",
        title: "Complete mastery",
        targetValue: 100,
        completed: false,
        reward: "Database Expert Certification",
      },
    ],
    tags: ["database", "sql", "theory"],
    relatedSubjects: ["DBMS"],
  },
];

const sampleAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Completed your first study goal",
    category: "completion",
    icon: "🎯",
    earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    points: 100,
    rarity: "common",
  },
  {
    id: "2",
    title: "Consistency Master",
    description: "Maintained a 7-day study streak",
    category: "streak",
    icon: "🔥",
    earnedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    points: 250,
    rarity: "rare",
  },
  {
    id: "3",
    title: "Code Warrior",
    description: "Solved 20 coding problems in a week",
    category: "skill",
    icon: "⚔️",
    earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    points: 300,
    rarity: "epic",
  },
  {
    id: "4",
    title: "Knowledge Seeker",
    description: "Completed 5 different subjects in one month",
    category: "improvement",
    icon: "🧠",
    earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    points: 500,
    rarity: "legendary",
  },
];

const sampleSkills: SkillProgress[] = [
  {
    skill: "Problem Solving",
    subject: "DSA",
    currentLevel: 4,
    progress: 65,
    totalExp: 2650,
    recentGains: [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        exp: 50,
        activity: "Solved Binary Tree problem",
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        exp: 35,
        activity: "Completed DP practice",
      },
    ],
  },
  {
    skill: "Database Design",
    subject: "DBMS",
    currentLevel: 3,
    progress: 80,
    totalExp: 1980,
    recentGains: [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        exp: 40,
        activity: "Normalization exercises",
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        exp: 60,
        activity: "Query optimization lab",
      },
    ],
  },
  {
    skill: "System Architecture",
    subject: "OS",
    currentLevel: 2,
    progress: 45,
    totalExp: 945,
    recentGains: [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        exp: 30,
        activity: "Process management study",
      },
    ],
  },
];

const weeklyProgress: WeeklyProgress[] = [
  {
    week: "This Week",
    goalsCompleted: 2,
    studyHours: 12,
    tasksFinished: 8,
    skillsImproved: ["Problem Solving", "Database Design"],
    averageScore: 85,
  },
  {
    week: "Last Week",
    goalsCompleted: 3,
    studyHours: 18,
    tasksFinished: 12,
    skillsImproved: ["Problem Solving", "System Architecture", "Networking"],
    averageScore: 78,
  },
  {
    week: "2 Weeks Ago",
    goalsCompleted: 1,
    studyHours: 15,
    tasksFinished: 10,
    skillsImproved: ["Database Design"],
    averageScore: 72,
  },
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [achievements, setAchievements] =
    useState<Achievement[]>(sampleAchievements);
  const [skills, setSkills] = useState<SkillProgress[]>(sampleSkills);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [currentTime, setCurrentTime] = useState(getISTTime());

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "academic" as Goal["category"],
    priority: "medium" as Goal["priority"],
    period: "week" as Goal["period"],
    targetValue: 1,
    unit: "tasks",
    deadline: "",
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getISTTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const activeGoals = goals.filter((goal) => goal.status === "active");
  const completedGoals = goals.filter((goal) => goal.status === "completed");
  const periodGoals = activeGoals.filter(
    (goal) => goal.period === selectedPeriod,
  );

  const totalPoints = achievements.reduce((sum, ach) => sum + ach.points, 0);
  const currentLevel = Math.floor(totalPoints / 1000) + 1;
  const levelProgress = ((totalPoints % 1000) / 1000) * 100;

  const createGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      currentValue: 0,
      deadline: new Date(newGoal.deadline),
      status: "active",
      createdAt: new Date(),
      milestones: [],
      tags: [],
      relatedSubjects: [],
    };

    setGoals((prev) => [goal, ...prev]);
    setShowCreateGoal(false);
    setNewGoal({
      title: "",
      description: "",
      category: "academic",
      priority: "medium",
      period: "week",
      targetValue: 1,
      unit: "tasks",
      deadline: "",
    });
  };

  const updateGoalProgress = (goalId: string, newValue: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updated = {
            ...goal,
            currentValue: Math.min(newValue, goal.targetValue),
          };
          if (updated.currentValue >= updated.targetValue) {
            updated.status = "completed";
            updated.completedAt = new Date();
          }
          return updated;
        }
        return goal;
      }),
    );
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getPriorityColor = (priority: Goal["priority"]) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
    }
  };

  const getCategoryIcon = (category: Goal["category"]) => {
    switch (category) {
      case "academic":
        return BookOpen;
      case "skill":
        return Brain;
      case "personal":
        return Target;
      case "project":
        return Code;
    }
  };

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50";
      case "rare":
        return "border-blue-300 bg-blue-50";
      case "epic":
        return "border-purple-300 bg-purple-50";
      case "legendary":
        return "border-yellow-300 bg-yellow-50";
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const days = Math.ceil(
      (deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
    );
    return days;
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Target className="w-8 h-8 text-primary" />
              <span>Goals & Achievements</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your progress and celebrate your achievements
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {getISTDate()} • {currentTime} IST
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Complete 10 LeetCode problems"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your goal..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={newGoal.category}
                        onValueChange={(value: Goal["category"]) =>
                          setNewGoal((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">📚 Academic</SelectItem>
                          <SelectItem value="skill">🧠 Skill</SelectItem>
                          <SelectItem value="personal">🎯 Personal</SelectItem>
                          <SelectItem value="project">💻 Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={newGoal.priority}
                        onValueChange={(value: Goal["priority"]) =>
                          setNewGoal((prev) => ({ ...prev, priority: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">🟢 Low</SelectItem>
                          <SelectItem value="medium">🟡 Medium</SelectItem>
                          <SelectItem value="high">🔴 High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Period</Label>
                      <Select
                        value={newGoal.period}
                        onValueChange={(value: Goal["period"]) =>
                          setNewGoal((prev) => ({ ...prev, period: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                          <SelectItem value="year">Year</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Target</Label>
                      <Input
                        type="number"
                        value={newGoal.targetValue}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            targetValue: parseInt(e.target.value) || 1,
                          }))
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <Label>Unit</Label>
                      <Input
                        value={newGoal.unit}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                        placeholder="tasks, hours, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          deadline: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateGoal(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={createGoal}>Create Goal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeGoals.length}</div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {completedGoals.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {achievements.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
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
                  <div className="text-2xl font-bold">Level {currentLevel}</div>
                  <p className="text-sm text-muted-foreground">
                    {totalPoints} XP
                  </p>
                  <Progress value={levelProgress} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-6">
            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">View:</span>
              {(["week", "month", "year"] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Button>
              ))}
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {periodGoals.map((goal) => {
                const progress = getGoalProgress(goal);
                const CategoryIcon = getCategoryIcon(goal.category);
                const daysLeft = getDaysUntilDeadline(goal.deadline);

                return (
                  <Card
                    key={goal.id}
                    className={cn(
                      "border-l-4",
                      getPriorityColor(goal.priority),
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{goal.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            goal.priority === "high"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span className="font-medium">
                              {goal.currentValue} / {goal.targetValue}{" "}
                              {goal.unit}
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{Math.round(progress)}% complete</span>
                            <span>
                              {daysLeft > 0
                                ? `${daysLeft} days left`
                                : "Overdue"}
                            </span>
                          </div>
                        </div>

                        {/* Milestones */}
                        {goal.milestones.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Milestones
                            </h4>
                            <div className="space-y-1">
                              {goal.milestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <CheckCircle
                                    className={cn(
                                      "w-4 h-4",
                                      milestone.completed
                                        ? "text-green-600"
                                        : "text-gray-400",
                                    )}
                                  />
                                  <span
                                    className={
                                      milestone.completed
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }
                                  >
                                    {milestone.title}
                                  </span>
                                  {milestone.reward && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {milestone.reward}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateGoalProgress(goal.id, goal.currentValue + 1)
                            }
                            disabled={goal.currentValue >= goal.targetValue}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Update
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            {/* Weekly Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weeklyProgress.map((week, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{week.week}</h3>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          Score: {week.averageScore}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {week.goalsCompleted}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Goals Completed
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {week.studyHours}h
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Study Hours
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {week.tasksFinished}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tasks Finished
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {week.skillsImproved.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Skills Improved
                          </div>
                        </div>
                      </div>

                      {week.skillsImproved.length > 0 && (
                        <div className="mt-4">
                          <div className="text-sm font-medium mb-2">
                            Skills Improved:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {week.skillsImproved.map((skill, skillIndex) => (
                              <Badge
                                key={skillIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                <Lightbulb className="w-3 h-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={cn("border-2", getRarityColor(achievement.rarity))}
                >
                  <CardContent className="p-4">
                    <div className="text-center space-y-3">
                      <div className="text-4xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {achievement.rarity}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {achievement.points} XP
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Earned {achievement.earnedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{skill.skill}</h3>
                        <p className="text-sm text-muted-foreground">
                          {skill.subject}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          Level {skill.currentLevel}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {skill.totalExp} XP
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            Progress to Level {skill.currentLevel + 1}
                          </span>
                          <span>{skill.progress}%</span>
                        </div>
                        <Progress value={skill.progress} className="h-2" />
                      </div>

                      {skill.recentGains.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Recent Progress
                          </h4>
                          <div className="space-y-2">
                            {skill.recentGains
                              .slice(0, 3)
                              .map((gain, gainIndex) => (
                                <div
                                  key={gainIndex}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="flex-1">
                                    {gain.activity}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{gain.exp} XP
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {gain.date.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
