import { AppLayout } from "@/components/layout/AppLayout";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { CreateSubjectDialog } from "@/components/subjects/CreateSubjectDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const subjects = [
  {
    id: 1,
    name: "Database Management Systems",
    shortName: "DBMS",
    description:
      "Comprehensive study of database concepts, normalization, and SQL",
    progress: 85,
    totalTopics: 24,
    completedTopics: 20,
    color: "bg-red-100 text-red-800",
    nextTopic: "Query Optimization",
    examDate: "2024-03-15",
    materials: 12,
  },
  {
    id: 2,
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    description: "Core programming concepts and problem-solving techniques",
    progress: 67,
    totalTopics: 30,
    completedTopics: 20,
    color: "bg-blue-100 text-blue-800",
    nextTopic: "Binary Trees",
    examDate: "2024-03-20",
    materials: 8,
  },
  {
    id: 3,
    name: "Operating Systems",
    shortName: "OS",
    description: "System software, process management, and memory allocation",
    progress: 42,
    totalTopics: 18,
    completedTopics: 8,
    color: "bg-purple-100 text-purple-800",
    nextTopic: "Process Synchronization",
    examDate: "2024-03-25",
    materials: 15,
  },
  {
    id: 4,
    name: "Linear Algebra",
    shortName: "Math",
    description: "Vectors, matrices, and linear transformations",
    progress: 78,
    totalTopics: 16,
    completedTopics: 12,
    color: "bg-green-100 text-green-800",
    nextTopic: "Eigenvalues",
    examDate: "2024-03-30",
    materials: 6,
  },
];

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Subjects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your study subjects and track your progress
            </p>
          </div>
          <CreateSubjectDialog>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </CreateSubjectDialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                {searchTerm ? "No subjects found" : "No subjects yet"}
              </div>
              {!searchTerm && (
                <CreateSubjectDialog>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first subject
                  </Button>
                </CreateSubjectDialog>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
