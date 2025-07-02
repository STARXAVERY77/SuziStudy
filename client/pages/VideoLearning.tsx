import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Settings,
  BookOpen,
  FileText,
  Clock,
  Tag,
  Download,
  Share,
  Bookmark,
  MessageSquare,
  Brain,
  Zap,
  Upload,
  Link,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface VideoLesson {
  id: string;
  title: string;
  url: string;
  videoId: string; // YouTube video ID
  subject: string;
  topic: string;
  duration: string;
  addedDate: Date;
  notes: Note[];
  transcript: TranscriptSegment[];
  tags: string[];
  bookmarks: Bookmark[];
  attachments: Attachment[];
  aiSummary: string;
  concepts: string[];
  difficulty: number; // 1-10
}

interface Note {
  id: string;
  timestamp: number; // seconds
  content: string;
  type: "note" | "question" | "key-point" | "summary";
  tags: string[];
  createdAt: Date;
}

interface TranscriptSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

interface Bookmark {
  id: string;
  timestamp: number;
  title: string;
  description?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "doc";
  url: string;
  uploadDate: Date;
}

const sampleVideos: VideoLesson[] = [
  {
    id: "1",
    title: "MIT 6.006 Introduction to Algorithms - Lecture 1",
    url: "https://www.youtube.com/watch?v=HtSuA80QTyo",
    videoId: "HtSuA80QTyo",
    subject: "DSA",
    topic: "Algorithm Analysis",
    duration: "1:23:45",
    addedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    notes: [
      {
        id: "n1",
        timestamp: 120,
        content:
          "Big O notation - describes the upper bound of algorithm complexity. Important for comparing algorithms.",
        type: "key-point",
        tags: ["big-o", "complexity"],
        createdAt: new Date(),
      },
      {
        id: "n2",
        timestamp: 300,
        content:
          "Why do we ignore constants and lower-order terms in Big O analysis?",
        type: "question",
        tags: ["big-o", "theory"],
        createdAt: new Date(),
      },
      {
        id: "n3",
        timestamp: 450,
        content:
          "Master theorem is used for solving divide-and-conquer recurrence relations.",
        type: "note",
        tags: ["master-theorem", "recurrence"],
        createdAt: new Date(),
      },
    ],
    transcript: [
      {
        id: "t1",
        startTime: 0,
        endTime: 30,
        text: "Welcome to Introduction to Algorithms. I'm Erik Demaine, and today we'll start with algorithm analysis.",
      },
      {
        id: "t2",
        startTime: 30,
        endTime: 60,
        text: "Algorithm analysis is about predicting the resources that an algorithm requires, primarily time and space.",
      },
      {
        id: "t3",
        startTime: 120,
        endTime: 180,
        text: "Big O notation gives us a way to describe the upper bound of an algorithm's running time as a function of input size.",
      },
    ],
    tags: ["algorithms", "complexity", "analysis", "mit"],
    bookmarks: [
      {
        id: "b1",
        timestamp: 120,
        title: "Big O Introduction",
        description: "First explanation of Big O notation",
      },
      {
        id: "b2",
        timestamp: 600,
        title: "Master Theorem",
        description: "Introduction to Master Theorem",
      },
    ],
    attachments: [
      {
        id: "a1",
        name: "Lecture 1 Slides.pdf",
        type: "pdf",
        url: "/attachments/lecture1-slides.pdf",
        uploadDate: new Date(),
      },
    ],
    aiSummary:
      "This lecture introduces fundamental concepts of algorithm analysis including asymptotic notation (Big O, Ω, Θ), worst-case analysis, and the Master Theorem for solving recurrence relations.",
    concepts: ["Big O Notation", "Algorithm Analysis", "Master Theorem"],
    difficulty: 7,
  },
];

