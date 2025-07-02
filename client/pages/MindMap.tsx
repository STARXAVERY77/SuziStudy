import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import {
  GitBranch,
  Plus,
  Download,
  Zap,
  BookOpen,
  Brain,
  Expand,
  Shrink,
  RotateCcw,
  Palette,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: number;
  parentId?: string;
  children: string[];
  color: string;
  expanded: boolean;
}

interface MindMapData {
  id: string;
  title: string;
  subject: string;
  nodes: Record<string, MindMapNode>;
  rootNodeId: string;
  createdAt: Date;
  lastModified: Date;
}

const sampleMindMaps: MindMapData[] = [
  {
    id: "1",
    title: "Database Management Systems",
    subject: "DBMS",
    rootNodeId: "root-1",
    nodes: {
      "root-1": {
        id: "root-1",
        text: "Database Management Systems",
        x: 400,
        y: 300,
        level: 0,
        children: ["node-1", "node-2", "node-3", "node-4"],
        color: "bg-primary",
        expanded: true,
      },
      "node-1": {
        id: "node-1",
        text: "Data Models",
        x: 200,
        y: 200,
        level: 1,
        parentId: "root-1",
        children: ["node-1-1", "node-1-2"],
        color: "bg-blue-500",
        expanded: true,
      },
      "node-1-1": {
        id: "node-1-1",
        text: "Relational Model",
        x: 100,
        y: 150,
        level: 2,
        parentId: "node-1",
        children: [],
        color: "bg-blue-300",
        expanded: true,
      },
      "node-1-2": {
        id: "node-1-2",
        text: "NoSQL Models",
        x: 100,
        y: 250,
        level: 2,
        parentId: "node-1",
        children: [],
        color: "bg-blue-300",
        expanded: true,
      },
      "node-2": {
        id: "node-2",
        text: "Normalization",
        x: 600,
        y: 200,
        level: 1,
        parentId: "root-1",
        children: ["node-2-1", "node-2-2"],
        color: "bg-green-500",
        expanded: true,
      },
      "node-2-1": {
        id: "node-2-1",
        text: "1NF, 2NF, 3NF",
        x: 700,
        y: 150,
        level: 2,
        parentId: "node-2",
        children: [],
        color: "bg-green-300",
        expanded: true,
      },
      "node-2-2": {
        id: "node-2-2",
        text: "BCNF",
        x: 700,
        y: 250,
        level: 2,
        parentId: "node-2",
        children: [],
        color: "bg-green-300",
        expanded: true,
      },
      "node-3": {
        id: "node-3",
        text: "SQL",
        x: 200,
        y: 400,
        level: 1,
        parentId: "root-1",
        children: [],
        color: "bg-purple-500",
        expanded: true,
      },
      "node-4": {
        id: "node-4",
        text: "Transactions",
        x: 600,
        y: 400,
        level: 1,
        parentId: "root-1",
        children: [],
        color: "bg-red-500",
        expanded: true,
      },
    },
    createdAt: new Date("2024-01-10"),
    lastModified: new Date("2024-01-14"),
  },
];

