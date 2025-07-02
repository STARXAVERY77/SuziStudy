import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Video,
  Mic,
  Brain,
  Download,
  Search,
  Sparkles,
  Play,
  Pause,
  Volume2,
  Eye,
  MessageSquare,
  Zap,
  BookOpen,
  Clock,
  Tag,
  Star,
  Share,
  MoreVertical,
  Trash2,
  Edit,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DocumentAnalysis {
  id: string;
  title: string;
  type: "pdf" | "video" | "audio" | "youtube";
  subject: string;
  topic: string;
  uploadDate: Date;
  fileSize?: string;
  duration?: string;
  url?: string;
  transcription?: string;
  summary: string;
  keyPoints: string[];
  flashcards: Flashcard[];
  questions: Question[];
  notes: string;
  tags: string[];
  processingStatus: "processing" | "completed" | "failed";
  aiAnalysis: {
    complexity: number; // 1-10
    concepts: string[];
    prerequisites: string[];
    recommendations: string[];
  };
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  confidence: number;
}

interface Question {
  id: string;
  question: string;
  answer: string;
  type: "mcq" | "short" | "long" | "fill";
  difficulty: number;
}

const sampleDocuments: DocumentAnalysis[] = [
  {
    id: "1",
    title: "Database Normalization Complete Guide.pdf",
    type: "pdf",
    subject: "DBMS",
    topic: "Normalization",
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    fileSize: "15.2 MB",
    transcription: "",
    summary:
      "Comprehensive guide covering 1NF, 2NF, 3NF, and BCNF with practical examples. Explains functional dependencies, decomposition rules, and normalization algorithms.",
    keyPoints: [
      "First Normal Form (1NF) eliminates repeating groups",
      "Second Normal Form (2NF) removes partial dependencies",
      "Third Normal Form (3NF) eliminates transitive dependencies",
      "BCNF ensures every determinant is a candidate key",
      "Normalization reduces redundancy and prevents anomalies",
    ],
    flashcards: [
      {
        id: "f1",
        front: "What is First Normal Form (1NF)?",
        back: "A relation is in 1NF if it contains only atomic (indivisible) values and has no repeating groups of columns.",
        confidence: 0.8,
      },
      {
        id: "f2",
        front: "Define functional dependency",
        back: "A functional dependency X → Y means that for any two tuples with the same X value, they must have the same Y value.",
        confidence: 0.6,
      },
    ],
    questions: [
      {
        id: "q1",
        question:
          "Which normal form eliminates partial dependencies on the primary key?",
        answer: "Second Normal Form (2NF)",
        type: "short",
        difficulty: 3,
      },
      {
        id: "q2",
        question:
          "Explain the process of converting a table from 2NF to 3NF with an example.",
        answer:
          "To convert from 2NF to 3NF, eliminate transitive dependencies by creating separate tables for transitively dependent attributes...",
        type: "long",
        difficulty: 4,
      },
    ],
    notes: "",
    tags: ["database", "normalization", "sql", "design"],
    processingStatus: "completed",
    aiAnalysis: {
      complexity: 7,
      concepts: ["Functional Dependencies", "Normal Forms", "Database Design"],
      prerequisites: ["Basic SQL", "Relational Model"],
      recommendations: [
        "Practice with real database examples",
        "Review relational algebra concepts",
        "Study denormalization scenarios",
      ],
    },
  },
  {
    id: "2",
    title: "MIT 6.006 - Introduction to Algorithms Lecture 1",
    type: "youtube",
    subject: "DSA",
    topic: "Algorithm Analysis",
    uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: "1:23:45",
    url: "https://www.youtube.com/watch?v=HtSuA80QTyo",
    transcription:
      "Welcome to Introduction to Algorithms. Today we'll cover the mathematical foundations of algorithm analysis including asymptotic notation, Big O, Omega, and Theta notations...",
    summary:
      "Introduction to algorithm analysis, asymptotic notation (Big O, Ω, Θ), and basic complexity theory. Covers worst-case, best-case, and average-case analysis.",
    keyPoints: [
      "Big O notation describes upper bound of algorithm complexity",
      "Omega notation describes lower bound",
      "Theta notation describes tight bound",
      "Worst-case analysis is most commonly used",
      "Master theorem for divide-and-conquer recurrences",
    ],
    flashcards: [
      {
        id: "f3",
        front: "What does O(n²) mean?",
        back: "The algorithm's running time grows at most quadratically with input size n in the worst case.",
        confidence: 0.9,
      },
    ],
    questions: [
      {
        id: "q3",
        question: "What is the time complexity of binary search?",
        answer: "O(log n)",
        type: "short",
        difficulty: 2,
      },
    ],
    notes:
      "# Algorithm Analysis Notes\n\n## Big O Notation\n- Describes upper bound\n- Ignore constants and lower-order terms\n\n## Common Complexities\n- O(1) - Constant\n- O(log n) - Logarithmic\n- O(n) - Linear\n- O(n log n) - Linearithmic\n- O(n²) - Quadratic",
    tags: ["algorithms", "complexity", "big-o", "analysis"],
    processingStatus: "completed",
    aiAnalysis: {
      complexity: 8,
      concepts: ["Asymptotic Analysis", "Time Complexity", "Space Complexity"],
      prerequisites: ["Basic Mathematics", "Programming Fundamentals"],
      recommendations: [
        "Practice calculating time complexities",
        "Solve problems on different complexity classes",
        "Study common algorithm patterns",
      ],
    },
  },
  {
    id: "3",
    title: "Operating Systems Lecture Recording.mp3",
    type: "audio",
    subject: "OS",
    topic: "Process Management",
    uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    fileSize: "45.8 MB",
    duration: "1:15:30",
    transcription:
      "Today we're discussing process management in operating systems. A process is a program in execution with its own memory space, including code, data, heap, and stack segments...",
    summary:
      "Covers process lifecycle, process control blocks, context switching, and inter-process communication mechanisms.",
    keyPoints: [
      "Process vs Program distinction",
      "Process states: New, Ready, Running, Waiting, Terminated",
      "Context switching overhead",
      "Process Control Block (PCB) structure",
      "IPC mechanisms: pipes, shared memory, message passing",
    ],
    flashcards: [],
    questions: [],
    notes: "",
    tags: ["operating-systems", "processes", "ipc", "context-switching"],
    processingStatus: "processing",
    aiAnalysis: {
      complexity: 6,
      concepts: ["Process Management", "Context Switching", "IPC"],
      prerequisites: ["Computer Architecture", "Programming"],
      recommendations: [
        "Implement simple process scheduler",
        "Study real OS implementations",
        "Practice process synchronization problems",
      ],
    },
  },
];

