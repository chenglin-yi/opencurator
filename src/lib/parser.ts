import { Resume, BasicInfo, Education, Experience, Project, Skill } from "@/types/resume";
import { generateId } from "@/lib/utils";

// 解析Word文件
export async function parseWordFile(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// 解析PDF文件（使用 pdfjs-dist，浏览器兼容）
export async function parsePDFFile(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  // 设置 worker（使用 CDN，避免打包问题）
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n\n";
  }

  return fullText.trim();
}

// 使用AI解析文本为简历结构
export function parseTextToResumePrompt(text: string): string {
  return `请将以下简历文本解析为结构化的JSON格式。

## 简历文本内容

${text}

---

请返回解析后的JSON，使用以下格式：

{
  "basicInfo": {
    "name": "姓名",
    "phone": "手机号码",
    "email": "电子邮箱",
    "targetPosition": "求职意向/目标职位",
    "city": "所在城市",
    "website": "个人网站（如有）"
  },
  "education": [
    {
      "school": "学校名称",
      "degree": "学历（本科/硕士/博士等）",
      "major": "专业",
      "startDate": "YYYY-MM格式开始时间",
      "endDate": "YYYY-MM格式结束时间",
      "gpa": "GPA（如有）"
    }
  ],
  "experience": [
    {
      "company": "公司名称",
      "position": "职位名称",
      "startDate": "YYYY-MM格式开始时间",
      "endDate": "YYYY-MM格式结束时间",
      "description": "工作描述"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "项目角色",
      "startDate": "YYYY-MM格式开始时间",
      "endDate": "YYYY-MM格式结束时间",
      "description": "项目描述",
      "techStack": ["技术栈"],
      "responsibilities": "个人职责与成果"
    }
  ],
  "skills": [
    {
      "name": "技能名称",
      "level": "熟练程度（了解/熟悉/熟练/精通）"
    }
  ],
  "summary": "自我评价/个人总结"
}

注意事项：
1. 如果某些字段无法从文本中提取，请使用空字符串或空数组
2. 时间格式统一为YYYY-MM
3. 技能熟练程度默认为"熟悉"
4. 保持内容真实，不要添加原文中没有的信息`;
}

// 创建默认的空简历
export function createEmptyResume(): Resume {
  return {
    basicInfo: {
      name: "",
      phone: "",
      email: "",
      targetPosition: "",
      recruitmentType: "social",
      jobCategory: "tech",
      website: "",
      city: "",
      yearsOfExperience: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    summary: "",
  };
}

// 合并导入的简历数据到现有简历
export function mergeResumeData(existing: Resume, imported: Partial<Resume>): Resume {
  return {
    basicInfo: {
      ...existing.basicInfo,
      ...(imported.basicInfo || {}),
    },
    education: imported.education?.length ? imported.education : existing.education,
    experience: imported.experience?.length ? imported.experience : existing.experience,
    projects: imported.projects?.length ? imported.projects : existing.projects,
    skills: imported.skills?.length ? imported.skills : existing.skills,
    summary: imported.summary || existing.summary,
  };
}

// 验证文件类型
export function validateFileType(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/pdf", // .pdf
  ];
  
  const allowedExtensions = [".docx", ".pdf"];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
  
  if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
    return { valid: false, error: "请上传 .docx 或 .pdf 格式的文件" };
  }
  
  if (file.size > 20 * 1024 * 1024) {
    return { valid: false, error: "文件大小不能超过20MB" };
  }
  
  return { valid: true };
}
