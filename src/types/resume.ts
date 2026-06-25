export type RecruitmentType = "social" | "campus";

export type JobCategory = "tech" | "non-tech";

export interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  targetPosition: string;
  recruitmentType: RecruitmentType;
  jobCategory: JobCategory;
  website?: string;
  city: string;
  yearsOfExperience?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  courses?: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  techStack: string[];
  responsibilities: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "了解" | "熟悉" | "熟练" | "精通";
}

export interface Resume {
  basicInfo: BasicInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  summary: string;
}

export interface ResumeScore {
  overall: number;
  sections: {
    basicInfo: number;
    experience: number;
    skills: number;
    formatting: number;
    atsCompatibility: number;
  };
  suggestions: string[];
  strengths: string[];
}

// 简历诊断 - 硬伤
export interface DiagnosisIssue {
  title: string;
  severity: "critical" | "warning" | "info";
  description: string;
  suggestion: string;
  needsUserInput: boolean;
  userPrompt?: string; // 需要用户补充的信息说明
}

// 简历诊断 - 结构性建议
export interface DiagnosisStructural {
  title: string;
  description: string;
  action: string;
}

// 简历诊断 - HR隐性担忧
export interface DiagnosisRisk {
  category: string;
  description: string;
  mitigation: string;
}

// 完整诊断报告
export interface ResumeDiagnosis {
  overallAssessment: string;
  issues: DiagnosisIssue[];
  structural: DiagnosisStructural[];
  risks: DiagnosisRisk[];
  userFeedbackPrompts: string[]; // 需要用户回答的问题列表
}

// 诊断优化工作流的阶段
export type DoctorPhase = "diagnosis" | "user-feedback" | "optimization" | "review" | "done";

export interface JDAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  keyResponsibilities: string[];
  suggestedKeywords: string[];
}

export const defaultResume: Resume = {
  basicInfo: {
    name: "",
    phone: "",
    email: "",
    targetPosition: "",
    recruitmentType: "social",
    jobCategory: "tech",
    website: "",
    city: "",
    yearsOfExperience: "",
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  summary: "",
};

export const defaultBasicInfo: BasicInfo = {
  name: "",
  phone: "",
  email: "",
  targetPosition: "",
  recruitmentType: "social",
  jobCategory: "tech",
  website: "",
  city: "",
  yearsOfExperience: "",
};

export const defaultEducation: Education = {
  id: "",
  school: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  gpa: "",
  courses: [],
};

export const defaultExperience: Experience = {
  id: "",
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

export const defaultProject: Project = {
  id: "",
  name: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  techStack: [],
  responsibilities: "",
};

export const defaultSkill: Skill = {
  id: "",
  name: "",
  level: "熟悉",
};
