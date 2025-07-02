import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Lightbulb,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VivaQuestion {
  id: string;
  question: string;
  subject: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  expectedAnswer: string;
  keywords: string[];
  followUpQuestions?: string[];
  timeLimit: number; // seconds
  category: "concept" | "application" | "analysis" | "synthesis";
}

interface VivaSession {
  id: string;
  subject: string;
  startTime: Date;
  endTime?: Date;
  questions: VivaAttempt[];
  totalScore: number;
  averageResponseTime: number;
  strengths: string[];
  weaknesses: string[];
}

interface VivaAttempt {
  questionId: string;
  question: VivaQuestion;
  userAnswer: string;
  aiResponse: string;
  score: number; // 0-100
  responseTime: number; // seconds
  feedback: string;
  keywordsCovered: string[];
  timestamp: Date;
  voiceUsed: boolean;
}

const sampleQuestions: VivaQuestion[] = [
  {
    id: "1",
    question:
      "Explain the concept of database normalization and why it's important.",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: 3,
    expectedAnswer:
      "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables and defining relationships between them. The main goals are to eliminate redundant data, minimize data anomalies, and ensure data consistency.",
    keywords: [
      "redundancy",
      "data integrity",
      "decomposition",
      "relationships",
      "anomalies",
      "consistency",
    ],
    followUpQuestions: [
      "What are the different normal forms?",
      "Can you give an example of 1NF, 2NF, and 3NF?",
    ],
    timeLimit: 120,
    category: "concept",
  },
  {
    id: "2",
    question:
      "How would you implement a binary search tree and what are its time complexities?",
    subject: "DSA",
    topic: "Trees",
    difficulty: 4,
    expectedAnswer:
      "A BST is implemented with nodes containing data, left child, and right child pointers. Insert: compare with current node, go left if smaller, right if larger. Search: similar comparison logic. Delete: three cases - leaf node, one child, two children. Average time complexity: O(log n) for all operations. Worst case: O(n) for skewed trees.",
    keywords: [
      "node",
      "left child",
      "right child",
      "insert",
      "search",
      "delete",
      "O(log n)",
      "O(n)",
      "skewed",
    ],
    followUpQuestions: [
      "How would you balance a BST?",
      "What's the difference between BST and AVL tree?",
    ],
    timeLimit: 180,
    category: "application",
  },
  {
    id: "3",
    question:
      "Explain the difference between processes and threads in operating systems.",
    subject: "OS",
    topic: "Process Management",
    difficulty: 3,
    expectedAnswer:
      "Processes are independent execution units with separate memory spaces, while threads are lightweight execution units within a process that share memory. Processes require IPC for communication, threads can communicate directly through shared memory. Context switching between processes is expensive, between threads is cheaper. Processes provide better isolation and security.",
    keywords: [
      "independent",
      "memory space",
      "lightweight",
      "shared memory",
      "IPC",
      "context switching",
      "isolation",
      "security",
    ],
    followUpQuestions: [
      "What are the advantages of multithreading?",
      "How do you handle synchronization between threads?",
    ],
    timeLimit: 150,
    category: "concept",
  },
];

