"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResumeScore } from "@/types/resume";
import { BarChart3, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface ScoreDisplayProps {
  score: ResumeScore;
}

const sectionLabels: Record<string, string> = {
  basicInfo: "基本信息",
  experience: "经历描述",
  skills: "技能匹配",
  formatting: "格式规范",
  atsCompatibility: "ATS兼容",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getScoreBadgeVariant(
  score: number
): "default" | "secondary" | "destructive" {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-serif">
          <BarChart3 className="h-5 w-5 text-primary" />
          简历评分
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 总分 */}
        <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-6">
          <p className="text-sm text-muted-foreground">综合评分</p>
          <p
            className={`text-5xl font-bold ${getScoreColor(score.overall)}`}
          >
            {score.overall}
          </p>
          <Badge variant={getScoreBadgeVariant(score.overall)} className="mt-2">
            {score.overall >= 80
              ? "优秀"
              : score.overall >= 60
                ? "良好"
                : "需改进"}
          </Badge>
        </div>

        {/* 分项评分 */}
        <div className="space-y-3">
          <p className="text-sm font-medium">分项评分</p>
          {Object.entries(score.sections).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {sectionLabels[key] || key}
                </span>
                <span className={getScoreColor(value)}>{value}</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>

        {/* 优势 */}
        {score.strengths.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1 text-sm font-medium text-green-600">
              <CheckCircle className="h-4 w-4" />
              优势亮点
            </p>
            <ul className="space-y-1">
              {score.strengths.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 改进建议 */}
        {score.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1 text-sm font-medium text-yellow-600">
              <AlertCircle className="h-4 w-4" />
              改进建议
            </p>
            <ul className="space-y-1">
              {score.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
