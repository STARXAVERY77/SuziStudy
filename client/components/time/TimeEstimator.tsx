import { useState, useEffect } from "react";
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
  Clock,
  Target,
  TrendingUp,
  Brain,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Timer,
  BarChart3,
  Zap,
  Calendar,
  BookOpen,
  FileText,
  Video,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskEstimate {
  id: string;
  taskName: string;
  taskType:
    | "reading"
    | "writing"
    | "problem_solving"
    | "video_watching"
    | "note_taking"
    | "revision"
    | "coding"
    | "research";
  estimatedMinutes: number;
  confidenceLevel: number; // 0-100
  factors: EstimationFactor[];
  bufferRecommendation: number; // additional minutes
  difficulty: "easy" | "medium" | "hard";
  subject?: string;
  actualTime?: number; // for learning
  completed?: boolean;
  accuracy?: number; // if completed, how accurate was the estimate
}

interface EstimationFactor {
  name: string;
  impact: "increase" | "decrease" | "neutral";
  magnitude: number; // 1-10
  description: string;
}

interface UserPerformanceData {
  subject: string;
  taskType: string;
  averageSpeed: number; // pages/problems per minute
  accuracyRate: number; // 0-1
  difficultyMultiplier: number;
  timeOfDayEfficiency: { [hour: number]: number };
  streakBonus: number; // efficiency bonus when on a streak
}

interface MaterialAnalysis {
  type: "pdf" | "video" | "audio" | "text";
  length: number; // pages, minutes, words
  complexity: "low" | "medium" | "high";
  density: number; // information density 1-10
  prerequisites: string[];
}

