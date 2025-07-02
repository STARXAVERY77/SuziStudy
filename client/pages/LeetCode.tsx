import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Code,
  ExternalLink,
  CheckCircle,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Star,
  Filter,
  Search,
  Calendar,
  BarChart3,
  Zap,
  BookOpen,
  Award,
  Flame,
  Plus,
  X,
  PieChart,
  LineChart,
  Users,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeetCodeProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  leetcodeUrl: string;
  status: "not_started" | "attempted" | "solved" | "reviewed";
  attempts: number;
  bestTime?: string;
  lastAttempt?: Date;
  solutionNotes?: string;
  isStriverSheet: boolean;
  dayNumber?: number;
  importance: number; // 1-10
  company?: string[];
}

interface StudyPlan {
  id: string;
  name: string;
  description: string;
  totalProblems: number;
  completedProblems: number;
  estimatedDays: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

const striverSheet: LeetCodeProblem[] = [
  // Arrays
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["hash-table", "array"],
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    status: "solved",
    attempts: 3,
    bestTime: "5:30",
    lastAttempt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isStriverSheet: true,
    dayNumber: 1,
    importance: 9,
    company: ["Google", "Amazon", "Microsoft"],
  },
  {
    id: "2",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "dynamic-programming"],
    leetcodeUrl:
      "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    status: "attempted",
    attempts: 2,
    lastAttempt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isStriverSheet: true,
    dayNumber: 1,
    importance: 8,
    company: ["Facebook", "Apple"],
  },
  {
    id: "3",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Arrays",
    tags: ["array", "hash-table"],
    leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
    status: "solved",
    attempts: 1,
    bestTime: "3:45",
    lastAttempt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isStriverSheet: true,
    dayNumber: 1,
    importance: 7,
    company: ["Amazon", "Microsoft"],
  },
  // Strings
  {
    id: "4",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Strings",
    tags: ["hash-table", "string", "sorting"],
    leetcodeUrl: "https://leetcode.com/problems/valid-anagram/",
    status: "not_started",
    attempts: 0,
    isStriverSheet: true,
    dayNumber: 2,
    importance: 6,
    company: ["Amazon"],
  },
  {
    id: "5",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Strings",
    tags: ["array", "hash-table", "string", "sorting"],
    leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
    status: "not_started",
    attempts: 0,
    isStriverSheet: true,
    dayNumber: 2,
    importance: 8,
    company: ["Amazon", "Facebook", "Uber"],
  },
  // Linked Lists
  {
    id: "6",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked Lists",
    tags: ["linked-list", "recursion"],
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    status: "reviewed",
    attempts: 4,
    bestTime: "7:20",
    lastAttempt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isStriverSheet: true,
    dayNumber: 3,
    importance: 10,
    company: ["Google", "Microsoft", "Amazon", "Apple"],
  },
  // Trees
  {
    id: "7",
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Trees",
    tags: ["stack", "tree", "depth-first-search"],
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-inorder-traversal/",
    status: "attempted",
    attempts: 1,
    lastAttempt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isStriverSheet: true,
    dayNumber: 4,
    importance: 9,
    company: ["Amazon", "Microsoft"],
  },
  {
    id: "8",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    tags: ["tree", "depth-first-search", "breadth-first-search"],
    leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    status: "not_started",
    attempts: 0,
    isStriverSheet: true,
    dayNumber: 4,
    importance: 7,
    company: ["LinkedIn"],
  },
];

