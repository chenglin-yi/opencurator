export interface TemplateTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    text: string;
    textLight: string;
    background: string;
    headerBg: string;
    border: string;
  };
  style: {
    headerLayout: "center" | "left" | "split";
    accentStyle: "line" | "block" | "subtle";
    fontFamily: string;
  };
}

export const templateThemes: Record<string, TemplateTheme> = {
  classic: {
    id: "classic",
    name: "经典商务",
    colors: {
      primary: "1E3A5F",      // 深海蓝
      primaryLight: "E8F0FE", // 浅蓝
      primaryDark: "0F2847",  // 深蓝
      accent: "C4A35A",       // 金色点缀
      text: "1A1A2E",         // 深色文字
      textLight: "6B7280",    // 浅灰文字
      background: "FFFFFF",   // 白色
      headerBg: "F8FAFC",     // 浅灰背景
      border: "D1D5DB",       // 边框灰
    },
    style: {
      headerLayout: "center",
      accentStyle: "line",
      fontFamily: "Microsoft YaHei",
    },
  },
  modern: {
    id: "modern",
    name: "现代简约",
    colors: {
      primary: "2563EB",      // 亮蓝
      primaryLight: "DBEAFE", // 浅蓝
      primaryDark: "1D4ED8",  // 深蓝
      accent: "3B82F6",       // 蓝色强调
      text: "111827",         // 近黑文字
      textLight: "9CA3AF",    // 浅灰文字
      background: "FFFFFF",   // 白色
      headerBg: "F0F9FF",     // 极浅蓝背景
      border: "BFDBFE",       // 浅蓝边框
    },
    style: {
      headerLayout: "left",
      accentStyle: "block",
      fontFamily: "Microsoft YaHei",
    },
  },
  tech: {
    id: "tech",
    name: "技术简历",
    colors: {
      primary: "059669",      // 翠绿
      primaryLight: "D1FAE5", // 浅绿
      primaryDark: "047857",  // 深绿
      accent: "10B981",       // 绿色强调
      text: "064E3B",         // 深绿文字
      textLight: "6B7280",    // 浅灰文字
      background: "FFFFFF",   // 白色
      headerBg: "ECFDF5",     // 浅绿背景
      border: "A7F3D0",       // 浅绿边框
    },
    style: {
      headerLayout: "split",
      accentStyle: "subtle",
      fontFamily: "Microsoft YaHei",
    },
  },
};

export function getTemplateTheme(templateId: string): TemplateTheme {
  return templateThemes[templateId] || templateThemes.classic;
}
