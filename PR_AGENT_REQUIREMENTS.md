# PR Agent 需求文档

## 1. 项目概述

### 1.1 产品名称
IDE Plugin Buddy - PR Agent

### 1.2 产品定位
一个集成在 IDE 中的智能代码审查助手，通过 AI 技术自动检测代码问题，提供修复建议，并支持一键批量修复，提升开发者的代码质量和开发效率。

### 1.3 目标用户
- 软件开发工程师
- 代码审查人员
- 技术 Leader
- DevOps 工程师

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 Agent 类型选择
**功能描述**：用户可以在 Code Agent 和 PR Agent 之间切换

**交互方式**：
- 输入框上方有一个下拉选择器
- 默认选中 "Code Agent"
- 支持选择 "PR Agent" 和 "Code Agent"

**业务价值**：
- 提供灵活的工作模式切换
- 满足不同场景的使用需求

#### 2.1.2 分支选择
**功能描述**：选择要审查的 Git 分支

**交互细节**：
- 显示当前仓库的所有分支列表
- 标注默认分支（如 main/master）
- 显示分支图标
- 默认选中当前分支

**分支列表示例**：
- main (default)
- develop
- feature/user-auth
- feature/payment-integration
- bugfix/login-issue

#### 2.1.3 审查范围选择
**功能描述**：选择要审查的代码范围

**选项**：
1. Review uncommitted changes（审查未提交的更改）
2. Review committed changes（审查已提交的更改）
3. Review all changes（审查所有更改）

**默认值**：Review uncommitted changes

#### 2.1.4 代码审查执行
**功能描述**：启动 AI 驱动的代码审查流程

**审查流程**：
1. **Setting up**（设置环境）
   - 初始化审查环境
   - 加载项目配置
   - 连接 AI 服务

2. **Analyzing changes**（分析变更）
   - 获取 Git diff
   - 识别变更文件
   - 解析代码结构

3. **Reviewing files**（审查文件）
   - AI 分析代码质量
   - 检测潜在问题
   - 生成修复建议

**UI 反馈**：
- 实时显示当前进度步骤
- 已完成步骤显示 ✓ 图标
- 进行中步骤显示动画效果
- 未开始步骤显示灰色状态

#### 2.1.5 审查结果展示

##### 2.1.5.1 文件列表视图（右侧插件）
**展示内容**：
- 文件路径
- 问题数量（红色标注，如 "4!"）
- ChevronRight 图标表示可展开

**交互**：
- 点击文件名，在左侧编辑器打开详细视图
- 支持返回文件列表

##### 2.1.5.2 文件详情视图（右侧插件）
**展示内容**：
- 返回按钮（< 图标）
- 文件名
- 问题总数
- 该文件的所有问题列表

**问题卡片包含**：
- 问题类型图标（Critical/Potential Issue/Suggestion）
- 问题标题
- 问题描述
- 问题类型标签（红色/橙色/蓝色）
- 代码行号

**交互**：
- 点击问题卡片，定位到左侧编辑器的对应位置

##### 2.1.5.3 完整审查报告（左侧编辑器）
**布局结构**：
```
PR Review Results                                    [Fix All Issues]

BlogBanner.java                                      4 issues
  ├─ [Critical/Potential/Suggestion] Issue Title
  │   Description
  │   Code: [原始代码片段]
  │   Suggestion: [修改建议]
  │   Fixed Code: [可编辑的修复代码]        [Apply Fix / ✓ Applied]
  │
  ├─ [下一个问题...]

BlogCollection.java                                  4 issues
  ├─ ...
```

**问题详情展示**：
1. **问题元信息**
   - 图标（AlertCircle/AlertTriangle/Info）
   - 标题
   - 类型标签（Critical/Potential Issue/Suggestion）
   - 行号

2. **问题描述**
   - 清晰的中文描述
   - 说明问题的影响

3. **原始代码**
   - 只读的代码片段
   - 高亮显示问题行
   - 语法高亮

4. **修改建议**
   - AI 生成的修复建议
   - 说明为什么要这样修改

5. **修复后代码**
   - **可编辑**的文本框
   - 支持用户修改 AI 建议
   - 等宽字体
   - 语法高亮
   - 绿色边框表示修复代码

#### 2.1.6 问题定位
**功能描述**：点击右侧插件的问题，自动定位到左侧编辑器

