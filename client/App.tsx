import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import {
  Calendar,
  Target,
  Brain,
  Timer,
  BarChart3,
  MessageCircle,
  Mic,
  Settings,
} from "lucide-react";

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
          <Route
            path="/schedule"
            element={
              <PlaceholderPage
                title="Study Schedule"
                description="Plan and manage your daily study sessions with AI-powered scheduling."
                icon={Calendar}
              />
            }
          />
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
            path="/ai-tutor"
            element={
              <PlaceholderPage
                title="AI Tutor"
                description="Get personalized help and explanations from your AI study companion."
                icon={Brain}
              />
            }
          />
          <Route
            path="/focus"
            element={
              <PlaceholderPage
                title="Focus Timer"
                description="Use Pomodoro technique and deep focus sessions to maximize productivity."
                icon={Timer}
              />
            }
          />
          <Route
            path="/progress"
            element={
              <PlaceholderPage
                title="Progress Analytics"
                description="Visualize your learning progress with detailed analytics and insights."
                icon={BarChart3}
              />
            }
          />
          <Route
            path="/voice"
            element={
              <PlaceholderPage
                title="Voice Assistant"
                description="Interact with your study planner using natural voice commands."
                icon={Mic}
              />
            }
          />
          <Route
            path="/chat"
            element={
              <PlaceholderPage
                title="AI Chat"
                description="Chat with AI about your studies, get help, and ask questions."
                icon={MessageCircle}
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
