"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/stores/config-store";
import { useUIStore } from "@/stores/ui-store";
import { AIProvider, defaultModels, defaultEndpoints, defaultAPIConfig } from "@/types/ai";
import { testConnection } from "@/lib/ai";
import { Settings, X, Save, TestTube, Loader2, CheckCircle, XCircle, Key, Cpu, Globe, Sparkles } from "lucide-react";

export function ConfigPanel() {
  const { apiConfig, setApiConfig, clearApiConfig } = useConfigStore();
  const { setConfigOpen } = useUIStore();

  const [config, setConfig] = React.useState(
    apiConfig || defaultAPIConfig
  );
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleProviderChange = (provider: AIProvider) => {
    setConfig({
      ...config,
      provider,
      model: defaultModels[provider][0],
      endpoint: defaultEndpoints[provider],
    });
    setTestResult(null);
  };

  const handleSave = () => {
    setApiConfig(config);
    setConfigOpen(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    const result = await testConnection(config);
    
    setTestResult({
      type: result.success ? "success" : "error",
      message: result.message,
    });
    setIsTesting(false);
  };

  const handleClear = () => {
    clearApiConfig();
    setConfig(defaultAPIConfig);
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-md mx-4 border-primary/10 shadow-xl animate-fade-in-up">
        <CardHeader className="pb-4 border-b border-muted">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2.5 text-base font-serif">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25">
                <Settings className="h-4 w-4 text-primary-foreground" />
              </div>
              API配置
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfigOpen(false)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          {/* 模型提供商 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-primary/60" />
              模型提供商
            </Label>
            <Select
              value={config.provider}
              onValueChange={(value) => handleProviderChange(value as AIProvider)}
            >
              <SelectTrigger className="h-10 bg-muted/30 border-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                <SelectItem value="custom">自定义 (OpenAI兼容)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 模型名称 */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary/60" />
              模型名称
            </Label>
            {config.provider === "custom" ? (
              <Input
                placeholder="请输入模型名称，如 gpt-4、claude-3-opus 等"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="h-10 bg-muted/30 border-transparent focus:border-primary/30"
              />
            ) : (
              <Select
                value={config.model}
                onValueChange={(value) => setConfig({ ...config, model: value })}
              >
                <SelectTrigger className="h-10 bg-muted/30 border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultModels[config.provider].map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Key className="h-3.5 w-3.5 text-primary/60" />
              API Key
            </Label>
            <Input
              type="password"
              placeholder="请输入API Key"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30"
            />
            <p className="text-[11px] text-muted-foreground/60">
              API Key仅存储在您的浏览器本地，不会上传到服务器
            </p>
          </div>

          {/* 自定义端点 */}
          {config.provider === "custom" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-primary/60" />
                API端点
              </Label>
              <Input
                type="url"
                placeholder="http://localhost:3000/v1 或完整路径"
                value={config.endpoint || ""}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                className="h-10 bg-muted/30 border-transparent focus:border-primary/30"
              />
              <p className="text-[11px] text-muted-foreground/60">
                输入基础URL即可，系统会自动补全完整路径
              </p>
            </div>
          )}

          {/* 测试结果 */}
          {testResult && (
            <div className={`rounded-xl p-3 text-sm flex items-center gap-2 animate-fade-in ${
              testResult.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
                : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
            }`}>
              {testResult.type === "success" ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 flex-shrink-0" />
              )}
              {testResult.message}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={isTesting || !config.apiKey}
              className="flex-1 gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 text-primary" />
              )}
              {isTesting ? "测试中..." : "测试连接"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleClear}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              清除
            </Button>
            <Button 
              onClick={handleSave} 
              className="btn-gold gap-1.5 shadow-md shadow-primary/20"
            >
              <Save className="h-4 w-4" />
              保存
            </Button>
          </div>

          {/* 支持的模型 */}
          <div className="rounded-xl bg-muted/30 p-3 border border-muted">
            <p className="text-[11px] text-muted-foreground">
              <strong className="text-foreground/80">支持的模型：</strong>
            </p>
            <ul className="mt-1.5 space-y-1 text-[11px] text-muted-foreground/80">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/60" />
                OpenAI: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/60" />
                Claude: Claude 3 Opus, Sonnet, Haiku
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary/60" />
                自定义: 任何OpenAI兼容接口
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
