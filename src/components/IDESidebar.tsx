import { FileText, Search, GitBranch, Bug, Package, Menu } from "lucide-react";
import { Button } from "./ui/button";

export const IDESidebar = () => {
  const icons = [
    { icon: FileText, active: true },
    { icon: Search, active: false },
    { icon: GitBranch, active: false },
    { icon: Bug, active: false },
    { icon: Package, active: false },
    { icon: Menu, active: false },
  ];

  return (
    <div className="w-12 bg-[hsl(var(--editor-sidebar))] border-r border-[hsl(var(--editor-border))] flex flex-col items-center py-4 gap-2">
      {icons.map((item, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className={`h-12 w-12 ${
            item.active ? "text-primary bg-[hsl(var(--editor-hover))]" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <item.icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
};
