import { create } from "zustand";
import { TemplateId, CustomTemplate } from "@/types/template";
import { saveTemplateToDB, loadTemplateFromDB, removeTemplateFromDB } from "@/lib/db";

interface TemplateState {
  selectedTemplate: TemplateId;
  customTemplate: Omit<CustomTemplate, "fileData"> | null;
  isLoaded: boolean;
  
  setSelectedTemplate: (template: TemplateId) => void;
  setCustomTemplate: (template: CustomTemplate) => Promise<void>;
  clearCustomTemplate: () => Promise<void>;
  loadTemplate: () => Promise<void>;
  getTemplateData: () => Promise<ArrayBuffer | null>;
}

export const useTemplateStore = create<TemplateState>()((set, get) => ({
  selectedTemplate: "classic",
  customTemplate: null,
  isLoaded: false,

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  
  setCustomTemplate: async (template) => {
    // 保存到IndexedDB
    await saveTemplateToDB(template.fileData, template.fileName, template.name);
    
    // 保存基本信息到state（不包含fileData）
    const { fileData, ...meta } = template;
    set({ 
      customTemplate: meta,
      selectedTemplate: "custom"
    });
  },
  
  clearCustomTemplate: async () => {
    await removeTemplateFromDB();
    set({ 
      customTemplate: null,
      selectedTemplate: "classic"
    });
  },
  
  loadTemplate: async () => {
    if (get().isLoaded) return;
    
    try {
      const saved = await loadTemplateFromDB();
      if (saved) {
        set({
          customTemplate: {
            id: "custom",
            name: saved.name,
            description: "用户上传的自定义Word模板",
            previewImage: "",
            isCustom: true,
            fileName: saved.fileName,
            styles: {
              primaryColor: "#666",
              fontFamily: "sans",
              layout: "single-column",
            },
          },
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },
  
  getTemplateData: async () => {
    try {
      const saved = await loadTemplateFromDB();
      return saved?.data || null;
    } catch {
      return null;
    }
  },
}));