export default function MindMap() {
  const [mindMaps, setMindMaps] = useState<MindMapData[]>(sampleMindMaps);
  const [selectedMindMap, setSelectedMindMap] = useState<MindMapData | null>(
    sampleMindMaps[0],
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("DBMS");
  const svgRef = useRef<SVGSVGElement>(null);

  const subjects = ["DBMS", "DSA", "OS", "Math"];

  const generateMindMap = async () => {
    if (!newTopic.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const newMindMap: MindMapData = {
        id: Date.now().toString(),
        title: newTopic,
        subject: selectedSubject,
        rootNodeId: "new-root",
        nodes: {
          "new-root": {
            id: "new-root",
            text: newTopic,
            x: 400,
            y: 300,
            level: 0,
            children: ["concept-1", "concept-2", "concept-3"],
            color: "bg-primary",
            expanded: true,
          },
          "concept-1": {
            id: "concept-1",
            text: "Key Concepts",
            x: 250,
            y: 200,
            level: 1,
            parentId: "new-root",
            children: [],
            color: "bg-blue-500",
            expanded: true,
          },
          "concept-2": {
            id: "concept-2",
            text: "Applications",
            x: 550,
            y: 200,
            level: 1,
            parentId: "new-root",
            children: [],
            color: "bg-green-500",
            expanded: true,
          },
          "concept-3": {
            id: "concept-3",
            text: "Examples",
            x: 400,
            y: 450,
            level: 1,
            parentId: "new-root",
            children: [],
            color: "bg-purple-500",
            expanded: true,
          },
        },
        createdAt: new Date(),
        lastModified: new Date(),
      };

      setMindMaps((prev) => [newMindMap, ...prev]);
      setSelectedMindMap(newMindMap);
      setNewTopic("");
      setIsGenerating(false);
    }, 3000);
  };

  const renderMindMap = () => {
    if (!selectedMindMap) return null;

    const { nodes, rootNodeId } = selectedMindMap;

    const renderNode = (nodeId: string) => {
      const node = nodes[nodeId];
      if (!node) return null;

      return (
        <g key={nodeId}>
          {/* Connections to children */}
          {node.children.map((childId) => {
            const childNode = nodes[childId];
            if (!childNode) return null;

            return (
              <line
                key={`${nodeId}-${childId}`}
                x1={node.x}
                y1={node.y}
                x2={childNode.x}
                y2={childNode.y}
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
              />
            );
          })}

          {/* Node */}
          <g transform={`translate(${node.x - 50}, ${node.y - 20})`}>
            <rect
              width="100"
              height="40"
              rx="20"
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                node.color,
                node.level === 0 ? "shadow-lg" : "shadow-md",
              )}
              fill="currentColor"
            />
            <text
              x="50"
              y="25"
              textAnchor="middle"
              className="text-white text-sm font-medium"
              style={{ fill: "white" }}
            >
              {node.text.length > 12
                ? node.text.substring(0, 12) + "..."
                : node.text}
            </text>
          </g>

          {/* Render children */}
          {node.expanded && node.children.map((childId) => renderNode(childId))}
        </g>
      );
    };

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-full border rounded-lg bg-background"
      >
        {renderNode(rootNodeId)}
      </svg>
    );
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
            <h1 className="text-3xl font-bold">Mind Map Generator</h1>
            <p className="text-muted-foreground">
              Create visual mind maps from your study topics using AI
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Generate New Mind Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter a topic (e.g., 'Database Normalization', 'Binary Trees')"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
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
              <Button
                onClick={generateMindMap}
                disabled={!newTopic.trim() || isGenerating}
              >
                <Brain className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>

            {isGenerating && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <div className="font-medium">
                      AI is analyzing your topic...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Creating connections and organizing concepts
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mind Map Canvas */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="w-5 h-5" />
                    <span>{selectedMindMap?.title || "Select a mind map"}</span>
                    {selectedMindMap && (
                      <Badge
                        variant="secondary"
                        className={getSubjectColor(selectedMindMap.subject)}
                      >
                        {selectedMindMap.subject}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Expand className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">{renderMindMap()}</div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Button variant="outline" className="w-full mb-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Click to add a new concept
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Button variant="outline" className="w-full mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Generate from Notes
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Create from uploaded materials
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Button variant="outline" className="w-full mb-2">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Expand
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Let AI add related concepts
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Saved Mind Maps */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Saved Mind Maps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mindMaps.map((mindMap) => (
                  <div
                    key={mindMap.id}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      selectedMindMap?.id === mindMap.id &&
                        "border-primary bg-primary/5",
                    )}
                    onClick={() => setSelectedMindMap(mindMap)}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <GitBranch className="w-4 h-4" />
                      <span className="font-medium text-sm truncate">
                        {mindMap.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={getSubjectColor(mindMap.subject)}
                      >
                        {mindMap.subject}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(mindMap.nodes).length} nodes
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {mindMap.lastModified.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mind Map Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Maps</span>
                  <span className="font-medium">{mindMaps.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Concepts</span>
                  <span className="font-medium">
                    {mindMaps.reduce(
                      (sum, map) => sum + Object.keys(map.nodes).length,
                      0,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subjects Covered</span>
                  <span className="font-medium">
                    {new Set(mindMaps.map((m) => m.subject)).size}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Most Used Subject</span>
                  <Badge
                    variant="secondary"
                    className={getSubjectColor("DBMS")}
                  >
                    DBMS
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
