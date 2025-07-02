import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Brain,
  BookOpen,
  Lightbulb,
  Clock,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
  category?: "general" | "quiz" | "explanation" | "summary" | "planning";
}

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI study companion. I can help you with quizzes, explanations, study planning, and more. What would you like to work on today?",
    type: "ai",
    timestamp: new Date(Date.now() - 60000),
    category: "general",
  },
];

const quickActions = [
  { label: "Quiz me on DBMS", icon: Brain, category: "quiz" },
  { label: "Explain OS concepts", icon: BookOpen, category: "explanation" },
  { label: "Create study plan", icon: Clock, category: "planning" },
  { label: "Summarize notes", icon: FileText, category: "summary" },
  { label: "Study tips", icon: Lightbulb, category: "general" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    const responses = {
      quiz: [
        "Great! Let's test your DBMS knowledge. What is normalization and why is it important in database design?",
        "Here's a DBMS question: What's the difference between PRIMARY KEY and UNIQUE constraints?",
        "Let me quiz you: Can you explain the ACID properties of database transactions?",
      ],
      explanation: [
        "I'd be happy to explain OS concepts! Let's start with processes vs threads. A process is an independent program in execution with its own memory space, while threads are lightweight units within a process that share memory...",
        "Operating Systems manage hardware resources through several key components: Process Management, Memory Management, File Systems, and I/O Management. Would you like me to dive deeper into any specific area?",
      ],
      planning: [
        "I'll help you create a personalized study plan! Based on your subjects and exam dates, here's what I recommend:\n\n📚 **This Week:**\n- DBMS: 2 hours daily (Query Optimization)\n- DSA: 1.5 hours daily (Trees & Graphs)\n- OS: 1 hour daily (Process Synchronization)\n\n⏰ **Schedule:**\n- Morning: Theory concepts\n- Afternoon: Practice problems\n- Evening: Review & notes",
      ],
      summary: [
        "I can help summarize your study materials! Please upload a document or paste the content you'd like me to summarize. I'll create concise notes highlighting the key concepts.",
      ],
      general: [
        "Here are some proven study techniques:\n\n🎯 **Active Recall**: Test yourself instead of re-reading\n🔄 **Spaced Repetition**: Review at increasing intervals\n🍅 **Pomodoro**: 25min focused sessions\n📝 **Feynman Technique**: Explain concepts simply\n🎨 **Mind Maps**: Visualize connections",
        "I'm here to help with your studies! You can ask me to:\n- Create custom quizzes\n- Explain difficult concepts\n- Generate study schedules\n- Summarize materials\n- Provide study tips\n- Track your progress",
      ],
    };

    let category: keyof typeof responses = "general";
    let responseText = "";

    if (
      userMessage.toLowerCase().includes("quiz") ||
      userMessage.toLowerCase().includes("test")
    ) {
      category = "quiz";
    } else if (
      userMessage.toLowerCase().includes("explain") ||
      userMessage.toLowerCase().includes("what is")
    ) {
      category = "explanation";
    } else if (
      userMessage.toLowerCase().includes("plan") ||
      userMessage.toLowerCase().includes("schedule")
    ) {
      category = "planning";
    } else if (
      userMessage.toLowerCase().includes("summary") ||
      userMessage.toLowerCase().includes("summarize")
    ) {
      category = "summary";
    }

    const categoryResponses = responses[category];
    responseText =
      categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    return {
      id: Date.now().toString(),
      content: responseText,
      type: "ai",
      timestamp: new Date(),
      category,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(
      () => {
        const aiResponse = simulateAIResponse(input);
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      },
      1000 + Math.random() * 2000,
    );
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "quiz":
        return Brain;
      case "explanation":
        return BookOpen;
      case "planning":
        return Clock;
      case "summary":
        return FileText;
      default:
        return Sparkles;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "quiz":
        return "bg-blue-100 text-blue-800";
      case "explanation":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-purple-100 text-purple-800";
      case "summary":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Study Assistant</h1>
              <p className="text-muted-foreground">
                Your personal learning companion
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b bg-muted/30">
          <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.label)}
                className="text-xs"
              >
                <action.icon className="w-3 h-3 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">
            <div className="space-y-4">
              {messages.map((message) => (
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
                      {message.type === "ai" && message.category && (
                        <div className="flex items-center space-x-2 mb-2">
                          {React.createElement(
                            getCategoryIcon(message.category),
                            {
                              className: "w-3 h-3",
                            },
                          )}
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getCategoryColor(message.category)}`}
                          >
                            {message.category}
                          </Badge>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-2 opacity-70`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-card border rounded-lg p-4">
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
        </div>

        {/* Input */}
        <div className="p-6 border-t">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
