import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Active Subjects",
    value: "4",
    change: "+2 this week",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Study Hours",
    value: "32h",
    change: "+5h from last week",
    icon: Clock,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Goals Completed",
    value: "8/12",
    change: "67% completion rate",
    icon: Target,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Learning Streak",
    value: "7 days",
    change: "Personal best!",
    icon: TrendingUp,
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            {stat.title === "Goals Completed" && (
              <Progress value={67} className="mt-3" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
