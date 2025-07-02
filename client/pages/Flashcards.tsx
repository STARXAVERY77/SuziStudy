import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Brain,
  Clock,
  Target,
  Zap,
  FileText,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  BarChart3,
  Shuffle,
  Filter,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1=easy, 5=very hard
  interval: number; // Days until next review
  nextReview: Date;
  reviews: Review[];
  tags: string[];
  createdAt: Date;
  aiGenerated: boolean;
  memoryStrength: number; // 0-100
}

interface Review {
  date: Date;
  rating: 1 | 2 | 3 | 4 | 5; // 1=again, 2=hard, 3=good, 4=easy, 5=perfect
  responseTime: number; // seconds
}

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  newCards: number;
  reviewCards: number;
  averageRating: number;
  subject: string;
}

const sampleFlashcards: Flashcard[] = [
  {
    id: "1",
    front: "What is database normalization?",
    back: "Database normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves decomposing tables to eliminate data anomalies and ensure each piece of information is stored in only one place.",
    subject: "DBMS",
    topic: "Normalization",
    difficulty: 3,
    interval: 3,
    nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        rating: 3,
        responseTime: 15,
      },
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        rating: 2,
        responseTime: 25,
      },
    ],
    tags: ["theory", "fundamentals"],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    aiGenerated: true,
    memoryStrength: 65,
  },
  {
    id: "2",
    front: "What are the different types of binary trees?",
    back: "Main types of binary trees include:\n1. Complete Binary Tree - All levels filled except possibly the last\n2. Full Binary Tree - Every node has 0 or 2 children\n3. Perfect Binary Tree - All internal nodes have 2 children and leaves at same level\n4. Balanced Binary Tree - Height difference between subtrees ≤ 1\n5. Binary Search Tree - Left subtree < root < right subtree",
    subject: "DSA",
    topic: "Trees",
    difficulty: 4,
    interval: 1,
    nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    reviews: [
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        rating: 2,
        responseTime: 35,
      },
    ],
    tags: ["trees", "data-structures"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    aiGenerated: true,
    memoryStrength: 45,
  },
  {
    id: "3",
    front: "Explain the difference between process and thread",
    back: "Process:\n- Independent execution unit with its own memory space\n- Heavy-weight, slower context switching\n- Inter-process communication needed for data sharing\n- More secure isolation\n\nThread:\n- Lightweight execution unit within a process\n- Shares memory space with other threads\n- Faster context switching\n- Direct memory sharing but requires synchronization",
    subject: "OS",
    topic: "Process Management",
    difficulty: 3,
    interval: 7,
    nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    reviews: [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        rating: 4,
        responseTime: 12,
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        rating: 3,
        responseTime: 18,
      },
    ],
    tags: ["processes", "threads", "fundamentals"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    aiGenerated: false,
    memoryStrength: 78,
  },
];

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(sampleFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<"review" | "new" | "mixed">(
    "mixed",
  );
  const [sessionStats, setSessionStats] = useState({
    cardsStudied: 0,
    correctAnswers: 0,
    startTime: new Date(),
  });
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null,
  );

  const subjects = ["All", "DBMS", "DSA", "OS", "Math"];

  const filteredCards = flashcards.filter((card) => {
    if (!selectedSubject || selectedSubject === "All") return true;
    return card.subject === selectedSubject;
  });

  const dueCards = filteredCards.filter(
    (card) => card.nextReview <= new Date(),
  );
  const newCards = filteredCards.filter((card) => card.reviews.length === 0);

  const currentCard = filteredCards[currentCardIndex];

  const calculateSpacedRepetition = (
    card: Flashcard,
    rating: number,
  ): number => {
    // Simplified SM-2 algorithm
    let interval = card.interval;

    if (rating >= 3) {
      if (card.reviews.length === 0) {
        interval = 1;
      } else if (card.reviews.length === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * (2.5 + (rating - 3) * 0.1));
      }
    } else {
      interval = 1;
    }

    return Math.max(1, interval);
  };

  const handleRating = (rating: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return;

    const newInterval = calculateSpacedRepetition(currentCard, rating);
    const nextReview = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000);

    const newReview: Review = {
      date: new Date(),
      rating,
      responseTime: 15, // Mock response time
    };

    const updatedCard: Flashcard = {
      ...currentCard,
      interval: newInterval,
      nextReview,
      reviews: [...currentCard.reviews, newReview],
      memoryStrength: Math.min(
        100,
        currentCard.memoryStrength + (rating - 2) * 10,
      ),
    };

    setFlashcards((prev) =>
      prev.map((card) => (card.id === currentCard.id ? updatedCard : card)),
    );

    setSessionStats((prev) => ({
      ...prev,
      cardsStudied: prev.cardsStudied + 1,
      correctAnswers: prev.correctAnswers + (rating >= 3 ? 1 : 0),
    }));

    // Move to next card
    nextCard();
    setShowAnswer(false);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) =>
      prev === 0 ? filteredCards.length - 1 : prev - 1,
    );
  };

  const startStudySession = () => {
    setIsStudyMode(true);
    setCurrentSession({
      id: Date.now().toString(),
      startTime: new Date(),
      cardsStudied: 0,
      newCards: 0,
      reviewCards: 0,
      averageRating: 0,
      subject: selectedSubject || "All",
    });
    setSessionStats({
      cardsStudied: 0,
      correctAnswers: 0,
      startTime: new Date(),
    });
  };

  const endStudySession = () => {
    setIsStudyMode(false);
    setCurrentSession(null);
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-yellow-100 text-yellow-800";
      case 4:
        return "bg-orange-100 text-orange-800";
      case 5:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMemoryStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-600";
    if (strength >= 60) return "text-blue-600";
    if (strength >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Flashcards</h1>
            <p className="text-muted-foreground">
              Spaced repetition learning with AI-generated content
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Create Cards
            </Button>
            <Button variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{flashcards.length}</div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
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
                  <div className="text-2xl font-bold">{dueCards.length}</div>
                  <p className="text-sm text-muted-foreground">
                    Due for Review
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{newCards.length}</div>
                  <p className="text-sm text-muted-foreground">New Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {sessionStats.cardsStudied > 0
                      ? Math.round(
                          (sessionStats.correctAnswers /
                            sessionStats.cardsStudied) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Subject:</span>
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={
                    selectedSubject === subject ||
                    (!selectedSubject && subject === "All")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setSelectedSubject(subject === "All" ? null : subject)
                  }
                >
                  {subject}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Mode:</span>
              <Button
                variant={studyMode === "review" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("review")}
              >
                Review ({dueCards.length})
              </Button>
              <Button
                variant={studyMode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("new")}
              >
                New ({newCards.length})
              </Button>
              <Button
                variant={studyMode === "mixed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStudyMode("mixed")}
              >
                Mixed
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isStudyMode ? (
              <Button
                onClick={startStudySession}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Study Session
              </Button>
            ) : (
              <Button onClick={endStudySession} variant="outline">
                End Session
              </Button>
            )}
          </div>
        </div>

        {/* Main Flashcard Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentCard ? (
              <Card className="min-h-96">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={getDifficultyColor(currentCard.difficulty)}
                      >
                        Level {currentCard.difficulty}
                      </Badge>
                      <Badge variant="outline">{currentCard.subject}</Badge>
                      <Badge variant="outline">{currentCard.topic}</Badge>
                      {currentCard.aiGenerated && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {currentCardIndex + 1} of {filteredCards.length}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">Memory:</span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            getMemoryStrengthColor(currentCard.memoryStrength),
                          )}
                        >
                          {currentCard.memoryStrength}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Card Content */}
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Question:</h3>
                      <p className="text-xl leading-relaxed">
                        {currentCard.front}
                      </p>
                    </div>

                    {showAnswer && (
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Answer:</h3>
                        <div className="text-left bg-muted/50 p-4 rounded-lg">
                          <p className="whitespace-pre-line leading-relaxed">
                            {currentCard.back}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button variant="outline" onClick={prevCard}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="px-8"
                    >
                      {showAnswer ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide Answer
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Show Answer
                        </>
                      )}
                    </Button>

                    <Button variant="outline" onClick={nextCard}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Rating Buttons (only show if answer is visible and in study mode) */}
                  {showAnswer && isStudyMode && (
                    <div className="border-t pt-6">
                      <h4 className="text-center text-sm font-medium mb-4">
                        How well did you know this?
                      </h4>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRating(1)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Again
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRating(2)}
                          className="text-orange-600 hover:bg-orange-50"
                        >
                          Hard
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRating(3)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          Good
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRating(4)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          Easy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRating(5)}
                          className="text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Perfect
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="min-h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No cards available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create some flashcards or adjust your filters
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Card
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Progress */}
            {isStudyMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Session Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cards Studied</span>
                      <span className="font-medium">
                        {sessionStats.cardsStudied}
                      </span>
                    </div>
                    <Progress
                      value={
                        (sessionStats.cardsStudied / filteredCards.length) * 100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Accuracy</span>
                      <span className="font-medium">
                        {sessionStats.cardsStudied > 0
                          ? Math.round(
                              (sessionStats.correctAnswers /
                                sessionStats.cardsStudied) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        sessionStats.cardsStudied > 0
                          ? (sessionStats.correctAnswers /
                              sessionStats.cardsStudied) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Session time:{" "}
                    {Math.floor(
                      (Date.now() - sessionStats.startTime.getTime()) / 60000,
                    )}{" "}
                    minutes
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card Info */}
            {currentCard && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reviews</span>
                      <span className="font-medium">
                        {currentCard.reviews.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Review</span>
                      <span className="font-medium">
                        {currentCard.nextReview > new Date()
                          ? `${Math.ceil((currentCard.nextReview.getTime() - Date.now()) / (24 * 60 * 60 * 1000))}d`
                          : "Due now"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Strength</span>
                      <span
                        className={cn(
                          "font-medium",
                          getMemoryStrengthColor(currentCard.memoryStrength),
                        )}
                      >
                        {currentCard.memoryStrength}%
                      </span>
                    </div>
                  </div>

                  {currentCard.tags.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentCard.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Cards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
