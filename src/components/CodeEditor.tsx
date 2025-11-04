import { useState, useEffect, useRef } from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";

interface Tab {
  id: string;
  name: string;
  type: "readme" | "pr-review";
  modified?: boolean;
}

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

interface CodeEditorProps {
  prReviewData?: PRReviewData | null;
  selectedIssue?: { file: string; issueIndex: number } | null;
}

export const CodeEditor = ({ prReviewData, selectedIssue }: CodeEditorProps) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "readme", name: "README.md", type: "readme", modified: true },
  ]);
  const [activeTab, setActiveTab] = useState("readme");
  const issueRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [editingIssues, setEditingIssues] = useState<{ [key: string]: string }>({});
  const [isFixingAll, setIsFixingAll] = useState(false);
  const [fixedIssues, setFixedIssues] = useState<Set<string>>(new Set());

  // 当有 PR review 数据时，自动添加 PR Review 标签页
  useEffect(() => {
    if (prReviewData && !tabs.find(t => t.type === "pr-review")) {
      setTabs(prev => [...prev, { id: "pr-review", name: "PR Review Results", type: "pr-review" }]);
      setActiveTab("pr-review");
    }
  }, [prReviewData, tabs]);

  // 当点击右侧问题时，切换到 PR Review 标签页并滚动到对应问题
  useEffect(() => {
    if (selectedIssue) {
      setActiveTab("pr-review");
      const issueKey = `${selectedIssue.file}-${selectedIssue.issueIndex}`;
      setTimeout(() => {
        const element = issueRefs.current[issueKey];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // 添加高亮效果
          element.classList.add("ring-2", "ring-primary");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-primary");
          }, 2000);
        }
      }, 100);
    }
  }, [selectedIssue]);

  const codeContent = `  - **[Vite Max](...)** - React 应用框架
  - **[Ant Design](...)** - UI 组件库
  - **[TypeScript](...)** - 类型安全
  - **[Zustand](...)** - 状态管理

  ## 开始使用

  ### 安装依赖

  \`\`\`bash
  npm install
  # 或
  yarn install
  \`\`\`

  ### 启动开发服务器

  \`\`\`bash
  npm run dev
  # 或
  yarn dev
  \`\`\`

  访问 [http://localhost:8080](http://localhost:8080) 查看应用

  ### 构建生产版本

  \`\`\`bash
  npm run build
  # 或
  yarn build
  \`\`\`

  ## 目录结构

  \`\`\`
  ├── config/         # 配置文件目录
  ├── src/            # 源代码
  │   ├── assets/     # 静态资源
  │   ├── components/ # 公共组件
  │   ├── constants/  # 常量定义
  │   ├── hooks/      # 自定义 Hooks
  \`\`\``;

  const closeTab = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const renderREADME = () => (
    <div className="flex-1 overflow-auto p-4 font-mono text-sm">
      <pre className="text-foreground leading-relaxed">
        {codeContent.split('\n').map((line, index) => (
          <div key={index} className="flex">
            <span className="text-muted-foreground w-12 text-right mr-4 select-none">
              {index + 1}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/^(#{1,3})\s+(.+)$/, '<span class="text-[hsl(var(--code-keyword))]">$1</span> <span class="font-bold">$2</span>')
                  .replace(/`([^`]+)`/g, '<span class="text-[hsl(var(--code-string))] bg-[hsl(var(--editor-hover))] px-1 rounded">$1</span>')
                  .replace(/\[([^\]]+)\]/g, '<span class="text-[hsl(var(--code-function))]">[$1]</span>')
                  .replace(/\*\*([^\*]+)\*\*/g, '<span class="font-bold">$1</span>')
                  .replace(/^(\s*)-\s+/, '$1<span class="text-[hsl(var(--code-keyword))]">-</span> ')
                  .replace(/(npm|yarn|bash|http)/g, '<span class="text-[hsl(var(--code-number))]">$1</span>'),
              }}
            />
          </div>
        ))}
      </pre>
    </div>
  );

  const handleFixAll = async () => {
    setIsFixingAll(true);
    // 模拟异步修复所有问题
    const allIssues: string[] = [];
    prReviewData?.files.forEach((fileData) => {
      fileData.issues.forEach((_, issueIndex) => {
        allIssues.push(`${fileData.file}-${issueIndex}`);
      });
    });

    // 逐个修复，每个延迟500ms
    for (const issueKey of allIssues) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFixedIssues(prev => new Set([...prev, issueKey]));
    }
    setIsFixingAll(false);
  };

  const handleApplySingleFix = (fileData: any, issueIndex: number) => {
    const issueKey = `${fileData.file}-${issueIndex}`;
    setFixedIssues(prev => new Set([...prev, issueKey]));
    console.log(`Applied fix for ${issueKey}`);
  };

  const renderPRReview = () => {
    if (!prReviewData) return null;

    const totalIssues = prReviewData.files.reduce((sum, file) => sum + file.issueCount, 0);
    const fixedCount = fixedIssues.size;

    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">PR Review Results</h1>
          <button
            onClick={handleFixAll}
            disabled={isFixingAll || fixedCount === totalIssues}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              isFixingAll || fixedCount === totalIssues
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isFixingAll ? `Fixing... (${fixedCount}/${totalIssues})` : fixedCount === totalIssues ? "All Fixed" : "Fix All Issues"}
          </button>
        </div>

        {prReviewData.files.map((fileData, fileIndex) => (
          <div key={fileIndex} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-foreground">{fileData.file}</h2>
              <span className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400">
                {fileData.issueCount} issues
              </span>
            </div>

            <div className="space-y-4 ml-4">
              {fileData.issues.map((issue, issueIndex) => {
                const issueKey = `${fileData.file}-${issueIndex}`;
                return (
                  <div
                    key={issueIndex}
                    ref={(el) => (issueRefs.current[issueKey] = el)}
                    className="p-4 border border-[hsl(var(--editor-border))] rounded-lg transition-all"
                  >
                  <div className="flex items-start gap-3">
                    {issue.type === "critical" ? (
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    ) : issue.type === "potential" ? (
                      <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${
                            issue.type === "critical"
                              ? "bg-red-500/20 text-red-400"
                              : issue.type === "potential"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {issue.type === "critical" ? "Critical" : issue.type === "potential" ? "Potential Issue" : "Suggestion"}
                        </span>
                        {issue.lineNumber && (
                          <span className="text-xs text-muted-foreground">Line {issue.lineNumber}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>

                      {issue.codeSnippet && (
                        <div className="mb-3">
                          <div className="text-xs text-muted-foreground mb-1">Code:</div>
                          <pre className="bg-[hsl(var(--editor-bg))] border border-[hsl(var(--editor-border))] rounded p-3 text-xs text-foreground overflow-x-auto">
                            <code>{issue.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {issue.suggestion && (
                        <div className="mb-3">
                          <div className="text-xs text-muted-foreground mb-1">Suggestion:</div>
                          <p className="text-sm text-foreground">{issue.suggestion}</p>
                        </div>
                      )}

                      {issue.fixedCode && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-xs text-muted-foreground">Fixed Code:</div>
                            {fixedIssues.has(issueKey) ? (
                              <span className="text-xs text-green-400">✓ Applied</span>
                            ) : (
                              <button
                                onClick={() => handleApplySingleFix(fileData, issueIndex)}
                                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                              >
                                Apply Fix
                              </button>
                            )}
                          </div>
                          <textarea
                            value={editingIssues[issueKey] ?? issue.fixedCode}
                            onChange={(e) => setEditingIssues(prev => ({ ...prev, [issueKey]: e.target.value }))}
                            className="w-full bg-[hsl(var(--editor-bg))] border border-green-500/30 rounded p-3 text-xs text-foreground font-mono resize-y min-h-[100px] focus:outline-none focus:border-green-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--editor-bg))]">
      {/* Tabs */}
      <div className="h-10 bg-[hsl(var(--editor-sidebar))] border-b border-[hsl(var(--editor-border))] flex items-center px-4 gap-1">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-sm cursor-pointer transition-colors ${
              activeTab === tab.id
                ? "bg-[hsl(var(--editor-hover))] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.modified && <span className="text-blue-400">M!</span>}
            <span>{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="ml-1 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Content */}
      {activeTab === "readme" && renderREADME()}
      {activeTab === "pr-review" && renderPRReview()}
    </div>
  );
};
