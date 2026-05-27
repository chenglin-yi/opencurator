"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/stores/ui-store";
import { useResumeStore } from "@/stores/resume-store";
import { useTemplateStore } from "@/stores/template-store";
import { exportToWord, exportToPDF } from "@/lib/resume";
import { exportWithCustomTemplate } from "@/lib/template";
import { Resume } from "@/types/resume";
import {
  Download,
  X,
  FileText,
  FileType,
  Loader2,
  CheckCircle,
  Upload,
  AlertCircle,
} from "lucide-react";

export function ExportDialog() {
  const { setExportOpen } = useUIStore();
  const resumeStore = useResumeStore();
  const { selectedTemplate, customTemplate, setCustomTemplate, clearCustomTemplate, loadTemplate, getTemplateData } = useTemplateStore();
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportSuccess, setExportSuccess] = React.useState<string | null>(null);
  const [showTemplateUpload, setShowTemplateUpload] = React.useState(false);
  
  // 模板上传状态
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 加载已保存的模板
  React.useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const getResume = (): Resume => ({
    basicInfo: resumeStore.basicInfo,
    education: resumeStore.education,
    experience: resumeStore.experience,
    projects: resumeStore.projects,
    skills: resumeStore.skills,
    summary: resumeStore.summary,
  });

  const handleExportWord = async (useCustomTemplate: boolean = false) => {
    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      const resume = getResume();
      
      if (useCustomTemplate) {
        // 从IndexedDB获取模板数据
        const templateData = await getTemplateData();
        if (templateData) {
          await exportWithCustomTemplate(resume, templateData);
        } else {
          throw new Error("模板数据不存在，请重新上传");
        }
      } else {
        // 使用选择的模板样式导出
        await exportToWord(resume, selectedTemplate);
      }
      
      setExportSuccess("Word");
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error("导出Word失败:", error);
      alert(error instanceof Error ? error.message : "导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportSuccess(null);
    
    try {
      // 使用选择的模板样式导出
      await exportToPDF(getResume(), selectedTemplate);
      setExportSuccess("PDF");
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error("导出PDF失败:", error);
      alert("导出失败，请重试");
    } finally {
      setIsExporting(false);
    }
  };

  // 模板上传处理
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
      await handleTemplateFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleTemplateFile(files[0]);
    }
  };

  const handleTemplateFile = async (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    // 验证文件类型
    if (!file.name.endsWith(".docx")) {
      setUploadError("请上传.docx格式的Word文件");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("文件大小不能超过10MB");
      return;
    }

    setIsUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      await setCustomTemplate({
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
      });
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setUploadError("处理文件失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveTemplate = async () => {
    await clearCustomTemplate();
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-serif">
              <Download className="h-5 w-5 text-primary" />
              导出简历
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExportOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 导出成功提示 */}
          {exportSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              {exportSuccess}格式简历导出成功！
            </div>
          )}

          {/* 默认模板导出 */}
          <div className="space-y-3">
            <p className="text-sm font-medium">使用默认模板导出</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex h-20 flex-col items-center justify-center gap-2"
                onClick={() => handleExportWord(false)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                ) : (
                  <FileType className="h-6 w-6 text-blue-500" />
                )}
                <span>Word格式</span>
              </Button>

              <Button
                variant="outline"
                className="flex h-20 flex-col items-center justify-center gap-2"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                ) : (
                  <FileText className="h-6 w-6 text-red-500" />
                )}
                <span>PDF格式</span>
              </Button>
            </div>
          </div>

          {/* 自定义模板导出 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">自定义Word模板</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateUpload(!showTemplateUpload)}
              >
                {showTemplateUpload ? "收起" : customTemplate ? "管理模板" : "上传模板"}
              </Button>
            </div>

            {/* 模板上传区域 */}
            {showTemplateUpload && (
              <div className="space-y-3 rounded-lg border p-4">
                {/* 已上传的模板 */}
                {customTemplate && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{customTemplate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customTemplate.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">已保存</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveTemplate}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 上传区域 */}
                {!customTemplate && (
                  <div
                    className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm">正在保存到本地...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground/50" />
                        <p className="mt-2 text-sm font-medium">
                          点击或拖拽上传Word模板
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          支持 .docx 格式，最大10MB
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          模板将保存到浏览器本地存储
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {/* 错误提示 */}
                {uploadError && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {uploadError}
                  </div>
                )}

                {/* 成功提示 */}
                {uploadSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    模板已保存到浏览器，下次打开无需重新上传
                  </div>
                )}

                {/* 使用说明 */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>模板标签示例：</strong></p>
                  <p className="font-mono bg-muted p-1 rounded">{"{name} {phone} {email}"}</p>
                  <p className="font-mono bg-muted p-1 rounded">{"{#experience} {company} {description} {/experience}"}</p>
                </div>
              </div>
            )}

            {customTemplate && (
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={() => handleExportWord(true)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileType className="h-4 w-4" />
                )}
                使用自定义模板导出 Word
                <Badge variant="secondary" className="ml-2">
                  {customTemplate.name}
                </Badge>
              </Button>
            )}
          </div>

          {/* 提示信息 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>存储说明：</strong>
            </p>
            <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
              <li>默认模板：使用系统内置的专业简历模板</li>
              <li>自定义模板：上传后会保存到浏览器 IndexedDB</li>
              <li>关闭浏览器后模板仍然保留，无需重复上传</li>
              <li>简历数据保存在 localStorage，模板文件保存在 IndexedDB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
