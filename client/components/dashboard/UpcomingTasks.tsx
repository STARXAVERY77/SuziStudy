import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Circle } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Review Database Normalization",
    subject: "DBMS",
    time: "9:00 AM",
    duration: "45 min",
    priority: "high",
    completed: false,
    color: "bg-red-100 text-red-800",
  },
  {
    id: 2,
    title: "Practice Binary Trees",
    subject: "DSA",
    time: "11:00 AM",
    duration: "60 min",
    priority: "medium",
    completed: false,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    title: "Linear Algebra - Vectors",
    subject: "Mathematics",
    time: "2:00 PM",
    duration: "30 min",
    priority: "low",
    completed: true,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 4,
    title: "Operating Systems Concepts",
    subject: "OS",
    time: "4:00 PM",
    duration: "40 min",
    priority: "high",
    completed: false,
    color: "bg-purple-100 text-purple-800",
  },
];

export function UpcomingTasks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Today's Study Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors ${
              task.completed ? "bg-muted/50" : "hover:bg-muted/30"
            }`}
          >
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4
                  className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </h4>
                <Badge variant="secondary" className={task.color}>
                  {task.subject}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                <span>{task.time}</span>
                <span>•</span>
                <span>{task.duration}</span>
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

            {!task.completed && (
              <Button size="sm" variant="outline">
                Start
              </Button>
            )}
          </div>
        ))}

        <Button className="w-full mt-4" variant="outline">
          View Full Schedule
        </Button>
      </CardContent>
    </Card>
  );
}
