import { GitBranch, AlertCircle, Bell, Zap } from "lucide-react";

export const IDEStatusBar = () => {
  return (
    <div className="h-6 bg-[hsl(var(--editor-bg))] border-t border-[hsl(var(--editor-border))] flex items-center justify-between px-4 text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          <span>ai-ones-demo</span>
        </div>
        <div className="flex items-center gap-1 text-green-400">
          <span>✓</span>
          <span>1</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-muted-foreground">
        <span>LF</span>
        <span>UTF-8</span>
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          <span>2 spaces</span>
        </div>
        <span>TypeScript React</span>
      </div>
    </div>
  );
};
