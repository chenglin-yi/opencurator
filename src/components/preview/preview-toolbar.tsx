"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/stores/ui-store";
import { useResumeStore } from "@/stores/resume-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useAI } from "@/hooks/use-ai";
import { ScoreDisplay } from "@/components/ai/score-display";
import {
  Download,
  Sparkles,
  BarChart3,
  FileSearch,
  Loader2,
  CheckCircle,
  Zap,
} from "lucide-react";

export function PreviewToolbar() {
  const { setExportOpen, setJDAnalyzerOpen } = useUIStore();
  const resumeStore = useResumeStore();
  const { setScore, hasScored, hasAnalyzedJD } = useAnalysisStore();
  const { optimizeResume, scoreResume, isLoading, error } = useAI();
  const [showScore, setShowScore] = React.useState(false);
  const [optimizeSuccess, setOptimizeSuccess] = React.useState(false);

  const handleOptimize = async () => {
    setOptimizeSuccess(false);
    const result = await optimizeResume();
    if (result) {
      if (result.summary) {
        resumeStore.setSummary(result.summary);
      }
      if (result.experience) {
        result.experience.forEach((optimizedExp) => {
          const existingExp = resumeStore.experience.find(
            (e) => e.company === optimizedExp.company && e.position === optimizedExp.position
          );
          if (existingExp) {
            resumeStore.updateExperience(existingExp.id, {
              description: optimizedExp.description,
            });
          }
        });
      }
      if (result.projects) {
        result.projects.forEach((optimizedProj) => {
          const existingProj = resumeStore.projects.find(
            (p) => p.name === optimizedProj.name
          );
          if (existingProj) {
            resumeStore.updateProject(existingProj.id, {
              description: optimizedProj.description,
              responsibilities: optimizedProj.responsibilities,
              techStack: optimizedProj.techStack || existingProj.techStack,
            });
          }
        });
      }
      setOptimizeSuccess(true);
      setTimeout(() => setOptimizeSuccess(false), 3000);
    }
  };

  const handleScore = async () => {
    setShowScore(false);
    const result = await scoreResume();
    if (result) {
      setScore(result);
      setShowScore(true);
    }
  };

  const { score } = useAnalysisStore();

  return (
    <div className="space-y-4">
      {/* 主要操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setExportOpen(true)}
          className="btn-gold gap-1.5 shadow-md shadow-primary/20"
        >
          <Download className="h-3.5 w-3.5" />
          <span>导出简历</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleScore}
          disabled={isLoading}
          className="gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
          )}
          <span>智能评分</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setJDAnalyzerOpen(true)}
          className="gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <FileSearch className="h-3.5 w-3.5 text-primary" />
          <span>JD分析</span>
        </Button>
        
        <Button
          variant={optimizeSuccess ? "default" : "outline"}
          size="sm"
          onClick={handleOptimize}
          disabled={isLoading}
          className={`gap-1.5 transition-all ${
            optimizeSuccess 
              ? 'btn-gold shadow-md shadow-primary/20' 
              : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : optimizeSuccess ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          )}
          <span>{optimizeSuccess ? "优化完成" : "一键优化"}</span>
        </Button>
      </div>

      {/* 状态标签 */}
      {(hasScored || hasAnalyzedJD) && (
        <div className="flex flex-wrap gap-2">
          {hasScored && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              已评分
            </Badge>
          )}
          {hasAnalyzedJD && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              已分析JD
            </Badge>
          )}
          {(hasScored || hasAnalyzedJD) && (
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              优化将参考以上分析
            </Badge>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-fade-in">
          {error}
        </div>
      )}

      {/* 成功提示 */}
      {optimizeSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">简历优化完成！</span>
          </div>
          <p className="mt-1 text-xs opacity-80">已根据评分建议和JD要求进行针对性优化</p>
        </div>
      )}

      {/* 评分显示 */}
      {showScore && score && <ScoreDisplay score={score} />}
    </div>
  );
}