export default function VideoLearning() {
  const [videos, setVideos] = useState<VideoLesson[]>(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(
    videos[0],
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<Note["type"]>("note");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const youtubeRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = ["All", "DSA", "DBMS", "OS", "Math"];

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject =
      !selectedSubject ||
      selectedSubject === "All" ||
      video.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const addNewVideo = () => {
    if (!newVideoUrl.trim()) return;

    const videoId = extractVideoId(newVideoUrl);
    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    const newVideo: VideoLesson = {
      id: Date.now().toString(),
      title: "Loading video details...",
      url: newVideoUrl,
      videoId,
      subject: "DSA",
      topic: "New Video",
      duration: "Unknown",
      addedDate: new Date(),
      notes: [],
      transcript: [],
      tags: ["youtube"],
      bookmarks: [],
      attachments: [],
      aiSummary: "Processing video with AI...",
      concepts: [],
      difficulty: 5,
    };

    setVideos((prev) => [newVideo, ...prev]);
    setSelectedVideo(newVideo);
    setNewVideoUrl("");

    // Simulate loading video details
    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === newVideo.id
            ? {
                ...v,
                title: "User Added Video - AI Analysis Complete",
                duration: "45:32",
                aiSummary:
                  "AI analysis complete. Video covers important concepts with practical examples.",
                concepts: [
                  "Key Concept 1",
                  "Important Topic",
                  "Advanced Theory",
                ],
              }
            : v,
        ),
      );
    }, 3000);
  };

  const addNote = () => {
    if (!noteContent.trim() || !selectedVideo) return;

    const newNote: Note = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: noteContent,
      type: noteType,
      tags: [],
      createdAt: new Date(),
    };

    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id ? { ...v, notes: [...v.notes, newNote] } : v,
      ),
    );

    setSelectedVideo((prev) =>
      prev ? { ...prev, notes: [...prev.notes, newNote] } : null,
    );

    setNoteContent("");
  };

  const addBookmark = () => {
    if (!selectedVideo) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      timestamp: currentTime,
      title: `Bookmark at ${formatTime(currentTime)}`,
      description: "Important moment",
    };

    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id
          ? { ...v, bookmarks: [...v.bookmarks, newBookmark] }
          : v,
      ),
    );

    setSelectedVideo((prev) =>
      prev ? { ...prev, bookmarks: [...prev.bookmarks, newBookmark] } : null,
    );
  };

  const jumpToTime = (timestamp: number) => {
    setCurrentTime(timestamp);
    // In a real implementation, you'd control the YouTube player
    console.log(`Jumping to ${formatTime(timestamp)}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getNoteTypeColor = (type: Note["type"]) => {
    switch (type) {
      case "key-point":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "question":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "summary":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getNoteTypeIcon = (type: Note["type"]) => {
    switch (type) {
      case "key-point":
        return "⭐";
      case "question":
        return "❓";
      case "summary":
        return "📝";
      default:
        return "📋";
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedVideo) return;

    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("image")
          ? "image"
          : "doc",
      url: URL.createObjectURL(file),
      uploadDate: new Date(),
    };

    setVideos((prev) =>
      prev.map((v) =>
        v.id === selectedVideo.id
          ? { ...v, attachments: [...v.attachments, newAttachment] }
          : v,
      ),
    );

    setSelectedVideo((prev) =>
      prev
        ? { ...prev, attachments: [...prev.attachments, newAttachment] }
        : null,
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Video Learning Studio</h1>
            <p className="text-muted-foreground">
              YouTube integration with synchronized notes and AI transcription
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.png,.doc,.docx"
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button>
              <Brain className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
        </div>

        {/* Add New Video */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Paste YouTube URL here..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                />
              </div>
              <Button onClick={addNewVideo}>
                <Link className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search videos..."
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
          {/* Video List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Video Library ({filteredVideos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredVideos.map((video) => (
                      <div
                        key={video.id}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          selectedVideo?.id === video.id &&
                            "border-primary bg-primary/5",
                        )}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{video.subject}</Badge>
                            <Badge variant="outline">{video.duration}</Badge>
                          </div>
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
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Export Notes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <h3 className="font-medium text-sm mb-1 line-clamp-2">
                          {video.title}
                        </h3>

                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                          <span>{video.topic}</span>
                          <span>���</span>
                          <span>{video.notes.length} notes</span>
                          <span>•</span>
                          <span>{video.bookmarks.length} bookmarks</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Difficulty: {video.difficulty}/10</span>
                          <span>{video.addedDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Video Player and Content */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="space-y-4">
                {/* Video Player */}
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.videoId}?enablejsapi=1`}
                        className="w-full h-full rounded-t-lg"
                        allowFullScreen
                        title={selectedVideo.title}
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2">
                        {selectedVideo.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Duration: {selectedVideo.duration}</span>
                        <span>•</span>
                        <span>Subject: {selectedVideo.subject}</span>
                        <span>•</span>
                        <span>Topic: {selectedVideo.topic}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs for Notes, Transcript, etc. */}
                <Tabs defaultValue="notes" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                    <TabsTrigger value="attachments">Files</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notes" className="space-y-4">
                    {/* Add Note */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Add Note</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Type:</span>
                          {(
                            [
                              "note",
                              "question",
                              "key-point",
                              "summary",
                            ] as const
                          ).map((type) => (
                            <Button
                              key={type}
                              variant={
                                noteType === type ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setNoteType(type)}
                            >
                              {getNoteTypeIcon(type)} {type}
                            </Button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Add your note here..."
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Current time: {formatTime(currentTime)}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" onClick={addBookmark}>
                              <Bookmark className="w-4 h-4 mr-2" />
                              Bookmark
                            </Button>
                            <Button onClick={addNote}>
                              <FileText className="w-4 h-4 mr-2" />
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notes List */}
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Notes ({selectedVideo.notes.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <div className="space-y-3">
                            {selectedVideo.notes
                              .sort((a, b) => a.timestamp - b.timestamp)
                              .map((note) => (
                                <div
                                  key={note.id}
                                  className={cn(
                                    "p-3 border-l-4 rounded-lg cursor-pointer hover:bg-muted/50",
                                    getNoteTypeColor(note.type),
                                  )}
                                  onClick={() => jumpToTime(note.timestamp)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {getNoteTypeIcon(note.type)} {note.type}
                                      </Badge>
                                      <span className="text-sm font-medium">
                                        {formatTime(note.timestamp)}
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        jumpToTime(note.timestamp);
                                      }}
                                    >
                                      <Play className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="text-sm">{note.content}</p>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {note.createdAt.toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transcript" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Video Transcript</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-64">
                          <div className="space-y-2">
                            {selectedVideo.transcript.map((segment) => (
                              <div
                                key={segment.id}
                                className="p-2 hover:bg-muted/50 rounded cursor-pointer"
                                onClick={() => jumpToTime(segment.startTime)}
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-primary">
                                    {formatTime(segment.startTime)}
                                  </span>
                                  {segment.speaker && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {segment.speaker}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm">{segment.text}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="bookmarks" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Bookmarks ({selectedVideo.bookmarks.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedVideo.bookmarks.map((bookmark) => (
                            <div
                              key={bookmark.id}
                              className="flex items-center space-x-4 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                              onClick={() => jumpToTime(bookmark.timestamp)}
                            >
                              <Bookmark className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {bookmark.title}
                                </h4>
                                {bookmark.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {bookmark.description}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm font-medium">
                                {formatTime(bookmark.timestamp)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attachments" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Attached Files ({selectedVideo.attachments.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedVideo.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-4 p-3 border rounded-lg"
                            >
                              <FileText className="w-4 h-4" />
                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {attachment.name}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {attachment.type.toUpperCase()} •{" "}
                                  {attachment.uploadDate.toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="w-5 h-5" />
                          <span>AI Summary & Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Summary</h3>
                          <p className="text-sm text-muted-foreground">
                            {selectedVideo.aiSummary}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Key Concepts</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedVideo.concepts.map((concept) => (
                              <Badge key={concept} variant="secondary">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">
                            Difficulty Assessment
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${selectedVideo.difficulty * 10}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {selectedVideo.difficulty}/10
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button>
                            <Zap className="w-4 h-4 mr-2" />
                            Generate Flashcards
                          </Button>
                          <Button variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Ask AI Questions
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Play className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a video to start learning
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a video from your library or add a new YouTube video
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
