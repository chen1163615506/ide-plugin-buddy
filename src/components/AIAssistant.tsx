import { useState } from "react";
import { Send, AtSign, ImagePlus, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface AIMode {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: string;
}

export const AIAssistant = () => {
  const [selectedMode, setSelectedMode] = useState("agent");
  const [selectedModel, setSelectedModel] = useState("claude-4.5-sonnet");
  const [selectedWorkMode, setSelectedWorkMode] = useState("Agent");
  const [input, setInput] = useState("");

  const modes: AIMode[] = [
    {
      id: "copilot",
      name: "Copilot 模式",
      badge: "Hot",
      description: "智能代码补全及辅助编程，真随易用，实时随答",
      icon: "📋",
    },
    {
      id: "agent",
      name: "Agent 模式",
      badge: "New",
      description: "如说话般，自然语言驱动开发任务，从需求到实现，一步到位",
      icon: "🎯",
    },
    {
      id: "remote",
      name: "Remote 模式",
      badge: "Pro",
      description: "多任务并行执行，10倍效能提速，重新定义开发效率",
      icon: "🚀",
    },
  ];

  const workModes = ["Chat", "Agent", "Remote", "ClaudeCode"];
  const models = [
    "claude-4.5-sonnet",
    "claude-opus-4-1",
    "claude-3.7-sonnet",
    "gpt-5",
  ];

  return (
    <div className="w-96 bg-[hsl(var(--editor-sidebar))] border-l border-[hsl(var(--editor-border))] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--editor-border))]">
        <h2 className="text-left text-sm font-bold tracking-wide">CODELINK</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[hsl(var(--editor-border))]">
        <button className="flex-1 px-4 py-3 text-primary border-b-2 border-primary font-medium">
          Chat
        </button>
        <button className="flex-1 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
          Work Bench
        </button>
        <button className="flex-1 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
          Complete
        </button>
      </div>

      {/* Modes */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`w-full p-4 rounded-lg border transition-all ${
              selectedMode === mode.id
                ? "border-primary bg-[hsl(var(--editor-hover))] shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
                : "border-[hsl(var(--editor-border))] hover:border-[hsl(var(--editor-border))]/60 hover:bg-[hsl(var(--editor-hover))]/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{mode.icon}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{mode.name}</span>
                  {mode.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        mode.badge === "Hot"
                          ? "bg-red-500/20 text-red-400"
                          : mode.badge === "New"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {mode.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[hsl(var(--editor-border))] space-y-3">
        {/* Work Mode Selector */}
        <div className="flex gap-2 pb-2">
          {workModes.map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedWorkMode(mode)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                selectedWorkMode === mode
                  ? "bg-[hsl(var(--editor-hover))] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="relative">
          <div className="flex items-center gap-2 p-3 bg-[hsl(var(--editor-hover))] border border-[hsl(var(--editor-border))] rounded-lg focus-within:border-primary transition-colors">
            {/* Left Icons */}
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <AtSign className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
            </Button>

            {/* Input */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="请清晰描述您的需求，支持快捷键输入 (Ctrl+I)"
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-6 text-sm"
            />

            {/* Right Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <span>{selectedModel}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                  {models.map((model) => (
                    <DropdownMenuItem
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      {model}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Work Mode Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <span>{selectedWorkMode}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                  {workModes.map((mode) => (
                    <DropdownMenuItem
                      key={mode}
                      onClick={() => setSelectedWorkMode(mode)}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      {mode}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Send Button */}
              <Button size="icon" className="h-7 w-7 bg-primary hover:bg-primary/90 shrink-0">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[hsl(var(--editor-bg))] border-t border-[hsl(var(--editor-border))] flex items-center justify-between px-4 text-xs text-muted-foreground">
        <span>3:3:1</span>
        <div className="flex items-center gap-4">
          <span>LF</span>
          <span>UTF-8</span>
          <span>2 spaces</span>
        </div>
      </div>
    </div>
  );
};
