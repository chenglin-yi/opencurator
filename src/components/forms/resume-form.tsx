"use client";

import * as React from "react";
import { BasicInfoForm } from "./basic-info-form";
import { EducationForm } from "./education-form";
import { ExperienceForm } from "./experience-form";
import { ProjectsForm } from "./projects-form";
import { SkillsForm } from "./skills-form";
import { SummaryForm } from "./summary-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Wrench,
  PenLine,
} from "lucide-react";

const tabs = [
  { id: "basic", label: "基本信息", icon: User, component: BasicInfoForm },
  { id: "education", label: "教育背景", icon: GraduationCap, component: EducationForm },
  { id: "experience", label: "工作经历", icon: Briefcase, component: ExperienceForm },
  { id: "projects", label: "项目经历", icon: FolderOpen, component: ProjectsForm },
  { id: "skills", label: "技能清单", icon: Wrench, component: SkillsForm },
  { id: "summary", label: "自我评价", icon: PenLine, component: SummaryForm },
];

export function ResumeForm() {
  const [activeTab, setActiveTab] = React.useState("basic");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto bg-muted/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center gap-1.5 text-xs py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            <tab.icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <tab.component />
        </TabsContent>
      ))}
    </Tabs>
  );
}
