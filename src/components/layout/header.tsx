"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";
import {
  Sun,
  Moon,
  Settings,
  Upload,
  Download,
  FileText,
  Sparkles,
  Github,
} from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setConfigOpen, setImportOpen, setExportOpen } = useUIStore();
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-lg shadow-foreground/5' 
          : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold-light animate-pulse-gold" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-gradient">Open</span>
              <span className="text-foreground">Curator</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Resume Studio
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImportOpen(true)}
            className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">导入</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">导出</span>
          </Button>
          
          <div className="mx-1 h-5 w-px bg-border" />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfigOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            title="API配置"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            title="切换主题"
          >
            {mounted && (theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            ))}
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <a
            href="https://github.com/chenglin-yi/opencurator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
      
      {/* 底部装饰线 */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </header>
  );
}
