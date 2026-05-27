"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/stores/resume-store";
import { useAI } from "@/hooks/use-ai";
import { Project } from "@/types/resume";
import { FolderOpen, Plus, Trash2, Sparkles, X, Loader2, CheckCircle } from "lucide-react";

export function ProjectsForm() {
  const { projects, addProject, updateProject, removeProject } =
    useResumeStore();
  const { optimizeSingleProject, isLoading } = useAI();
  const [techInput, setTechInput] = React.useState<Record<string, string>>({});
  const [optimizingId, setOptimizingId] = React.useState<string | null>(null);
  const [optimizedId, setOptimizedId] = React.useState<string | null>(null);

  const handleChange = (id: string, field: keyof Project, value: string) => {
    updateProject(id, { [field]: value });
  };

  const handleAddTech = (id: string) => {
    const tech = techInput[id]?.trim();
    if (!tech) return;

    const project = projects.find((p) => p.id === id);
    if (project && !project.techStack.includes(tech)) {
      updateProject(id, { techStack: [...project.techStack, tech] });
    }
    setTechInput({ ...techInput, [id]: "" });
  };

  const handleRemoveTech = (id: string, tech: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      updateProject(id, {
        techStack: project.techStack.filter((t) => t !== tech),
      });
    }
  };

  const handleOptimize = async (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;

    setOptimizingId(id);
    setOptimizedId(null);

    const result = await optimizeSingleProject({
      name: proj.name,
      role: proj.role,
      description: proj.description,
      responsibilities: proj.responsibilities,
      techStack: proj.techStack,
    });

    if (result) {
      updateProject(id, {
        description: result.description,
        responsibilities: result.responsibilities,
      });
      setOptimizedId(id);
      setTimeout(() => setOptimizedId(null), 3000);
    }

    setOptimizingId(null);
  };

  return (
    <Card className="card-elegant border-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-serif">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
              <FolderOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>项目经历</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addProject}
            className="gap-1.5 text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            <Plus className="h-3.5 w-3.5" />
            添加
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 p-8 text-center bg-muted/20">
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-3">
              <FolderOpen className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              还没有添加项目经历
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={addProject}
              className="gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
            >
              <Plus className="h-3.5 w-3.5" />
              点击添加
            </Button>
          </div>
        ) : (
          projects.map((proj, index) => (
            <div
              key={proj.id}
              className="group relative rounded-xl border border-muted bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant={optimizedId === proj.id ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleOptimize(proj.id)}
                  disabled={isLoading || !proj.description.trim()}
                  className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/5"
                  title="AI优化此段经历"
                >
                  {optimizingId === proj.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : optimizedId === proj.id ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(proj.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  title="删除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                项目 {index + 1}
              </p>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`name-${proj.id}`} className="text-xs text-muted-foreground">
                    项目名称 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`name-${proj.id}`}
                    placeholder="请输入项目名称"
                    value={proj.name}
                    onChange={(e) => handleChange(proj.id, "name", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`role-${proj.id}`} className="text-xs text-muted-foreground">
                    项目角色 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`role-${proj.id}`}
                    placeholder="请输入您的角色"
                    value={proj.role}
                    onChange={(e) => handleChange(proj.id, "role", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`startDate-${proj.id}`} className="text-xs text-muted-foreground">
                    开始时间 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`startDate-${proj.id}`}
                    type="month"
                    value={proj.startDate}
                    onChange={(e) => handleChange(proj.id, "startDate", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${proj.id}`} className="text-xs text-muted-foreground">
                    结束时间 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`endDate-${proj.id}`}
                    type="month"
                    value={proj.endDate}
                    onChange={(e) => handleChange(proj.id, "endDate", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">技术栈</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入技术栈，按回车添加"
                      value={techInput[proj.id] || ""}
                      onChange={(e) =>
                        setTechInput({ ...techInput, [proj.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTech(proj.id);
                        }
                      }}
                      className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddTech(proj.id)}
                      className="h-9 w-9 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="gap-1 text-[11px] bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
                        >
                          {tech}
                          <button
                            onClick={() => handleRemoveTech(proj.id, tech)}
                            className="ml-0.5 rounded-full hover:bg-primary/20"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${proj.id}`} className="text-xs text-muted-foreground">
                      项目描述 <span className="text-primary">*</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOptimize(proj.id)}
                      disabled={isLoading || !proj.description.trim()}
                      className="h-6 gap-1 text-[11px] text-primary hover:bg-primary/5"
                    >
                      {optimizingId === proj.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      AI优化
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${proj.id}`}
                    placeholder="请简要描述项目背景和目标"
                    value={proj.description}
                    onChange={(e) => handleChange(proj.id, "description", e.target.value)}
                    rows={3}
                    className="bg-background border-transparent focus:border-primary/30 text-sm resize-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor={`responsibilities-${proj.id}`} className="text-xs text-muted-foreground">
                    个人职责与成果 <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id={`responsibilities-${proj.id}`}
                    placeholder="请描述您在项目中的职责和取得的成果"
                    value={proj.responsibilities}
                    onChange={(e) => handleChange(proj.id, "responsibilities", e.target.value)}
                    rows={4}
                    className="bg-background border-transparent focus:border-primary/30 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
