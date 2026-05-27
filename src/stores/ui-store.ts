import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isConfigOpen: boolean;
  isImportOpen: boolean;
  isExportOpen: boolean;
  isJDAnalyzerOpen: boolean;
  activeTab: string;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setConfigOpen: (open: boolean) => void;
  setImportOpen: (open: boolean) => void;
  setExportOpen: (open: boolean) => void;
  setJDAnalyzerOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isConfigOpen: false,
  isImportOpen: false,
  isExportOpen: false,
  isJDAnalyzerOpen: false,
  activeTab: "basic",

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setConfigOpen: (open) => set({ isConfigOpen: open }),
  setImportOpen: (open) => set({ isImportOpen: open }),
  setExportOpen: (open) => set({ isExportOpen: open }),
  setJDAnalyzerOpen: (open) => set({ isJDAnalyzerOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
