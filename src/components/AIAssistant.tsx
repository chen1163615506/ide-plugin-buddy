import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AIMode {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: string;
}

export const AIAssistant = () => {
  const [selectedMode, setSelectedMode] = useState("copilot");
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
      <div className="p-4 border-t border-[hsl(var(--editor-border))]">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请清晰描述您的需求，支持快捷键输入 (Ctrl+I)"
            className="pr-24 bg-[hsl(var(--editor-hover))] border-[hsl(var(--editor-border))] focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-xs text-muted-foreground">claude-4.5-sonnet</span>
            <span className="text-xs text-muted-foreground mx-1">•</span>
            <span className="text-xs text-muted-foreground">Agent</span>
            <Button size="icon" className="h-8 w-8 ml-1 bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
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
