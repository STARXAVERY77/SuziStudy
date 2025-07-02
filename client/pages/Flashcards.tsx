import { AppLayout } from "@/components/layout/AppLayout";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar,
  Settings,
  BookOpen,
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

// IST time helpers
const getISTTime = () => {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
};

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
  const [currentTime, setCurrentTime] = useState(getISTTime());

  // Dialog states
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Form states
  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    subject: "",
    topic: "",
    difficulty: 3 as Flashcard["difficulty"],
    tags: "",
  });

  const [aiGenerateSettings, setAIGenerateSettings] = useState({
    subject: "",
    topic: "",
    count: 5,
    difficulty: "mixed",
    source: "textbook",
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    difficultyRange: [1, 5],
    memoryStrength: [0, 100],
    reviewStatus: "all",
    tags: [] as string[],
    dateRange: "all",
  });

  const subjects = ["All", "DBMS", "DSA", "OS", "Math"];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getISTTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const createCard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card: Flashcard = {
      id: Date.now().toString(),
      front: newCard.front,
      back: newCard.back,
      subject: newCard.subject,
      topic: newCard.topic,
      difficulty: newCard.difficulty,
      interval: 1,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
      reviews: [],
      tags: newCard.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date(),
      aiGenerated: false,
      memoryStrength: 0,
    };

    setFlashcards((prev) => [card, ...prev]);
    setShowCreateCard(false);
    setNewCard({
      front: "",
      back: "",
      subject: "",
      topic: "",
      difficulty: 3,
      tags: "",
    });
  };

  const generateAICards = () => {
    // Simulate AI card generation
    const aiCards: Flashcard[] = Array.from(
      { length: aiGenerateSettings.count },
      (_, i) => ({
        id: `ai-${Date.now()}-${i}`,
        front: `AI Generated Question ${i + 1} about ${aiGenerateSettings.topic}`,
        back: `AI Generated Answer ${i + 1} explaining the concept in detail.`,
        subject: aiGenerateSettings.subject,
        topic: aiGenerateSettings.topic,
        difficulty: (Math.floor(Math.random() * 5) +
          1) as Flashcard["difficulty"],
        interval: 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reviews: [],
        tags: ["ai-generated", aiGenerateSettings.topic.toLowerCase()],
        createdAt: new Date(),
        aiGenerated: true,
        memoryStrength: 0,
      }),
    );

    setFlashcards((prev) => [...aiCards, ...prev]);
    setShowAIGenerate(false);
  };

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFlashcards((prev) => {
      const others = prev.filter((card) => !filteredCards.includes(card));
      return [...shuffled, ...others];
    });
    setCurrentCardIndex(0);
  };

  const resetProgress = () => {
    setFlashcards((prev) =>
      prev.map((card) => ({
        ...card,
        interval: 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reviews: [],
        memoryStrength: 0,
      })),
    );
  };

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
            <p className="text-sm text-muted-foreground mt-1">
              Current time: {currentTime} IST
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showCreateCard} onOpenChange={setShowCreateCard}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Cards
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Flashcard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="front">Front (Question)</Label>
                    <Textarea
                      id="front"
                      value={newCard.front}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          front: e.target.value,
                        }))
                      }
                      placeholder="Enter the question or prompt..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="back">Back (Answer)</Label>
                    <Textarea
                      id="back"
                      value={newCard.back}
                      onChange={(e) =>
                        setNewCard((prev) => ({
                          ...prev,
                          back: e.target.value,
                        }))
                      }
                      placeholder="Enter the answer or explanation..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select
                        value={newCard.subject}
                        onValueChange={(value) =>
                          setNewCard((prev) => ({ ...prev, subject: value }))
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Topic</Label>
                      <Input
                        value={newCard.topic}
                        onChange={(e) =>
                          setNewCard((prev) => ({
                            ...prev,
                            topic: e.target.value,
                          }))
                        }
                        placeholder="e.g., Normalization"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Difficulty (1-5)</Label>
                      <Select
                        value={newCard.difficulty.toString()}
                        onValueChange={(value) =>
                          setNewCard((prev) => ({
                            ...prev,
                            difficulty: parseInt(
                              value,
                            ) as Flashcard["difficulty"],
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Very Easy</SelectItem>
                          <SelectItem value="2">2 - Easy</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - Hard</SelectItem>
                          <SelectItem value="5">5 - Very Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Tags (comma-separated)</Label>
                      <Input
                        value={newCard.tags}
                        onChange={(e) =>
                          setNewCard((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        placeholder="theory, fundamentals, important"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateCard(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={createCard}>Create Card</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showAIGenerate} onOpenChange={setShowAIGenerate}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Generate Flashcards</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Select
                        value={aiGenerateSettings.subject}
                        onValueChange={(value) =>
                          setAIGenerateSettings((prev) => ({
                            ...prev,
                            subject: value,
                          }))
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Topic</Label>
                      <Input
                        value={aiGenerateSettings.topic}
                        onChange={(e) =>
                          setAIGenerateSettings((prev) => ({
                            ...prev,
                            topic: e.target.value,
                          }))
                        }
                        placeholder="e.g., Binary Trees"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Number of Cards</Label>
                      <Input
                        type="number"
                        value={aiGenerateSettings.count}
                        onChange={(e) =>
                          setAIGenerateSettings((prev) => ({
                            ...prev,
                            count: parseInt(e.target.value) || 5,
                          }))
                        }
                        min="1"
                        max="20"
                      />
                    </div>

                    <div>
                      <Label>Difficulty</Label>
                      <Select
                        value={aiGenerateSettings.difficulty}
                        onValueChange={(value) =>
                          setAIGenerateSettings((prev) => ({
                            ...prev,
                            difficulty: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Source</Label>
                    <Select
                      value={aiGenerateSettings.source}
                      onValueChange={(value) =>
                        setAIGenerateSettings((prev) => ({
                          ...prev,
                          source: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="textbook">
                          Textbook Concepts
                        </SelectItem>
                        <SelectItem value="practice">
                          Practice Problems
                        </SelectItem>
                        <SelectItem value="theory">
                          Theoretical Questions
                        </SelectItem>
                        <SelectItem value="application">
                          Real-world Applications
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAIGenerate(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={generateAICards}>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Cards
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
                  onClick={shuffleCards}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Shuffle Cards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={resetProgress}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>

                <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Flashcard Analytics</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="performance">
                          Performance
                        </TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">
                              {flashcards.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total Cards
                            </div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">
                              {sessionStats.cardsStudied}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Cards Studied Today
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="performance">
                        <div className="text-center py-8 text-muted-foreground">
                          Performance analytics would be displayed here
                        </div>
                      </TabsContent>

                      <TabsContent value="progress">
                        <div className="text-center py-8 text-muted-foreground">
                          Progress tracking would be shown here
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={showAdvancedFilters}
                  onOpenChange={setShowAdvancedFilters}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Advanced Filters</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Review Status</Label>
                        <Select
                          value={advancedFilters.reviewStatus}
                          onValueChange={(value) =>
                            setAdvancedFilters((prev) => ({
                              ...prev,
                              reviewStatus: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Cards</SelectItem>
                            <SelectItem value="due">Due for Review</SelectItem>
                            <SelectItem value="new">New Cards</SelectItem>
                            <SelectItem value="learned">
                              Well Learned
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Memory Strength Range (0-100%)</Label>
                        <div className="text-center text-sm text-muted-foreground mt-2">
                          {advancedFilters.memoryStrength[0]}% -{" "}
                          {advancedFilters.memoryStrength[1]}%
                        </div>
                      </div>

                      <div>
                        <Label>Tags</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                          {Array.from(
                            new Set(flashcards.flatMap((card) => card.tags)),
                          ).map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={tag}
                                checked={advancedFilters.tags.includes(tag)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setAdvancedFilters((prev) => ({
                                      ...prev,
                                      tags: [...prev.tags, tag],
                                    }));
                                  } else {
                                    setAdvancedFilters((prev) => ({
                                      ...prev,
                                      tags: prev.tags.filter((t) => t !== tag),
                                    }));
                                  }
                                }}
                              />
                              <Label htmlFor={tag} className="text-sm">
                                {tag}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setAdvancedFilters({
                              difficultyRange: [1, 5],
                              memoryStrength: [0, 100],
                              reviewStatus: "all",
                              tags: [],
                              dateRange: "all",
                            })
                          }
                        >
                          Clear
                        </Button>
                        <Button onClick={() => setShowAdvancedFilters(false)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
