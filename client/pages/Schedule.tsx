import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Brain,
  Zap,
  Settings,
  CalendarDays,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyTask {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  priority: "low" | "medium" | "high";
  type: "study" | "quiz" | "review" | "exam";
  completed: boolean;
  color: string;
}

const initialTasks: StudyTask[] = [
  {
    id: "1",
    title: "Database Normalization",
    subject: "DBMS",
    startTime: "09:00",
    endTime: "10:30",
    date: "2024-01-15",
    priority: "high",
    type: "study",
    completed: false,
    color: "bg-red-100 border-red-300 text-red-800",
  },
  {
    id: "2",
    title: "Binary Trees Practice",
    subject: "DSA",
    startTime: "11:00",
    endTime: "12:30",
    date: "2024-01-15",
    priority: "medium",
    type: "study",
    completed: false,
    color: "bg-blue-100 border-blue-300 text-blue-800",
  },
  {
    id: "3",
    title: "OS Concepts Review",
    subject: "OS",
    startTime: "14:00",
    endTime: "15:00",
    date: "2024-01-15",
    priority: "medium",
    type: "review",
    completed: true,
    color: "bg-purple-100 border-purple-300 text-purple-800",
  },
  {
    id: "4",
    title: "Linear Algebra Quiz",
    subject: "Math",
    startTime: "16:00",
    endTime: "17:00",
    date: "2024-01-15",
    priority: "high",
    type: "quiz",
    completed: false,
    color: "bg-green-100 border-green-300 text-green-800",
  },
  {
    id: "5",
    title: "DBMS Final Exam",
    subject: "DBMS",
    startTime: "10:00",
    endTime: "12:00",
    date: "2024-01-17",
    priority: "high",
    type: "exam",
    completed: false,
    color: "bg-red-100 border-red-300 text-red-800",
  },
];

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// IST time helpers
const getISTTime = () => {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
};

const getISTDate = () => {
  return new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
};

