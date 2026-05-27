export type TemplateId = "classic" | "modern" | "tech" | "custom";

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  previewImage: string;
  isCustom: boolean;
  fileData?: ArrayBuffer;
  fileName?: string;
  styles: {
    primaryColor: string;
    fontFamily: string;
    layout: "single-column" | "two-column";
  };
}

export interface CustomTemplate extends Template {
  id: "custom";
  isCustom: true;
  fileData: ArrayBuffer;
  fileName: string;
}

export const templates: Template[] = [
  {
    id: "classic",
    name: "经典商务",
    description: "传统专业的简历模板，适合商务和金融行业",
    previewImage: "/templates/classic.png",
    isCustom: false,
    styles: {
      primaryColor: "#1a365d",
      fontFamily: "serif",
      layout: "single-column",
    },
  },
  {
    id: "modern",
    name: "现代简约",
    description: "简洁现代的设计，适合科技和互联网行业",
    previewImage: "/templates/modern.png",
    isCustom: false,
    styles: {
      primaryColor: "#2563eb",
      fontFamily: "sans",
      layout: "two-column",
    },
  },
  {
    id: "tech",
    name: "技术简历",
    description: "专为技术人员设计，突出技能和项目经验",
    previewImage: "/templates/tech.png",
    isCustom: false,
    styles: {
      primaryColor: "#059669",
      fontFamily: "mono",
      layout: "two-column",
    },
  },
];

export function getTemplate(id: TemplateId): Template {
  if (id === "custom") {
    return {
      id: "custom",
      name: "自定义模板",
      description: "用户上传的自定义Word模板",
      previewImage: "",
      isCustom: true,
      styles: {
        primaryColor: "#666",
        fontFamily: "sans",
        layout: "single-column",
      },
    };
  }
  return templates.find((t) => t.id === id) || templates[0];
}
