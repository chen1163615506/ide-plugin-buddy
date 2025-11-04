import { useState } from "react";
import { IDEHeader } from "@/components/IDEHeader";
import { IDESidebar } from "@/components/IDESidebar";
import { CodeEditor } from "@/components/CodeEditor";
import { AIAssistant } from "@/components/AIAssistant";
import { IDEStatusBar } from "@/components/IDEStatusBar";

interface PRReviewData {
  files: Array<{
    file: string;
    issueCount: number;
    issues: Array<{
      type: "critical" | "potential" | "suggestion";
      title: string;
      description: string;
      lineNumber?: number;
      codeSnippet?: string;
      suggestion?: string;
      fixedCode?: string;
    }>;
  }>;
}

const Index = () => {
  const [prReviewData, setPRReviewData] = useState<PRReviewData | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<{ file: string; issueIndex: number } | null>(null);

  const handleIssueClick = (file: string, issueIndex: number) => {
    setSelectedIssue({ file, issueIndex });
  };

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--editor-bg))] overflow-hidden">
      <IDEHeader />

      <div className="flex flex-1 overflow-hidden">
        <IDESidebar />
        <CodeEditor
          prReviewData={prReviewData}
          selectedIssue={selectedIssue}
        />
        <AIAssistant
          onPRReviewComplete={setPRReviewData}
          onIssueClick={handleIssueClick}
        />
      </div>

      <IDEStatusBar />
    </div>
  );
};

export default Index;
