import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  MessageSquare,
  FileText,
  Zap,
  User,
  Bot,
  Send,
  Sparkles,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  Heart,
  Battery,
  TrendingUp,
  Database,
  Upload,
  Mic,
  Volume2,
  Star,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Memory {
  id: string;
  content: string;
  type: "concept" | "preference" | "progress" | "difficulty" | "goal";
  subject: string;
  importance: number; // 1-10
  lastAccessed: Date;
  embedding?: number[]; // Simulated vector embedding
}

interface Conversation {
  id: string;
  messages: Message[];
  subject: string;
  startTime: Date;
  summary: string;
  learningProgress: number;
}

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
  category: "teaching" | "quiz" | "explanation" | "encouragement" | "planning";
  relatedMemories?: string[];
  confidence?: number;
}

interface UserState {
  energy: number; // 1-100
  mood: "excellent" | "good" | "neutral" | "low" | "stressed";
  focusLevel: number; // 1-100
  preferredLearningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  currentGoals: string[];
  weakAreas: string[];
  strongAreas: string[];
}

export default function AITutor() {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      content:
        "Alex struggles with database normalization but excels at SQL queries",
      type: "difficulty",
      subject: "DBMS",
      importance: 9,
      lastAccessed: new Date(),
    },
    {
      id: "2",
      content: "Prefers visual explanations with diagrams and examples",
      type: "preference",
      subject: "general",
      importance: 8,
      lastAccessed: new Date(),
    },
    {
      id: "3",
      content: "Goal: Master all DBMS concepts by March 15th for the exam",
      type: "goal",
      subject: "DBMS",
      importance: 10,
      lastAccessed: new Date(),
    },
  ]);

  const [userState, setUserState] = useState<UserState>({
    energy: 75,
    mood: "good",
    focusLevel: 80,
    preferredLearningStyle: "visual",
    currentGoals: ["Master DBMS normalization", "Complete DSA tree problems"],
    weakAreas: ["Database normalization", "Dynamic programming"],
    strongAreas: ["SQL queries", "Basic data structures"],
  });

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      messages: [],
      subject: "DBMS",
      startTime: new Date(Date.now() - 86400000), // Yesterday
      summary:
        "Explained 1NF, 2NF, 3NF with examples. Alex understood concepts well.",
      learningProgress: 85,
    },
  ]);

  const [currentConversation, setCurrentConversation] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello Alex! I can see from our previous sessions that you've been working on database normalization. Your energy level seems good today (75%), and I know you prefer visual explanations. Ready to continue where we left off, or would you like to work on something new?",
      type: "ai",
      timestamp: new Date(Date.now() - 60000),
      category: "teaching",
      relatedMemories: ["1", "2"],
    },
  ]);

  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("DBMS");
  const [mode, setMode] = useState<"chat" | "quiz" | "flashcards" | "viva">(
    "chat",
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const subjects = ["DBMS", "DSA", "OS", "Math", "General"];
  const modes = [
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "flashcards", label: "Flashcards", icon: FileText },
    { id: "viva", label: "Viva", icon: Mic },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentConversation]);

  const generateAIResponse = (userMessage: string): Message => {
    const relevantMemories = memories.filter(
      (m) => m.subject === selectedSubject || m.subject === "general",
    );

    let responseContent = "";
    let category: Message["category"] = "teaching";

    // Personalized responses based on user state and memories
    if (
      userMessage.toLowerCase().includes("quiz") ||
      userMessage.toLowerCase().includes("test")
    ) {
      category = "quiz";
      if (selectedSubject === "DBMS") {
        responseContent = `Based on your progress with normalization, let me ask you this: You have a table with columns (StudentID, StudentName, CourseID, CourseName, InstructorName, InstructorOffice). What normal form violations do you see, and how would you fix them? Remember, you're strong with SQL but need practice with normalization concepts.`;
      } else {
        responseContent = `Let's test your understanding! I'll adapt this quiz to your visual learning style.`;
      }
    } else if (
      userMessage.toLowerCase().includes("explain") ||
      userMessage.toLowerCase().includes("how")
    ) {
      category = "explanation";
      responseContent = `I'll explain this using visual examples since that's how you learn best. Let me break this down step by step with diagrams and real-world examples.`;
    } else if (
      userMessage.toLowerCase().includes("tired") ||
      userMessage.toLowerCase().includes("difficult")
    ) {
      category = "encouragement";
      responseContent = `I notice your energy is at ${userState.energy}%. That's actually pretty good! Remember, you've already mastered SQL queries, which shows you have strong analytical skills. Let's take this one step at a time.`;
    } else {
      // Default teaching response with memory integration
      const relatedMemory = relevantMemories.find(
        (m) => m.type === "difficulty",
      );
      if (relatedMemory) {
        responseContent = `I remember you've been working on this area. Based on our previous sessions, I'll approach this in a way that builds on your strengths. Let me use visual examples to make this clearer.`;
      } else {
        responseContent = `Great question! Let me help you understand this concept thoroughly.`;
      }
    }

    // Update memory with this interaction
    const newMemory: Memory = {
      id: Date.now().toString(),
      content: `Discussed: ${userMessage}`,
      type: "concept",
      subject: selectedSubject,
      importance: 5,
      lastAccessed: new Date(),
    };
    setMemories((prev) => [...prev, newMemory]);

    return {
      id: Date.now().toString(),
      content: responseContent,
      type: "ai",
      timestamp: new Date(),
      category,
      relatedMemories: relevantMemories.slice(0, 2).map((m) => m.id),
      confidence: 0.85 + Math.random() * 0.1,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: "user",
      timestamp: new Date(),
      category: "teaching",
    };

    setCurrentConversation((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    // Simulate AI processing with personalization
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(input);
        setCurrentConversation((prev) => [...prev, aiResponse]);
        setIsProcessing(false);
      },
      1500 + Math.random() * 2000,
    );
  };

  const getCategoryIcon = (category: Message["category"]) => {
    switch (category) {
      case "teaching":
        return BookOpen;
      case "quiz":
        return Brain;
      case "explanation":
        return Lightbulb;
      case "encouragement":
        return Heart;
      case "planning":
        return Target;
      default:
        return MessageSquare;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "neutral":
        return "text-gray-600 bg-gray-100";
      case "low":
        return "text-yellow-600 bg-yellow-100";
      case "stressed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header with AI Status */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span>AI Learning Companion</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Personalized tutoring with persistent memory • GPT-4o powered
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
            <Button variant="outline" size="sm">
              <Database className="w-4 h-4 mr-2" />
              Memory: {memories.length}
            </Button>
          </div>
        </div>

        {/* User State Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Your Learning State</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Battery className="w-4 h-4 mr-1" />
                    Energy
                  </span>
                  <span className="text-sm font-bold">{userState.energy}%</span>
                </div>
                <Progress value={userState.energy} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Brain className="w-4 h-4 mr-1" />
                    Focus
                  </span>
                  <span className="text-sm font-bold">
                    {userState.focusLevel}%
                  </span>
                </div>
                <Progress value={userState.focusLevel} className="h-2" />
              </div>

              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Mood:</span>
                <Badge className={getMoodColor(userState.mood)}>
                  {userState.mood}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Style:</span>
                <Badge variant="outline">
                  {userState.preferredLearningStyle}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5" />
                    <span>AI Tutor Session</span>
                  </CardTitle>

                  <div className="flex items-center space-x-2">
                    {/* Mode Selection */}
                    {modes.map((modeOption) => {
                      const Icon = modeOption.icon;
                      return (
                        <Button
                          key={modeOption.id}
                          variant={
                            mode === modeOption.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setMode(modeOption.id as any)}
                        >
                          <Icon className="w-4 h-4 mr-1" />
                          {modeOption.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm font-medium">Subject:</span>
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={
                        selectedSubject === subject ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Messages */}
                <ScrollArea className="h-96 mb-4">
                  <div className="space-y-4">
                    {currentConversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex space-x-3 max-w-3xl ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gradient-to-br from-primary to-accent text-white"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                          </div>

                          <div
                            className={`rounded-lg p-4 ${
                              message.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border"
                            }`}
                          >
                            {message.type === "ai" && (
                              <div className="flex items-center space-x-2 mb-2">
                                {React.createElement(
                                  getCategoryIcon(message.category),
                                  {
                                    className: "w-3 h-3",
                                  },
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {message.category}
                                </Badge>
                                {message.confidence && (
                                  <Badge variant="outline" className="text-xs">
                                    {(message.confidence * 100).toFixed(0)}%
                                    confident
                                  </Badge>
                                )}
                              </div>
                            )}

                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>

                            {message.relatedMemories &&
                              message.relatedMemories.length > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  💭 Based on {message.relatedMemories.length}{" "}
                                  previous interactions
                                </div>
                              )}

                            <div className="text-xs mt-2 opacity-70">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="flex space-x-3 max-w-3xl">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-card border rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-3 h-3" />
                              <span className="text-xs">AI is thinking...</span>
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything... I remember our previous conversations!"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isProcessing}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Memory & Stats Sidebar */}
          <div className="space-y-6">
            {/* Memory System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>AI Memory</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {memories.slice(0, 5).map((memory) => (
                  <div key={memory.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {memory.type}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{memory.importance}/10</span>
                      </div>
                    </div>
                    <p className="text-sm">{memory.content}</p>
                    <div className="text-xs text-muted-foreground mt-1">
                      {memory.subject} •{" "}
                      {memory.lastAccessed.toLocaleDateString()}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Memories ({memories.length})
                </Button>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Today's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concepts Learned</span>
                    <span className="font-medium">7</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Interactions</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retention Rate</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>

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
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Flashcards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Study Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Learning Goal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Voice Mode
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
