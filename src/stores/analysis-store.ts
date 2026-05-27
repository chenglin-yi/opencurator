import { create } from "zustand";
import { ResumeScore, JDAnalysis } from "@/types/resume";

interface AnalysisState {
  // 评分结果
  score: ResumeScore | null;
  hasScored: boolean;
  
  // JD分析结果
  jdAnalysis: JDAnalysis | null;
  jdText: string;
  hasAnalyzedJD: boolean;
  
  // 操作
  setScore: (score: ResumeScore) => void;
  clearScore: () => void;
  
  setJDAnalysis: (analysis: JDAnalysis, jdText: string) => void;
  clearJDAnalysis: () => void;
  
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
