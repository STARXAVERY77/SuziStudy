import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {
  Brain,
  HardDrive,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  Lock,
  Unlock,
  Star,
  Clock,
  Tag,
  FileText,
  Database,
  Zap,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  RefreshCcw,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryRecord {
  id: string;
  content: string;
  type: "personal" | "academic" | "preference" | "behavioral" | "emotional";
  category: string;
  importance: number; // 1-10
  confidence: number; // 0-1
  lastAccessed: Date;
  createdAt: Date;
  sources: string[]; // Where this memory came from
  tags: string[];
  isProtected: boolean; // User-marked as important
  vectorEmbedding?: number[]; // Simulated vector for semantic search
  relatedMemories: string[]; // IDs of related memories
  accessCount: number;
  isEncrypted: boolean;
}

interface MemoryCluster {
  id: string;
  name: string;
  description: string;
  memories: string[];
  centralTheme: string;
  strength: number; // How well connected the memories are
}

const sampleMemories: MemoryRecord[] = [
  {
    id: "1",
    content:
      "Alex struggles with database normalization but excels at SQL queries. Prefers visual explanations with examples.",
    type: "academic",
    category: "Learning Patterns",
    importance: 9,
    confidence: 0.95,
    lastAccessed: new Date(Date.now() - 60000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    sources: ["Chat History", "Quiz Results", "Study Sessions"],
    tags: ["DBMS", "learning-style", "difficulty-areas"],
    isProtected: true,
    relatedMemories: ["2", "3"],
    accessCount: 47,
    isEncrypted: false,
  },
  {
    id: "2",
    content:
      "Best study times are 9-11 AM and 4-6 PM. Energy drops significantly after lunch (1-2 PM).",
    type: "behavioral",
    category: "Schedule Patterns",
    importance: 8,
    confidence: 0.88,
    lastAccessed: new Date(Date.now() - 30 * 60000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    sources: ["Activity Tracking", "Focus Timer", "Self-reported data"],
    tags: ["energy-patterns", "productivity", "schedule"],
    isProtected: false,
    relatedMemories: ["4", "5"],
    accessCount: 23,
    isEncrypted: false,
  },
  {
    id: "3",
    content:
      "Responds well to encouragement when frustrated. Motivation drops when comparing to others.",
    type: "emotional",
    category: "Emotional Patterns",
    importance: 7,
    confidence: 0.75,
    lastAccessed: new Date(Date.now() - 2 * 60 * 60000),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    sources: ["Mood Tracking", "Chat Analysis", "Voice Assistant"],
    tags: ["motivation", "emotional-support", "personality"],
    isProtected: true,
    relatedMemories: ["1"],
    accessCount: 15,
    isEncrypted: true,
  },
  {
    id: "4",
    content:
      "Goal: Master all DBMS concepts by March 15th for final exam. Wants to achieve 85%+ score.",
    type: "personal",
    category: "Goals & Aspirations",
    importance: 10,
    confidence: 1.0,
    lastAccessed: new Date(Date.now() - 5 * 60000),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    sources: ["User Input", "Goal Setting"],
    tags: ["goals", "exams", "DBMS", "targets"],
    isProtected: true,
    relatedMemories: ["1", "2"],
    accessCount: 8,
    isEncrypted: false,
  },
  {
    id: "5",
    content:
      "Prefers Pomodoro technique (25min) over longer study sessions. Gets distracted after 45 minutes.",
    type: "preference",
    category: "Study Preferences",
    importance: 6,
    confidence: 0.82,
    lastAccessed: new Date(Date.now() - 24 * 60 * 60000),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    sources: ["Focus Timer Data", "User Preferences"],
    tags: ["pomodoro", "focus", "study-techniques"],
    isProtected: false,
    relatedMemories: ["2"],
    accessCount: 31,
    isEncrypted: false,
  },
];

const memoryClusters: MemoryCluster[] = [
  {
    id: "cluster-1",
    name: "DBMS Learning Profile",
    description:
      "Understanding of Alex's database learning patterns and challenges",
    memories: ["1", "4"],
    centralTheme: "Database learning and goals",
    strength: 0.92,
  },
  {
    id: "cluster-2",
    name: "Productivity Patterns",
    description: "Energy levels, optimal study times, and focus preferences",
    memories: ["2", "5"],
    centralTheme: "Daily productivity and schedule optimization",
    strength: 0.78,
  },
  {
    id: "cluster-3",
    name: "Emotional Intelligence",
    description: "Motivation patterns and emotional responses to learning",
    memories: ["3"],
    centralTheme: "Emotional support and motivation strategies",
    strength: 0.65,
  },
];

export default function MemoryManager() {
  const [memories, setMemories] = useState<MemoryRecord[]>(sampleMemories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showProtectedOnly, setShowProtectedOnly] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryRecord | null>(
    null,
  );

  const types = [
    "personal",
    "academic",
    "preference",
    "behavioral",
    "emotional",
  ];
  const categories = [...new Set(memories.map((m) => m.category))];

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch =
      !searchQuery ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesType = !selectedType || memory.type === selectedType;
    const matchesCategory =
      !selectedCategory || memory.category === selectedCategory;
    const matchesProtected = !showProtectedOnly || memory.isProtected;

    return matchesSearch && matchesType && matchesCategory && matchesProtected;
  });

  const deleteMemory = (memoryId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
  };

  const toggleProtection = (memoryId: string) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId ? { ...m, isProtected: !m.isProtected } : m,
      ),
    );
  };

  const toggleEncryption = (memoryId: string) => {
    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId ? { ...m, isEncrypted: !m.isEncrypted } : m,
      ),
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "personal":
        return "bg-blue-100 text-blue-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "preference":
        return "bg-purple-100 text-purple-800";
      case "behavioral":
        return "bg-orange-100 text-orange-800";
      case "emotional":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "text-red-600";
    if (importance >= 6) return "text-yellow-600";
    return "text-green-600";
  };

  const totalMemorySize = memories.length;
  const protectedMemories = memories.filter((m) => m.isProtected).length;
  const encryptedMemories = memories.filter((m) => m.isEncrypted).length;
  const averageImportance =
    memories.reduce((sum, m) => sum + m.importance, 0) / memories.length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Memory Manager</h1>
            <p className="text-muted-foreground">
              Manage your personal AI learning data and privacy controls
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete All Memories?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all AI memories. This action
                    cannot be undone. Your AI will lose all personalization and
                    learning about your preferences.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalMemorySize}</div>
                  <p className="text-sm text-muted-foreground">
                    Total Memories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{protectedMemories}</div>
                  <p className="text-sm text-muted-foreground">Protected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{encryptedMemories}</div>
                  <p className="text-sm text-muted-foreground">Encrypted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {averageImportance.toFixed(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Avg Importance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memory Clusters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Memory Clusters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {memoryClusters.map((cluster) => (
                <div key={cluster.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{cluster.name}</h3>
                    <Badge variant="outline">
                      {cluster.memories.length} memories
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {cluster.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Connection Strength</span>
                      <span>{(cluster.strength * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={cluster.strength * 100} className="h-2" />
                  </div>
                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {cluster.centralTheme}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search memories and tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Type:</span>
                <Button
                  variant={!selectedType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(null)}
                >
                  All
                </Button>
                {types.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showProtectedOnly}
                  onChange={(e) => setShowProtectedOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Protected only</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Memory List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  Memory Records ({filteredMemories.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {filteredMemories.map((memory) => (
                      <div
                        key={memory.id}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          selectedMemory?.id === memory.id &&
                            "border-primary bg-primary/5",
                        )}
                        onClick={() => setSelectedMemory(memory)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={getTypeColor(memory.type)}
                            >
                              {memory.type}
                            </Badge>
                            <Badge variant="outline">{memory.category}</Badge>
                            {memory.isProtected && (
                              <Shield className="w-4 h-4 text-green-600" />
                            )}
                            {memory.isEncrypted && (
                              <Lock className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star
                              className={cn(
                                "w-4 h-4",
                                getImportanceColor(memory.importance),
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium",
                                getImportanceColor(memory.importance),
                              )}
                            >
                              {memory.importance}/10
                            </span>
                          </div>
                        </div>

                        <p
                          className="text-sm mb-3 overflow-hidden text-ellipsis"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {memory.isEncrypted
                            ? "🔒 Encrypted content"
                            : memory.content}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {memory.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <span>Accessed {memory.accessCount} times</span>
                            <span>
                              Confidence: {(memory.confidence * 100).toFixed(0)}
                              %
                            </span>
                          </div>
                          <span>
                            {memory.lastAccessed.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-end space-x-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleProtection(memory.id);
                            }}
                          >
                            {memory.isProtected ? (
                              <Shield className="w-4 h-4 text-green-600" />
                            ) : (
                              <Shield className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEncryption(memory.id);
                            }}
                          >
                            {memory.isEncrypted ? (
                              <Lock className="w-4 h-4 text-orange-600" />
                            ) : (
                              <Unlock className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Memory?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this memory. The
                                  AI will lose this information about you.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground"
                                  onClick={() => deleteMemory(memory.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Memory Details Sidebar */}
          <div className="space-y-6">
            {selectedMemory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5" />
                    <span>Memory Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Content</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedMemory.isEncrypted
                        ? "🔒 Encrypted content"
                        : selectedMemory.content}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Metadata</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <Badge
                          variant="secondary"
                          className={getTypeColor(selectedMemory.type)}
                        >
                          {selectedMemory.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Importance:</span>
                        <span
                          className={getImportanceColor(
                            selectedMemory.importance,
                          )}
                        >
                          {selectedMemory.importance}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span>
                          {(selectedMemory.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Access Count:</span>
                        <span>{selectedMemory.accessCount}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Sources</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedMemory.sources.map((source) => (
                        <Badge
                          key={source}
                          variant="outline"
                          className="text-xs"
                        >
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Related Memories</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedMemory.relatedMemories.length} connected memories
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>
                        Created: {selectedMemory.createdAt.toLocaleString()}
                      </div>
                      <div>
                        Last accessed:{" "}
                        {selectedMemory.lastAccessed.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Data Usage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Reset AI Learning
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Memory Analytics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Privacy Audit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>{((totalMemorySize / 1000) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress
                    value={(totalMemorySize / 1000) * 100}
                    className="h-2"
                  />
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Data Retention:</span>
                    <span>30 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-cleanup:</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Encryption:</span>
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      Selective
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
