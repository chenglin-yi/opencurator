import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Resume,
  BasicInfo,
  Education,
  Experience,
  Project,
  Skill,
  defaultResume,
  defaultEducation,
  defaultExperience,
  defaultProject,
  defaultSkill,
} from "@/types/resume";
import { generateId } from "@/lib/utils";

interface ResumeState extends Resume {
  setBasicInfo: (info: BasicInfo) => void;
  
  addEducation: () => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  addExperience: () => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  addProject: () => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  addSkill: () => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  setSummary: (summary: string) => void;
  
  setResume: (resume: Resume) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      ...defaultResume,

      setBasicInfo: (info) =>
        set((state) => ({
          basicInfo: { ...state.basicInfo, ...info },
        })),

      addEducation: () =>
        set((state) => ({
          education: [
            ...state.education,
            { ...defaultEducation, id: generateId() },
          ],
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? { ...e, ...edu } : e
          ),
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),

      addExperience: () =>
        set((state) => ({
          experience: [
            ...state.experience,
            { ...defaultExperience, id: generateId() },
          ],
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          experience: state.experience.map((e) =>
            e.id === id ? { ...e, ...exp } : e
          ),
        })),

      removeExperience: (id) =>
        set((state) => ({
          experience: state.experience.filter((e) => e.id !== id),
        })),

      addProject: () =>
        set((state) => ({
          projects: [
            ...state.projects,
            { ...defaultProject, id: generateId() },
          ],
        })),

      updateProject: (id, proj) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...proj } : p
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addSkill: () =>
        set((state) => ({
          skills: [...state.skills, { ...defaultSkill, id: generateId() }],
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...skill } : s
          ),
        })),

      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      setSummary: (summary) => set({ summary }),

      setResume: (resume) => set(resume),

      resetResume: () => set(defaultResume),
    }),
    {
      name: "opencurator-resume",
    }
  )
);