**交互细节**：
1. 自动切换到 "PR Review Results" 标签页
2. 平滑滚动到对应问题
3. 问题卡片高亮 2 秒（蓝色边框）
4. 定位到视口中央

#### 2.1.7 单个问题修复
**功能描述**：应用单个问题的修复方案

**操作流程**：
1. 用户在 Fixed Code 区域编辑代码（可选）
2. 点击 "Apply Fix" 按钮
3. 按钮变为 "✓ Applied"（绿色）
4. 系统应用修复到实际文件

**状态管理**：
- 已修复的问题显示 "✓ Applied"
- 未修复的问题显示 "Apply Fix" 按钮

#### 2.1.8 一键批量修复
**功能描述**：自动修复所有检测到的问题

**位置**：PR Review Results 页面右上角

**按钮状态**：
1. **初始状态**："Fix All Issues"（蓝色按钮）
2. **修复中**："Fixing... (3/22)"（显示进度）
3. **全部完成**："All Fixed"（灰色，禁用）

**执行流程**：
1. 按顺序遍历所有文件的所有问题
2. 每个问题修复间隔 500ms（异步执行）
3. 实时更新进度计数
4. 修复完成后标记 "✓ Applied"
5. 所有问题修复完成后禁用按钮

**异步特性**：
- 不阻塞 UI
- 支持取消操作（可扩展）
- 显示实时进度

## 3. 问题分类标准

### 3.1 Critical（严重问题）
**颜色**：红色
**图标**：AlertCircle
**定义**：
- SQL 注入漏洞
- 空指针异常风险
- 安全漏洞
- 权限验证缺失
- 内存泄漏风险

**示例**：
```java
// Critical: SQL injection vulnerability
String sql = "SELECT * FROM users WHERE username = '" + username + "'";
```

### 3.2 Potential Issue（潜在问题）
**颜色**：橙色
**图标**：AlertTriangle
**定义**：
- 错误处理不完善
- 输入验证缺失
- 代码逻辑问题
- 资源管理不当
- 文档不清晰/误导性文档

**示例**：
```java
// Potential Issue: Missing null check
public void addBlog(Blog blog) {
    this.blogs.add(blog);  // blogs 可能为 null
}
```

### 3.3 Suggestion（建议）
**颜色**：蓝色
**图标**：Info
**定义**：
- 代码风格建议
- 命名优化
- 注释补充
- 最佳实践建议
- 性能优化建议

**示例**：
```java
// Suggestion: Use Optional
public Blog getLatestBlog() {
    return blogs.isEmpty() ? null : blogs.get(0);
}
// 建议改为返回 Optional<Blog>
```

## 4. UI/UX 设计

### 4.1 布局设计

#### 4.1.1 整体布局
```
┌─────────────────────────────────────────────────────────────────────┐
│  IDE Header                                                         │
├──────────┬────────────────────────────────────────┬─────────────────┤
│          │  ┌─────────────────────────────────┐   │                 │
│          │  │ README.md  │ PR Review Results │   │  CODELINK      │
│          │  └─────────────────────────────────┘   │                 │
│  Sidebar │                                        │  Chat │ Work.. │
│          │  PR Review Results   [Fix All Issues] │                 │
│          │                                        │  ┌─────────────┐│
│          │  BlogBanner.java           4 issues   │  │ Code Agent  ││
│          │    [Critical] Issue title...          │  │ PR Agent    ││
│          │    ...                                 │  └─────────────┘│
│          │                                        │                 │
│          │  BlogCollection.java       4 issues   │  Branch: main  │
│          │    ...                                 │                 │
│          │                                        │  [Review...]   │
│          │                                        │                 │
│          │                                        │  Input box...  │
└──────────┴────────────────────────────────────────┴─────────────────┘
```

#### 4.1.2 右侧插件尺寸
- 宽度：480px
- 高度：自适应
- 可滚动区域

#### 4.1.3 左侧编辑器
- 标签页导航
- 可关闭标签
- README.md 默认打开
- PR Review Results 审查后自动打开

### 4.2 颜色系统

#### 4.2.1 主题色
- Primary：蓝色（#2563eb）
- Success：绿色（#16a34a）
- Warning：橙色（#ea580c）
- Error：红色（#dc2626）
- Info：蓝色（#3b82f6）

#### 4.2.2 状态颜色
- Critical：红色背景 + 红色文字
- Potential：橙色背景 + 橙色文字
- Suggestion：蓝色背景 + 蓝色文字
- Applied：绿色文字 + ✓ 图标

