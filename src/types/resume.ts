export type RecruitmentType = "social" | "campus";

export interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  targetPosition: string;
  recruitmentType: RecruitmentType;
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
