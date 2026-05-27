<div align="center">

# OpenCurator

### AI-Powered Resume Studio

<p align="center">
  <strong>Create professional resumes with AI assistance</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

</div>

---

## Introduction

OpenCurator is an AI-powered resume builder that helps you create professional resumes tailored to your target positions. Like a museum curator carefully crafts exhibitions, OpenCurator helps you craft your career story with precision and elegance.

## Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Optimization** | One-click resume optimization using OpenAI, Claude, or custom APIs |
| 📊 **Resume Scoring** | AI-powered scoring with detailed feedback and suggestions |
| 📋 **JD Analysis** | Analyze job descriptions to match keywords and requirements |
| 📝 **Multi-Template** | 3 professional templates: Classic, Modern, and Tech |
| 📥 **Import Support** | Import from Word (.docx) and PDF files |
| 📤 **Export Options** | Export to Word and PDF with template styling |
| 🌙 **Dark Mode** | Light and dark theme support |
| 💼 **Recruitment Type** | Separate optimization for social and campus recruitment |
| 💾 **Data Persistence** | Auto-save to localStorage and IndexedDB |

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/opencurator.git

# Navigate to project directory
cd opencurator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
# Build the project
npm run build

# The output will be in the 'out' directory
# Upload the 'out' directory to Edgeone or any static hosting
```

## Usage Guide

### 1. Configure AI API

Click the ⚙️ icon in the header to configure your AI API:

- **OpenAI**: Enter your OpenAI API key
- **Claude**: Enter your Anthropic API key  
- **Custom**: Enter endpoint URL for OpenAI-compatible APIs

### 2. Fill Resume Information

Complete each section in the left panel:
- Basic Information (name, contact, target position)
- Education Background
- Work Experience
- Project Experience
- Skills
- Personal Summary

### 3. AI Optimization

- **One-Click Optimize**: Click "一键优化" to optimize the entire resume
- **Section Optimize**: Click the ✨ icon on each section to optimize individually
- **JD Analysis**: Paste job description to analyze requirements
- **Resume Score**: Get AI-powered scoring and feedback

### 4. Export Resume

Click "导出简历" to export:
- Choose template (Classic/Modern/Tech)
- Export as Word or PDF
- Or upload custom Word template

## Templates

### Classic Business
- Primary Color: Navy Blue `#1E3A5F`
- Style: Traditional, stable, professional
- Best for: Finance, consulting, traditional industries

### Modern Minimal
- Primary Color: Bright Blue `#2563EB`
- Style: Modern, clean, dynamic
- Best for: Internet, tech companies

### Tech Resume
- Primary Color: Emerald Green `#059669`
- Style: Technical, clear, efficient
- Best for: Technical positions, engineers

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14, React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| State | Zustand |
| AI | OpenAI SDK (compatible with multiple providers) |
| Export | docx.js, @react-pdf/renderer |
| Import | mammoth.js, pdf-parse |

## Project Structure

```
opencurator/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   │   ├── ai/        # AI-related components
│   │   ├── export/    # Export dialogs
│   │   ├── forms/     # Resume forms
│   │   ├── import/    # Import components
│   │   ├── layout/    # Layout components
│   │   ├── preview/   # Preview components
│   │   ├── templates/ # Template components
│   │   └── ui/        # Base UI components
│   ├── lib/           # Utility functions
│   ├── stores/        # Zustand stores
│   ├── hooks/         # Custom hooks
│   └── types/         # TypeScript types
└── package.json
```

## Deployment

### Edgeone Deployment

1. Build the project: `npm run build`
2. Upload the `out` directory to Edgeone
3. Configure your domain

### Other Platforms

The project generates static files that can be deployed to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Environment Variables

No environment variables required. The API keys are configured by users in the browser and stored locally.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

---

<div align="center">

**Made with ❤️ by OpenCurator Team**

</div>
