"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/stores/resume-store";
import { Education } from "@/types/resume";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

export function EducationForm() {
  const { education, addEducation, updateEducation, removeEducation } =
    useResumeStore();

  const handleChange = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    updateEducation(id, { [field]: value });
  };

  return (
    <Card className="card-elegant border-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-serif">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>教育背景</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={addEducation}
            className="gap-1.5 text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            <Plus className="h-3.5 w-3.5" />
            添加
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {education.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 p-8 text-center bg-muted/20">
            <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-3">
              <GraduationCap className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              还没有添加教育背景
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={addEducation}
              className="gap-1.5 text-primary hover:text-primary hover:bg-primary/5"
            >
              <Plus className="h-3.5 w-3.5" />
              点击添加
            </Button>
          </div>
        ) : (
          education.map((edu, index) => (
            <div
              key={edu.id}
              className="group relative rounded-xl border border-muted bg-muted/20 p-4 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(edu.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                  title="删除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                教育 {index + 1}
              </p>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`school-${edu.id}`} className="text-xs text-muted-foreground">
                    学校名称 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`school-${edu.id}`}
                    placeholder="请输入学校名称"
                    value={edu.school}
                    onChange={(e) => handleChange(edu.id, "school", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`degree-${edu.id}`} className="text-xs text-muted-foreground">
                    学历 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`degree-${edu.id}`}
                    placeholder="如：本科、硕士、博士"
                    value={edu.degree}
                    onChange={(e) => handleChange(edu.id, "degree", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`major-${edu.id}`} className="text-xs text-muted-foreground">
                    专业 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`major-${edu.id}`}
                    placeholder="请输入专业名称"
                    value={edu.major}
                    onChange={(e) => handleChange(edu.id, "major", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`gpa-${edu.id}`} className="text-xs text-muted-foreground">
                    GPA/排名
                  </Label>
                  <Input
                    id={`gpa-${edu.id}`}
                    placeholder="如：3.8/4.0 或 前10%"
                    value={edu.gpa || ""}
                    onChange={(e) => handleChange(edu.id, "gpa", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`startDate-${edu.id}`} className="text-xs text-muted-foreground">
                    入学时间 <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id={`startDate-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleChange(edu.id, "startDate", e.target.value)}
                    className="h-9 bg-background border-transparent focus:border-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`endDate-${edu.id}`} className="text-xs text-muted-foreground">
                    毕业时间 <span className="text-primary">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`endDate-${edu.id}`}
                      type={edu.endDate === "至今" ? "text" : "month"}
                      value={edu.endDate}
                      disabled={edu.endDate === "至今"}
                      onChange={(e) => handleChange(edu.id, "endDate", e.target.value)}
                      className={`h-9 bg-background border-transparent focus:border-primary/30 text-sm ${edu.endDate === "至今" ? "opacity-50" : ""}`}
                    />
                    <Button
                      type="button"
                      variant={edu.endDate === "至今" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange(edu.id, "endDate", edu.endDate === "至今" ? "" : "至今")}
                      className="h-9 whitespace-nowrap text-xs border-primary/20 hover:border-primary/40"
                    >
                      在读
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
