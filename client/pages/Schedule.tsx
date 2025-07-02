import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

export default function Schedule() {
  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [selectedDate, setSelectedDate] = useState(new Date("2024-01-15"));
  const [view, setView] = useState<"week" | "day">("week");
  const [draggedTask, setDraggedTask] = useState<StudyTask | null>(null);

  const currentWeek = getWeekDates(selectedDate);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Schedule</h1>
            <p className="text-muted-foreground">
              Plan and organize your study sessions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
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
          </CardContent>
        </Card>

        {/* Today's Tasks Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
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
