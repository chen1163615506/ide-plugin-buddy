import { useState } from "react";
import { Send, AtSign, ImagePlus, ChevronDown, ChevronRight, GitBranch, CheckCircle2, Circle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AIMode {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: string;
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

interface AIAssistantProps {
  onPRReviewComplete?: (data: PRReviewData) => void;
  onIssueClick?: (file: string, issueIndex: number) => void;
}

export const AIAssistant = ({ onPRReviewComplete, onIssueClick }: AIAssistantProps) => {
  const [selectedMode, setSelectedMode] = useState("agent");
  const [selectedModel, setSelectedModel] = useState("claude-4.5-sonnet");
  const [selectedWorkMode, setSelectedWorkMode] = useState("Agent");
  const [selectedAgentType, setSelectedAgentType] = useState("code");
  const [input, setInput] = useState("");
  const [isBranchOpen, setIsBranchOpen] = useState(true);
  const [isFilesOpen, setIsFilesOpen] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [reviewOption, setReviewOption] = useState("Review uncommitted changes");
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState<"setup" | "analyzing" | "reviewing" | "completed">("setup");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<{file: string, issue: any} | null>(null);
  const [showPRAgentDialog, setShowPRAgentDialog] = useState(false);
  const [showAtMenu, setShowAtMenu] = useState(false);
  const [showReviewOptions, setShowReviewOptions] = useState(false);
  const [atMenuPosition, setAtMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // Mock data for branches
  const mockBranches = [
    { name: "main", isDefault: true },
    { name: "develop", isDefault: false },
    { name: "feature/user-auth", isDefault: false },
    { name: "feature/payment-integration", isDefault: false },
    { name: "bugfix/login-issue", isDefault: false },
  ];

  // Mock data for changed files
  const mockChangedFiles = [
    { path: "src/components/AIAssistant.tsx", status: "modified", additions: 45, deletions: 12 },
    { path: "src/components/CodeEditor.tsx", status: "modified", additions: 23, deletions: 8 },
    { path: "src/pages/Index.tsx", status: "added", additions: 156, deletions: 0 },
    { path: "src/utils/helpers.ts", status: "modified", additions: 15, deletions: 5 },
    { path: "README.md", status: "modified", additions: 8, deletions: 2 },
  ];

  // Mock data for review results
  const mockReviewResults = [
    {
      file: "BlogBanner.java",
      issueCount: 4,
      issues: [
        {
          type: "potential",
          title: "Clarify class documentation to match entity purpose.",
          description: "类文档需要更清晰地说明实体用途",
          lineNumber: 15,
          codeSnippet: `/**
 * Blog banner entity
 * @author system
 */
@Entity
@Table(name = "blog_banner")
public class BlogBanner {
    // ...
}`,
          suggestion: "建议修改类文档注释,明确说明BlogBanner实体的用途和职责。例如:\n/**\n * 博客横幅实体类\n * 用于管理博客首页的横幅图片和链接\n * @author system\n */",
          fixedCode: `/**
 * 博客横幅实体类
 * 用于管理博客首页的横幅图片和链接
 * @author system
 */
@Entity
@Table(name = "blog_banner")
public class BlogBanner {
    // ...
}`
        },
        {
          type: "potential",
          title: "Correct the copy-pasted documentation.",
          description: "修正复制粘贴的文档",
          lineNumber: 28,
          codeSnippet: `/**
 * Get banner image URL
 * This is a copy-pasted comment
 */
public String getImageUrl() {
    return imageUrl;
}`,
          suggestion: "删除复制粘贴的注释,使用准确的方法说明",
          fixedCode: `/**
 * 获取横幅图片URL
 */
public String getImageUrl() {
    return imageUrl;
}`
        },
        {
          type: "potential",
          title: "Correct the misleading documentation.",
          description: "修正误导性的文档",
          lineNumber: 42,
          codeSnippet: `/**
 * Set banner status (misleading comment)
 */
public void setStatus(Integer status) {
    this.status = status;
}`,
          suggestion: "修正误导性的注释,准确描述方法功能"
        },
        {
          type: "potential",
          title: "Correct the misleading documentation.",
          description: "修正误导性的文档",
          lineNumber: 56,
          codeSnippet: `/**
 * Update timestamp
 */
public void setUpdateTime(Date updateTime) {
    this.updateTime = updateTime;
}`,
          suggestion: "添加更详细的时间戳说明"
        },
      ]
    },
    {
      file: "BlogCollection.java",
      issueCount: 4,
      issues: [
        {
          type: "critical",
          title: "Fix null pointer exception risk",
          description: "修复空指针异常风险",
          lineNumber: 67,
          codeSnippet: `public void addBlog(Blog blog) {
    this.blogs.add(blog);
}`,
          suggestion: "在使用blogs集合前添加空值检查",
          fixedCode: `public void addBlog(Blog blog) {
    if (blog == null) {
        throw new IllegalArgumentException("Blog cannot be null");
    }
    if (this.blogs == null) {
        this.blogs = new ArrayList<>();
    }
    this.blogs.add(blog);
}`
        },
        {
          type: "potential",
          title: "Improve error handling",
          description: "改进错误处理",
          lineNumber: 89,
          codeSnippet: `public Blog getBlog(Long id) {
    return blogs.stream()
        .filter(b -> b.getId().equals(id))
        .findFirst()
        .orElse(null);
}`,
          suggestion: "使用Optional或抛出自定义异常代替返回null"
        },
        {
          type: "suggestion",
          title: "Consider using Optional",
          description: "考虑使用 Optional",
          lineNumber: 103,
          codeSnippet: `public Blog getLatestBlog() {
    return blogs.isEmpty() ? null : blogs.get(0);
}`,
          suggestion: "返回Optional<Blog>以更好地处理空值情况"
        },
        {
          type: "potential",
          title: "Add input validation",
          description: "添加输入验证",
          lineNumber: 115,
          codeSnippet: `public void setName(String name) {
    this.name = name;
}`,
          suggestion: "添加名称的验证逻辑,如非空检查和长度限制"
        },
      ]
    },
    {
      file: "PageRequest.java",
      issueCount: 4,
      issues: [
        { type: "potential", title: "Validate page parameters", description: "验证分页参数", lineNumber: 23, codeSnippet: "public void setPage(int page) {\n    this.page = page;\n}", suggestion: "添加页码的范围验证" },
        { type: "suggestion", title: "Add JavaDoc comments", description: "添加 JavaDoc 注释", lineNumber: 15, codeSnippet: "public class PageRequest {", suggestion: "为类和公共方法添加JavaDoc注释" },
        { type: "potential", title: "Handle edge cases", description: "处理边界情况", lineNumber: 45, codeSnippet: "public int getOffset() {\n    return page * size;\n}", suggestion: "处理page或size为负数的情况" },
        { type: "suggestion", title: "Improve naming", description: "改进命名", lineNumber: 8, codeSnippet: "private int size;", suggestion: "考虑使用pageSize代替size以提高可读性" },
      ]
    },
    {
      file: "BlogCollectionController.java",
      issueCount: 3,
      issues: [
        { type: "critical", title: "Add authentication check", description: "添加身份验证检查", lineNumber: 34, codeSnippet: "@PostMapping(\"/create\")\npublic ResponseEntity create(@RequestBody BlogCollection collection) {", suggestion: "添加@PreAuthorize注解或手动验证用户权限" },
        { type: "potential", title: "Validate request body", description: "验证请求体", lineNumber: 34, codeSnippet: "public ResponseEntity create(@RequestBody BlogCollection collection) {", suggestion: "添加@Valid注解并在实体类中定义验证规则" },
        { type: "suggestion", title: "Use ResponseEntity", description: "使用 ResponseEntity", lineNumber: 42, codeSnippet: "return new ResponseEntity(result, HttpStatus.OK);", suggestion: "使用泛型ResponseEntity<BlogCollection>以提供更好的类型安全" },
      ]
    },
    {
      file: "BlogCollectionService.java",
      issueCount: 3,
      issues: [
        { type: "potential", title: "Add transaction management", description: "添加事务管理", lineNumber: 56, codeSnippet: "public void createCollection(BlogCollection collection) {", suggestion: "添加@Transactional注解确保数据一致性" },
        { type: "potential", title: "Improve exception handling", description: "改进异常处理", lineNumber: 78, codeSnippet: "} catch (Exception e) {\n    e.printStackTrace();\n}", suggestion: "使用日志框架记录异常,并抛出自定义业务异常" },
        { type: "suggestion", title: "Extract common logic", description: "提取公共逻辑", lineNumber: 92, codeSnippet: "// Duplicate validation code", suggestion: "将重复的验证逻辑提取到私有方法中" },
      ]
    },
    {
      file: "UserServiceImpl.java",
      issueCount: 3,
      issues: [
        { type: "critical", title: "Fix SQL injection vulnerability", description: "修复 SQL 注入漏洞", lineNumber: 123, codeSnippet: "String sql = \"SELECT * FROM users WHERE username = '\" + username + \"';\"", suggestion: "使用PreparedStatement或JPA查询方法" },
        { type: "potential", title: "Add password encryption", description: "添加密码加密", lineNumber: 145, codeSnippet: "user.setPassword(password);", suggestion: "使用BCrypt或其他加密算法加密密码" },
        { type: "suggestion", title: "Use prepared statements", description: "使用预编译语句", lineNumber: 167, codeSnippet: "jdbcTemplate.execute(sql);", suggestion: "使用JdbcTemplate的参数化查询方法" },
      ]
    },
  ];

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

  const handleStartReview = () => {
    setIsReviewing(true);
    setReviewProgress("setup");

    // 模拟审查进度
    setTimeout(() => setReviewProgress("analyzing"), 1000);
    setTimeout(() => setReviewProgress("reviewing"), 2000);
    setTimeout(() => {
      setReviewProgress("completed");
      // 将审查结果传递给父组件，显示在编辑器中
      onPRReviewComplete?.({ files: mockReviewResults });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);

    const lastChar = value[value.length - 1];
    if (lastChar === '@') {
      setShowAtMenu(true);
    }
  };

  const handleAtMenuSelect = (option: string) => {
    setShowAtMenu(false);
    setInput(input.slice(0, -1));
    if (option === 'Code Review') {
      setShowReviewOptions(true);
    }
  };

  return (
    <div className="w-[480px] bg-[hsl(var(--editor-sidebar))] border-l border-[hsl(var(--editor-border))] flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-[hsl(var(--editor-border))]">
        <h2 className="text-left text-sm font-bold tracking-wide">CODELINK</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[hsl(var(--editor-border))]">
        <button className="px-4 py-2 text-xs text-primary border-b-2 border-primary font-medium">
          Chat
        </button>
        <button className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          Work Bench
        </button>
        <button className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          Complete
        </button>
      </div>

      {/* Content Area - Always present to maintain layout stability */}
      <div className="flex-1 overflow-auto">
        {/* Review Results - Show when reviewing */}
        {isReviewing ? (
          <div className="p-4 space-y-4">
            {/* Review Progress */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {reviewProgress === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                ) : (
                  <Circle className="h-4 w-4 text-blue-400 animate-pulse" />
                )}
                <span className={reviewProgress === "setup" || reviewProgress === "completed" ? "text-blue-400" : "text-muted-foreground"}>
                  Setting up
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {reviewProgress === "completed" || reviewProgress === "reviewing" ? (
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                ) : reviewProgress === "analyzing" ? (
                  <Circle className="h-4 w-4 text-blue-400 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={reviewProgress === "analyzing" || reviewProgress === "reviewing" || reviewProgress === "completed" ? "text-blue-400" : "text-muted-foreground"}>
                  Analyzing changes
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {reviewProgress === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                ) : reviewProgress === "reviewing" ? (
                  <Circle className="h-4 w-4 text-blue-400 animate-pulse" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={reviewProgress === "reviewing" || reviewProgress === "completed" ? "text-blue-400" : "text-muted-foreground"}>
                  Reviewing files...
                </span>
              </div>
            </div>

            {/* Files List or File Detail View */}
            {reviewProgress === "completed" && !selectedFile && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  FILES ({mockReviewResults.length}+)
                </div>
                {mockReviewResults.map((result) => (
                  <div
                    key={result.file}
                    onClick={() => setSelectedFile(result.file)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-[hsl(var(--editor-hover))] rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-sm text-foreground">{result.file}</span>
                    </div>
                    <span className="text-xs text-red-400">{result.issueCount}!</span>
                  </div>
                ))}
              </div>
            )}

            {/* File Detail View - Show when a file is selected */}
            {reviewProgress === "completed" && selectedFile && (
              <div className="space-y-4">
                {/* Back button and file header */}
                <div className="flex items-center gap-2 pb-3 border-b border-[hsl(var(--editor-border))]">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1 hover:bg-[hsl(var(--editor-hover))] rounded transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </button>
                  <h3 className="text-sm font-semibold text-foreground">{selectedFile}</h3>
                  <span className="text-xs text-red-400">
                    {mockReviewResults.find(r => r.file === selectedFile)?.issueCount}!
                  </span>
                </div>

                {/* Issues list for this file */}
                <div className="space-y-3">
                  {mockReviewResults.find(r => r.file === selectedFile)?.issues.map((issue, issueIndex) => (
                    <div
                      key={issueIndex}
                      onClick={() => onIssueClick?.(selectedFile, issueIndex)}
                      className="p-3 hover:bg-[hsl(var(--editor-hover))] rounded cursor-pointer transition-colors border border-[hsl(var(--editor-border))]"
                    >
                      <div className="flex items-start gap-3">
                        {issue.type === "critical" ? (
                          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        ) : issue.type === "potential" ? (
                          <AlertTriangle className="h-5 w-5 text-orange-400 mt-0.5" />
                        ) : (
                          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground mb-1">{issue.title}</div>
                          <div className="text-xs text-muted-foreground mb-2">{issue.description}</div>
                          <div className="flex items-center gap-2">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Modes - Show when not reviewing */
          <div className="p-4 space-y-3">
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
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[hsl(var(--editor-border))]">
        <div className="relative">
          {/* Review Options - Show above input when Code Review is selected */}
          {showReviewOptions && (
            <div className="mb-3 p-3 bg-[hsl(var(--editor-bg))] border border-[hsl(var(--editor-border))] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Code Review</span>
                <button
                  onClick={() => setShowReviewOptions(false)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Branch Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">分支</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm bg-[hsl(var(--editor-hover))] hover:bg-[hsl(var(--editor-hover))]/80 border border-[hsl(var(--editor-border))] rounded transition-colors">
                      <GitBranch className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground flex-1 text-left">{selectedBranch}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[400px] bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                    {mockBranches.map((branch) => (
                      <DropdownMenuItem
                        key={branch.name}
                        onClick={() => setSelectedBranch(branch.name)}
                        className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer flex items-center gap-2"
                      >
                        <GitBranch className="h-3 w-3" />
                        <span>{branch.name}</span>
                        {branch.isDefault && (
                          <span className="ml-auto text-xs text-muted-foreground">(default)</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Scope Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">审查范围</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm bg-[hsl(var(--editor-hover))] hover:bg-[hsl(var(--editor-hover))]/80 border border-[hsl(var(--editor-border))] rounded transition-colors">
                      <span className="text-foreground flex-1 text-left">{reviewOption}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[400px] bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                    <DropdownMenuItem
                      onClick={() => setReviewOption("Review uncommitted changes")}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Review uncommitted changes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setReviewOption("Review committed changes")}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Review committed changes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setReviewOption("Review all changes")}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Review all changes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Start Review Button */}
              <button
                onClick={() => {
                  setShowReviewOptions(false);
                  setSelectedWorkMode("PR Agent");
                  handleStartReview();
                }}
                className="w-full px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
              >
                开始审查
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 p-4 bg-[hsl(var(--editor-hover))] border border-[hsl(var(--editor-border))] rounded-lg focus-within:border-primary transition-colors min-h-[120px]">
            {/* Input Area - Takes up most space */}
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="请清晰描述您的需求，支持粘贴图片 (Ctrl+V)"
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[60px]"
            />

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[hsl(var(--editor-border))]">
              {/* Left Icons */}
              <div className="flex items-center gap-2">
                <DropdownMenu open={showAtMenu} onOpenChange={setShowAtMenu}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                    >
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('Files')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Files
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('Past Chats')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Past Chats
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('Notepads')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Notepads
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('MCP Tools')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      MCP Tools
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('Rules')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Rules
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAtMenuSelect('Code Review')}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                    >
                      Code Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ImagePlus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
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
                <Button size="icon" className="h-7 w-7 bg-primary hover:bg-primary/90">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
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

      {/* PR Agent Dialog */}
      <Dialog open={showPRAgentDialog} onOpenChange={setShowPRAgentDialog}>
        <DialogContent className="bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] max-w-md">
          <DialogHeader>
            <DialogTitle>Code Review</DialogTitle>
            <DialogDescription>
              选择要审查的分支和范围
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Branch Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">分支</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--editor-bg))] hover:bg-[hsl(var(--editor-bg))]/80 border border-[hsl(var(--editor-border))] rounded transition-colors">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground flex-1 text-left">{selectedBranch}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                  {mockBranches.map((branch) => (
                    <DropdownMenuItem
                      key={branch.name}
                      onClick={() => setSelectedBranch(branch.name)}
                      className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer flex items-center gap-2"
                    >
                      <GitBranch className="h-3 w-3" />
                      <span>{branch.name}</span>
                      {branch.isDefault && (
                        <span className="ml-auto text-xs text-muted-foreground">(default)</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Scope Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">审查范围</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--editor-bg))] hover:bg-[hsl(var(--editor-bg))]/80 border border-[hsl(var(--editor-border))] rounded transition-colors">
                    <span className="text-foreground flex-1 text-left">{reviewOption}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] bg-[hsl(var(--editor-sidebar))] border-[hsl(var(--editor-border))] z-50">
                  <DropdownMenuItem
                    onClick={() => setReviewOption("Review uncommitted changes")}
                    className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                  >
                    Review uncommitted changes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setReviewOption("Review committed changes")}
                    className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                  >
                    Review committed changes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setReviewOption("Review all changes")}
                    className="text-sm hover:bg-[hsl(var(--editor-hover))] cursor-pointer"
                  >
                    Review all changes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Start Review Button */}
            <button
              onClick={() => {
                setShowPRAgentDialog(false);
                setSelectedWorkMode("PR Agent");
                handleStartReview();
              }}
              className="w-full px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors font-medium"
            >
              开始审查
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};