const studyPlans: StudyPlan[] = [
  {
    id: "striver-sde",
    name: "Striver SDE Sheet",
    description: "180 most important coding problems for SDE interviews",
    totalProblems: 180,
    completedProblems: 23,
    estimatedDays: 60,
    difficulty: "Intermediate",
    tags: ["SDE", "Interview Prep", "DSA"],
  },
  {
    id: "leetcode-75",
    name: "LeetCode 75",
    description: "Ace Coding Interview with 75 Qs",
    totalProblems: 75,
    completedProblems: 12,
    estimatedDays: 30,
    difficulty: "Beginner",
    tags: ["Beginner", "Core Concepts"],
  },
  {
    id: "neetcode-150",
    name: "NeetCode 150",
    description: "150 LeetCode problems covering all important patterns",
    totalProblems: 150,
    completedProblems: 8,
    estimatedDays: 45,
    difficulty: "Intermediate",
    tags: ["Patterns", "Interview"],
  },
];

export default function LeetCode() {
  const [problems, setProblems] = useState<LeetCodeProblem[]>(striverSheet);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("striver-sde");

  // Dialog states
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);

  // Goal settings
  const [currentGoal, setCurrentGoal] = useState({
    type: "daily",
    target: 2,
    deadline: "",
    description: "",
  });

  // Schedule settings
  const [practiceSchedule, setPracticeSchedule] = useState({
    frequency: "daily",
    timeSlot: "morning",
    duration: 60,
    preferredDifficulty: "Mixed",
    categories: [] as string[],
    customTime: "",
  });

  // Advanced filters
  const [advancedFilters, setAdvancedFilters] = useState({
    importance: [1, 10],
    companies: [] as string[],
    lastAttemptDays: null as number | null,
    onlyStriver: false,
    hasNotes: false,
  });

  const categories = [...new Set(problems.map((p) => p.category))];
  const difficulties = ["Easy", "Medium", "Hard"];
  const statuses = ["not_started", "attempted", "solved", "reviewed"];

  const filteredProblems = problems.filter((problem) => {
    const matchesCategory =
      !selectedCategory || problem.category === selectedCategory;
    const matchesDifficulty =
      !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesStatus = !selectedStatus || problem.status === selectedStatus;
    const matchesSearch =
      !searchQuery ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return (
      matchesCategory && matchesDifficulty && matchesStatus && matchesSearch
    );
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return CheckCircle;
      case "reviewed":
        return Star;
      case "attempted":
        return Clock;
      default:
        return Circle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "text-green-600 bg-green-100";
      case "reviewed":
        return "text-blue-600 bg-blue-100";
      case "attempted":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const toggleProblemStatus = (problemId: string) => {
    setProblems((prev) =>
      prev.map((problem) => {
        if (problem.id === problemId) {
          let newStatus: LeetCodeProblem["status"];
          switch (problem.status) {
            case "not_started":
              newStatus = "attempted";
              break;
            case "attempted":
              newStatus = "solved";
              break;
            case "solved":
              newStatus = "reviewed";
              break;
            case "reviewed":
              newStatus = "not_started";
              break;
            default:
              newStatus = "attempted";
          }
          return {
            ...problem,
            status: newStatus,
            attempts:
              newStatus === "attempted"
                ? problem.attempts + 1
                : problem.attempts,
            lastAttempt: new Date(),
          };
        }
        return problem;
      }),
    );
  };

  const currentPlan = studyPlans.find((plan) => plan.id === selectedPlan);
  const solvedProblems = problems.filter((p) => p.status === "solved").length;
  const totalProblems = problems.length;
  const progressPercentage = (solvedProblems / totalProblems) * 100;

  const getStreakDays = () => {
    const today = new Date();
    const recentAttempts = problems.filter((p) => {
      if (!p.lastAttempt) return false;
      const daysDiff = Math.floor(
        (today.getTime() - p.lastAttempt.getTime()) / (24 * 60 * 60 * 1000),
      );
      return daysDiff < 7; // Problems attempted in last week
    });
    return Math.min(7, recentAttempts.length); // Simplified streak calculation
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Code className="w-8 h-8 text-primary" />
              <span>LeetCode Tracker</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your coding journey with Striver SDE Sheet & more
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog
              open={scheduleDialogOpen}
              onOpenChange={setScheduleDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Practice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule Practice Sessions</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        value={practiceSchedule.frequency}
                        onValueChange={(value) =>
                          setPracticeSchedule((prev) => ({
                            ...prev,
                            frequency: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekdays">
                            Weekdays Only
                          </SelectItem>
                          <SelectItem value="weekends">
                            Weekends Only
                          </SelectItem>
                          <SelectItem value="custom">Custom Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeSlot">Preferred Time</Label>
                      <Select
                        value={practiceSchedule.timeSlot}
                        onValueChange={(value) =>
                          setPracticeSchedule((prev) => ({
                            ...prev,
                            timeSlot: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            Morning (6-10 AM)
                          </SelectItem>
                          <SelectItem value="afternoon">
                            Afternoon (12-4 PM)
                          </SelectItem>
                          <SelectItem value="evening">
                            Evening (6-9 PM)
                          </SelectItem>
                          <SelectItem value="custom">Custom Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {practiceSchedule.timeSlot === "custom" && (
                    <div>
                      <Label htmlFor="customTime">Custom Time</Label>
                      <Input
                        type="time"
                        value={practiceSchedule.customTime}
                        onChange={(e) =>
                          setPracticeSchedule((prev) => ({
                            ...prev,
                            customTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="duration">Session Duration (minutes)</Label>
                    <Select
                      value={practiceSchedule.duration.toString()}
                      onValueChange={(value) =>
                        setPracticeSchedule((prev) => ({
                          ...prev,
                          duration: parseInt(value),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Preferred Difficulty</Label>
                    <Select
                      value={practiceSchedule.preferredDifficulty}
                      onValueChange={(value) =>
                        setPracticeSchedule((prev) => ({
                          ...prev,
                          preferredDifficulty: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy Only</SelectItem>
                        <SelectItem value="Medium">Medium Only</SelectItem>
                        <SelectItem value="Hard">Hard Only</SelectItem>
                        <SelectItem value="Mixed">Mixed Difficulty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Focus Categories</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={category}
                            checked={practiceSchedule.categories.includes(
                              category,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setPracticeSchedule((prev) => ({
                                  ...prev,
                                  categories: [...prev.categories, category],
                                }));
                              } else {
                                setPracticeSchedule((prev) => ({
                                  ...prev,
                                  categories: prev.categories.filter(
                                    (c) => c !== category,
                                  ),
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={category}>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setScheduleDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Save schedule logic here
                        setScheduleDialogOpen(false);
                        // You could add a toast notification here
                      }}
                    >
                      Save Schedule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Set Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Your Coding Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="goalType">Goal Type</Label>
                    <Select
                      value={currentGoal.type}
                      onValueChange={(value) =>
                        setCurrentGoal((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Problems</SelectItem>
                        <SelectItem value="weekly">Weekly Problems</SelectItem>
                        <SelectItem value="monthly">
                          Monthly Problems
                        </SelectItem>
                        <SelectItem value="streak">Solve Streak</SelectItem>
                        <SelectItem value="completion">
                          Complete Study Plan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target">Target Number</Label>
                    <Input
                      type="number"
                      value={currentGoal.target}
                      onChange={(e) =>
                        setCurrentGoal((prev) => ({
                          ...prev,
                          target: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="e.g., 2 problems per day"
                    />
                  </div>

                  {currentGoal.type !== "streak" && (
                    <div>
                      <Label htmlFor="deadline">Deadline (Optional)</Label>
                      <Input
                        type="date"
                        value={currentGoal.deadline}
                        onChange={(e) =>
                          setCurrentGoal((prev) => ({
                            ...prev,
                            deadline: e.target.value,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="description">Description/Notes</Label>
                    <Textarea
                      value={currentGoal.description}
                      onChange={(e) =>
                        setCurrentGoal((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Optional notes about your goal..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setGoalDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Save goal logic here
                        setGoalDialogOpen(false);
                        // You could add a toast notification here
                      }}
                    >
                      Save Goal
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{solvedProblems}</div>
                  <p className="text-sm text-muted-foreground">
                    Problems Solved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {progressPercentage.toFixed(0)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Progress</p>
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
                  <div className="text-2xl font-bold">{getStreakDays()}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
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
                    {problems.filter((p) => p.status === "reviewed").length}
                  </div>
                  <p className="text-sm text-muted-foreground">Mastered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Study Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {studyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50",
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{plan.name}</h3>
                    <Badge variant="outline">{plan.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {plan.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {plan.completedProblems}/{plan.totalProblems}
                      </span>
                    </div>
                    <Progress
                      value={
                        (plan.completedProblems / plan.totalProblems) * 100
                      }
                      className="h-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {plan.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Category:</span>
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Difficulty:</span>
                <Button
                  variant={!selectedDifficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(null)}
                >
                  All
                </Button>
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Problems ({filteredProblems.length})</span>
              <div className="flex items-center space-x-2">
                <Dialog
                  open={analyticsDialogOpen}
                  onOpenChange={setAnalyticsDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Practice Analytics</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                        <TabsTrigger value="patterns">Patterns</TabsTrigger>
                        <TabsTrigger value="companies">Companies</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <PieChart className="w-5 h-5 text-blue-600" />
                                <div>
                                  <div className="text-lg font-bold">
                                    {progressPercentage.toFixed(1)}%
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Overall Progress
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <Timer className="w-5 h-5 text-green-600" />
                                <div>
                                  <div className="text-lg font-bold">
                                    {Math.round(
                                      (problems.filter((p) => p.bestTime)
                                        .length /
                                        problems.length) *
                                        100,
                                    ) || 0}
                                    %
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Timed Solutions
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <LineChart className="w-5 h-5 text-purple-600" />
                                <div>
                                  <div className="text-lg font-bold">
                                    {(
                                      problems.reduce(
                                        (acc, p) => acc + p.attempts,
                                        0,
                                      ) / problems.length
                                    ).toFixed(1)}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Avg Attempts
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-orange-600" />
                                <div>
                                  <div className="text-lg font-bold">
                                    {
                                      new Set(
                                        problems.flatMap(
                                          (p) => p.company || [],
                                        ),
                                      ).size
                                    }
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Companies Covered
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">
                                Difficulty Distribution
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {difficulties.map((difficulty) => {
                                  const count = problems.filter(
                                    (p) => p.difficulty === difficulty,
                                  ).length;
                                  const solved = problems.filter(
                                    (p) =>
                                      p.difficulty === difficulty &&
                                      p.status === "solved",
                                  ).length;
                                  const percentage =
                                    count > 0 ? (solved / count) * 100 : 0;
                                  return (
                                    <div
                                      key={difficulty}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-sm">
                                        {difficulty}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                          <div
                                            className={cn(
                                              "h-2 rounded-full",
                                              difficulty === "Easy"
                                                ? "bg-green-500"
                                                : difficulty === "Medium"
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500",
                                            )}
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                          {solved}/{count}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm">
                                Category Progress
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {categories.map((category) => {
                                  const count = problems.filter(
                                    (p) => p.category === category,
                                  ).length;
                                  const solved = problems.filter(
                                    (p) =>
                                      p.category === category &&
                                      p.status === "solved",
                                  ).length;
                                  const percentage =
                                    count > 0 ? (solved / count) * 100 : 0;
                                  return (
                                    <div
                                      key={category}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-sm">
                                        {category}
                                      </span>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                          <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                          {solved}/{count}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="progress">
                        <div className="text-center py-8 text-muted-foreground">
                          Progress charts would be implemented here with a
                          charting library like Chart.js or Recharts
                        </div>
                      </TabsContent>

                      <TabsContent value="patterns">
                        <div className="text-center py-8 text-muted-foreground">
                          Problem pattern analysis would be displayed here
                        </div>
                      </TabsContent>

                      <TabsContent value="companies">
                        <div className="text-center py-8 text-muted-foreground">
                          Company-specific problem statistics would be shown
                          here
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={filtersDialogOpen}
                  onOpenChange={setFiltersDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      More Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Filters</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Importance Level (1-10)</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm">1</span>
                          <div className="flex-1 px-2">
                            <div className="text-center text-sm text-muted-foreground">
                              Range slider would be implemented here
                            </div>
                          </div>
                          <span className="text-sm">10</span>
                        </div>
                      </div>

                      <div>
                        <Label>Companies</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                          {Array.from(
                            new Set(problems.flatMap((p) => p.company || [])),
                          ).map((company) => (
                            <div
                              key={company}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={company}
                                checked={advancedFilters.companies.includes(
                                  company,
                                )}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAdvancedFilters((prev) => ({
                                      ...prev,
                                      companies: [...prev.companies, company],
                                    }));
                                  } else {
                                    setAdvancedFilters((prev) => ({
                                      ...prev,
                                      companies: prev.companies.filter(
                                        (c) => c !== company,
                                      ),
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={company} className="text-sm">
                                {company}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="lastAttempt">
                          Last Attempted (days ago)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g., 7 for problems attempted in last week"
                          value={advancedFilters.lastAttemptDays || ""}
                          onChange={(e) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              lastAttemptDays: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="onlyStriver"
                            checked={advancedFilters.onlyStriver}
                            onCheckedChange={(checked) =>
                              setAdvancedFilters((prev) => ({
                                ...prev,
                                onlyStriver: !!checked,
                              }))
                            }
                          />
                          <Label htmlFor="onlyStriver">
                            Striver Sheet Problems Only
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasNotes"
                            checked={advancedFilters.hasNotes}
                            onCheckedChange={(checked) =>
                              setAdvancedFilters((prev) => ({
                                ...prev,
                                hasNotes: !!checked,
                              }))
                            }
                          />
                          <Label htmlFor="hasNotes">
                            Problems with Solution Notes
                          </Label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setAdvancedFilters({
                              importance: [1, 10],
                              companies: [],
                              lastAttemptDays: null,
                              onlyStriver: false,
                              hasNotes: false,
                            });
                          }}
                        >
                          Clear Filters
                        </Button>
                        <Button onClick={() => setFiltersDialogOpen(false)}>
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredProblems.map((problem) => {
                const StatusIcon = getStatusIcon(problem.status);
                return (
                  <div
                    key={problem.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleProblemStatus(problem.id)}
                    >
                      <StatusIcon
                        className={cn(
                          "w-5 h-5",
                          problem.status === "solved"
                            ? "text-green-600"
                            : problem.status === "reviewed"
                              ? "text-blue-600"
                              : problem.status === "attempted"
                                ? "text-yellow-600"
                                : "text-gray-400",
                        )}
                      />
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        {problem.dayNumber && (
                          <Badge variant="outline" className="text-xs">
                            Day {problem.dayNumber}
                          </Badge>
                        )}
                        <h3 className="font-medium truncate">
                          {problem.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={getDifficultyColor(problem.difficulty)}
                        >
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="outline">{problem.category}</Badge>
                        {problem.isStriverSheet && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800"
                          >
                            Striver
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>Attempts: {problem.attempts}</span>
                        {problem.bestTime && (
                          <span>Best: {problem.bestTime}</span>
                        )}
                        {problem.lastAttempt && (
                          <span>
                            Last: {problem.lastAttempt.toLocaleDateString()}
                          </span>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{problem.importance}/10</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {problem.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {problem.company && problem.company.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Companies:
                          </span>
                          {problem.company.slice(0, 3).map((company, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {company}
                            </Badge>
                          ))}
                          {problem.company.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{problem.company.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(problem.leetcodeUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Solve
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
