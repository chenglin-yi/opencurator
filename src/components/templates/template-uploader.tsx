"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTemplateStore } from "@/stores/template-store";
import { validateTemplate, TEMPLATE_TAGS_HELP } from "@/lib/template";
import { CustomTemplate } from "@/types/template";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export function TemplateUploader() {
  const { customTemplate, setCustomTemplate, clearCustomTemplate } =
    useTemplateStore();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    setIsUploading(true);

    try {
      // 验证模板
      const validation = await validateTemplate(file);
      if (!validation.valid) {
        setError(validation.error || "模板验证失败");
        return;
      }

      // 读取文件
      const arrayBuffer = await file.arrayBuffer();

      // 保存模板
      const template: CustomTemplate = {
        id: "custom",
        name: file.name.replace(".docx", ""),
        description: "用户上传的自定义Word模板",
        previewImage: "",
        isCustom: true,
        fileData: arrayBuffer,
        fileName: file.name,
        styles: {
          primaryColor: "#666",
          fontFamily: "sans",
          layout: "single-column",
        },
      };

      setCustomTemplate(template);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("处理文件失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    clearCustomTemplate();
    setError(null);
    setSuccess(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-serif">
            <FileText className="h-5 w-5 text-primary" />
            自定义Word模板
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            className="gap-1"
          >
            <HelpCircle className="h-4 w-4" />
            模板标签说明
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 模板标签帮助 */}
        {showHelp && (
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <pre className="whitespace-pre-wrap font-mono text-xs">
              {TEMPLATE_TAGS_HELP}
            </pre>
          </div>
        )}

        {/* 已上传的模板 */}
        {customTemplate && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{customTemplate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {customTemplate.fileName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">已上传</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 上传区域 */}
        {!customTemplate && (
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-4 text-sm">正在验证模板...</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium">
                  拖拽Word模板到此处或点击上传
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  支持 .docx 格式，最大10MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  选择文件
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* 成功提示 */}
        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            模板上传成功！现在可以在导出时选择使用此模板。
          </div>
        )}

        {/* 使用说明 */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            <strong>使用说明：</strong>
          </p>
          <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
            <li>上传包含模板标签的Word文件</li>
            <li>使用 {"{name}"}、{"{phone}"} 等标签插入数据</li>
            <li>使用 {"{#experience}"}...{"{/experience}"} 循环遍历列表</li>
            <li>导出时将自动替换标签为实际数据</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
