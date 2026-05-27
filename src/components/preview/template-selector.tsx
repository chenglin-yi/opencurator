"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTemplateStore } from "@/stores/template-store";
import { useUIStore } from "@/stores/ui-store";
import { templates, TemplateId } from "@/types/template";
import { Palette, Check, FileText, Upload, Layers } from "lucide-react";

export function TemplateSelector() {
  const { selectedTemplate, setSelectedTemplate, customTemplate, loadTemplate } = useTemplateStore();
  const { setExportOpen } = useUIStore();

  React.useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const handleCustomTemplateClick = () => {
    if (customTemplate) {
      setSelectedTemplate("custom");
    } else {
      setExportOpen(true);
    }
  };

  return (
    <Card className="border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-serif">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10">
            <Layers className="h-3 w-3 text-primary" />
          </div>
          <span>简历模板</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {/* 内置模板 */}
          {templates.map((template) => (
            <div
              key={template.id}
              className={`group relative cursor-pointer rounded-lg border-2 p-2.5 transition-all hover-lift ${
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-transparent bg-muted/30 hover:border-primary/30 hover:bg-muted/50"
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {selectedTemplate === template.id && (
                <div className="absolute right-1.5 top-1.5">
                  <div className="rounded-full bg-primary p-0.5">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div
                className="mb-2 h-10 rounded-md overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${template.styles.primaryColor}15, ${template.styles.primaryColor}30)` 
                }}
              >
                <div className="flex h-full items-end justify-center p-1">
                  <div
                    className="h-3 w-6 rounded-t-sm"
                    style={{ backgroundColor: template.styles.primaryColor + "60" }}
                  />
                </div>
              </div>
              <h3 className="text-[11px] font-medium text-foreground truncate">
                {template.name}
              </h3>
            </div>
          ))}

          {/* 自定义模板 */}
          <div
            className={`group relative cursor-pointer rounded-lg border-2 p-2.5 transition-all hover-lift ${
              selectedTemplate === "custom"
                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                : customTemplate
                  ? "border-transparent bg-muted/30 hover:border-primary/30 hover:bg-muted/50"
                  : "border-dashed border-muted-foreground/20 hover:border-primary/30 hover:bg-muted/20"
            }`}
            onClick={handleCustomTemplateClick}
          >
            {selectedTemplate === "custom" && (
              <div className="absolute right-1.5 top-1.5">
                <div className="rounded-full bg-primary p-0.5">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" />
                </div>
              </div>
            )}
            <div className="mb-2 h-10 rounded-md bg-muted/50 flex items-center justify-center">
              {customTemplate ? (
                <FileText className="h-5 w-5 text-blue-500" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
              )}
            </div>
            <h3 className="text-[11px] font-medium text-foreground truncate">
              {customTemplate ? customTemplate.name : "自定义"}
            </h3>
            {customTemplate && (
              <Badge variant="secondary" className="mt-1 text-[9px] px-1 py-0">
                已上传
              </Badge>
            )}
          </div>
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground text-center">
          点击"自定义"上传您的Word模板
        </p>
      </CardContent>
    </Card>
  );
}
