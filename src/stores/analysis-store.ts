import { create } from "zustand";
import { ResumeScore, JDAnalysis, ResumeDiagnosis, DoctorPhase } from "@/types/resume";

interface ReviewResult {
  passed: boolean;
  score: number;
  fixedIssues: string[];
  remainingIssues: Array<{ title: string; description: string; suggestion: string }>;
  qualityNotes: string;
}

interface AnalysisState {
  // 评分结果
  score: ResumeScore | null;
  hasScored: boolean;
  
  // JD分析结果
  jdAnalysis: JDAnalysis | null;
  jdText: string;
  hasAnalyzedJD: boolean;

  // 诊断结果
  diagnosis: ResumeDiagnosis | null;
  hasDiagnosed: boolean;

  // 诊断优化工作流状态
  doctorPhase: DoctorPhase;
  userFeedback: string;
  reviewResult: ReviewResult | null;
  optimizationRound: number;
  
  // 操作
  setScore: (score: ResumeScore) => void;
  clearScore: () => void;
  
  setJDAnalysis: (analysis: JDAnalysis, jdText: string) => void;
  clearJDAnalysis: () => void;

  setDiagnosis: (diagnosis: ResumeDiagnosis) => void;
  clearDiagnosis: () => void;

  setDoctorPhase: (phase: DoctorPhase) => void;
  setUserFeedback: (feedback: string) => void;
  setReviewResult: (result: ReviewResult | null) => void;
  incrementOptimizationRound: () => void;
  resetDoctorWorkflow: () => void;
  
  // 获取优化建议上下文
  getOptimizationContext: () => string;
}

export const useAnalysisStore = create<AnalysisState>()((set, get) => ({
  // 初始状态
  score: null,
  hasScored: false,
  jdAnalysis: null,
  jdText: "",
  hasAnalyzedJD: false,
  diagnosis: null,
  hasDiagnosed: false,
  doctorPhase: "diagnosis",
  userFeedback: "",
  reviewResult: null,
  optimizationRound: 0,
  
  // 评分操作
  setScore: (score) => set({ score, hasScored: true }),
  clearScore: () => set({ score: null, hasScored: false }),
  
  // JD分析操作
  setJDAnalysis: (analysis, jdText) => set({ 
    jdAnalysis: analysis, 
    jdText, 
    hasAnalyzedJD: true 
  }),
  clearJDAnalysis: () => set({ 
    jdAnalysis: null, 
    jdText: "", 
    hasAnalyzedJD: false 
  }),

  // 诊断操作
  setDiagnosis: (diagnosis) => set({ diagnosis, hasDiagnosed: true, doctorPhase: "user-feedback" }),
  clearDiagnosis: () => set({ diagnosis: null, hasDiagnosed: false }),

  // 工作流操作
  setDoctorPhase: (phase) => set({ doctorPhase: phase }),
  setUserFeedback: (feedback) => set({ userFeedback: feedback }),
  setReviewResult: (result) => set({ reviewResult: result }),
  incrementOptimizationRound: () => set((state) => ({ optimizationRound: state.optimizationRound + 1 })),
  resetDoctorWorkflow: () => set({
    diagnosis: null,
    hasDiagnosed: false,
    doctorPhase: "diagnosis",
    userFeedback: "",
    reviewResult: null,
    optimizationRound: 0,
  }),
  
  // 获取优化建议上下文
  getOptimizationContext: () => {
    const { score, jdAnalysis, jdText } = get();
    let context = "";
    
    // 添加评分改进建议
    if (score && score.suggestions.length > 0) {
      context += "## 简历评分改进建议\n";
      context += "请根据以下建议进行针对性优化：\n";
      score.suggestions.forEach((suggestion, index) => {
        context += `${index + 1}. ${suggestion}\n`;
      });
      context += "\n";
    }
    
    // 添加JD分析要求
    if (jdAnalysis) {
      context += "## 目标职位要求\n";
      context += "请确保简历满足以下职位要求：\n";
      
      if (jdAnalysis.requiredSkills.length > 0) {
        context += "\n必备技能：\n";
        jdAnalysis.requiredSkills.forEach((skill) => {
          context += `- ${skill}\n`;
        });
      }
      
      if (jdAnalysis.preferredSkills.length > 0) {
        context += "\n优先技能：\n";
        jdAnalysis.preferredSkills.forEach((skill) => {
          context += `- ${skill}\n`;
        });
      }
      
      if (jdAnalysis.keyResponsibilities.length > 0) {
        context += "\n主要职责：\n";
        jdAnalysis.keyResponsibilities.forEach((resp) => {
          context += `- ${resp}\n`;
        });
      }
      
      if (jdAnalysis.suggestedKeywords.length > 0) {
        context += "\n建议包含的关键词：\n";
        context += jdAnalysis.suggestedKeywords.join("、") + "\n";
      }
      
      if (jdAnalysis.experienceLevel) {
        context += `\n经验要求：${jdAnalysis.experienceLevel}\n`;
      }
    }
    
    return context;
  },
}));
