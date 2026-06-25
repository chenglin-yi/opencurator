"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAI } from "@/hooks/use-ai";
import { useUIStore } from "@/stores/ui-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { useResumeStore } from "@/stores/resume-store";
import { ResumeDiagnosis, DoctorPhase } from "@/types/resume";
import {
  Stethoscope,
  X,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Shield,
  Building2,
  Eye,
  UserCheck,
} from "lucide-react";

const PHASE_LABELS: Record<DoctorPhase, string> = {
  diagnosis: "简历诊断",
  "user-feedback": "用户反馈",
  optimization: "智能优化",
  review: "质量审查",
  done: "优化完成",
};

const PHASE_DESCRIPTIONS: Record<DoctorPhase, string> = {
  diagnosis: "以大厂HR视角对简历进行深度诊断，发现硬伤和潜在风险",
  "user-feedback": "根据诊断结果，请您补充关键信息以提升优化质量",
  optimization: "基于诊断结果和您的反馈，针对性优化简历内容",
  review: "反思审查优化结果，确保质量达标、逻辑自洽",
  done: "所有优化已完成，请查看并应用优化结果",
};

const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    badge: "destructive" as const,
    label: "严重",
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    badge: "secondary" as const,
    label: "警告",
  },
  info: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    badge: "outline" as const,
    label: "提示",
  },
};

