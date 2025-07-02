import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Settings as SettingsIcon,
  Brain,
  Shield,
  Palette,
  Bell,
  Volume2,
  Database,
  Zap,
  Clock,
  User,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  Upload,
  Key,
  Globe,
  Mic,
  Eye,
  Lock,
  Smartphone,
  Laptop,
  Tablet,
  Save,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Star,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIModelConfig {
  provider: "openai" | "anthropic" | "google" | "local";
  model: string;
  contextWindow: number;
  description: string;
  capabilities: string[];
  cost: "low" | "medium" | "high";
  speed: "fast" | "medium" | "slow";
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  aiModel: string;
  language: string;
  timezone: string;
  studyReminders: boolean;
  breakReminders: boolean;
  soundNotifications: boolean;
  voiceCommands: boolean;
  aiPersonality: "coach" | "friend" | "mentor" | "professional";
  privacyLevel: "minimal" | "standard" | "strict";
  dataRetention: number; // days
  autoBackup: boolean;
  analyticsEnabled: boolean;
}

const aiModels: AIModelConfig[] = [
  {
    provider: "openai",
    model: "gpt-4o",
    contextWindow: 128000,
    description:
      "Latest GPT-4o with multimodal capabilities, excellent for reasoning and code",
    capabilities: ["Text", "Images", "Code", "Analysis", "Voice"],
    cost: "high",
    speed: "medium",
  },
  {
    provider: "anthropic",
    model: "claude-3-opus",
    contextWindow: 200000,
    description:
      "Claude 3 Opus with massive context window, best for document analysis",
    capabilities: ["Text", "Documents", "Analysis", "Reasoning"],
    cost: "high",
    speed: "medium",
  },
  {
    provider: "google",
    model: "gemini-1.5-pro",
    contextWindow: 1000000,
    description:
      "Gemini 1.5 Pro with 1M token context, ideal for very long documents",
    capabilities: ["Text", "Images", "Video", "Code", "Long Context"],
    cost: "medium",
    speed: "fast",
  },
  {
    provider: "openai",
    model: "gpt-4-turbo",
    contextWindow: 128000,
    description: "Cost-effective option with good performance for most tasks",
    capabilities: ["Text", "Images", "Code", "Analysis"],
    cost: "medium",
    speed: "fast",
  },
  {
    provider: "local",
    model: "llama-3-70b",
    contextWindow: 8192,
    description: "Local model for privacy-conscious users, runs offline",
    capabilities: ["Text", "Code", "Privacy"],
    cost: "low",
    speed: "slow",
  },
];

