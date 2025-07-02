import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  FileText,
  MoreVertical,
  Play,
  Target,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Subject {
  id: number;
  name: string;
  shortName: string;
  description: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  color: string;
  nextTopic: string;
  examDate: string;
  materials: number;
}

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const daysUntilExam = Math.ceil(
    (new Date(subject.examDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{subject.name}</h3>
              <Badge variant="secondary" className={subject.color}>
                {subject.shortName}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Subject</DropdownMenuItem>
              <DropdownMenuItem>View Materials</DropdownMenuItem>
              <DropdownMenuItem>Schedule Study</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Subject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{subject.description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{subject.progress}%</span>
          </div>
          <Progress value={subject.progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {subject.completedTopics} of {subject.totalTopics} topics completed
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{daysUntilExam} days</div>
              <div className="text-xs text-muted-foreground">until exam</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{subject.materials}</div>
              <div className="text-xs text-muted-foreground">materials</div>
            </div>
          </div>
        </div>

        {/* Next Topic */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="font-medium">Next:</span>
            <span>{subject.nextTopic}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Continue
          </Button>
          <Button size="sm" variant="outline">
            AI Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