// 步骤指示器
function StepIndicator({ currentPhase }: { currentPhase: DoctorPhase }) {
  const phases: DoctorPhase[] = ["diagnosis", "user-feedback", "optimization", "review", "done"];
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-1 px-2">
      {phases.map((phase, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        return (
          <React.Fragment key={phase}>
            {index > 0 && (
              <div
                className={`h-px flex-1 min-w-[12px] transition-colors ${
                  isCompleted ? "bg-primary" : "bg-border"
                }`}
              />
            )}
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : isCompleted
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <span className="h-3.5 w-3.5 flex items-center justify-center text-[9px]">
                  {index + 1}
                </span>
              )}
              <span className="hidden sm:inline">{PHASE_LABELS[phase]}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 诊断报告展示
function DiagnosisReport({ diagnosis }: { diagnosis: ResumeDiagnosis }) {
  const [expandedIssues, setExpandedIssues] = React.useState<Set<number>>(new Set([0]));

  const toggleIssue = (index: number) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* 整体评价 */}
      <div className="rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 p-4 border border-primary/10">
        <p className="flex items-center gap-2 text-sm font-medium mb-2">
          <Building2 className="h-4 w-4 text-primary" />
          大厂HR视角的整体评价
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {diagnosis.overallAssessment}
        </p>
      </div>

      {/* 硬伤列表 */}
      {diagnosis.issues.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            发现 {diagnosis.issues.length} 个问题
          </p>
          {diagnosis.issues.map((issue, index) => {
            const config = SEVERITY_CONFIG[issue.severity];
            const Icon = config.icon;
            const isExpanded = expandedIssues.has(index);

            return (
              <div
                key={index}
                className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden`}
              >
                <button
                  onClick={() => toggleIssue(index)}
                  className="w-full flex items-center gap-2 p-3 text-left hover:opacity-80 transition-opacity"
                >
                  <Icon className={`h-4 w-4 ${config.color} shrink-0`} />
                  <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">
                    {config.label}
                  </Badge>
                  <span className="text-sm font-medium flex-1">{issue.title}</span>
                  {issue.needsUserInput && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                      需补充
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 border-t border-current/5">
                    <p className="text-sm text-muted-foreground pt-2">
                      {issue.description}
                    </p>
                    <div className="flex items-start gap-2 text-sm">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/80">{issue.suggestion}</span>
                    </div>
                    {issue.needsUserInput && issue.userPrompt && (
                      <div className="flex items-start gap-2 text-sm rounded-md bg-primary/5 p-2 border border-primary/10">
                        <UserCheck className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        <span className="text-primary/80">{issue.userPrompt}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 结构性建议 */}
      {diagnosis.structural.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Eye className="h-4 w-4 text-blue-500" />
            结构性改进建议
          </p>
          {diagnosis.structural.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3 space-y-1"
            >
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              <p className="text-xs text-foreground/80 flex items-start gap-1">
                <ArrowRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                {item.action}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 隐性风险 */}
      {diagnosis.risks.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Shield className="h-4 w-4 text-amber-500" />
            HR隐性担忧
          </p>
          {diagnosis.risks.map((risk, index) => (
            <div
              key={index}
              className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 space-y-1"
            >
              <p className="text-sm font-medium">{risk.category}</p>
              <p className="text-xs text-muted-foreground">{risk.description}</p>
              <p className="text-xs text-foreground/80 flex items-start gap-1">
                <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                应对策略：{risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 审查结果展示
function ReviewResultDisplay({
  reviewResult,
}: {
  reviewResult: {
    passed: boolean;
    score: number;
    fixedIssues: string[];
    remainingIssues: Array<{ title: string; description: string; suggestion: string }>;
    qualityNotes: string;
  };
}) {
  return (
    <div className="space-y-4">
      <div
        className={`rounded-lg p-4 ${
          reviewResult.passed
            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {reviewResult.passed ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          <span className="text-sm font-medium">
            {reviewResult.passed ? "审查通过" : "有待改进"}
          </span>
          <Badge variant={reviewResult.passed ? "default" : "secondary"}>
            {reviewResult.score}分
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{reviewResult.qualityNotes}</p>
      </div>

      {reviewResult.fixedIssues.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            已修复的问题
          </p>
          {reviewResult.fixedIssues.map((issue, i) => (
            <p key={i} className="text-xs text-muted-foreground pl-5">
              {issue}
            </p>
          ))}
        </div>
      )}

      {reviewResult.remainingIssues.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-yellow-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            仍需改进的问题
          </p>
          {reviewResult.remainingIssues.map((issue, i) => (
            <div key={i} className="pl-5 space-y-0.5">
              <p className="text-xs font-medium">{issue.title}</p>
              <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 主组件
export function ResumeDoctor() {
  const { setDoctorOpen } = useUIStore();
  const {
    diagnosis,
    hasDiagnosed,
    doctorPhase,
    userFeedback,
    reviewResult,
    optimizationRound,
    setDiagnosis,
    setDoctorPhase,
    setUserFeedback,
    setReviewResult,
    incrementOptimizationRound,
    resetDoctorWorkflow,
  } = useAnalysisStore();
  const resumeStore = useResumeStore();
  const {
    diagnoseResume,
    optimizeResume,
    reviewOptimization,
    reviseAfterReview,
    isLoading,
    error,
  } = useAI();

  // 暂存优化结果
  const [optimizedData, setOptimizedData] = React.useState<Partial<{
    summary: string;
    experience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>;
    projects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>;
  }> | null>(null);

  // 第一步：诊断
  const handleDiagnose = async () => {
    const result = await diagnoseResume();
    if (result) {
      setDiagnosis(result);
    }
  };

  // 第二步：用户反馈后进入优化
  const handleStartOptimization = async () => {
    if (!diagnosis) return;
    setDoctorPhase("optimization");
    const result = await optimizeResume(
      undefined,
      diagnosis,
      userFeedback || undefined
    );
    if (result) {
      setOptimizedData(result);
      // 自动进入审查阶段
      setDoctorPhase("review");
      await runReview(result);
    }
  };

  // 第三步：审查
  const runReview = async (optimized: Partial<{
    summary: string;
    experience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>;
    projects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>;
  }>) => {
    if (!diagnosis) return;

    const reviewData = await reviewOptimization(
      optimized.summary || "",
      optimized.experience || [],
      optimized.projects || [],
      diagnosis,
      userFeedback || undefined
    );

    if (reviewData) {
      setReviewResult(reviewData);

      if (reviewData.passed || optimizationRound >= 1) {
        // 审查通过或已达最大轮次
        setDoctorPhase("done");
      } else {
        // 需要修正，自动进入下一轮
        incrementOptimizationRound();
        const revised = await reviseAfterReview(
          optimized.summary || "",
          optimized.experience || [],
          optimized.projects || [],
          reviewData.remainingIssues
        );
        if (revised) {
          setOptimizedData(revised);
          // 再次审查
          setDoctorPhase("review");
          const secondReview = await reviewOptimization(
            revised.summary || "",
            revised.experience || [],
            revised.projects || [],
            diagnosis,
            userFeedback || undefined
          );
          if (secondReview) {
            setReviewResult(secondReview);
          }
          setDoctorPhase("done");
        }
      }
    }
  };

  // 应用优化结果到简历
  const handleApplyOptimization = () => {
    if (!optimizedData) return;

    if (optimizedData.summary) {
      resumeStore.setSummary(optimizedData.summary);
    }

    if (optimizedData.experience) {
      optimizedData.experience.forEach((optExp) => {
        const existing = resumeStore.experience.find(
          (e) => e.company === optExp.company && e.position === optExp.position
        );
        if (existing) {
          resumeStore.updateExperience(existing.id, {
            description: optExp.description,
          });
        }
      });
    }

    if (optimizedData.projects) {
      optimizedData.projects.forEach((optProj) => {
        const existing = resumeStore.projects.find(
          (p) => p.name === optProj.name
        );
        if (existing) {
          resumeStore.updateProject(existing.id, {
            description: optProj.description,
            responsibilities: optProj.responsibilities,
            techStack: optProj.techStack,
          });
        }
      });
    }

    setDoctorOpen(false);
  };

  // 重置工作流
  const handleReset = () => {
    resetDoctorWorkflow();
    setOptimizedData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col">
        <CardHeader className="pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-serif">
              <Stethoscope className="h-5 w-5 text-primary" />
              AI简历诊断
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDoctorOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <StepIndicator currentPhase={doctorPhase} />
          <p className="text-xs text-muted-foreground mt-1">
            {PHASE_DESCRIPTIONS[doctorPhase]}
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 诊断阶段 */}
          {doctorPhase === "diagnosis" && !hasDiagnosed && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">准备开始简历诊断</p>
                <p className="text-xs text-muted-foreground max-w-md">
                  AI将以字节跳动、阿里巴巴、腾讯等头部公司资深HR的视角，对您的简历进行全面深度诊断，
                  发现硬伤、结构性缺陷和隐性风险。
                </p>
              </div>
              <Button onClick={handleDiagnose} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Stethoscope className="h-4 w-4" />
                )}
                {isLoading ? "诊断中..." : "开始诊断"}
              </Button>
            </div>
          )}

          {/* 诊断结果展示 */}
          {hasDiagnosed && diagnosis && doctorPhase === "user-feedback" && (
            <div className="space-y-4">
              <DiagnosisReport diagnosis={diagnosis} />

              {/* 用户反馈区域 */}
              <div className="rounded-lg border p-4 space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  补充信息（可选）
                </p>
                <p className="text-xs text-muted-foreground">
                  根据以上诊断结果，您可以补充一些关键信息来帮助AI更好地优化简历。
                  例如：回答诊断中提到的需要补充的问题、提供更准确的数据基线、说明项目的真实业务规模等。
                </p>
                {diagnosis.userFeedbackPrompts.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-primary">建议回答以下问题：</p>
                    {diagnosis.userFeedbackPrompts.map((prompt, i) => (
                      <p key={i} className="text-xs text-muted-foreground pl-3">
                        {i + 1}. {prompt}
                      </p>
                    ))}
                  </div>
                )}
                <Textarea
                  placeholder="请输入您想补充的信息...（可留空，AI将仅基于诊断结果进行优化）"
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleStartOptimization}
                    disabled={isLoading}
                    className="flex-1 gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isLoading ? "优化中..." : "开始智能优化"}
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-1">
                    <RotateCcw className="h-3.5 w-3.5" />
                    重新诊断
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 优化/审查中 */}
          {(doctorPhase === "optimization" || doctorPhase === "review") && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {doctorPhase === "optimization"
                    ? "正在智能优化简历..."
                    : "正在反思审查优化结果..."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {doctorPhase === "optimization"
                    ? "AI正在根据诊断结果和您的反馈，针对性优化简历内容"
                    : "AI正在以面试官视角审查优化结果，检查数据逻辑自洽性"}
                </p>
              </div>
            </div>
          )}

          {/* 完成阶段 */}
          {doctorPhase === "done" && (
            <div className="space-y-4">
              {/* 审查结果 */}
              {reviewResult && <ReviewResultDisplay reviewResult={reviewResult} />}

              {/* 优化结果预览 */}
              {optimizedData && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    优化结果预览
                  </p>

                  {optimizedData.summary && (
                    <div className="rounded-lg border p-3 space-y-1">
                      <p className="text-xs font-medium text-primary">自我评价</p>
                      <p className="text-sm text-muted-foreground">
                        {optimizedData.summary}
                      </p>
                    </div>
                  )}

                  {optimizedData.experience?.map((exp, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-1">
                      <p className="text-xs font-medium text-primary">
                        {exp.company} - {exp.position}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {exp.description}
                      </p>
                    </div>
                  ))}

                  {optimizedData.projects?.map((proj, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-1">
                      <p className="text-xs font-medium text-primary">
                        {proj.name} - {proj.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {proj.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {proj.responsibilities}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleApplyOptimization}
                  className="flex-1 gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  应用优化结果
                </Button>
                <Button variant="outline" onClick={handleReset} className="gap-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  重新开始
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