export default function DocumentAnalysis() {
  const [documents, setDocuments] =
    useState<DocumentAnalysis[]>(sampleDocuments);
  const [selectedDocument, setSelectedDocument] = useState<
    DocumentAnalysis | undefined
  >(documents[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ["All", "DBMS", "DSA", "OS", "Math"];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesSubject =
      !selectedSubject ||
      selectedSubject === "All" ||
      doc.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const newDoc: DocumentAnalysis = {
        id: Date.now().toString(),
        title: file.name,
        type: file.type.includes("pdf")
          ? "pdf"
          : file.type.includes("audio")
            ? "audio"
            : "pdf",
        subject: "DBMS",
        topic: "New Topic",
        uploadDate: new Date(),
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        summary: "Processing document with AI...",
        keyPoints: [],
        flashcards: [],
        questions: [],
        notes: "",
        tags: ["uploaded"],
        processingStatus: "processing",
        aiAnalysis: {
          complexity: 5,
          concepts: [],
          prerequisites: [],
          recommendations: [],
        },
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocument(newDoc);

      // Simulate completion
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === newDoc.id
              ? {
                  ...d,
                  processingStatus: "completed" as const,
                  summary:
                    "AI analysis completed. Document contains advanced concepts with practical examples.",
                  keyPoints: [
                    "Key concept 1 identified",
                    "Important definition found",
                    "Practical example extracted",
                  ],
                }
              : d,
          ),
        );
      }, 5000);

      setIsProcessing(false);
    }, 2000);
  };

  const handleYouTubeAdd = () => {
    if (!youtubeUrl.trim()) return;

    const newDoc: DocumentAnalysis = {
      id: Date.now().toString(),
      title: "YouTube Video Analysis",
      type: "youtube",
      subject: "DSA",
      topic: "Video Learning",
      uploadDate: new Date(),
      url: youtubeUrl,
      duration: "Unknown",
      summary: "Processing YouTube video...",
      keyPoints: [],
      flashcards: [],
      questions: [],
      notes: "",
      tags: ["youtube", "video"],
      processingStatus: "processing",
      aiAnalysis: {
        complexity: 5,
        concepts: [],
        prerequisites: [],
        recommendations: [],
      },
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setYoutubeUrl("");
  };

  const generateFlashcards = (docId: string, count: number) => {
    // Simulate AI flashcard generation
    const newFlashcards: Flashcard[] = Array.from(
      { length: count },
      (_, i) => ({
        id: `generated-${i}`,
        front: `Generated question ${i + 1} based on document content`,
        back: `AI-generated answer explaining the concept in detail`,
        confidence: Math.random(),
      }),
    );

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, flashcards: [...d.flashcards, ...newFlashcards] }
          : d,
      ),
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "youtube":
      case "video":
        return Video;
      case "audio":
        return Mic;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "bg-red-100 text-red-800";
      case "youtube":
      case "video":
        return "bg-blue-100 text-blue-800";
      case "audio":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Document Analysis</h1>
            <p className="text-muted-foreground">
              AI-powered analysis of PDFs, videos, and audio with unlimited
              context
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.mp3,.wav,.m4a,.mp4"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <Button disabled={isProcessing}>
              <Brain className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
            <CardContent
              className="p-6 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">PDF Documents</h3>
              <p className="text-sm text-muted-foreground">
                Unlimited length textbooks, papers, notes
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <CardContent className="p-6">
              <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-2">YouTube Videos</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="YouTube URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" onClick={handleYouTubeAdd}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
            <CardContent
              className="p-6 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Mic className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">Audio Recordings</h3>
              <p className="text-sm text-muted-foreground">
                Up to 2 hours of lecture recordings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredDocuments.map((doc) => {
                      const TypeIcon = getTypeIcon(doc.type);
                      return (
                        <div
                          key={doc.id}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                            selectedDocument?.id === doc.id &&
                              "border-primary bg-primary/5",
                          )}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <TypeIcon className="w-4 h-4" />
                              <Badge
                                variant="secondary"
                                className={getTypeColor(doc.type)}
                              >
                                {doc.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              {doc.processingStatus === "processing" && (
                                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share className="w-4 h-4 mr-2" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <h3 className="font-medium text-sm mb-1 line-clamp-2">
                            {doc.title}
                          </h3>

                          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                            <Badge variant="outline">{doc.subject}</Badge>
                            <span>•</span>
                            <span>{doc.topic}</span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {doc.summary}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              {doc.fileSize && <span>{doc.fileSize}</span>}
                              {doc.duration && <span>{doc.duration}</span>}
                            </div>
                            <span>{doc.uploadDate.toLocaleDateString()}</span>
                          </div>

                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{doc.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <Tabs defaultValue="analysis" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="w-5 h-5" />
                          <span>AI Analysis</span>
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          {selectedDocument.type === "youtube" && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Open Video
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* YouTube Video Embed */}
                      {selectedDocument.type === "youtube" &&
                        selectedDocument.url && (
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${selectedDocument.url.split("v=")[1]?.split("&")[0] || ""}`}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                            />
                          </div>
                        )}

                      {/* Summary */}
                      <div>
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedDocument.summary}
                        </p>
                      </div>

                      {/* Key Points */}
                      <div>
                        <h3 className="font-medium mb-2">Key Points</h3>
                        <ul className="space-y-1">
                          {selectedDocument.keyPoints.map((point, index) => (
                            <li
                              key={index}
                              className="text-sm flex items-start"
                            >
                              <span className="text-primary mr-2">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Analysis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Complexity Level</h4>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={
                                selectedDocument.aiAnalysis.complexity * 10
                              }
                              className="flex-1"
                            />
                            <span className="text-sm font-medium">
                              {selectedDocument.aiAnalysis.complexity}/10
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Concepts</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedDocument.aiAnalysis.concepts.map(
                              (concept) => (
                                <Badge key={concept} variant="secondary">
                                  {concept}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Prerequisites</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedDocument.aiAnalysis.prerequisites.map(
                              (prereq) => (
                                <Badge key={prereq} variant="outline">
                                  {prereq}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <ul className="text-sm space-y-1">
                            {selectedDocument.aiAnalysis.recommendations.map(
                              (rec, index) => (
                                <li key={index} className="flex items-start">
                                  <Star className="w-3 h-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flashcards" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          Flashcards ({selectedDocument.flashcards.length})
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              generateFlashcards(selectedDocument.id, 5)
                            }
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Generate 5 Cards
                          </Button>
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4 mr-2" />
                            Study Mode
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {selectedDocument.flashcards.map((card) => (
                          <div key={card.id} className="border rounded-lg p-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-sm mb-1">
                                  Question:
                                </h4>
                                <p className="text-sm">{card.front}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1">
                                  Answer:
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {card.back}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs">Confidence:</span>
                                  <Progress
                                    value={card.confidence * 100}
                                    className="w-20 h-2"
                                  />
                                  <span className="text-xs">
                                    {Math.round(card.confidence * 100)}%
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <Button variant="ghost" size="sm">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Practice Questions ({selectedDocument.questions.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedDocument.questions.map((question) => (
                          <div
                            key={question.id}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge
                                variant={
                                  question.difficulty >= 4
                                    ? "destructive"
                                    : question.difficulty >= 3
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                Level {question.difficulty}
                              </Badge>
                              <Badge variant="outline">{question.type}</Badge>
                            </div>
                            <h4 className="font-medium mb-2">
                              {question.question}
                            </h4>
                            <div className="bg-muted/50 p-3 rounded">
                              <p className="text-sm">{question.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Add your notes here... (Supports Markdown)"
                        value={selectedDocument.notes}
                        onChange={(e) =>
                          setDocuments((prev) =>
                            prev.map((d) =>
                              d.id === selectedDocument.id
                                ? { ...d, notes: e.target.value }
                                : d,
                            ),
                          )
                        }
                        className="min-h-64"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transcript" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Transcript</CardTitle>
                        {(selectedDocument.type === "audio" ||
                          selectedDocument.type === "youtube") && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Audio Controls
                            </Button>
                            <Button variant="outline" size="sm">
                              <Volume2 className="w-4 h-4 mr-2" />
                              Text-to-Speech
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedDocument.transcription ||
                            "No transcript available for this document type."}
                        </p>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a document to analyze
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a document from the list to view AI analysis,
                    flashcards, and notes
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
