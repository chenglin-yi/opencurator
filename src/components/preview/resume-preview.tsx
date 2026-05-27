"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/stores/resume-store";
import { formatDate } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Wrench,
  FileText,
  Eye,
  Sparkles,
} from "lucide-react";

export function ResumePreview() {
  const {
    basicInfo,
    education,
    experience,
    projects,
    skills,
    summary,
  } = useResumeStore();

  const hasContent =
    basicInfo.name ||
    education.length > 0 ||
    experience.length > 0 ||
    projects.length > 0 ||
    skills.length > 0 ||
    summary;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-4">
          <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Eye className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-3 w-3 text-primary" />
          </div>
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground/80 mb-2">
          简历预览
        </h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          在左侧填写信息后，这里将实时显示简历预览
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* 头部 - 基本信息 */}
      {basicInfo.name && (
        <div className="pb-4 border-b border-primary/20">
          <h1 className="font-serif text-2xl font-bold text-foreground tracking-tight">
            {basicInfo.name}
          </h1>
          {basicInfo.targetPosition && (
            <p className="mt-1 text-sm font-medium text-primary">
              {basicInfo.targetPosition}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {basicInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-primary/60" />
                <span>{basicInfo.phone}</span>
              </div>
            )}
            {basicInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-primary/60" />
                <span>{basicInfo.email}</span>
              </div>
            )}
            {basicInfo.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary/60" />
                <span>{basicInfo.city}</span>
              </div>
            )}
            {basicInfo.website && (
              <div className="flex items-center gap-1.5">
                <Globe className="h-3 w-3 text-primary/60" />
                <span className="truncate max-w-[150px]">{basicInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 教育背景 */}
      {education.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <GraduationCap className="h-3 w-3 text-primary" />
            </div>
            教育背景
          </h2>
          <div className="space-y-3 pl-7">
            {education.map((edu) => (
              <div key={edu.id} className="group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{edu.school}</p>
                    <p className="text-xs text-muted-foreground">
                      {edu.degree} · {edu.major}
                      {edu.gpa && <span className="ml-2 text-primary">GPA: {edu.gpa}</span>}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 工作经历 */}
      {experience.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <Briefcase className="h-3 w-3 text-primary" />
            </div>
            工作经历
          </h2>
          <div className="space-y-4 pl-7">
            {experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-medium text-sm text-foreground">{exp.company}</p>
                    <p className="text-xs font-medium text-primary">{exp.position}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.description && (
                  <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line mt-2">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 项目经历 */}
      {projects.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <FolderOpen className="h-3 w-3 text-primary" />
            </div>
            项目经历
          </h2>
          <div className="space-y-4 pl-7">
            {projects.map((proj) => (
              <div key={proj.id} className="group">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-medium text-sm text-foreground">{proj.name}</p>
                    <p className="text-xs font-medium text-primary">{proj.role}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground/80">
                    {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                  </p>
                </div>
                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.techStack.map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="secondary" 
                        className="text-[10px] px-1.5 py-0 bg-primary/5 text-primary border-primary/10"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {proj.description && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {proj.description}
                  </p>
                )}
                {proj.responsibilities && (
                  <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line mt-1">
                    {proj.responsibilities}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 技能清单 */}
      {skills.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <Wrench className="h-3 w-3 text-primary" />
            </div>
            技能清单
          </h2>
          <div className="flex flex-wrap gap-1.5 pl-7">
            {skills.map((skill) => (
              <Badge 
                key={skill.id} 
                variant="outline"
                className="text-[11px] px-2 py-0.5 border-primary/20 text-foreground/80"
              >
                {skill.name}
                <span className="ml-1 text-[10px] text-muted-foreground">({skill.level})</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 个人总结 - 放在最后 */}
      {summary && (
        <div className="animate-fade-in">
          <h2 className="flex items-center gap-2 font-serif text-sm font-semibold text-foreground mb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
              <FileText className="h-3 w-3 text-primary" />
            </div>
            个人总结
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground pl-7">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
