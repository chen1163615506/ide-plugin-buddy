import { IDEHeader } from "@/components/IDEHeader";
import { IDESidebar } from "@/components/IDESidebar";
import { CodeEditor } from "@/components/CodeEditor";
import { AIAssistant } from "@/components/AIAssistant";
import { IDEStatusBar } from "@/components/IDEStatusBar";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--editor-bg))] overflow-hidden">
      <IDEHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <IDESidebar />
        <CodeEditor />
        <AIAssistant />
      </div>

      <IDEStatusBar />
    </div>
  );
};

export default Index;
