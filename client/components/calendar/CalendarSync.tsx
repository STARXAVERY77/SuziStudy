import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Users,
  MapPin,
  Link as LinkIcon,
  Settings,
  Sync,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
  attendees?: string[];
  type: "class" | "study_session" | "exam" | "meeting" | "other";
  subject?: string;
  calendarSource: "google" | "outlook" | "manual";
  studyMaterials?: {
    notes?: string;
    flashcards?: string[];
    documents?: string[];
  };
  conflictsWith?: string[]; // IDs of conflicting events
  aiGenerated?: boolean;
}

interface CalendarIntegration {
  provider: "google" | "outlook";
  connected: boolean;
  email?: string;
  lastSync?: Date;
  calendarList?: GoogleCalendar[];
  syncEnabled: boolean;
  twoWaySync: boolean;
}

interface GoogleCalendar {
  id: string;
  name: string;
  primary: boolean;
  color: string;
  syncEnabled: boolean;
}

interface ConflictSuggestion {
  eventId: string;
  suggestion: "reschedule" | "extend" | "split" | "cancel";
  newTime?: Date;
  reason: string;
  confidence: number;
}

export function CalendarSync() {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([
    {
      provider: "google",
      connected: false,
      syncEnabled: true,
      twoWaySync: false,
    },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Database Systems Lecture",
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      type: "class",
      subject: "DBMS",
      calendarSource: "google",
      location: "Room 203, CS Building",
      studyMaterials: {
        notes: "Chapter 3: Query Optimization",
        flashcards: ["SQL Joins", "Query Plans", "Indexing"],
        documents: ["lecture_slides_ch3.pdf", "assignment_2.pdf"],
      },
    },
    {
      id: "2",
      title: "Study Session - Operating Systems",
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      endTime: new Date(Date.now() + 6.5 * 60 * 60 * 1000),
      type: "study_session",
      subject: "OS",
      calendarSource: "manual",
      aiGenerated: true,
      description: "AI-scheduled review session based on your learning pattern",
    },
    {
      id: "3",
      title: "Computer Networks Exam",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
      type: "exam",
      subject: "Networks",
      calendarSource: "google",
      location: "Exam Hall A",
      conflictsWith: ["4"],
    },
  ]);

  const [conflicts, setConflicts] = useState<ConflictSuggestion[]>([
    {
      eventId: "3",
      suggestion: "reschedule",
      newTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
      reason:
        "Conflicts with scheduled study session. Moving 1 hour later would optimize preparation time.",
      confidence: 0.85,
    },
  ]);

  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");

  const connectGoogleCalendar = async () => {
    setSyncStatus("syncing");

    // Simulate Google OAuth flow
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.provider === "google"
            ? {
                ...integration,
                connected: true,
                email: "user@example.com",
                lastSync: new Date(),
                calendarList: [
                  {
                    id: "primary",
                    name: "Primary",
                    primary: true,
                    color: "#1976d2",
                    syncEnabled: true,
                  },
                  {
                    id: "academic",
                    name: "Academic",
                    primary: false,
                    color: "#9c27b0",
                    syncEnabled: true,
                  },
                  {
                    id: "personal",
                    name: "Personal",
                    primary: false,
                    color: "#f57c00",
                    syncEnabled: false,
                  },
                ],
              }
            : integration,
        ),
      );
      setSyncStatus("success");

      // Auto-import events
      importCalendarEvents();
    }, 2000);
  };

  const importCalendarEvents = () => {
    // Simulate importing events from Google Calendar
    const importedEvents: CalendarEvent[] = [
      {
        id: "imported-1",
        title: "Machine Learning Seminar",
        startTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 50 * 60 * 60 * 1000),
        type: "class",
        subject: "ML",
        calendarSource: "google",
        location: "Virtual - Zoom",
      },
      {
        id: "imported-2",
        title: "Study Group - Algorithms",
        startTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 74 * 60 * 60 * 1000),
        type: "study_session",
        subject: "Algorithms",
        calendarSource: "google",
        attendees: ["alice@example.com", "bob@example.com"],
      },
    ];

    setUpcomingEvents((prev) => [...prev, ...importedEvents]);
  };

  const syncToGoogleCalendar = async (event: CalendarEvent) => {
    // Simulate adding event to Google Calendar
    console.log(`Syncing event "${event.title}" to Google Calendar`);

    // Update event to mark as synced
    setUpcomingEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, calendarSource: "google" } : e,
      ),
    );
  };

  const detectConflicts = (events: CalendarEvent[]): ConflictSuggestion[] => {
    const suggestions: ConflictSuggestion[] = [];

    events.forEach((event) => {
      events.forEach((otherEvent) => {
        if (event.id !== otherEvent.id) {
          const eventStart = event.startTime.getTime();
          const eventEnd = event.endTime.getTime();
          const otherStart = otherEvent.startTime.getTime();
          const otherEnd = otherEvent.endTime.getTime();

          // Check for overlap
          if (eventStart < otherEnd && eventEnd > otherStart) {
            suggestions.push({
              eventId: event.id,
              suggestion: "reschedule",
              newTime: new Date(otherEnd + 30 * 60 * 1000), // 30 minutes after conflict ends
              reason: `Conflicts with "${otherEvent.title}". Suggested reschedule to avoid overlap.`,
              confidence: 0.8,
            });
          }
        }
      });
    });

    return suggestions;
  };

  const applyConflictSuggestion = (suggestion: ConflictSuggestion) => {
    setUpcomingEvents((prev) =>
      prev.map((event) => {
        if (event.id === suggestion.eventId && suggestion.newTime) {
          const duration = event.endTime.getTime() - event.startTime.getTime();
          return {
            ...event,
            startTime: suggestion.newTime,
            endTime: new Date(suggestion.newTime.getTime() + duration),
            conflictsWith: undefined,
          };
        }
        return event;
      }),
    );

    setConflicts((prev) =>
      prev.filter((c) => c.eventId !== suggestion.eventId),
    );
  };

  const generateStudySession = (subject: string) => {
    const now = new Date();
    const nextSlot = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now

    const newSession: CalendarEvent = {
      id: `ai-session-${Date.now()}`,
      title: `AI Study Session - ${subject}`,
      startTime: nextSlot,
      endTime: new Date(nextSlot.getTime() + 60 * 60 * 1000), // 1 hour duration
      type: "study_session",
      subject: subject,
      calendarSource: "manual",
      aiGenerated: true,
      description:
        "AI-generated study session based on your learning pattern and upcoming deadlines",
    };

    setUpcomingEvents((prev) => [...prev, newSession]);
  };

  const getEventTypeIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "class":
        return BookOpen;
      case "study_session":
        return Clock;
      case "exam":
        return AlertTriangle;
      case "meeting":
        return Users;
      default:
        return Calendar;
    }
  };

  const getEventTypeColor = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-700";
      case "study_session":
        return "bg-green-100 text-green-700";
      case "exam":
        return "bg-red-100 text-red-700";
      case "meeting":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const googleIntegration = integrations.find((i) => i.provider === "google");

  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Calendar Integrations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Google Calendar</div>
                <div className="text-sm text-muted-foreground">
                  {googleIntegration?.connected
                    ? `Connected as ${googleIntegration.email}`
                    : "Not connected"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {googleIntegration?.connected && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
              {!googleIntegration?.connected ? (
                <Button
                  onClick={connectGoogleCalendar}
                  disabled={syncStatus === "syncing"}
                >
                  {syncStatus === "syncing" ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="w-4 h-4 mr-2" />
                  )}
                  Connect
                </Button>
              ) : (
                <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Google Calendar Settings</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sync-enabled">Enable Sync</Label>
                        <Switch
                          id="sync-enabled"
                          checked={googleIntegration.syncEnabled}
                          onCheckedChange={(checked) => {
                            setIntegrations((prev) =>
                              prev.map((integration) =>
                                integration.provider === "google"
                                  ? { ...integration, syncEnabled: checked }
                                  : integration,
                              ),
                            );
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="two-way-sync">Two-way Sync</Label>
                        <Switch
                          id="two-way-sync"
                          checked={googleIntegration.twoWaySync}
                          onCheckedChange={(checked) => {
                            setIntegrations((prev) =>
                              prev.map((integration) =>
                                integration.provider === "google"
                                  ? { ...integration, twoWaySync: checked }
                                  : integration,
                              ),
                            );
                          }}
                        />
                      </div>

                      {googleIntegration.calendarList && (
                        <div>
                          <Label>Select Calendars to Sync</Label>
                          <div className="space-y-2 mt-2">
                            {googleIntegration.calendarList.map((calendar) => (
                              <div
                                key={calendar.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: calendar.color }}
                                  />
                                  <span className="text-sm">
                                    {calendar.name}
                                  </span>
                                  {calendar.primary && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      Primary
                                    </Badge>
                                  )}
                                </div>
                                <Switch
                                  checked={calendar.syncEnabled}
                                  onCheckedChange={(checked) => {
                                    setIntegrations((prev) =>
                                      prev.map((integration) =>
                                        integration.provider === "google"
                                          ? {
                                              ...integration,
                                              calendarList:
                                                integration.calendarList?.map(
                                                  (cal) =>
                                                    cal.id === calendar.id
                                                      ? {
                                                          ...cal,
                                                          syncEnabled: checked,
                                                        }
                                                      : cal,
                                                ),
                                            }
                                          : integration,
                                      ),
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {googleIntegration?.connected && googleIntegration.lastSync && (
            <div className="text-sm text-muted-foreground">
              Last synced: {googleIntegration.lastSync.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conflict Detection */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Schedule Conflicts Detected</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.map((conflict) => (
              <Alert key={conflict.eventId}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium mb-1">
                        Scheduling Conflict
                      </div>
                      <div className="text-sm">{conflict.reason}</div>
                      {conflict.newTime && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Suggested time: {formatEventTime(conflict.newTime)}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => applyConflictSuggestion(conflict)}
                        className="text-xs"
                      >
                        Apply Suggestion
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setConflicts((prev) =>
                            prev.filter((c) => c.eventId !== conflict.eventId),
                          )
                        }
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Upcoming Events</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateStudySession("DBMS")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Study Session
              </Button>
              {googleIntegration?.connected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSyncStatus("syncing")}
                >
                  <Sync className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents
              .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
              .slice(0, 8)
              .map((event) => {
                const EventIcon = getEventTypeIcon(event.type);
                const isConflicted =
                  event.conflictsWith && event.conflictsWith.length > 0;

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 border rounded-lg hover:bg-muted/50 transition-colors",
                      isConflicted && "border-red-200 bg-red-50",
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          getEventTypeColor(event.type),
                        )}
                      >
                        <EventIcon className="w-4 h-4" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center space-x-2">
                            {event.aiGenerated && (
                              <Badge variant="secondary" className="text-xs">
                                AI Generated
                              </Badge>
                            )}
                            {event.calendarSource === "google" && (
                              <Badge variant="outline" className="text-xs">
                                <Calendar className="w-3 h-3 mr-1" />
                                Google
                              </Badge>
                            )}
                            {isConflicted && (
                              <Badge variant="destructive" className="text-xs">
                                Conflict
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground mb-2">
                          {formatEventTime(event.startTime)} -{" "}
                          {formatEventTime(event.endTime)}
                        </div>

                        {event.location && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        {event.description && (
                          <div className="text-sm text-muted-foreground mb-2">
                            {event.description}
                          </div>
                        )}

                        {event.studyMaterials && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {event.studyMaterials.notes && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                Open Notes
                              </Button>
                            )}
                            {event.studyMaterials.flashcards &&
                              event.studyMaterials.flashcards.length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
                                  <Zap className="w-3 h-3 mr-1" />
                                  Flashcards (
                                  {event.studyMaterials.flashcards.length})
                                </Button>
                              )}
                            {event.subject && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                <Users className="w-3 h-3 mr-1" />
                                AI Assistant
                              </Button>
                            )}
                          </div>
                        )}

                        {event.calendarSource === "manual" &&
                          googleIntegration?.connected && (
                            <div className="mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => syncToGoogleCalendar(event)}
                                className="text-xs"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Add to Google Calendar
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
