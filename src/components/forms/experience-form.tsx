"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/stores/resume-store";
import { useAI } from "@/hooks/use-ai";
import { Experience } from "@/types/resume";
import { Briefcase, Plus, Trash2, Sparkles, Loader2, CheckCircle } from "lucide-react";

const PRESENT_VALUE = "至今";

export function ExperienceForm() {
  const { experience, addExperience, updateExperience, removeExperience } =
    useResumeStore();
  const { optimizeSingleExperience, isLoading } = useAI();
  const [optimizingId, setOptimizingId] = React.useState<string | null>(null);
  const [optimizedId, setOptimizedId] = React.useState<string | null>(null);

  const handleChange = (
    id: string,
    field: keyof Experience,
    value: string
  ) => {
    updateExperience(id, { [field]: value });
  };

  const handleOptimize = async (id: string) => {
    const exp = experience.find((e) => e.id === id);
    if (!exp) return;

    setOptimizingId(id);
    setOptimizedId(null);

    const result = await optimizeSingleExperience({
      company: exp.company,
      position: exp.position,
      description: exp.description,
    });

    if (result) {
      updateExperience(id, { description: result });
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
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>工作经历</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addExperience}
            className="gap-1.5 text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            <Plus className="h-3.5 w-3.5" />
            添加
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {experience.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 p-8 text-center bg-muted/20">
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              还没有添加工作经历
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={addExperience}
              className="gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
            >
              <Plus className="h-3.5 w-3.5" />
              点击添加
            </Button>
          </div>
        ) : (
          experience.map((exp, index) => (
            <div
              key={exp.id}
              className="group relative rounded-xl border border-muted bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant={optimizedId === exp.id ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handleOptimize(exp.id)}
                  disabled={isLoading || !exp.description.trim()}
                  className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/5"
                  title="AI优化此段经历"
                >
                  {optimizingId === exp.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : optimizedId === exp.id ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  title="删除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                经历 {index + 1}
              </p>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`company-${exp.id}`} className="text-xs text-muted-foreground">
                    公司名称 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`company-${exp.id}`}
                    placeholder="请输入公司名称"
                    value={exp.company}
                    onChange={(e) => handleChange(exp.id, "company", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`position-${exp.id}`} className="text-xs text-muted-foreground">
                    职位名称 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`position-${exp.id}`}
                    placeholder="请输入职位名称"
                    value={exp.position}
                    onChange={(e) => handleChange(exp.id, "position", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`startDate-${exp.id}`} className="text-xs text-muted-foreground">
                    开始时间 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleChange(exp.id, "startDate", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${exp.id}`} className="text-xs text-muted-foreground">
                    结束时间 <span className="text-primary">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`endDate-${exp.id}`}
                      type={exp.endDate === PRESENT_VALUE ? "text" : "month"}
                      value={exp.endDate}
                      disabled={exp.endDate === PRESENT_VALUE}
                      onChange={(e) => handleChange(exp.id, "endDate", e.target.value)}
                      className={`h-9 bg-background border-transparent focus:border-primary/30 text-sm ${exp.endDate === PRESENT_VALUE ? "opacity-50" : ""}`}
                    />
                    <Button
                      type="button"
                      variant={exp.endDate === PRESENT_VALUE ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(exp.id, "endDate", exp.endDate === PRESENT_VALUE ? "" : PRESENT_VALUE)}
                      className="h-9 whitespace-nowrap text-xs border-primary/20 hover:border-primary/40"
                    >
                      至今
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${exp.id}`} className="text-xs text-muted-foreground">
                      工作描述 <span className="text-primary">*</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOptimize(exp.id)}
                      disabled={isLoading || !exp.description.trim()}
                      className="h-6 gap-1 text-[11px] text-primary hover:bg-primary/5"
                    >
                      {optimizingId === exp.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      AI优化
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${exp.id}`}
                    placeholder="请描述您的工作职责和成就，建议使用STAR法则"
                    value={exp.description}
                    onChange={(e) => handleChange(exp.id, "description", e.target.value)}
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