export default function Viva() {
  const [currentQuestion, setCurrentQuestion] = useState<VivaQuestion | null>(
    null,
  );
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("DBMS");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<VivaSession | null>(
    null,
  );
  const [sessionHistory, setSessionHistory] = useState<VivaAttempt[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const recognitionRef = useRef<any>(null);

  const subjects = ["DBMS", "DSA", "OS", "Math"];
  const difficulties = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startVivaSession = () => {
    const filteredQuestions = sampleQuestions.filter((q) => {
      const matchesSubject = q.subject === selectedSubject;
      const matchesDifficulty = !difficulty || q.difficulty === difficulty;
      return matchesSubject && matchesDifficulty;
    });

    if (filteredQuestions.length === 0) return;

    const randomQuestion =
      filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    setCurrentQuestion(randomQuestion);
    setTimeLeft(randomQuestion.timeLimit);
    setIsActive(true);
    setCurrentAnswer("");
    setShowAnswer(false);

    const newSession: VivaSession = {
      id: Date.now().toString(),
      subject: selectedSubject,
      startTime: new Date(),
      questions: [],
      totalScore: 0,
      averageResponseTime: 0,
      strengths: [],
      weaknesses: [],
    };
    setCurrentSession(newSession);

    // Speak the question if voice is enabled
    if (voiceEnabled) {
      speakText(randomQuestion.question);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setCurrentAnswer(transcript);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      // Fallback for browsers without speech recognition
      setIsRecording(true);
      // Simulate voice input after 3 seconds
      setTimeout(() => {
        setCurrentAnswer(
          "Database normalization helps reduce redundancy and ensures data integrity by organizing data into separate tables with proper relationships.",
        );
        setIsRecording(false);
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleTimeUp = () => {
    setIsActive(false);
    if (isRecording) {
      stopRecording();
    }
    if (currentAnswer.trim()) {
      evaluateAnswer();
    } else {
      // No answer provided
      if (voiceEnabled) {
        speakText(
          "Time's up! Please provide an answer or skip to the next question.",
        );
      }
    }
  };

  const evaluateAnswer = () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    setIsEvaluating(true);

    // Simulate AI evaluation
    setTimeout(() => {
      const keywordsCovered = currentQuestion.keywords.filter((keyword) =>
        currentAnswer.toLowerCase().includes(keyword.toLowerCase()),
      );

      const keywordScore =
        (keywordsCovered.length / currentQuestion.keywords.length) * 100;
      const lengthScore = Math.min((currentAnswer.length / 200) * 100, 100);
      const finalScore = Math.round(keywordScore * 0.7 + lengthScore * 0.3);

      const responseTime = currentQuestion.timeLimit - timeLeft;

      const feedback = generateFeedback(
        finalScore,
        keywordsCovered,
        currentQuestion,
      );

      const attempt: VivaAttempt = {
        questionId: currentQuestion.id,
        question: currentQuestion,
        userAnswer: currentAnswer,
        aiResponse: feedback.response,
        score: finalScore,
        responseTime,
        feedback: feedback.detailed,
        keywordsCovered,
        timestamp: new Date(),
        voiceUsed: isRecording,
      };

      setSessionHistory((prev) => [...prev, attempt]);

      if (voiceEnabled) {
        speakText(feedback.response);
      }

      setIsEvaluating(false);
      setShowAnswer(true);
    }, 2000);
  };

  const generateFeedback = (
    score: number,
    keywordsCovered: string[],
    question: VivaQuestion,
  ) => {
    let response = "";
    let detailed = "";

    if (score >= 80) {
      response = "Excellent answer! You covered most of the key concepts.";
      detailed = `Great job! You mentioned ${keywordsCovered.length} out of ${question.keywords.length} important keywords. Your understanding is clear.`;
    } else if (score >= 60) {
      response = "Good answer, but you could elaborate more on some points.";
      detailed = `You covered ${keywordsCovered.length} out of ${question.keywords.length} key concepts. Consider discussing: ${question.keywords
        .filter((k) => !keywordsCovered.includes(k))
        .slice(0, 2)
        .join(", ")}.`;
    } else if (score >= 40) {
      response = "Your answer touches on some points, but needs more depth.";
      detailed = `You mentioned some relevant points but missed several key concepts. Focus on: ${question.keywords
        .filter((k) => !keywordsCovered.includes(k))
        .slice(0, 3)
        .join(", ")}.`;
    } else {
      response =
        "Your answer needs significant improvement. Let me help you understand better.";
      detailed = `Your response was quite brief and missed most key concepts. The main points to cover are: ${question.keywords.slice(0, 4).join(", ")}.`;
    }

    return { response, detailed };
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    startVivaSession();
  };

  const endSession = () => {
    setIsActive(false);
    setCurrentQuestion(null);
    setCurrentSession(null);
    if (isRecording) {
      stopRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const averageScore =
    sessionHistory.length > 0
      ? Math.round(
          sessionHistory.reduce((sum, attempt) => sum + attempt.score, 0) /
            sessionHistory.length,
        )
      : 0;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Viva Examiner</h1>
            <p className="text-muted-foreground">
              Practice oral examinations with AI-powered voice interaction
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice On
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Voice Off
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {sessionHistory.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Questions Answered
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{averageScore}%</div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {sessionHistory.length > 0
                      ? Math.round(
                          sessionHistory.reduce(
                            (sum, attempt) => sum + attempt.responseTime,
                            0,
                          ) / sessionHistory.length,
                        )
                      : 0}
                    s
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg Response Time
                  </p>
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
                    {
                      sessionHistory.filter((attempt) => attempt.score >= 80)
                        .length
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent Answers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Viva Interface */}
          <div className="lg:col-span-2">
            {!currentQuestion ? (
              <Card>
                <CardHeader>
                  <CardTitle>Start Viva Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select Subject:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map((subject) => (
                          <Button
                            key={subject}
                            variant={
                              selectedSubject === subject
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedSubject(subject)}
                          >
                            {subject}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Difficulty Level (Optional):
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={!difficulty ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDifficulty(null)}
                        >
                          Any
                        </Button>
                        {difficulties.map((level) => (
                          <Button
                            key={level}
                            variant={
                              difficulty === level ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setDifficulty(level)}
                          >
                            Level {level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={startVivaSession}
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    size="lg"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start Viva Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>Viva in Progress</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{currentQuestion.subject}</Badge>
                      <Badge variant="outline">{currentQuestion.topic}</Badge>
                      <Badge
                        variant="secondary"
                        className={
                          currentQuestion.difficulty <= 2
                            ? "bg-green-100 text-green-800"
                            : currentQuestion.difficulty <= 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        Level {currentQuestion.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Timer */}
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-4xl font-mono font-bold",
                        timeLeft <= 30 ? "text-red-600" : "text-primary",
                      )}
                    >
                      {formatTime(timeLeft)}
                    </div>
                    <Progress
                      value={(timeLeft / currentQuestion.timeLimit) * 100}
                      className="mt-2"
                    />
                  </div>

                  {/* Question */}
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Question:</h3>
                    <p className="text-xl leading-relaxed">
                      {currentQuestion.question}
                    </p>
                  </div>

                  {/* Voice Controls */}
                  <div className="flex justify-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700"
                        size="lg"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        variant="outline"
                        size="lg"
                      >
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </Button>
                    )}

                    <Button
                      onClick={() => speakText(currentQuestion.question)}
                      variant="outline"
                      size="lg"
                      disabled={!voiceEnabled}
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Repeat Question
                    </Button>
                  </div>

                  {/* Current Answer */}
                  {currentAnswer && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Your Answer:</h4>
                      <p className="text-sm">{currentAnswer}</p>
                    </div>
                  )}

                  {/* Evaluation */}
                  {isEvaluating && (
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">
                        AI is evaluating your answer...
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {showAnswer && sessionHistory.length > 0 && (
                    <div className="space-y-4">
                      {(() => {
                        const lastAttempt =
                          sessionHistory[sessionHistory.length - 1];
                        return (
                          <div className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">AI Evaluation</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Score:</span>
                                <span
                                  className={cn(
                                    "text-xl font-bold",
                                    getScoreColor(lastAttempt.score),
                                  )}
                                >
                                  {lastAttempt.score}%
                                </span>
                              </div>
                            </div>

                            <p className="text-sm">{lastAttempt.aiResponse}</p>
                            <p className="text-xs text-muted-foreground">
                              {lastAttempt.feedback}
                            </p>

                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>
                                Response Time: {lastAttempt.responseTime}s
                              </span>
                              <span>
                                Keywords Covered:{" "}
                                {lastAttempt.keywordsCovered.length}/
                                {currentQuestion.keywords.length}
                              </span>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowAnswer(!showAnswer)}
                            >
                              {showAnswer ? (
                                <EyeOff className="w-4 h-4 mr-2" />
                              ) : (
                                <Eye className="w-4 h-4 mr-2" />
                              )}
                              Expected Answer
                            </Button>

                            {showAnswer && (
                              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                                <h5 className="font-medium text-green-800 mb-2">
                                  Expected Answer:
                                </h5>
                                <p className="text-sm text-green-700">
                                  {currentQuestion.expectedAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-center space-x-4">
                    {currentAnswer && !isEvaluating && !showAnswer && (
                      <Button onClick={evaluateAnswer}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Answer
                      </Button>
                    )}

                    {showAnswer && (
                      <Button onClick={nextQuestion}>Next Question</Button>
                    )}

                    <Button variant="outline" onClick={endSession}>
                      End Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Recent Answers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {sessionHistory
                      .slice(-5)
                      .reverse()
                      .map((attempt, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {attempt.question.topic}
                            </Badge>
                            <span
                              className={cn(
                                "text-sm font-bold",
                                getScoreColor(attempt.score),
                              )}
                            >
                              {attempt.score}%
                            </span>
                          </div>
                          <p
                            className="text-xs text-muted-foreground overflow-hidden text-ellipsis"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {attempt.question.question}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{attempt.responseTime}s</span>
                            {attempt.voiceUsed && <Mic className="w-3 h-3" />}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Viva Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Speak clearly and at a moderate pace</p>
                <p>• Structure your answers logically</p>
                <p>• Use technical terms appropriately</p>
                <p>• Give examples when possible</p>
                <p>• Don't hesitate to ask for clarification</p>
                <p>• Stay calm and confident</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
