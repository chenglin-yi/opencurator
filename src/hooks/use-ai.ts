"use client";

import { useState } from "react";
import { useConfigStore } from "@/stores/config-store";
import { useResumeStore } from "@/stores/resume-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { callAI, extractJSON } from "@/lib/ai";
import {
  getResumeOptimizeSystemPrompt,
  getResumeOptimizePrompt,
  JD_ANALYSIS_SYSTEM_PROMPT,
  getJDAnalysisPrompt,
  RESUME_SCORING_SYSTEM_PROMPT,
  getResumeScoringPrompt,
  getExperienceOptimizePrompt,
  getProjectOptimizePrompt,
} from "@/lib/prompts";
import { Resume, JDAnalysis, ResumeScore } from "@/types/resume";

export function useAI() {
  const { apiConfig } = useConfigStore();
  const resumeStore = useResumeStore();
  const { getOptimizationContext } = useAnalysisStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeResume = async (targetPosition?: string): Promise<Partial<Resume> | null> => {
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
      
      const systemPrompt = getResumeOptimizeSystemPrompt(resume.basicInfo.recruitmentType);

      const response = await callAI(apiConfig, [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: getResumeOptimizePrompt(
            resume,
            targetPosition || resume.basicInfo.targetPosition,
            optimizationContext || undefined
          ),
        },
      ]);

      const jsonContent = extractJSON(response.content);
      const optimized = JSON.parse(jsonContent);
      return optimized;
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

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

      const jsonContent = extractJSON(response.content);
      const analysis = JSON.parse(jsonContent);
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

      const jsonContent = extractJSON(response.content);
      const score = JSON.parse(jsonContent);
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
            resumeStore.basicInfo.recruitmentType
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
            resumeStore.basicInfo.recruitmentType
          ),
        },
      ]);

      const jsonContent = extractJSON(response.content);
      return JSON.parse(jsonContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "优化失败");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    optimizeResume,
    analyzeJD,
    scoreResume,
    optimizeSingleExperience,
    optimizeSingleProject,
    isLoading,
    error,
  };
}
