import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Clock,
  Brain,
  BookOpen,
  Calendar,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  category: "schedule" | "quiz" | "info" | "control" | "general";
}

const sampleCommands: VoiceCommand[] = [
  {
    id: "1",
    command: "What's my schedule today?",
    response:
      "You have DBMS review at 9 AM for 45 minutes, DSA practice at 11 AM for 1 hour, and Operating Systems study at 2 PM for 30 minutes.",
    timestamp: new Date(Date.now() - 300000),
    category: "schedule",
  },
  {
    id: "2",
    command: "Quiz me on databases",
    response:
      "Great! Here's a question: What is the difference between a clustered and non-clustered index? Take your time to think about it.",
    timestamp: new Date(Date.now() - 180000),
    category: "quiz",
  },
];

const quickCommands = [
  { text: "What's my schedule today?", category: "schedule", icon: Calendar },
  { text: "Quiz me on DBMS", category: "quiz", icon: Brain },
  { text: "Summarize my progress", category: "info", icon: BookOpen },
  { text: "Start focus timer", category: "control", icon: Clock },
  {
    text: "What should I study next?",
    category: "general",
    icon: MessageSquare,
  },
];

export default function Voice() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [commands, setCommands] = useState<VoiceCommand[]>(sampleCommands);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition (mock for now)
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setVoiceState("listening");
      };

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          processVoiceCommand(transcript);
        } else {
          setVoiceState("idle");
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setVoiceState("idle");
      };
    }
  }, [transcript]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
    } else {
      // Fallback for browsers without speech recognition
      mockVoiceRecognition();
    }
  };

  const mockVoiceRecognition = () => {
    setVoiceState("listening");
    setIsListening(true);

    // Simulate listening for 3 seconds
    setTimeout(
      () => {
        setIsListening(false);
        const mockCommands = [
          "What's my schedule today?",
          "Quiz me on operating systems",
          "How am I progressing with DBMS?",
          "Start a focus session",
          "What should I study next?",
        ];
        const randomCommand =
          mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setTranscript(randomCommand);
        processVoiceCommand(randomCommand);
      },
      2000 + Math.random() * 2000,
    );
  };

  const processVoiceCommand = (command: string) => {
    setVoiceState("processing");

    setTimeout(
      () => {
        const response = generateResponse(command);
        const newCommand: VoiceCommand = {
          id: Date.now().toString(),
          command,
          response: response.text,
          timestamp: new Date(),
          category: response.category,
        };

        setCommands((prev) => [newCommand, ...prev]);

        if (voiceEnabled) {
          speakResponse(response.text);
        } else {
          setVoiceState("idle");
        }

        setTranscript("");
      },
      1000 + Math.random() * 1000,
    );
  };

  const generateResponse = (
    command: string,
  ): { text: string; category: VoiceCommand["category"] } => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("schedule") || lowerCommand.includes("today")) {
      return {
        text: "Today you have DBMS review at 9 AM for 45 minutes, followed by DSA practice at 11 AM for 1 hour. Your Operating Systems study session is scheduled for 2 PM.",
        category: "schedule",
      };
    } else if (lowerCommand.includes("quiz") || lowerCommand.includes("test")) {
      const subjects = [
        "DBMS",
        "operating systems",
        "data structures",
        "mathematics",
      ];
      const subject =
        subjects.find((s) => lowerCommand.includes(s)) || "your subject";
      return {
        text: `Let's test your knowledge! Here's a question about ${subject}: Can you explain the key concepts we've been studying? Take your time to think about it.`,
        category: "quiz",
      };
    } else if (
      lowerCommand.includes("progress") ||
      lowerCommand.includes("how am i doing")
    ) {
      return {
        text: "You're doing great! You've completed 85% of your DBMS goals, 67% of DSA, and 42% of Operating Systems. You're on track with your study plan.",
        category: "info",
      };
    } else if (
      lowerCommand.includes("focus") ||
      lowerCommand.includes("timer") ||
      lowerCommand.includes("pomodoro")
    ) {
      return {
        text: "I'll start a focus session for you. Your 25-minute Pomodoro timer is now running. Stay focused and eliminate distractions!",
        category: "control",
      };
    } else if (
      lowerCommand.includes("study next") ||
      lowerCommand.includes("what should")
    ) {
      return {
        text: "Based on your schedule, I recommend reviewing Query Optimization for DBMS. It's your next topic and you have an exam coming up soon.",
        category: "general",
      };
    } else {
      return {
        text: "I can help you with your studies! Try asking about your schedule, starting a quiz, checking progress, or getting study recommendations.",
        category: "general",
      };
    }
  };

  const speakResponse = (text: string) => {
    setVoiceState("speaking");

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setVoiceState("idle");
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback - just show speaking state for a few seconds
      setTimeout(() => setVoiceState("idle"), 3000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setVoiceState("idle");
  };

  const getCategoryIcon = (category: VoiceCommand["category"]) => {
    switch (category) {
      case "schedule":
        return Calendar;
      case "quiz":
        return Brain;
      case "info":
        return BookOpen;
      case "control":
        return Settings;
      default:
        return MessageSquare;
    }
  };

  const getCategoryColor = (category: VoiceCommand["category"]) => {
    switch (category) {
      case "schedule":
        return "bg-blue-100 text-blue-800";
      case "quiz":
        return "bg-purple-100 text-purple-800";
      case "info":
        return "bg-green-100 text-green-800";
      case "control":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Voice Assistant</h1>
          <p className="text-muted-foreground">
            Control your studies with natural voice commands
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Voice Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8 text-center">
                {/* Voice State Display */}
                <div className="mb-8">
                  <div
                    className={cn(
                      "w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-300",
                      voiceState === "listening"
                        ? "bg-red-100 animate-pulse"
                        : voiceState === "processing"
                          ? "bg-yellow-100"
                          : voiceState === "speaking"
                            ? "bg-green-100 animate-pulse"
                            : "bg-primary/10",
                    )}
                  >
                    {voiceState === "listening" ? (
                      <div className="relative">
                        <Mic className="w-12 h-12 text-red-600" />
                        <div className="absolute -inset-2 border-2 border-red-600 rounded-full animate-ping"></div>
                      </div>
                    ) : voiceState === "processing" ? (
                      <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : voiceState === "speaking" ? (
                      <Volume2 className="w-12 h-12 text-green-600" />
                    ) : (
                      <Mic className="w-12 h-12 text-primary" />
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">
                      {voiceState === "listening" && "Listening..."}
                      {voiceState === "processing" && "Processing..."}
                      {voiceState === "speaking" && "Speaking..."}
                      {voiceState === "idle" && "Tap to speak"}
                    </h3>

                    {transcript && (
                      <p className="text-muted-foreground mt-2 italic">
                        "{transcript}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Voice Controls */}
                <div className="space-y-4">
                  {voiceState === "idle" ? (
                    <Button
                      size="lg"
                      onClick={startListening}
                      className="px-8 py-4 text-lg"
                    >
                      <Mic className="w-6 h-6 mr-3" />
                      Start Voice Command
                    </Button>
                  ) : isListening ? (
                    <Button
                      size="lg"
                      onClick={stopListening}
                      variant="destructive"
                      className="px-8 py-4 text-lg"
                    >
                      <MicOff className="w-6 h-6 mr-3" />
                      Stop Listening
                    </Button>
                  ) : (
                    <Button size="lg" disabled className="px-8 py-4 text-lg">
                      {voiceState === "processing"
                        ? "Processing..."
                        : "Speaking..."}
                    </Button>
                  )}

                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                    >
                      {voiceEnabled ? (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" />
                          Voice responses on
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4 mr-2" />
                          Voice responses off
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Commands */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickCommands.map((cmd, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto p-4"
                      onClick={() => processVoiceCommand(cmd.text)}
                    >
                      <cmd.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span className="text-sm">{cmd.text}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Command History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {commands.map((cmd) => {
                      const CategoryIcon = getCategoryIcon(cmd.category);
                      return (
                        <div key={cmd.id} className="p-3 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <CategoryIcon className="w-4 h-4" />
                            <Badge
                              variant="secondary"
                              className={getCategoryColor(cmd.category)}
                            >
                              {cmd.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {cmd.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <strong>You:</strong> "{cmd.command}"
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <strong>Assistant:</strong> {cmd.response}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Voice Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Command Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Schedule</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>"What's my schedule today?"</li>
                  <li>"When is my next study session?"</li>
                  <li>"Plan my week"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Study</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>"Quiz me on DBMS"</li>
                  <li>"Explain operating systems"</li>
                  <li>"What should I study next?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Progress</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>"How am I doing?"</li>
                  <li>"Show my progress"</li>
                  <li>"What's my streak?"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Controls</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>"Start focus timer"</li>
                  <li>"Take a break"</li>
                  <li>"Open my subjects"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