export default function Settings() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    aiModel: "gpt-4o",
    language: "en",
    timezone: "UTC",
    studyReminders: true,
    breakReminders: true,
    soundNotifications: true,
    voiceCommands: true,
    aiPersonality: "coach",
    privacyLevel: "standard",
    dataRetention: 30,
    autoBackup: true,
    analyticsEnabled: true,
  });

  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: "",
    elevenlabs: "",
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateApiKey = (provider: string, key: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: key }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    // In a real app, save to backend
    console.log("Saving settings:", preferences, apiKeys);
    setHasUnsavedChanges(false);
  };

  const resetSettings = () => {
    setPreferences({
      theme: "system",
      aiModel: "gpt-4o",
      language: "en",
      timezone: "UTC",
      studyReminders: true,
      breakReminders: true,
      soundNotifications: true,
      voiceCommands: true,
      aiPersonality: "coach",
      privacyLevel: "standard",
      dataRetention: 30,
      autoBackup: true,
      analyticsEnabled: true,
    });
    setHasUnsavedChanges(true);
  };

  const exportSettings = () => {
    const data = {
      preferences,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studyflow-settings.json";
    a.click();
  };

  const getModelIcon = (provider: string) => {
    switch (provider) {
      case "openai":
        return "🤖";
      case "anthropic":
        return "🧠";
      case "google":
        return "🔍";
      case "local":
        return "🏠";
      default:
        return "⚡";
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case "fast":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "slow":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedModel = aiModels.find((m) => m.model === preferences.aiModel);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Customize your AI learning experience and privacy preferences
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <Badge
                variant="outline"
                className="bg-yellow-50 border-yellow-200"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" onClick={exportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={saveSettings} disabled={!hasUnsavedChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="ai">AI Models</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-6">
            {/* AI Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Model Selection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Model */}
                {selectedModel && (
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {getModelIcon(selectedModel.provider)}
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {selectedModel.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Currently Active
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getCostColor(selectedModel.cost)}>
                          {selectedModel.cost} cost
                        </Badge>
                        <Badge className={getSpeedColor(selectedModel.speed)}>
                          {selectedModel.speed}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{selectedModel.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>
                        Context: {selectedModel.contextWindow.toLocaleString()}{" "}
                        tokens
                      </span>
                      <span>•</span>
                      <span>
                        Capabilities: {selectedModel.capabilities.join(", ")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Model Options */}
                <div className="grid gap-4">
                  <h4 className="font-medium">Available Models</h4>
                  {aiModels.map((model) => (
                    <div
                      key={model.model}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                        preferences.aiModel === model.model &&
                          "border-primary bg-primary/5",
                      )}
                      onClick={() => updatePreference("aiModel", model.model)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">
                            {getModelIcon(model.provider)}
                          </span>
                          <div>
                            <h4 className="font-medium">{model.model}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {model.provider}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getCostColor(model.cost)}>
                            {model.cost}
                          </Badge>
                          <Badge className={getSpeedColor(model.speed)}>
                            {model.speed}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant="outline"
                            className="text-xs"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API Keys</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(apiKeys).map(([provider, key]) => (
                  <div key={provider} className="space-y-2">
                    <Label className="capitalize">{provider} API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="password"
                        placeholder={`Enter ${provider} API key`}
                        value={key}
                        onChange={(e) => updateApiKey(provider, e.target.value)}
                      />
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="text-sm text-muted-foreground">
                  API keys are stored securely and never shared. Required for AI
                  model access.
                </div>
              </CardContent>
            </Card>

            {/* AI Personality */}
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Personality</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(["coach", "friend", "mentor", "professional"] as const).map(
                    (personality) => (
                      <Button
                        key={personality}
                        variant={
                          preferences.aiPersonality === personality
                            ? "default"
                            : "outline"
                        }
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() =>
                          updatePreference("aiPersonality", personality)
                        }
                      >
                        <span className="text-lg">
                          {personality === "coach" && "🏃‍♂️"}
                          {personality === "friend" && "😊"}
                          {personality === "mentor" && "👨‍🏫"}
                          {personality === "professional" && "👔"}
                        </span>
                        <span className="capitalize">{personality}</span>
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            {/* Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Theme & Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="flex space-x-3">
                    {(["light", "dark", "system"] as const).map((theme) => (
                      <Button
                        key={theme}
                        variant={
                          preferences.theme === theme ? "default" : "outline"
                        }
                        className="flex items-center space-x-2"
                        onClick={() => updatePreference("theme", theme)}
                      >
                        {theme === "light" && <Sun className="w-4 h-4" />}
                        {theme === "dark" && <Moon className="w-4 h-4" />}
                        {theme === "system" && <Monitor className="w-4 h-4" />}
                        <span className="capitalize">{theme}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      updatePreference("language", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      updatePreference("timezone", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Study Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about scheduled study sessions
                      </p>
                    </div>
                    <Switch
                      checked={preferences.studyReminders}
                      onCheckedChange={(checked) =>
                        updatePreference("studyReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Break Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        45-minute study session break notifications
                      </p>
                    </div>
                    <Switch
                      checked={preferences.breakReminders}
                      onCheckedChange={(checked) =>
                        updatePreference("breakReminders", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Play sounds for important notifications
                      </p>
                    </div>
                    <Switch
                      checked={preferences.soundNotifications}
                      onCheckedChange={(checked) =>
                        updatePreference("soundNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Voice Commands</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable voice control and commands
                      </p>
                    </div>
                    <Switch
                      checked={preferences.voiceCommands}
                      onCheckedChange={(checked) =>
                        updatePreference("voiceCommands", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Data Control</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Privacy Level</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["minimal", "standard", "strict"] as const).map(
                        (level) => (
                          <Button
                            key={level}
                            variant={
                              preferences.privacyLevel === level
                                ? "default"
                                : "outline"
                            }
                            className="h-auto p-4 flex flex-col items-center space-y-2"
                            onClick={() =>
                              updatePreference("privacyLevel", level)
                            }
                          >
                            <span className="text-lg">
                              {level === "minimal" && "🔓"}
                              {level === "standard" && "🛡️"}
                              {level === "strict" && "🔒"}
                            </span>
                            <span className="capitalize">{level}</span>
                          </Button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Data Retention (days)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[preferences.dataRetention]}
                        onValueChange={([value]) =>
                          updatePreference("dataRetention", value)
                        }
                        max={365}
                        min={1}
                        step={1}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 day</span>
                        <span>{preferences.dataRetention} days</span>
                        <span>365 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically backup your data and progress
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoBackup}
                      onCheckedChange={(checked) =>
                        updatePreference("autoBackup", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve the app with anonymous usage data
                      </p>
                    </div>
                    <Switch
                      checked={preferences.analyticsEnabled}
                      onCheckedChange={(checked) =>
                        updatePreference("analyticsEnabled", checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea placeholder="Tell us about your learning goals..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "laptop", name: "MacBook Pro", lastSeen: "Now" },
                  {
                    type: "smartphone",
                    name: "iPhone 15",
                    lastSeen: "2 hours ago",
                  },
                  {
                    type: "tablet",
                    name: "iPad Air",
                    lastSeen: "Yesterday",
                  },
                ].map((device, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {device.type === "laptop" && (
                        <Laptop className="w-5 h-5" />
                      )}
                      {device.type === "smartphone" && (
                        <Smartphone className="w-5 h-5" />
                      )}
                      {device.type === "tablet" && (
                        <Tablet className="w-5 h-5" />
                      )}
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last seen: {device.lastSeen}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Developer Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable advanced features and debugging
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Experimental Features</Label>
                    <p className="text-sm text-muted-foreground">
                      Try new features before they're released
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable offline functionality when possible
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                  <Button variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Check for Updates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Version:</span> 2.1.0
                  </div>
                  <div>
                    <span className="font-medium">Build:</span> 20241220
                  </div>
                  <div>
                    <span className="font-medium">Platform:</span> Web
                  </div>
                  <div>
                    <span className="font-medium">AI Models:</span>{" "}
                    {aiModels.length} available
                  </div>
                  <div>
                    <span className="font-medium">Storage:</span> 2.1 GB used
                  </div>
                  <div>
                    <span className="font-medium">Last Sync:</span> Just now
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
