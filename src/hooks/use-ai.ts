"use client";

import { useState } from "react";
import { useConfigStore } from "@/stores/config-store";
import { useResumeStore } from "@/stores/resume-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { callAI, parseAIJSON } from "@/lib/ai";
import {
  getResumeOptimizeSystemPrompt,
  getResumeOptimizePrompt,
  JD_ANALYSIS_SYSTEM_PROMPT,
  getJDAnalysisPrompt,
  RESUME_SCORING_SYSTEM_PROMPT,
  getResumeScoringPrompt,
  getExperienceOptimizePrompt,
  getProjectOptimizePrompt,
  RESUME_DIAGNOSIS_SYSTEM_PROMPT,
  getResumeDiagnosisPrompt,
  RESUME_REVIEW_SYSTEM_PROMPT,
  getResumeReviewPrompt,
  getRevisionPrompt,
} from "@/lib/prompts";
import { Resume, JDAnalysis, ResumeScore, ResumeDiagnosis } from "@/types/resume";

export function useAI() {
  const { apiConfig } = useConfigStore();
  const resumeStore = useResumeStore();
  const { getOptimizationContext } = useAnalysisStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================
  // 简历诊断（大厂HR视角）
  // ============================================================
  const diagnoseResume = async (targetPosition?: string): Promise<ResumeDiagnosis | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resume: Resume = {
        basicInfo: resumeStore.basicInfo,
        education: resumeStore.education,
        experience: resumeStore.experience,
        projects: resumeStore.projects,
        skills: resumeStore.skills,
        summary: resumeStore.summary,
      };

      const response = await callAI(apiConfig, [
        { role: "system", content: RESUME_DIAGNOSIS_SYSTEM_PROMPT },
        {
          role: "user",
          content: getResumeDiagnosisPrompt(
            resume,
            targetPosition || resume.basicInfo.targetPosition
          ),
        },
      ], { maxTokens: 8000 });

      const diagnosis: ResumeDiagnosis = parseAIJSON(response.content);
      return diagnosis;
    } catch (err) {
      setError(err instanceof Error ? err.message : "诊断失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 简历优化（支持诊断上下文和用户反馈）
  // ============================================================
  const optimizeResume = async (
    targetPosition?: string,
    diagnosis?: ResumeDiagnosis,
    userFeedback?: string
  ): Promise<Partial<Resume> | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resume: Resume = {
        basicInfo: resumeStore.basicInfo,
        education: resumeStore.education,
        experience: resumeStore.experience,
        projects: resumeStore.projects,
        skills: resumeStore.skills,
        summary: resumeStore.summary,
      };

      // 获取优化上下文（评分建议 + JD分析）
      const optimizationContext = getOptimizationContext();
      
      const systemPrompt = getResumeOptimizeSystemPrompt(resume.basicInfo.recruitmentType, resume.basicInfo.jobCategory);

      const response = await callAI(apiConfig, [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: getResumeOptimizePrompt(
            resume,
            targetPosition || resume.basicInfo.targetPosition,
            optimizationContext || undefined,
            diagnosis,
            userFeedback
          ),
        },
      ], { maxTokens: 6000 });

      const optimized = parseAIJSON(response.content);
      return optimized;
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 反思审查（检查优化结果质量）
  // ============================================================
  const reviewOptimization = async (
    optimizedSummary: string,
    optimizedExperience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
    optimizedProjects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>,
    diagnosis: ResumeDiagnosis,
    userFeedback?: string
  ): Promise<{
    passed: boolean;
    score: number;
    fixedIssues: string[];
    remainingIssues: Array<{ title: string; description: string; suggestion: string }>;
    qualityNotes: string;
  } | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resume: Resume = {
        basicInfo: resumeStore.basicInfo,
        education: resumeStore.education,
        experience: resumeStore.experience,
        projects: resumeStore.projects,
        skills: resumeStore.skills,
        summary: resumeStore.summary,
      };

      const response = await callAI(apiConfig, [
        { role: "system", content: RESUME_REVIEW_SYSTEM_PROMPT },
        {
          role: "user",
          content: getResumeReviewPrompt(
            resume,
            optimizedSummary,
            optimizedExperience,
            optimizedProjects,
            diagnosis,
            userFeedback
          ),
        },
      ], { maxTokens: 4000 });

      const reviewResult = parseAIJSON(response.content);
      return reviewResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : "审查失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 基于反思的最终修正
  // ============================================================
  const reviseAfterReview = async (
    currentSummary: string,
    currentExperience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
    currentProjects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>,
    remainingIssues: Array<{ title: string; description: string; suggestion: string }>
  ): Promise<Partial<Resume> | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await callAI(apiConfig, [
        {
          role: "system",
          content: "你是一位简历优化专家，请根据审查反馈修正简历中仍然存在的问题。只修改有问题的部分，保持已通过审查的内容不变。",
        },
        {
          role: "user",
          content: getRevisionPrompt(
            currentSummary,
            currentExperience,
            currentProjects,
            remainingIssues
          ),
        },
      ], { maxTokens: 6000 });

      const revised = parseAIJSON(response.content);
      return revised;
    } catch (err) {
      setError(err instanceof Error ? err.message : "修正失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // 保留原有的功能
  // ============================================================

  const analyzeJD = async (jd: string): Promise<JDAnalysis | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await callAI(apiConfig, [
        { role: "system", content: JD_ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: getJDAnalysisPrompt(jd) },
      ]);

      const analysis: JDAnalysis = parseAIJSON(response.content);
      return analysis;
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const scoreResume = async (): Promise<ResumeScore | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resume: Resume = {
        basicInfo: resumeStore.basicInfo,
        education: resumeStore.education,
        experience: resumeStore.experience,
        projects: resumeStore.projects,
        skills: resumeStore.skills,
        summary: resumeStore.summary,
      };

      const response = await callAI(apiConfig, [
        { role: "system", content: RESUME_SCORING_SYSTEM_PROMPT },
        {
          role: "user",
          content: getResumeScoringPrompt(
            resume,
            resume.basicInfo.targetPosition
          ),
        },
      ]);

      const score: ResumeScore = parseAIJSON(response.content);
      return score;
    } catch (err) {
      setError(err instanceof Error ? err.message : "评分失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeSingleExperience = async (
    experience: { company: string; position: string; description: string }
  ): Promise<string | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await callAI(apiConfig, [
        {
          role: "system",
          content: "你是一位简历优化专家，请优化工作经历描述，返回纯文本。",
        },
        {
          role: "user",
          content: getExperienceOptimizePrompt(
            experience,
            resumeStore.basicInfo.recruitmentType,
            resumeStore.basicInfo.jobCategory
          ),
        },
      ]);

      return response.content.trim();
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeSingleProject = async (
    project: { name: string; role: string; description: string; responsibilities: string; techStack: string[] }
  ): Promise<{ description: string; responsibilities: string } | null> => {
    if (!apiConfig) {
      setError("请先配置API");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await callAI(apiConfig, [
        {
          role: "system",
          content: "你是一位简历优化专家，请优化项目经历描述，返回JSON格式。",
        },
        {
          role: "user",
          content: getProjectOptimizePrompt(
            project,
            resumeStore.basicInfo.recruitmentType,
            resumeStore.basicInfo.jobCategory
          ),
        },
      ]);

      return parseAIJSON(response.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    diagnoseResume,
    optimizeResume,
    reviewOptimization,
    reviseAfterReview,
    analyzeJD,
    scoreResume,
    optimizeSingleExperience,
    optimizeSingleProject,
    isLoading,
    error,
  };
}