#### 4.2.3 暗色主题适配
- 使用 HSL 变量
- 支持明暗主题切换
- 保持足够对比度

### 4.3 交互设计

#### 4.3.1 动画效果
1. **进度指示**：
   - 进行中：脉冲动画
   - 已完成：✓ 淡入动画

2. **问题定位**：
   - 平滑滚动（smooth scroll）
   - 2秒高亮动画
   - 边框渐变效果

3. **按钮状态**：
   - Hover：轻微颜色加深
   - 禁用：降低透明度
   - 加载：旋转图标

#### 4.3.2 响应式反馈
- 点击按钮有视觉反馈
- 加载状态有进度提示
- 操作成功有确认提示
- 错误操作有警告提示

### 4.4 字体设计
- 标题：14-24px, 粗体
- 正文：12-14px, 常规
- 代码：12px, 等宽字体 (Monaco, Consolas, 'Courier New')
- 标签：10-12px

## 5. 技术规格

### 5.1 技术栈
- **前端框架**：React 18
- **构建工具**：Vite
- **UI 组件库**：shadcn/ui
- **样式方案**：Tailwind CSS
- **图标库**：Lucide React
- **类型检查**：TypeScript

### 5.2 数据结构

#### 5.2.1 PR Review Data
```typescript
interface PRReviewData {
  files: Array<{
    file: string;           // 文件路径
    issueCount: number;     // 问题总数
    issues: Array<{
      type: "critical" | "potential" | "suggestion";
      title: string;        // 问题标题
      description: string;  // 问题描述
      lineNumber?: number;  // 代码行号
      codeSnippet?: string; // 原始代码片段
      suggestion?: string;  // 修改建议
      fixedCode?: string;   // 修复后的代码
    }>;
  }>;
}
```

#### 5.2.2 状态管理
```typescript
// Agent 类型
selectedAgentType: "code" | "pr"

// 分支选择
selectedBranch: string

// 审查选项
reviewOption: "Review uncommitted changes"
            | "Review committed changes"
            | "Review all changes"

// 审查进度
reviewProgress: "setup" | "analyzing" | "reviewing" | "completed"

// 审查状态
isReviewing: boolean

// 文件选择（右侧插件）
selectedFile: string | null

// 问题选择（用于定位）
selectedIssue: { file: string; issueIndex: number } | null

// 编辑状态
editingIssues: { [issueKey: string]: string }

// 修复状态
fixedIssues: Set<string>
isFixingAll: boolean
```

### 5.3 API 设计

#### 5.3.1 获取分支列表
```typescript
interface Branch {
  name: string;
  isDefault: boolean;
}

getBranches(): Promise<Branch[]>
```

#### 5.3.2 获取文件变更
```typescript
interface FileChange {
  path: string;
  status: "added" | "modified" | "deleted";
  additions: number;
  deletions: number;
}

getFileChanges(
  branch: string,
  scope: "uncommitted" | "committed" | "all"
): Promise<FileChange[]>
```

#### 5.3.3 执行代码审查
```typescript
interface ReviewRequest {
  branch: string;
  scope: "uncommitted" | "committed" | "all";
  files?: string[];  // 可选：指定文件
}

executeReview(request: ReviewRequest): Promise<PRReviewData>
```

#### 5.3.4 应用修复
```typescript
interface ApplyFixRequest {
  file: string;
  lineNumber: number;
  fixedCode: string;
}

applySingleFix(request: ApplyFixRequest): Promise<boolean>
applyAllFixes(fixes: ApplyFixRequest[]): Promise<boolean>
```

### 5.4 性能要求
- 初始化时间：< 2s
- 文件扫描：< 5s（100个文件）
- AI 审查响应：< 30s（单个文件）
- UI 交互响应：< 100ms
- 批量修复：异步执行，不阻塞 UI

## 6. 扩展性设计

### 6.1 可配置项
1. **审查规则配置**
   - 自定义检测规则
   - 规则优先级
   - 规则启用/禁用

2. **AI 模型配置**
   - 模型选择（Claude, GPT-4, etc.）
   - Temperature 调节
   - Max tokens 设置

3. **界面配置**
   - 主题切换
   - 字体大小
   - 布局调整

### 6.2 插件扩展
1. **自定义检测器**
   - 支持第三方检测插件
   - Linter 集成
   - 静态分析工具集成

