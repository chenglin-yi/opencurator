"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import { useResumeStore } from "@/stores/resume-store";
import { useConfigStore } from "@/stores/config-store";
import { useAI } from "@/hooks/use-ai";
import { parseWordFile, parsePDFFile, parseTextToResumePrompt, validateFileType, mergeResumeData } from "@/lib/parser";
import { callAI, extractJSON } from "@/lib/ai";
import { Resume } from "@/types/resume";
import {
  Upload,
  X,
  FileText,
  FileType,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function ImportDialog() {
  const { setImportOpen } = useUIStore();
  const resumeStore = useResumeStore();
  const { apiConfig } = useConfigStore();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [progress, setProgress] = React.useState<string>("");
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
    setProgress("");

    // 验证文件类型
    const validation = validateFileType(file);
    if (!validation.valid) {
      setError(validation.error || "文件格式不支持");
      return;
    }

    // 检查是否配置了API
    if (!apiConfig) {
      setError("请先在设置中配置AI API，以便智能解析简历内容");
      return;
    }

    setIsProcessing(true);

    try {
      // 步骤1: 解析文件
      setProgress("正在解析文件...");
      let textContent: string;
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));

      if (fileExtension === ".docx") {
        textContent = await parseWordFile(file);
      } else if (fileExtension === ".pdf") {
        textContent = await parsePDFFile(file);
      } else {
        throw new Error("不支持的文件格式");
      }

      if (!textContent.trim()) {
        throw new Error("文件内容为空，请检查文件是否正确");
      }

      // 步骤2: 使用AI解析内容
      setProgress("正在使用AI智能解析简历内容...");
      const prompt = parseTextToResumePrompt(textContent);
      
      const response = await callAI(apiConfig, [
        {
          role: "system",
          content: "你是一个简历解析专家，能够从文本中提取结构化的简历信息。请严格按照要求的JSON格式返回数据。",
        },
        { role: "user", content: prompt },
      ]);

      // 步骤3: 解析AI返回的JSON
      setProgress("正在处理解析结果...");
      const jsonContent = extractJSON(response.content);
      const parsedResume = JSON.parse(jsonContent) as Partial<Resume>;

      // 步骤4: 合并到现有简历
      const existingResume: Resume = {
        basicInfo: resumeStore.basicInfo,
        education: resumeStore.education,
        experience: resumeStore.experience,
        projects: resumeStore.projects,
        skills: resumeStore.skills,
        summary: resumeStore.summary,
      };

      const mergedResume = mergeResumeData(existingResume, parsedResume);

      // 步骤5: 更新store
      resumeStore.setBasicInfo(mergedResume.basicInfo);
      resumeStore.setSummary(mergedResume.summary);
      
      // 清除旧数据并添加新数据
      existingResume.education.forEach(edu => resumeStore.removeEducation(edu.id));
      existingResume.experience.forEach(exp => resumeStore.removeExperience(exp.id));
      existingResume.projects.forEach(proj => resumeStore.removeProject(proj.id));
      existingResume.skills.forEach(skill => resumeStore.removeSkill(skill.id));

      mergedResume.education.forEach(edu => {
        resumeStore.addEducation();
        const newEdu = resumeStore.education[resumeStore.education.length - 1];
        if (newEdu) {
          resumeStore.updateEducation(newEdu.id, edu);
        }
      });

      mergedResume.experience.forEach(exp => {
        resumeStore.addExperience();
        const newExp = resumeStore.experience[resumeStore.experience.length - 1];
        if (newExp) {
          resumeStore.updateExperience(newExp.id, exp);
        }
      });

      mergedResume.projects.forEach(proj => {
        resumeStore.addProject();
        const newProj = resumeStore.projects[resumeStore.projects.length - 1];
        if (newProj) {
          resumeStore.updateProject(newProj.id, proj);
        }
      });

      mergedResume.skills.forEach(skill => {
        resumeStore.addSkill();
        const newSkill = resumeStore.skills[resumeStore.skills.length - 1];
        if (newSkill) {
          resumeStore.updateSkill(newSkill.id, skill);
        }
      });

      setSuccess(true);
      setProgress("导入完成！");
      
      // 3秒后关闭对话框
      setTimeout(() => {
        setImportOpen(false);
      }, 2000);

    } catch (err) {
      console.error("导入失败:", err);
      setError(err instanceof Error ? err.message : "导入失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-serif">
              <Upload className="h-5 w-5 text-primary" />
              导入简历
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setImportOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 上传区域 */}
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : isProcessing
                  ? "border-muted-foreground/25 bg-muted/50"
                  : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-sm font-medium">{progress}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  请稍候，正在处理您的简历...
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium">
                  拖拽简历文件到此处或点击上传
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  支持 Word(.docx) 和 PDF(.pdf) 格式，最大20MB
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
                  accept=".docx,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </>
            )}
          </div>

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
              简历导入成功！即将自动关闭...
            </div>
          )}

          {/* 支持的格式 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <FileType className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Word文件</p>
                <p className="text-xs text-muted-foreground">.docx</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <FileText className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-sm font-medium">PDF文件</p>
                <p className="text-xs text-muted-foreground">.pdf</p>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>导入说明：</strong>
            </p>
            <ul className="mt-1 list-disc pl-4 text-xs text-muted-foreground">
              <li>系统将使用AI智能解析简历内容</li>
              <li>解析结果将自动填充到表单中</li>
              <li>您可以在导入后手动调整内容</li>
              <li>需要先配置AI API才能使用导入功能</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