export function TimeEstimator() {
  const [currentEstimate, setCurrentEstimate] = useState<TaskEstimate | null>(
    null,
  );
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedType, setSelectedType] =
    useState<TaskEstimate["taskType"]>("reading");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<TaskEstimate["difficulty"]>("medium");
  const [materialAnalysis, setMaterialAnalysis] =
    useState<MaterialAnalysis | null>(null);

  const [userPerformance, setUserPerformance] = useState<UserPerformanceData[]>(
    [
      {
        subject: "DBMS",
        taskType: "reading",
        averageSpeed: 0.8, // pages per minute
        accuracyRate: 0.85,
        difficultyMultiplier: 1.2,
        timeOfDayEfficiency: {
          9: 1.2,
          10: 1.3,
          11: 1.1,
          14: 0.9,
          15: 0.8,
          19: 1.0,
          20: 0.9,
        },
        streakBonus: 1.1,
      },
      {
        subject: "OS",
        taskType: "problem_solving",
        averageSpeed: 2.5, // problems per minute
        accuracyRate: 0.75,
        difficultyMultiplier: 1.5,
        timeOfDayEfficiency: {
          9: 1.0,
          10: 1.1,
          11: 1.2,
          14: 1.0,
          15: 0.9,
          19: 0.8,
          20: 0.7,
        },
        streakBonus: 1.15,
      },
    ],
  );

  const [recentEstimates, setRecentEstimates] = useState<TaskEstimate[]>([
    {
      id: "1",
      taskName: "Read Chapter 3: Query Optimization",
      taskType: "reading",
      estimatedMinutes: 45,
      confidenceLevel: 85,
      factors: [
        {
          name: "Previous chapter completion time",
          impact: "neutral",
          magnitude: 5,
          description: "Similar pace as Chapter 2",
        },
        {
          name: "Morning efficiency boost",
          impact: "decrease",
          magnitude: 3,
          description: "10% faster in morning hours",
        },
        {
          name: "Complex diagrams",
          impact: "increase",
          magnitude: 4,
          description: "Additional time for understanding visuals",
        },
      ],
      bufferRecommendation: 15,
      difficulty: "medium",
      subject: "DBMS",
      actualTime: 52,
      completed: true,
      accuracy: 87, // 52 vs 45+15 estimate
    },
    {
      id: "2",
      taskName: "Complete Assignment 2 - SQL Queries",
      taskType: "problem_solving",
      estimatedMinutes: 75,
      confidenceLevel: 78,
      factors: [
        {
          name: "Complex join operations",
          impact: "increase",
          magnitude: 6,
          description: "Multi-table joins require careful planning",
        },
        {
          name: "Familiar with MySQL",
          impact: "decrease",
          magnitude: 4,
          description: "Experience with the database system",
        },
        {
          name: "Reference materials available",
          impact: "decrease",
          magnitude: 2,
          description: "Can refer to previous examples",
        },
      ],
      bufferRecommendation: 30,
      difficulty: "hard",
      subject: "DBMS",
      actualTime: 98,
      completed: true,
      accuracy: 72, // 98 vs 75+30 estimate
    },
  ]);

  const generateTimeEstimate = () => {
    if (!taskDescription.trim()) return;

    const baseEstimate = calculateBaseEstimate();
    const factors = analyzeTaskFactors();
    const adjustedEstimate = applyFactorAdjustments(baseEstimate, factors);
    const confidence = calculateConfidence(factors);
    const buffer = calculateBufferRecommendation(adjustedEstimate, confidence);

    const estimate: TaskEstimate = {
      id: `estimate-${Date.now()}`,
      taskName: taskDescription,
      taskType: selectedType,
      estimatedMinutes: adjustedEstimate,
      confidenceLevel: confidence,
      factors,
      bufferRecommendation: buffer,
      difficulty: selectedDifficulty,
      subject: selectedSubject,
    };

    setCurrentEstimate(estimate);
    setRecentEstimates((prev) => [estimate, ...prev.slice(0, 9)]);
  };

  const calculateBaseEstimate = (): number => {
    const performance = userPerformance.find(
      (p) => p.subject === selectedSubject && p.taskType === selectedType,
    );

    if (!performance) {
      // Default estimates based on task type
      const defaultEstimates = {
        reading: 30,
        writing: 45,
        problem_solving: 60,
        video_watching: 40,
        note_taking: 35,
        revision: 25,
        coding: 90,
        research: 75,
      };
      return defaultEstimates[selectedType];
    }

    // Estimate based on material analysis if available
    if (materialAnalysis) {
      let estimate = 0;

      switch (selectedType) {
        case "reading":
          estimate = materialAnalysis.length / performance.averageSpeed;
          break;
        case "video_watching":
          estimate = materialAnalysis.length; // 1:1 for videos
          break;
        case "problem_solving":
          estimate = materialAnalysis.length / performance.averageSpeed;
          break;
        default:
          estimate = materialAnalysis.length * 2; // 2 minutes per unit for other types
      }

      // Adjust for complexity
      const complexityMultiplier = {
        low: 0.8,
        medium: 1.0,
        high: 1.3,
      };

      estimate *= complexityMultiplier[materialAnalysis.complexity];
      estimate *= performance.difficultyMultiplier;

      return Math.round(estimate);
    }

    // Fallback to historical performance
    return Math.round(
      (45 / performance.averageSpeed) * performance.difficultyMultiplier,
    );
  };

  const analyzeTaskFactors = (): EstimationFactor[] => {
    const factors: EstimationFactor[] = [];

    // Time of day factor
    const currentHour = new Date().getHours();
    const performance = userPerformance.find(
      (p) => p.subject === selectedSubject && p.taskType === selectedType,
    );

    if (performance?.timeOfDayEfficiency[currentHour]) {
      const efficiency = performance.timeOfDayEfficiency[currentHour];
      factors.push({
        name: "Current time efficiency",
        impact: efficiency > 1 ? "decrease" : "increase",
        magnitude: Math.abs(efficiency - 1) * 10,
        description: `${efficiency > 1 ? "Higher" : "Lower"} efficiency at ${currentHour}:00`,
      });
    }

    // Difficulty factor
    if (selectedDifficulty === "hard") {
      factors.push({
        name: "High difficulty level",
        impact: "increase",
        magnitude: 6,
        description: "Complex material requires additional processing time",
      });
    } else if (selectedDifficulty === "easy") {
      factors.push({
        name: "Low difficulty level",
        impact: "decrease",
        magnitude: 4,
        description: "Straightforward material can be processed faster",
      });
    }

    // Subject familiarity
    const subjectPerformance = userPerformance.filter(
      (p) => p.subject === selectedSubject,
    );
    if (subjectPerformance.length > 0) {
      const avgAccuracy =
        subjectPerformance.reduce((acc, p) => acc + p.accuracyRate, 0) /
        subjectPerformance.length;
      if (avgAccuracy > 0.8) {
        factors.push({
          name: "High subject familiarity",
          impact: "decrease",
          magnitude: 3,
          description: "Strong performance history in this subject",
        });
      } else if (avgAccuracy < 0.6) {
        factors.push({
          name: "Lower subject familiarity",
          impact: "increase",
          magnitude: 4,
          description: "May need additional time for comprehension",
        });
      }
    }

    // Material analysis factors
    if (materialAnalysis) {
      if (materialAnalysis.density > 7) {
        factors.push({
          name: "High information density",
          impact: "increase",
          magnitude: 5,
          description: "Dense material requires slower, more careful reading",
        });
      }

      if (materialAnalysis.prerequisites.length > 2) {
        factors.push({
          name: "Multiple prerequisites",
          impact: "increase",
          magnitude: 3,
          description: "May need to review background concepts",
        });
      }
    }

    // Recent performance trend
    const recentAccuracy =
      recentEstimates
        .slice(0, 3)
        .filter((e) => e.completed && e.accuracy)
        .reduce((acc, e) => acc + (e.accuracy || 0), 0) / 3;

    if (recentAccuracy > 85) {
      factors.push({
        name: "Recent estimation accuracy",
        impact: "neutral",
        magnitude: 8,
        description: "High confidence based on recent accurate estimates",
      });
    } else if (recentAccuracy < 70) {
      factors.push({
        name: "Recent underestimation pattern",
        impact: "increase",
        magnitude: 5,
        description: "Recent tasks took longer than estimated",
      });
    }

    return factors;
  };

  const applyFactorAdjustments = (
    baseEstimate: number,
    factors: EstimationFactor[],
  ): number => {
    let adjustedEstimate = baseEstimate;

    factors.forEach((factor) => {
      const adjustment = (factor.magnitude / 10) * 0.2; // Max 20% adjustment per factor

      switch (factor.impact) {
        case "increase":
          adjustedEstimate *= 1 + adjustment;
          break;
        case "decrease":
          adjustedEstimate *= 1 - adjustment;
          break;
        // neutral factors don't change the estimate but affect confidence
      }
    });

    return Math.round(adjustedEstimate);
  };

  const calculateConfidence = (factors: EstimationFactor[]): number => {
    let baseConfidence = 70;

    // Neutral factors increase confidence
    const neutralFactors = factors.filter((f) => f.impact === "neutral");
    baseConfidence += neutralFactors.reduce((acc, f) => acc + f.magnitude, 0);

    // High-magnitude factors decrease confidence
    const highMagnitudeFactors = factors.filter((f) => f.magnitude >= 7);
    baseConfidence -= highMagnitudeFactors.length * 10;

    // Subject familiarity increases confidence
    const hasSubjectData = userPerformance.some(
      (p) => p.subject === selectedSubject,
    );
    if (hasSubjectData) baseConfidence += 15;

    return Math.max(30, Math.min(95, baseConfidence));
  };

  const calculateBufferRecommendation = (
    estimate: number,
    confidence: number,
  ): number => {
    // Lower confidence = higher buffer
    const confidenceBuffer = ((100 - confidence) / 100) * estimate * 0.5;

    // Minimum buffer for different task types
    const minimumBuffers = {
      reading: 10,
      writing: 15,
      problem_solving: 20,
      video_watching: 5,
      note_taking: 10,
      revision: 8,
      coding: 30,
      research: 25,
    };

    const minBuffer = minimumBuffers[selectedType];
    return Math.max(minBuffer, Math.round(confidenceBuffer));
  };

  const analyzeMaterial = (
    materialType: "pdf" | "video" | "text",
    length: number,
  ) => {
    const analysis: MaterialAnalysis = {
      type: materialType,
      length,
      complexity: "medium", // This would be determined by AI analysis
      density: 6, // Information density
      prerequisites: ["Database basics", "SQL fundamentals"], // Would be extracted by AI
    };

    setMaterialAnalysis(analysis);
  };

  const startTimedSession = (estimate: TaskEstimate) => {
    // This would integrate with the focus mode component
    console.log(
      `Starting timed session for ${estimate.estimatedMinutes + estimate.bufferRecommendation} minutes`,
    );
  };

  const getTaskTypeIcon = (type: TaskEstimate["taskType"]) => {
    switch (type) {
      case "reading":
        return BookOpen;
      case "writing":
        return FileText;
      case "problem_solving":
        return Target;
      case "video_watching":
        return Video;
      case "note_taking":
        return FileText;
      case "revision":
        return BarChart3;
      case "coding":
        return Zap;
      case "research":
        return Lightbulb;
      default:
        return Clock;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600 bg-green-100";
    if (confidence >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Estimation Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Time Estimator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="task-description">Task Description</Label>
            <Textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="e.g., Read Chapter 3 of Database Systems textbook, Complete SQL assignment problems 1-5"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="task-type">Task Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value: TaskEstimate["taskType"]) =>
                  setSelectedType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">📚 Reading</SelectItem>
                  <SelectItem value="writing">✍️ Writing</SelectItem>
                  <SelectItem value="problem_solving">
                    �� Problem Solving
                  </SelectItem>
                  <SelectItem value="video_watching">
                    🎥 Video Watching
                  </SelectItem>
                  <SelectItem value="note_taking">📝 Note Taking</SelectItem>
                  <SelectItem value="revision">🔄 Revision</SelectItem>
                  <SelectItem value="coding">💻 Coding</SelectItem>
                  <SelectItem value="research">🔍 Research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DBMS">Database Systems</SelectItem>
                  <SelectItem value="OS">Operating Systems</SelectItem>
                  <SelectItem value="Networks">Computer Networks</SelectItem>
                  <SelectItem value="Algorithms">Algorithms</SelectItem>
                  <SelectItem value="ML">Machine Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value: TaskEstimate["difficulty"]) =>
                  setSelectedDifficulty(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🟢 Easy</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">🔴 Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Material Analysis */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm font-medium mb-2">
              Optional: Analyze Material
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => analyzeMaterial("pdf", 25)}
              >
                📄 PDF (25 pages)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => analyzeMaterial("video", 45)}
              >
                🎥 Video (45 min)
              </Button>
              <Input
                placeholder="Custom length"
                className="w-32"
                type="number"
              />
            </div>
          </div>

          <Button
            onClick={generateTimeEstimate}
            className="w-full"
            disabled={!taskDescription.trim()}
          >
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Estimate
          </Button>
        </CardContent>
      </Card>

      {/* Current Estimate */}
      {currentEstimate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Time Estimate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {currentEstimate.estimatedMinutes} minutes
                </div>
                <div className="text-sm text-muted-foreground">
                  + {currentEstimate.bufferRecommendation} minute buffer
                  recommended
                </div>
                <Badge
                  className={cn(
                    "mt-2",
                    getConfidenceColor(currentEstimate.confidenceLevel),
                  )}
                >
                  {currentEstimate.confidenceLevel}% confidence
                </Badge>
              </div>

              {/* Factors */}
              <div>
                <div className="text-sm font-medium mb-2">
                  Estimation Factors:
                </div>
                <div className="space-y-2">
                  {currentEstimate.factors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          factor.impact === "increase"
                            ? "bg-red-500"
                            : factor.impact === "decrease"
                              ? "bg-green-500"
                              : "bg-blue-500",
                        )}
                      />
                      <span className="font-medium">{factor.name}:</span>
                      <span className="text-muted-foreground">
                        {factor.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Analysis */}
              {materialAnalysis && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-1">
                    Material Analysis
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {materialAnalysis.type.toUpperCase()} •{" "}
                    {materialAnalysis.length}{" "}
                    {materialAnalysis.type === "video" ? "minutes" : "pages"} •
                    {materialAnalysis.complexity} complexity • Density:{" "}
                    {materialAnalysis.density}/10
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => startTimedSession(currentEstimate)}
                  className="flex-1"
                >
                  <Timer className="w-4 h-4 mr-2" />
                  Start{" "}
                  {currentEstimate.estimatedMinutes +
                    currentEstimate.bufferRecommendation}
                  min Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => startTimedSession(currentEstimate)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Estimates & Accuracy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Estimation History & Learning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEstimates.slice(0, 5).map((estimate) => {
              const TaskIcon = getTaskTypeIcon(estimate.taskType);
              const accuracy = estimate.accuracy;

              return (
                <div
                  key={estimate.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <TaskIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        {estimate.taskName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Estimated: {estimate.estimatedMinutes}m (+
                        {estimate.bufferRecommendation}m buffer)
                        {estimate.actualTime &&
                          ` • Actual: ${estimate.actualTime}m`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {estimate.completed && accuracy && (
                      <Badge
                        variant={
                          accuracy >= 80
                            ? "default"
                            : accuracy >= 60
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {accuracy}% accurate
                      </Badge>
                    )}
                    {!estimate.completed && (
                      <Badge variant="outline">In Progress</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Accuracy */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  Overall Estimation Accuracy
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on completed tasks
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">79%</div>
                <div className="text-xs text-muted-foreground">Improving!</div>
              </div>
            </div>
            <Progress value={79} className="mt-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