2. **报告导出**
   - Markdown 格式
   - HTML 格式
   - JSON 格式
   - PDF 格式

3. **团队协作**
   - 审查结果分享
   - 评论和讨论
   - 审查历史记录

## 7. 用户故事

### 7.1 基础审查流程
**作为**开发者
**我想要**快速审查我的代码变更
**以便**在提交 PR 前发现并修复问题

**验收标准**：
- [x] 可以选择要审查的分支
- [x] 可以选择审查范围（未提交/已提交/全部）
- [x] 点击审查按钮后显示进度
- [x] 审查完成后展示问题列表
- [x] 可以查看每个问题的详细信息

### 7.2 问题修复
**作为**开发者
**我想要**一键修复 AI 发现的问题
**以便**快速提升代码质量

**验收标准**：
- [x] 每个问题都有修复建议
- [x] Fixed Code 区域可编辑
- [x] 可以单独应用每个修复
- [x] 可以一键修复所有问题
- [x] 显示修复进度和状态

### 7.3 问题导航
**作为**开发者
**我想要**快速定位到具体的问题
**以便**快速理解和处理

**验收标准**：
- [x] 右侧插件显示问题列表
- [x] 点击问题后左侧编辑器自动定位
- [x] 定位时有平滑滚动和高亮效果
- [x] 支持在文件列表和问题详情间切换

## 8. 测试计划

### 8.1 功能测试
- [ ] Agent 类型切换
- [ ] 分支选择
- [ ] 审查范围选择
- [ ] 代码审查执行
- [ ] 结果展示
- [ ] 问题定位
- [ ] 单个修复
- [ ] 批量修复
- [ ] 代码编辑

### 8.2 性能测试
- [ ] 大文件审查（>1000行）
- [ ] 多文件审查（>100个文件）
- [ ] 批量修复性能
- [ ] 内存占用
- [ ] UI 响应速度

### 8.3 兼容性测试
- [ ] 不同 Git 版本
- [ ] 不同编程语言
- [ ] 不同操作系统
- [ ] 不同主题（明/暗）

### 8.4 用户体验测试
- [ ] 新手引导
- [ ] 操作流畅度
- [ ] 错误处理
- [ ] 边界情况

## 9. 发布计划

### 9.1 MVP（v1.0）
**时间**：当前已完成
**功能**：
- ✅ PR Agent 基础审查
- ✅ 问题检测和分类
- ✅ 修复建议生成
- ✅ 可编辑的修复代码
- ✅ 单个问题修复
- ✅ 批量修复（异步）
- ✅ 问题定位和导航

### 9.2 v1.1（计划）
**新增功能**：
- [ ] 真实 Git 集成
- [ ] 真实 AI API 调用
- [ ] 配置文件支持
- [ ] 更多编程语言支持
- [ ] 审查历史记录

### 9.3 v1.2（规划）
**新增功能**：
- [ ] 团队协作功能
- [ ] 自定义规则
- [ ] 报告导出
- [ ] 性能优化
- [ ] 插件系统

## 10. 常见问题

### 10.1 为什么需要 PR Agent？
传统代码审查依赖人工，效率低且容易遗漏问题。PR Agent 通过 AI 技术自动检测常见问题，提高审查效率和代码质量。

### 10.2 AI 审查准确吗？
AI 审查可以发现大部分常见问题，但仍建议结合人工审查。系统提供可编辑的修复代码，用户可以根据实际情况调整。

### 10.3 支持哪些编程语言？
当前主要支持 Java，后续将扩展到 TypeScript、Python、Go 等主流语言。

### 10.4 审查结果会保存吗？
当前版本仅在内存中保存，关闭后会丢失。v1.1 版本将支持历史记录功能。

### 10.5 如何自定义审查规则？
v1.2 版本将支持自定义规则配置。

## 11. 附录

### 11.1 参考资料
- Git 官方文档
- Claude AI 文档
- React 官方文档
- Tailwind CSS 文档

### 11.2 设计原则
1. **用户优先**：简单易用，降低学习成本
2. **性能第一**：快速响应，异步处理
3. **可扩展性**：模块化设计，易于扩展
4. **安全性**：代码审查本地执行，保护隐私

### 11.3 更新日志
- 2025-11-03：初始版本发布
- 待续...

---

**文档版本**：v1.0
**最后更新**：2025-11-03
**维护者**：开发团队