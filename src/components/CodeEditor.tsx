import { useState } from "react";

export const CodeEditor = () => {
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

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--editor-bg))]">
      <div className="h-10 bg-[hsl(var(--editor-sidebar))] border-b border-[hsl(var(--editor-border))] flex items-center px-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-[hsl(var(--editor-hover))] rounded text-sm">
          <span className="text-blue-400">M!</span>
          <span>README.md</span>
          <span className="ml-2 text-muted-foreground">×</span>
        </div>
      </div>

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
    </div>
  );
};
