"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeStore } from "@/stores/resume-store";
import { Skill } from "@/types/resume";
import { Wrench, Plus, X, Lightbulb } from "lucide-react";

const skillLevels: Skill["level"][] = ["了解", "熟悉", "熟练", "精通"];

const levelColors: Record<Skill["level"], string> = {
  "了解": "bg-muted text-muted-foreground",
  "熟悉": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "熟练": "bg-primary/10 text-primary",
  "精通": "bg-primary text-primary-foreground",
};

export function SkillsForm() {
  const { skills, addSkill, updateSkill, removeSkill } = useResumeStore();
  const [newSkillName, setNewSkillName] = React.useState("");
  const [newSkillLevel, setNewSkillLevel] = React.useState<Skill["level"]>("熟悉");

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;

    addSkill();
    const lastSkill = skills[skills.length - 1];
    if (lastSkill) {
      updateSkill(lastSkill.id, {
        name: newSkillName.trim(),
        level: newSkillLevel,
      });
    }

    setNewSkillName("");
    setNewSkillLevel("熟悉");
  };

  return (
    <Card className="card-elegant border-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-serif">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
            <Wrench className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>技能清单</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 添加技能 */}
        <div className="flex gap-2">
          <Input
            placeholder="输入技能名称"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            className="h-9 flex-1 bg-muted/30 border-transparent focus:border-primary/30 text-sm"
          />
          <Select
            value={newSkillLevel}
            onValueChange={(value) => setNewSkillLevel(value as Skill["level"])}
          >
            <SelectTrigger className="h-9 w-[90px] bg-muted/30 border-transparent focus:border-primary/30 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {skillLevels.map((level) => (
                <SelectItem key={level} value={level} className="text-sm">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleAddSkill}
            className="h-9 w-9 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 技能列表 */}
        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 p-6 text-center bg-muted/20">
            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
              <Lightbulb className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              还没有添加技能
            </p>
            <p className="text-xs text-muted-foreground/60">
              在上方输入技能名称并选择熟练程度
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                variant="secondary"
                className={`gap-1.5 pl-2.5 pr-1.5 py-1 ${levelColors[skill.level]} transition-colors`}
              >
                <span className="text-sm">{skill.name}</span>
                <span className="text-[10px] opacity-70">({skill.level})</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-background/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* 提示 */}
        <div className="rounded-lg bg-muted/30 p-3 border border-muted">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 mt-0.5 text-primary/60 flex-shrink-0" />
            <span>
              <strong className="text-foreground/80">建议：</strong>添加与目标职位相关的技能，包括编程语言、框架工具、软技能等
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
