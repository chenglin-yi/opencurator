<div align="center">

# OpenCurator

### AI智能简历制作工具

<p align="center">
  <strong>用AI打造专业简历，开启职业新篇章</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

</div>

---

## 简介

OpenCurator 是一个AI驱动的在线简历制作工具，帮助您创建针对目标职位的专业简历。就像博物馆策展人精心策划展览一样，OpenCurator 帮助您精准地打造您的职业故事。

## 核心功能

| 功能 | 说明 |
|------|------|
| 🤖 **AI优化** | 支持OpenAI、Claude或自定义API的一键简历优化 |
| 📊 **简历评分** | AI评分系统，提供详细反馈和改进建议 |
| 📋 **JD分析** | 分析职位描述，匹配关键词和要求 |
| 📝 **多模板** | 3种专业模板：经典商务、现代简约、技术简历 |
| 📥 **导入支持** | 支持从Word (.docx) 和PDF文件导入 |
| 📤 **导出选项** | 导出为Word和PDF，支持模板样式 |
| 🌙 **暗色模式** | 支持亮色和暗色主题切换 |
| 💼 **招聘类型** | 社招和校招分别优化 |
| 💾 **数据持久化** | 自动保存到浏览器本地存储 |

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/opencurator.git

# 进入项目目录
cd opencurator

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 http://localhost:3001

### 生产构建

```bash
# 构建项目
npm run build

# 输出文件在 'out' 目录
# 将 'out' 目录上传到Edgeone或任何静态托管服务
```

## 使用指南

### 1. 配置AI API

点击顶部导航栏的 ⚙️ 图标配置AI API：

- **OpenAI**：输入您的OpenAI API密钥
- **Claude**：输入您的Anthropic API密钥
- **自定义**：输入OpenAI兼容API的端点URL

> 💡 API密钥仅存储在您的浏览器本地，不会上传到服务器

### 2. 选择招聘类型

在基本信息中选择招聘类型：
- **社会招聘**：适合有工作经验的求职者
- **校园招聘**：适合应届毕业生和实习生

### 3. 填写简历信息

在左侧面板完成各个部分：

| 部分 | 说明 |
|------|------|
| 基本信息 | 姓名、联系方式、求职意向 |
| 教育背景 | 学校、学历、专业、GPA |
| 工作经历 | 公司、职位、工作描述 |
| 项目经历 | 项目名称、技术栈、个人职责 |
| 技能清单 | 技能标签和熟练程度 |
| 自我评价 | 个人总结和职业目标 |

### 4. AI优化

- **一键优化**：点击"一键优化"按钮优化整份简历
- **分段优化**：点击每个部分的 ✨ 图标单独优化
- **JD分析**：粘贴职位描述，AI自动分析要求
- **简历评分**：获取AI评分和详细反馈

### 5. 导出简历

点击"导出简历"进行导出：

1. 选择模板风格（经典/现代/技术）
2. 选择导出格式（Word或PDF）
3. 或上传自定义Word模板

## 模板样式

### 经典商务 (Classic)

```
┌─────────────────────────────┐
│         张三丰              │ ← 居中大号姓名
│      前端开发工程师         │
│  138xxx | xx@xx.com         │
│ ─────────────────────────── │
│ ■ 教育背景                  │ ← 专业标题
│   XX大学 | 本科 | 计算机    │
│ ■ 工作经历                  │
│   XX公司 | 前端开发         │
│   · 负责XX项目开发...       │
└─────────────────────────────┘
```

- 主色调：深海蓝 `#1E3A5F`
- 风格：传统、稳重、专业
- 适合：金融、咨询、传统行业

### 现代简约 (Modern)

- 主色调：亮蓝 `#2563EB`
- 风格：现代、简洁、活力
- 适合：互联网、科技公司

### 技术简历 (Tech)

- 主色调：翠绿 `#059669`
- 风格：技术、清晰、高效
- 适合：技术岗位、工程师

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 14, React 18 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS, shadcn/ui |
| 状态管理 | Zustand |
| AI集成 | OpenAI SDK（兼容多种提供商） |
| 导出 | docx.js, @react-pdf/renderer |
| 导入 | mammoth.js, pdf-parse |

## 项目结构

```
opencurator/
├── public/              # 静态资源
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React组件
│   │   ├── ai/        # AI相关组件
│   │   ├── export/    # 导出对话框
│   │   ├── forms/     # 简历表单
│   │   ├── import/    # 导入组件
│   │   ├── layout/    # 布局组件
│   │   ├── preview/   # 预览组件
│   │   ├── templates/ # 模板组件
│   │   └── ui/        # 基础UI组件
│   ├── lib/           # 工具函数
│   ├── stores/        # Zustand状态管理
│   ├── hooks/         # 自定义Hooks
│   └── types/         # TypeScript类型
├── templates/           # 简历模板
└── package.json
```

## 部署

### Edgeone部署（推荐）

1. 构建项目：`npm run build`
2. 上传 `out` 目录到Edgeone静态网站托管
3. 配置您的域名

### 其他平台

项目生成静态文件，可部署到任何静态托管服务：

- **Vercel**：直接连接GitHub仓库
- **Netlify**：拖拽上传 `out` 目录
- **GitHub Pages**：推送到 `gh-pages` 分支
- **Cloudflare Pages**：连接Git仓库

## 常见问题

### Q: API密钥安全吗？

A: 是的，API密钥仅存储在您的浏览器本地（localStorage），不会上传到任何服务器。

### Q: 支持哪些AI模型？

A: 支持OpenAI（GPT-4、GPT-3.5）、Claude（Opus、Sonnet、Haiku）以及任何OpenAI兼容API。

### Q: 简历数据会丢失吗？

A: 不会，简历数据自动保存到浏览器localStorage，刷新页面后仍然保留。

### Q: 可以上传自己的Word模板吗？

A: 可以，在导出对话框中点击"上传模板"即可上传自定义Word模板。

## 许可证

MIT License

---

<div align="center">

**Made with ❤️ by OpenCurator Team**

</div>