export default function Schedule() {
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [selectedDate, setSelectedDate] = useState(new Date("2024-01-15"));
  const [view, setView] = useState<"week" | "day">("week");
  const [draggedTask, setDraggedTask] = useState<StudyTask | null>(null);
  const [currentTime, setCurrentTime] = useState(getISTTime());

  // Dialog states
  const [showAddTask, setShowAddTask] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [showOptimize, setShowOptimize] = useState(false);

  // Form states
  const [newTask, setNewTask] = useState({
    title: "",
    subject: "",
    startTime: "09:00",
    endTime: "10:00",
    date: getISTDate(),
    priority: "medium" as StudyTask["priority"],
    type: "study" as StudyTask["type"],
  });

  const [filters, setFilters] = useState({
    subjects: [] as string[],
    priorities: [] as string[],
    types: [] as string[],
    period: "week",
  });

  const [autoScheduleSettings, setAutoScheduleSettings] = useState({
    freeTime: 3, // hours per day
    preferredTime: "morning",
    breakDuration: 15, // minutes
    sessionLength: 60, // minutes
    subjects: [] as string[],
  });

  const currentWeek = getWeekDates(selectedDate);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getISTTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const createTask = () => {
    if (!newTask.title.trim()) return;

    const task: StudyTask = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      color: getSubjectColor(newTask.subject),
    };

    setTasks((prev) => [...prev, task]);
    setShowAddTask(false);
    setNewTask({
      title: "",
      subject: "",
      startTime: "09:00",
      endTime: "10:00",
      date: getISTDate(),
      priority: "medium",
      type: "study",
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      DBMS: "bg-red-100 border-red-300 text-red-800",
      DSA: "bg-blue-100 border-blue-300 text-blue-800",
      OS: "bg-purple-100 border-purple-300 text-purple-800",
      Math: "bg-green-100 border-green-300 text-green-800",
      Networks: "bg-yellow-100 border-yellow-300 text-yellow-800",
    };
    return (
      colors[subject as keyof typeof colors] ||
      "bg-gray-100 border-gray-300 text-gray-800"
    );
  };

  const autoScheduleTasks = () => {
    // Simulate auto-scheduling logic
    const pendingTasks = [
      "Review DBMS Chapter 4",
      "Complete DSA Assignment",
      "OS Lab Preparation",
    ];
    const newAutoTasks: StudyTask[] = pendingTasks.map((title, index) => ({
      id: `auto-${Date.now()}-${index}`,
      title,
      subject: index === 0 ? "DBMS" : index === 1 ? "DSA" : "OS",
      startTime: `${9 + index * 2}:00`,
      endTime: `${10 + index * 2}:00`,
      date: getISTDate(),
      priority: "medium",
      type: "study",
      completed: false,
      color: getSubjectColor(index === 0 ? "DBMS" : index === 1 ? "DSA" : "OS"),
    }));

    setTasks((prev) => [...prev, ...newAutoTasks]);
    setShowAutoSchedule(false);
  };

  const optimizeSchedule = () => {
    // Simulate schedule optimization
    const optimizedTasks = tasks.map((task) => {
      // Move high priority tasks to morning hours
      if (
        task.priority === "high" &&
        parseInt(task.startTime.split(":")[0]) > 12
      ) {
        return {
          ...task,
          startTime: "09:00",
          endTime: "10:30",
        };
      }
      return task;
    });

    setTasks(optimizedTasks);
    setShowOptimize(false);
  };

  function getWeekDates(date: Date) {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  }

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter((task) => task.date === dateStr);
  };

  const getTasksForTimeSlot = (date: Date, timeSlot: string) => {
    const dateTasks = getTasksForDate(date);
    return dateTasks.filter((task) => task.startTime === timeSlot);
  };

  const handleDragStart = (task: StudyTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent,
    targetDate: Date,
    targetTime: string,
  ) => {
    e.preventDefault();
    if (!draggedTask) return;

    const targetDateStr = targetDate.toISOString().split("T")[0];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === draggedTask.id
          ? { ...task, date: targetDateStr, startTime: targetTime }
          : task,
      ),
    );

    setDraggedTask(null);
  };

  const getTypeIcon = (type: StudyTask["type"]) => {
    switch (type) {
      case "study":
        return BookOpen;
      case "quiz":
        return Brain;
      case "review":
        return Target;
      case "exam":
        return Calendar;
      default:
        return BookOpen;
    }
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Study Schedule</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Plan and organize your study sessions
            </p>
            <p className="text-xs lg:text-sm text-muted-foreground mt-1">
              Current time: {currentTime} IST
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showAutoSchedule} onOpenChange={setShowAutoSchedule}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Auto Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Auto Schedule Tasks</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Available hours per day</Label>
                    <Input
                      type="number"
                      value={autoScheduleSettings.freeTime}
                      onChange={(e) =>
                        setAutoScheduleSettings((prev) => ({
                          ...prev,
                          freeTime: parseInt(e.target.value) || 3,
                        }))
                      }
                      min="1"
                      max="12"
                    />
                  </div>

                  <div>
                    <Label>Preferred time</Label>
                    <Select
                      value={autoScheduleSettings.preferredTime}
                      onValueChange={(value) =>
                        setAutoScheduleSettings((prev) => ({
                          ...prev,
                          preferredTime: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (6-12 PM)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12-6 PM)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (6-10 PM)
                        </SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Session length (min)</Label>
                      <Input
                        type="number"
                        value={autoScheduleSettings.sessionLength}
                        onChange={(e) =>
                          setAutoScheduleSettings((prev) => ({
                            ...prev,
                            sessionLength: parseInt(e.target.value) || 60,
                          }))
                        }
                        min="15"
                        max="180"
                      />
                    </div>
                    <div>
                      <Label>Break duration (min)</Label>
                      <Input
                        type="number"
                        value={autoScheduleSettings.breakDuration}
                        onChange={(e) =>
                          setAutoScheduleSettings((prev) => ({
                            ...prev,
                            breakDuration: parseInt(e.target.value) || 15,
                          }))
                        }
                        min="5"
                        max="60"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAutoSchedule(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={autoScheduleTasks}>
                      <Zap className="w-4 h-4 mr-2" />
                      Auto Schedule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showOptimize} onOpenChange={setShowOptimize}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Optimize Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Optimize Schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="prioritize-morning" defaultChecked />
                      <Label htmlFor="prioritize-morning">
                        Move high priority tasks to morning
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="balance-subjects" defaultChecked />
                      <Label htmlFor="balance-subjects">
                        Balance subjects across days
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="avoid-conflicts" defaultChecked />
                      <Label htmlFor="avoid-conflicts">
                        Avoid time conflicts
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="energy-levels" />
                      <Label htmlFor="energy-levels">
                        Consider energy levels
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowOptimize(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={optimizeSchedule}>
                      <Settings className="w-4 h-4 mr-2" />
                      Optimize
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showFilter} onOpenChange={setShowFilter}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Tasks</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Period</Label>
                    <Select
                      value={filters.period}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, period: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Tasks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subjects</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["DBMS", "DSA", "OS", "Math", "Networks"].map(
                        (subject) => (
                          <div
                            key={subject}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={subject}
                              checked={filters.subjects.includes(subject)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({
                                    ...prev,
                                    subjects: [...prev.subjects, subject],
                                  }));
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    subjects: prev.subjects.filter(
                                      (s) => s !== subject,
                                    ),
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={subject}>{subject}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setFilters({
                          subjects: [],
                          priorities: [],
                          types: [],
                          period: "week",
                        })
                      }
                    >
                      Clear
                    </Button>
                    <Button onClick={() => setShowFilter(false)}>Apply</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Review DBMS Chapter 3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select
                        value={newTask.subject}
                        onValueChange={(value) =>
                          setNewTask((prev) => ({ ...prev, subject: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DBMS">Database Systems</SelectItem>
                          <SelectItem value="DSA">Data Structures</SelectItem>
                          <SelectItem value="OS">Operating Systems</SelectItem>
                          <SelectItem value="Math">Mathematics</SelectItem>
                          <SelectItem value="Networks">Networks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Type</Label>
                      <Select
                        value={newTask.type}
                        onValueChange={(value: StudyTask["type"]) =>
                          setNewTask((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">📚 Study</SelectItem>
                          <SelectItem value="quiz">🧠 Quiz</SelectItem>
                          <SelectItem value="review">🔄 Review</SelectItem>
                          <SelectItem value="exam">📝 Exam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newTask.date}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={newTask.startTime}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={newTask.endTime}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: StudyTask["priority"]) =>
                        setNewTask((prev) => ({ ...prev, priority: value }))
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

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTask(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={createTask}>Create Task</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {currentWeek[0].toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {currentWeek[6].toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
            >
              Day
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Mobile: Show only current day */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Today's Schedule</h3>
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="space-y-2 p-4">
                {getTasksForDate(new Date("2024-01-15")).map((task) => {
                  const TaskIcon = getTypeIcon(task.type);
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "p-3 rounded-lg border-l-4",
                        task.color,
                        task.completed && "opacity-60",
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <TaskIcon className="w-4 h-4" />
                        <span className="font-medium text-sm">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {task.startTime}-{task.endTime}
                        </span>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Full week grid */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 border-r bg-muted/50">
                  <span className="text-sm font-medium">Time</span>
                </div>
                {currentWeek.map((date, index) => (
                  <div
                    key={index}
                    className="p-3 text-center border-r last:border-r-0"
                  >
                    <div className="text-sm font-medium">{weekDays[index]}</div>
                    <div className="text-sm text-muted-foreground">
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 border-b">
                    <div className="p-3 border-r bg-muted/50 text-sm font-medium">
                      {timeSlot}
                    </div>
                    {currentWeek.map((date, dayIndex) => {
                      const tasksInSlot = getTasksForTimeSlot(date, timeSlot);
                      return (
                        <div
                          key={dayIndex}
                          className="p-1 border-r last:border-r-0 min-h-[60px] relative"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, date, timeSlot)}
                        >
                          {tasksInSlot.map((task) => {
                            const TaskIcon = getTypeIcon(task.type);
                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={() => handleDragStart(task)}
                                className={cn(
                                  "p-2 rounded border-l-4 cursor-move mb-1 text-xs",
                                  task.color,
                                  task.completed && "opacity-60",
                                )}
                              >
                                <div className="flex items-center space-x-1">
                                  <TaskIcon className="w-3 h-3" />
                                  <span className="font-medium truncate">
                                    {task.title}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs">
                                    {task.startTime}-{task.endTime}
                                  </span>
                                  <Badge
                                    variant={
                                      task.priority === "high"
                                        ? "destructive"
                                        : task.priority === "medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs px-1 py-0"
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
                  <Clock className="w-5 h-5" />
                  <span>Today's Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTasksForDate(new Date("2024-01-15")).map((task) => {
                    const TaskIcon = getTypeIcon(task.type);
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center space-x-4 p-3 rounded-lg border",
                          task.completed && "opacity-60",
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <TaskIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge
                              variant="secondary"
                              className={task.color.replace("border-", "bg-")}
                            >
                              {task.subject}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {task.startTime} - {task.endTime}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Tasks Scheduled</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tasks Completed</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Study Hours</span>
                  <span className="font-medium">24h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Success Rate</span>
                  <span className="font-medium text-success">67%</span>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">DBMS Final Exam</div>
                    <div className="text-xs text-muted-foreground">
                      in 2 days
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">DSA Assignment</div>
                    <div className="text-xs text-muted-foreground">
                      in 5 days
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">OS Project</div>
                    <div className="text-xs text-muted-foreground">
                      in 1 week
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
