import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Upload,
  File,
  FileText,
  Image,
  Video,
  Link,
  Search,
  Filter,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  Plus,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface StudyMaterial {
  id: string;
  name: string;
  type: "pdf" | "doc" | "ppt" | "image" | "video" | "link";
  subject: string;
  size?: string;
  uploadDate: Date;
  lastAccessed?: Date;
  url?: string;
  description?: string;
  tags: string[];
  isProcessed: boolean;
  ocrText?: string;
}

const sampleMaterials: StudyMaterial[] = [
  {
    id: "1",
    name: "Database Normalization Guide.pdf",
    type: "pdf",
    subject: "DBMS",
    size: "2.4 MB",
    uploadDate: new Date("2024-01-10"),
    lastAccessed: new Date("2024-01-14"),
    tags: ["normalization", "theory", "fundamentals"],
    isProcessed: true,
    ocrText: "Database normalization is the process of organizing data...",
  },
  {
    id: "2",
    name: "Binary Trees Implementation",
    type: "link",
    subject: "DSA",
    uploadDate: new Date("2024-01-12"),
    url: "https://youtube.com/watch?v=example",
    description: "Comprehensive tutorial on binary tree operations",
    tags: ["trees", "implementation", "coding"],
    isProcessed: true,
  },
  {
    id: "3",
    name: "OS Process Management.ppt",
    type: "ppt",
    subject: "OS",
    size: "5.1 MB",
    uploadDate: new Date("2024-01-08"),
    lastAccessed: new Date("2024-01-13"),
    tags: ["processes", "scheduling", "memory"],
    isProcessed: true,
  },
  {
    id: "4",
    name: "Linear Algebra Handwritten Notes.jpg",
    type: "image",
    subject: "Math",
    size: "1.8 MB",
    uploadDate: new Date("2024-01-11"),
    tags: ["vectors", "matrices", "handwritten"],
    isProcessed: false,
  },
  {
    id: "5",
    name: "DBMS Lecture Recording.mp4",
    type: "video",
    subject: "DBMS",
    size: "145 MB",
    uploadDate: new Date("2024-01-09"),
    lastAccessed: new Date("2024-01-15"),
    tags: ["lecture", "sql", "queries"],
    isProcessed: false,
  },
];

export default function Materials() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(sampleMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subjects = ["All", "DBMS", "DSA", "OS", "Math"];
  const fileTypes = ["All", "pdf", "doc", "ppt", "image", "video", "link"];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      !selectedSubject ||
      selectedSubject === "All" ||
      material.subject === selectedSubject;
    const matchesType =
      !selectedType || selectedType === "All" || material.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getFileIcon = (type: StudyMaterial["type"]) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "doc":
        return File;
      case "ppt":
        return File;
      case "image":
        return Image;
      case "video":
        return Video;
      case "link":
        return Link;
      default:
        return File;
    }
  };

  const getFileColor = (type: StudyMaterial["type"]) => {
    switch (type) {
      case "pdf":
        return "text-red-600 bg-red-100";
      case "doc":
        return "text-blue-600 bg-blue-100";
      case "ppt":
        return "text-orange-600 bg-orange-100";
      case "image":
        return "text-green-600 bg-green-100";
      case "video":
        return "text-purple-600 bg-purple-100";
      case "link":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate file upload with OCR processing
    setTimeout(() => {
      const newMaterial: StudyMaterial = {
        id: Date.now().toString(),
        name: "New Study Material.pdf",
        type: "pdf",
        subject: "DBMS",
        size: "3.2 MB",
        uploadDate: new Date(),
        tags: ["new", "uploaded"],
        isProcessed: false,
      };
      setMaterials((prev) => [newMaterial, ...prev]);

      // Simulate OCR processing
      setTimeout(() => {
        setMaterials((prev) =>
          prev.map((m) =>
            m.id === newMaterial.id
              ? {
                  ...m,
                  isProcessed: true,
                  ocrText: "Extracted text from the document...",
                }
              : m,
          ),
        );
      }, 3000);

      setIsUploading(false);
    }, 1500);
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "DBMS":
        return "bg-red-100 text-red-800";
      case "DSA":
        return "bg-blue-100 text-blue-800";
      case "OS":
        return "bg-purple-100 text-purple-800";
      case "Math":
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
            <h1 className="text-3xl font-bold">Study Materials</h1>
            <p className="text-muted-foreground">
              Organize and access all your study resources in one place
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
            <Button onClick={handleFileUpload} disabled={isUploading}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Files"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Type:</span>
            {fileTypes.map((type) => (
              <Button
                key={type}
                variant={
                  selectedType === type || (!selectedType && type === "All")
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setSelectedType(type === "All" ? null : type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Upload Study Materials
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to select files
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button onClick={handleFileUpload}>Choose Files</Button>
              <span className="text-sm text-muted-foreground">or</span>
              <Button variant="outline">Add Web Link</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Supports PDF, DOC, PPT, images, videos. AI will extract text for
              better searchability.
            </p>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const FileIcon = getFileIcon(material.type);
            const fileColor = getFileColor(material.type);

            return (
              <Card
                key={material.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", fileColor)}>
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {material.name}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={getSubjectColor(material.subject)}
                          >
                            {material.subject}
                          </Badge>
                          {!material.isProcessed && (
                            <Badge variant="outline" className="text-xs">
                              Processing...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Study with AI
                        </DropdownMenuItem>
                        {material.type === "link" && (
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {material.description && (
                    <p className="text-sm text-muted-foreground">
                      {material.description}
                    </p>
                  )}

                  {material.url && (
                    <div className="flex items-center space-x-2 text-sm">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">{material.url}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {material.size && `${material.size} • `}
                      {material.uploadDate.toLocaleDateString()}
                    </span>
                    {material.lastAccessed && (
                      <span>
                        Last: {material.lastAccessed.toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {material.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {material.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {material.isProcessed && material.ocrText && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          AI Extracted Content
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {material.ocrText}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-3 h-3 mr-2" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      <BookOpen className="w-3 h-3 mr-2" />
                      Study
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No materials found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedSubject || selectedType
                  ? "Try adjusting your filters"
                  : "Upload your first study material to get started"}
              </p>
              {!searchTerm && !selectedSubject && !selectedType && (
                <Button onClick={handleFileUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Materials
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {materials.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Materials</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {materials.filter((m) => m.isProcessed).length}
              </div>
              <p className="text-sm text-muted-foreground">AI Processed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-info">
                {new Set(materials.map((m) => m.subject)).size}
              </div>
              <p className="text-sm text-muted-foreground">Subjects Covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {
                  materials.filter((m) =>
                    m.lastAccessed
                      ? new Date().getTime() - m.lastAccessed.getTime() <
                        7 * 24 * 60 * 60 * 1000
                      : false,
                  ).length
                }
              </div>
              <p className="text-sm text-muted-foreground">Recent Access</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
