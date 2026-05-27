"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { ResumeForm } from "@/components/forms/resume-form";
import { ResumePreview } from "@/components/preview/resume-preview";
import { TemplateSelector } from "@/components/preview/template-selector";
import { PreviewToolbar } from "@/components/preview/preview-toolbar";
import { ExportDialog } from "@/components/export/export-dialog";
import { ImportDialog } from "@/components/import/import-dialog";
import { useUIStore } from "@/stores/ui-store";

// 动态导入可能有问题的组件
const ConfigPanel = dynamic(
  () => import("@/components/ai/config-panel").then(mod => ({ default: mod.ConfigPanel })),
  { ssr: false }
);

const JDAnalyzer = dynamic(
  () => import("@/components/ai/jd-analyzer").then(mod => ({ default: mod.JDAnalyzer })),
  { ssr: false }
);

export default function Home() {
  const { isConfigOpen, isJDAnalyzerOpen, isExportOpen, isImportOpen } =
    useUIStore();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gold-light/5 blur-[100px]" />
      </div>

      <Header />
      
      <main className="container py-8">
        {/* 页面标题 */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium px-4">
              Craft Your Story
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/20" />
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* 左侧 - 简历编辑区域 */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <span className="text-xs font-bold text-primary">01</span>
              </div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Edit Resume
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <ResumeForm />
          </div>

          {/* 右侧 - 预览区域 */}
          <div className="lg:col-span-5 space-y-6 animate-fade-in-up stagger-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                <span className="text-xs font-bold text-primary">02</span>
              </div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Preview & Export
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <div className="lg:sticky lg:top-24 space-y-6">
              <PreviewToolbar />
              <div className="card-elegant rounded-xl border bg-card shadow-sm">
                <ResumePreview />
              </div>
              <TemplateSelector />
            </div>
          </div>
        </div>
      </main>

      {/* 底部装饰 */}
      <footer className="container py-8 mt-16">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            OpenCurator &middot; AI-Powered Resume Studio
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </footer>

      {/* 对话框 */}
      {isConfigOpen && <ConfigPanel />}
      {isJDAnalyzerOpen && <JDAnalyzer />}
      {isExportOpen && <ExportDialog />}
      {isImportOpen && <ImportDialog />}
    </div>
  );
}
