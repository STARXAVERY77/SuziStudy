import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Chat from "./pages/Chat";
import Schedule from "./pages/Schedule";
import Focus from "./pages/Focus";
import Voice from "./pages/Voice";
import Progress from "./pages/Progress";
import Materials from "./pages/Materials";
import MindMap from "./pages/MindMap";
import AITutor from "./pages/AITutor";
import Flashcards from "./pages/Flashcards";
import LeetCode from "./pages/LeetCode";
import Viva from "./pages/Viva";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { Target, Settings } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/ai-tutor" element={<AITutor />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/leetcode" element={<LeetCode />} />
          <Route path="/viva" element={<Viva />} />
          <Route
            path="/goals"
            element={
              <PlaceholderPage
                title="Study Goals"
                description="Set and track your learning objectives and milestones."
                icon={Target}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Customize your StudyFlow experience and preferences."
                icon={Settings}
              />
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
