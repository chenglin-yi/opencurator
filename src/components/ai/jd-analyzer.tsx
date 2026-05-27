"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAI } from "@/hooks/use-ai";
import { useUIStore } from "@/stores/ui-store";
import { useAnalysisStore } from "@/stores/analysis-store";
import { JDAnalysis } from "@/types/resume";
import { FileSearch, X, Search, Loader2, CheckCircle } from "lucide-react";

export function JDAnalyzer() {
  const { setJDAnalyzerOpen } = useUIStore();
  const { setJDAnalysis, jdText: savedJdText, hasAnalyzedJD } = useAnalysisStore();
  const { analyzeJD, isLoading, error } = useAI();
  const [jdText, setJdText] = React.useState(savedJdText || "");
  const [analysis, setAnalysis] = React.useState<JDAnalysis | null>(null);
  const [saved, setSaved] = React.useState(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setSaved(false);
    const result = await analyzeJD(jdText);
    if (result) {
      setAnalysis(result);
    }
  };

  const handleSave = () => {
    if (analysis && jdText) {
      setJDAnalysis(analysis, jdText);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-serif">
              <FileSearch className="h-5 w-5 text-primary" />
              职位JD分析
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setJDAnalyzerOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="请粘贴职位描述（JD）..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={6}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || !jdText.trim()}
                className="flex-1 gap-1"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {isLoading ? "分析中..." : "开始分析"}
              </Button>
              {analysis && (
                <Button
                  variant={saved ? "default" : "outline"}
                  onClick={handleSave}
                  className="gap-1"
                >
                  {saved ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : null}
                  {saved ? "已保存" : "保存分析结果"}
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <strong>提示：</strong>点击"保存分析结果"后，一键优化将根据JD要求进行针对性优化。
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">必备技能</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">优先技能</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.preferredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">经验要求</p>
                <p className="text-sm text-muted-foreground">
                  {analysis.experienceLevel}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">主要职责</p>
                <ul className="list-disc pl-4 text-sm text-muted-foreground">
                  {analysis.keyResponsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">建议关键词</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.suggestedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>优化建议：</strong>根据以上分析结果，建议在简历中包含相关的技能关键词，以提高ATS系统通过率。保存后，一键优化将自动参考这些要求。
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
