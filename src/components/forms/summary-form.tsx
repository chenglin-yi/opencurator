"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/stores/resume-store";
import { useAI } from "@/hooks/use-ai";
import { FileText, Sparkles, Loader2, PenLine } from "lucide-react";

export function SummaryForm() {
  const { summary, setSummary } = useResumeStore();
  const { optimizeResume, isLoading } = useAI();

  const handleOptimize = async () => {
    const result = await optimizeResume();
    if (result?.summary) {
      setSummary(result.summary);
    }
  };

  return (
    <Card className="card-elegant border-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-serif">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
              <PenLine className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>自我评价</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOptimize}
            disabled={isLoading || !summary.trim()}
            className="gap-1.5 text-xs border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            )}
            AI优化
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-xs text-muted-foreground">
            个人总结
          </Label>
          <Textarea
            id="summary"
            placeholder="请用2-3句话概括您的职业特点、核心优势和职业目标..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={5}
            className="bg-muted/30 border-transparent focus:border-primary/30 text-sm resize-none"
          />
        </div>

        {/* 写作建议 */}
        <div className="rounded-xl bg-muted/30 p-4 border border-muted space-y-3">
          <p className="text-xs font-medium text-foreground/80 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            撰写建议
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 flex-shrink-0" />
              突出您的核心竞争力和专业领域
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 flex-shrink-0" />
              提及与目标职位相关的经验和技能
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 flex-shrink-0" />
              展示您的职业态度和发展潜力
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1 w-1 rounded-full bg-primary/60 flex-shrink-0" />
              避免使用空洞的形容词，用具体事例支撑
            </li>
          </ul>
        </div>

        {/* 示例 */}
        <div className="rounded-xl border border-primary/10 p-4 bg-primary/5">
          <p className="text-[11px] font-medium text-primary/80 mb-2 uppercase tracking-wider">
            示例参考
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            拥有5年前端开发经验，精通React和Vue生态系统。曾主导多个大型Web应用的架构设计和开发，具备优秀的团队协作能力和问题解决能力。追求代码质量和用户体验的极致，持续关注前端技术发展趋势。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
