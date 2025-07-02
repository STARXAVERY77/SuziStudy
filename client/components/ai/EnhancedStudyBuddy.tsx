import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Sparkles,
  Brain,
  Heart,
  Clock,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  Coffee,
  Star,
  Calendar,
  Bell,
  Mic,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  type:
    | "motivation"
    | "reminder"
    | "achievement"
    | "tip"
    | "check-in"
    | "teaching";
  timestamp: Date;
  priority: "low" | "medium" | "high";
  actionable?: boolean;
  action?: () => void;
}

interface UserState {
  energy: number;
  mood: "excellent" | "good" | "neutral" | "low" | "stressed";
  streak: number;
  todayStudyTime: number; // minutes
  currentSubject?: string;
  lastActivity?: Date;
}

export function EnhancedStudyBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [buddyMood, setBuddyMood] = useState<
    "happy" | "excited" | "focused" | "concerned" | "celebrating"
  >("happy");
  const [isAnimating, setIsAnimating] = useState(false);
  const [userState, setUserState] = useState<UserState>({
    energy: 75,
    mood: "good",
    streak: 7,
    todayStudyTime: 120,
    currentSubject: "DBMS",
    lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  });

  // Personality traits that affect how buddy responds
  const [personality] = useState({
    enthusiasm: 0.8, // 0-1
    supportiveness: 0.9,
    directness: 0.6,
    humor: 0.7,
    academicFocus: 0.8,
  });

  const motivationalMessages = [
    {
      text: "🎯 You're crushing it with that 7-day streak! Keep the momentum going!",
      type: "motivation" as const,
      condition: () => userState.streak >= 7,
    },
    {
      text: "💪 2 hours of studying today already? You're unstoppable!",
      type: "achievement" as const,
      condition: () => userState.todayStudyTime >= 120,
    },
    {
      text: "🧠 Your focus on DBMS is paying off! I can see your progress improving.",
      type: "motivation" as const,
      condition: () => userState.currentSubject === "DBMS",
    },
    {
      text: "⚡ Your energy seems a bit low. How about a quick 5-minute break?",
      type: "check-in" as const,
      condition: () => userState.energy < 50,
    },
    {
      text: "📚 It's been 30 minutes since your last study session. Ready to dive back in?",
      type: "reminder" as const,
      condition: () =>
        userState.lastActivity &&
        Date.now() - userState.lastActivity.getTime() > 30 * 60 * 1000,
    },
  ];

  const teachingTips = [
    "💡 Pro tip: When studying database normalization, draw out the tables. Visual learning helps!",
    "🔥 Try the Feynman Technique: Explain concepts in simple terms as if teaching a 5-year-old.",
    "⏰ Use the Pomodoro Technique: 25 minutes focused study + 5 minute break = maximum retention!",
    "🎯 Set micro-goals: Instead of 'study DBMS', try 'understand 1NF, 2NF, 3NF today'.",
    "🧠 Active recall beats re-reading. Quiz yourself instead of just reviewing notes!",
  ];

  const checkInQuestions = [
    "How are you feeling about today's study session?",
    "What subject would you like to focus on next?",
    "Need help breaking down any complex topics?",
    "Feeling motivated or need a pep talk?",
    "Want to review what you've learned so far?",
  ];

  useEffect(() => {
    // Generate contextual messages based on user state
    const interval = setInterval(() => {
      generateContextualMessage();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [userState]);

  useEffect(() => {
    // Animate when mood changes
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  }, [buddyMood]);

  const generateContextualMessage = () => {
    // Check for urgent conditions first
    const urgentMessage = motivationalMessages.find(
      (msg) => msg.condition() && msg.type === "reminder",
    );

    if (urgentMessage) {
      showMessage({
        id: Date.now().toString(),
        text: urgentMessage.text,
        type: urgentMessage.type,
        timestamp: new Date(),
        priority: "high",
      });
      setBuddyMood("concerned");
      return;
    }

    // Check for achievements
    const achievementMessage = motivationalMessages.find(
      (msg) => msg.condition() && msg.type === "achievement",
    );

    if (achievementMessage && Math.random() < 0.3) {
      showMessage({
        id: Date.now().toString(),
        text: achievementMessage.text,
        type: achievementMessage.type,
        timestamp: new Date(),
        priority: "medium",
      });
      setBuddyMood("celebrating");
      return;
    }

    // Random tips and motivation
    if (Math.random() < 0.2) {
      const randomTip =
        teachingTips[Math.floor(Math.random() * teachingTips.length)];
      showMessage({
        id: Date.now().toString(),
        text: randomTip,
        type: "tip",
        timestamp: new Date(),
        priority: "low",
      });
      setBuddyMood("focused");
    }
  };

  const showMessage = (message: Message) => {
    setCurrentMessage(message);
    setMessageHistory((prev) => [message, ...prev.slice(0, 9)]); // Keep last 10 messages
    setIsOpen(true);

    // Auto-hide low priority messages
    if (message.priority === "low") {
      setTimeout(() => {
        if (currentMessage?.id === message.id) {
          setIsOpen(false);
        }
      }, 8000);
    }
  };

  const handleQuickAction = (action: string) => {
    let response = "";
    let newMood: typeof buddyMood = "happy";

    switch (action) {
      case "quiz":
        response =
          "🧠 Great choice! Let's test your knowledge. What topic would you like me to quiz you on?";
        newMood = "excited";
        break;
      case "tips":
        const randomTip =
          teachingTips[Math.floor(Math.random() * teachingTips.length)];
        response = randomTip;
        newMood = "focused";
        break;
      case "break":
        response =
          "☕ Good call! Take 5-10 minutes to recharge. I'll remind you when it's time to get back to studying.";
        newMood = "happy";
        break;
      case "motivation":
        response = `🌟 You've already studied for ${userState.todayStudyTime} minutes today and have a ${userState.streak}-day streak! You're building incredible learning habits. Keep going - you're closer to your goals than you think!`;
        newMood = "celebrating";
        break;
      default:
        response = "�� How can I help you study better today?";
    }

    showMessage({
      id: Date.now().toString(),
      text: response,
      type: "teaching",
      timestamp: new Date(),
      priority: "medium",
    });
    setBuddyMood(newMood);
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        text.replace(/[🎯💪🧠⚡📚💡🔥⏰🎯🧠☕🌟🤖]/g, ""),
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.voice =
        speechSynthesis
          .getVoices()
          .find((voice) => voice.name.includes("Female")) || null;
      speechSynthesis.speak(utterance);
    }
  };

  const getBuddyAnimation = () => {
    const baseClasses = "transition-all duration-500 ease-in-out";

    switch (buddyMood) {
      case "excited":
        return `${baseClasses} animate-bounce`;
      case "celebrating":
        return `${baseClasses} animate-pulse`;
      case "focused":
        return `${baseClasses} scale-105`;
      case "concerned":
        return `${baseClasses} animate-ping`;
      default:
        return `${baseClasses} hover:scale-110`;
    }
  };

  const getBuddyColor = () => {
    switch (buddyMood) {
      case "excited":
        return "from-blue-500 to-purple-600";
      case "celebrating":
        return "from-yellow-400 to-orange-500";
      case "focused":
        return "from-green-500 to-blue-500";
      case "concerned":
        return "from-orange-500 to-red-500";
      default:
        return "from-primary to-accent";
    }
  };

  const getMoodIcon = () => {
    switch (buddyMood) {
      case "excited":
        return Zap;
      case "celebrating":
        return Star;
      case "focused":
        return Target;
      case "concerned":
        return Clock;
      default:
        return Sparkles;
    }
  };

  const MoodIcon = getMoodIcon();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && currentMessage && (
        <Card className="mb-4 w-80 shadow-xl border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br",
                    getBuddyColor(),
                  )}
                >
                  <MoodIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-medium">Study Buddy</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 text-xs",
                      currentMessage.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : currentMessage.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800",
                    )}
                  >
                    {currentMessage.type}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakMessage(currentMessage.text)}
                  className="h-6 w-6 p-0"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              {currentMessage.text}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("quiz")}
              >
                <Brain className="w-3 h-3 mr-1" />
                Quiz me
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("tips")}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Study tip
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("motivation")}
              >
                <Heart className="w-3 h-3 mr-1" />
                Motivate me
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("break")}
              >
                <Coffee className="w-3 h-3 mr-1" />
                Break time
              </Button>
            </div>

            <div className="text-xs text-muted-foreground mt-3 flex items-center justify-between">
              <span>{currentMessage.timestamp.toLocaleTimeString()}</span>
              <div className="flex items-center space-x-2">
                <Bell className="w-3 h-3" />
                <span>AI Learning Companion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message History Indicator */}
      {messageHistory.length > 0 && !isOpen && (
        <div className="absolute -top-2 -right-2">
          <Badge
            variant="destructive"
            className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {messageHistory.length}
          </Badge>
        </div>
      )}

      {/* Main Buddy Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-lg border-2 border-white bg-gradient-to-br",
          getBuddyColor(),
          getBuddyAnimation(),
          isAnimating && "animate-pulse",
        )}
      >
        <div className="relative">
          <MoodIcon className="w-7 h-7 text-white" />
          {buddyMood === "celebrating" && (
            <div className="absolute -top-1 -right-1 text-yellow-300 animate-bounce">
              ✨
            </div>
          )}
        </div>
      </Button>

      {/* Floating indicators for active states */}
      {userState.energy < 40 && (
        <div className="absolute -top-3 -left-3 text-orange-500 animate-bounce">
          ⚡
        </div>
      )}

      {userState.streak >= 7 && (
        <div className="absolute -top-3 right-0 text-yellow-500 animate-bounce">
          🔥
        </div>
      )}
    </div>
  );
}
