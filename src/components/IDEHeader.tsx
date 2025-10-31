import { Menu, Search, Bell, Settings, User } from "lucide-react";
import { Button } from "./ui/button";

export const IDEHeader = () => {
  return (
    <header className="h-12 bg-[hsl(var(--editor-bg))] border-b border-[hsl(var(--editor-border))] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-primary font-semibold">ai-ones-demo</span>
          <span className="text-muted-foreground">▼</span>
          <span className="text-muted-foreground text-sm ml-2">cynDev ▼</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Current File ▼</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
