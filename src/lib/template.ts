import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import { Resume } from "@/types/resume";
import { formatDate } from "@/lib/utils";

export interface TemplateData {
  // 基本信息
  name: string;
  phone: string;
  email: string;
  city: string;
  targetPosition: string;
  website: string;
  yearsOfExperience: string;
  
  // 教育背景
  education: {
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    gpa: string;
    courses: string;
  }[];
  
  // 工作经历
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    descriptionLines: { text: string }[];
  }[];
  
  // 项目经历
  projects: {
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    responsibilities: string;
    techStack: string;
    techStackList: { name: string }[];
    descriptionLines: { text: string }[];
    responsibilityLines: { text: string }[];
  }[];
  
  // 技能清单
  skills: {
    name: string;
    level: string;
  }[];
  skillsText: string;
  
  // 自我评价
  summary: string;
  summaryLines: { text: string }[];
}

function convertResumeToTemplateData(resume: Resume): TemplateData {
  const { basicInfo, education, experience, projects, skills, summary } = resume;
  
  return {
    // 基本信息
    name: basicInfo.name || "姓名",
    phone: basicInfo.phone || "",
    email: basicInfo.email || "",
    city: basicInfo.city || "",
    targetPosition: basicInfo.targetPosition || "求职意向",
    website: basicInfo.website || "",
    yearsOfExperience: basicInfo.yearsOfExperience || "",
    
    // 教育背景
    education: education.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      major: edu.major,
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
      gpa: edu.gpa || "",
      courses: edu.courses?.join("、") || "",
    })),
    
    // 工作经历
    experience: experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      startDate: formatDate(exp.startDate),
      endDate: formatDate(exp.endDate),
      description: exp.description,
      // 将描述按行分割，用于模板循环
      descriptionLines: exp.description
        .split("\n")
        .filter(line => line.trim())
        .map(line => ({ text: line.trim() })),
    })),
    
    // 项目经历
    projects: projects.map(proj => ({
      name: proj.name,
      role: proj.role,
      startDate: formatDate(proj.startDate),
      endDate: formatDate(proj.endDate),
      description: proj.description,
      responsibilities: proj.responsibilities,
      techStack: proj.techStack.join("、"),
      techStackList: proj.techStack.map(t => ({ name: t })),
      descriptionLines: proj.description
        .split("\n")
        .filter(line => line.trim())
        .map(line => ({ text: line.trim() })),
      responsibilityLines: proj.responsibilities
        .split("\n")
        .filter(line => line.trim())
        .map(line => ({ text: line.trim() })),
    })),
    
    // 技能清单
    skills: skills.map(skill => ({
      name: skill.name,
      level: skill.level,
    })),
    skillsText: skills.map(s => `${s.name}(${s.level})`).join("、"),
    
    // 自我评价
    summary: summary,
    summaryLines: summary
      .split("\n")
      .filter(line => line.trim())
      .map(line => ({ text: line.trim() })),
  };
}

export async function exportWithCustomTemplate(
  resume: Resume,
  templateData: ArrayBuffer
): Promise<void> {
  try {
    // 加载模板文件
    const zip = new PizZip(templateData);
    
    // 创建docxtemplater实例
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: "{",
        end: "}",
      },
    });
    
    // 准备数据
    const data = convertResumeToTemplateData(resume);
    
    // 渲染模板
    doc.render(data);
    
    // 生成文档
    const output = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    
    // 下载文件
    saveAs(output, `${resume.basicInfo.name || "简历"}_OpenCurator.docx`);
  } catch (error) {
    console.error("模板导出失败:", error);
    throw new Error("模板导出失败，请检查模板格式是否正确");
  }
}

export function validateTemplate(file: File): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!file.name.endsWith(".docx")) {
      resolve({ valid: false, error: "请上传.docx格式的Word文件" });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      resolve({ valid: false, error: "文件大小不能超过10MB" });
      return;
    }
    
    // 简化验证：只检查文件类型和大小
    // 实际的模板验证会在导出时进行
    resolve({ valid: true });
  });
}

// 模板标签说明
export const TEMPLATE_TAGS_HELP = `
## Word模板标签说明

在Word文档中使用以下标签来插入简历数据：

### 基本信息
- {name} - 姓名
- {phone} - 手机号码
- {email} - 电子邮箱
- {city} - 所在城市
- {targetPosition} - 求职意向
- {website} - 个人网站
- {yearsOfExperience} - 工作年限

### 教育背景（循环）
{#education}
- {school} - 学校名称
- {degree} - 学历
- {major} - 专业
- {startDate} - 开始时间
- {endDate} - 结束时间
- {gpa} - GPA
{/education}

### 工作经历（循环）
{#experience}
- {company} - 公司名称
- {position} - 职位
- {startDate} - 开始时间
- {endDate} - 结束时间
- {description} - 工作描述（完整文本）
- {#descriptionLines}{text}{/descriptionLines} - 按行循环
{/experience}

### 项目经历（循环）
{#projects}
- {name} - 项目名称
- {role} - 项目角色
- {startDate} - 开始时间
- {endDate} - 结束时间
- {description} - 项目描述
- {responsibilities} - 个人职责
- {techStack} - 技术栈（逗号分隔）
- {#techStackList}{name}{/techStackList} - 技术栈循环
{/projects}

### 技能清单
- {skillsText} - 所有技能（文本格式）
- {#skills}{name}({level}){/skills} - 技能循环

### 自我评价
- {summary} - 自我评价（完整文本）
- {#summaryLines}{text}{/summaryLines} - 按行循环
`;
