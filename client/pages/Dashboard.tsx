import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, Flame, BookOpen, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Alex! 👋</h1>
            <p className="text-muted-foreground mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Calendar className="w-4 h-4 mr-2" />
            Plan Today
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks and Progress */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingTasks />

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Subject Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="relative">
                      <svg className="w-16 h-16 mx-auto">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${85 * 1.76} 176`}
                          strokeLinecap="round"
                          className="text-red-500 transform -rotate-90 origin-center"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">85%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">DBMS</p>
                  </div>
                  <div className="text-center">
                    <div className="relative">
                      <svg className="w-16 h-16 mx-auto">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${67 * 1.76} 176`}
                          strokeLinecap="round"
                          className="text-blue-500 transform -rotate-90 origin-center"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold">67%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">DSA</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operating Systems</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mathematics</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions and Study Streak */}
          <div className="space-y-6">
            <QuickActions />

            {/* Study Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>Study Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Days in a row! Keep it up!
                </p>
                <div className="flex justify-center space-x-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-medium"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Completed DBMS Quiz</div>
                  <div className="text-muted-foreground">2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Added new study notes</div>
                  <div className="text-muted-foreground">5 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Focus session completed</div>
                  <div className="text-muted-foreground">Yesterday</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
