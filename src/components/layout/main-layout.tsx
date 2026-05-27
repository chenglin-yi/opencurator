"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export function MainLayout({ children, leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {leftPanel}
          </div>
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {rightPanel}
          </div>
        </div>
      </main>
    </div>
  );
}
