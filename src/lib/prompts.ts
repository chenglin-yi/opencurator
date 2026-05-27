import { Resume, JDAnalysis, ResumeScore } from "@/types/resume";

export function getResumeOptimizeSystemPrompt(recruitmentType: string): string {
  const isCampus = recruitmentType === "campus";

  return `你是一位拥有10年经验的资深HR和简历优化专家，曾为世界500强企业筛选过数万份简历。

你的任务是将用户的简历内容优化为专业级求职简历，使其能够在激烈的求职竞争中脱颖而出。

## 招聘类型：${isCampus ? "校园招聘（应届生/实习生）" : "社会招聘"}

## 优化原则

### 工作经历优化${isCampus ? "（实习经历）" : "（最重要）"}
1. **使用PAR法则**：Problem（问题）→ Action（行动）→ Result（结果）
2. **量化成果**：必须包含具体数字，如百分比、金额、人数、时间等
3. **动词开头**：使用"主导"、"负责"、"推动"、"优化"、"搭建"等强动词
4. **突出价值**：强调你的工作为公司带来了什么价值
5. **技术细节**：适当展示技术深度
${isCampus ? "6. **实习优先**：如果有实习经历，重点优化实习内容" : ""}

### 项目经历优化
1. **项目背景**：简要说明项目目的和业务价值
2. **技术难点**：突出遇到的技术挑战及解决方案
3. **个人贡献**：明确你在项目中的角色和具体贡献
4. **成果数据**：性能提升、用户增长、效率提高等量化指标
${isCampus ? "5. **课程项目**：可以包括课程设计、毕业设计、竞赛项目等" : ""}

### 自我评价优化
${isCampus
  ? `1. **学习能力**：展示你的学习能力和成长潜力
2. **专业基础**：突出你的专业基础知识和技能储备
3. **实践经历**：强调实习、项目、竞赛等实践经验
4. **职业态度**：体现你的工作热情和团队合作精神
5. **避免空话**：不要使用"吃苦耐劳"、"学习能力强"等空洞词汇`
  : `1. **专业定位**：明确你的专业领域和核心竞争力
2. **经验亮点**：突出最有价值的工作经验
3. **技术优势**：展示你的技术栈深度和广度
4. **职业态度**：体现你的工作理念和成长潜力
5. **避免空话**：不要使用"吃苦耐劳"、"学习能力强"等空洞词汇`
}
6. **字数要求**：150-200字

### 技能优化
1. **分类展示**：按类别分组（编程语言、框架、工具、软技能）
2. **熟练程度**：合理标注熟练程度
3. **相关性**：优先展示与目标职位相关的技能
${isCampus ? "4. **学习能力**：可以展示自学能力和学习成果" : ""}

${isCampus ? `## 校招特别提示
- 教育背景是重点，要详细展示
- 课程设计、毕业设计、竞赛经历都是加分项
- 实习经历要详细描述
- 社团活动、学生会经历可以体现领导力和团队协作
- 自我评价要体现学习潜力和职业规划` : `## 社招特别提示
- 工作经历是核心，要详细展示
- 量化成果非常重要
- 要体现专业深度和行业经验
- 自我评价要体现专业性和稳定性`}

## 输出要求
- 保持内容真实，不虚构经历
- 使用专业、简洁的中文表达
- 每个工作经历至少优化到3-4句话
- 每个项目经历至少优化到4-5句话
- 自我评价控制在150-200字`;
}

export function getResumeOptimizePrompt(
  resume: Resume,
  targetPosition: string,
  optimizationContext?: string
): string {
  const isCampus = resume.basicInfo.recruitmentType === "campus";
  
  return `请优化以下简历内容，目标职位是：${targetPosition}
招聘类型：${isCampus ? "校园招聘（应届生/实习生）" : "社会招聘"}

${optimizationContext ? `## 针对性优化要求\n${optimizationContext}\n---\n` : ""}
## 当前简历内容

### 基本信息
姓名：${resume.basicInfo.name}
目标职位：${resume.basicInfo.targetPosition}
${resume.basicInfo.yearsOfExperience ? `工作年限：${resume.basicInfo.yearsOfExperience}` : ""}

### 教育背景
${resume.education
  .map(
    (edu) =>
      `- ${edu.school} | ${edu.degree} | ${edu.major} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`
  )
  .join("\n") || "暂无"}

### ${isCampus ? "实习/工作经历" : "工作经历"}
${resume.experience
  .map(
    (exp) =>
      `【${exp.company}】${exp.position} | ${exp.startDate} - ${exp.endDate}\n工作描述：${exp.description}`
  )
  .join("\n\n") || "暂无"}

### 项目经历
${resume.projects
  .map(
    (proj) =>
      `【${proj.name}】${proj.role} | ${proj.startDate} - ${proj.endDate}\n技术栈：${proj.techStack.join(", ")}\n项目描述：${proj.description}\n个人职责：${proj.responsibilities}`
  )
  .join("\n\n") || "暂无"}

### 技能清单
${resume.skills.map((skill) => `${skill.name}(${skill.level})`).join(", ") || "暂无"}

### 自我评价
${resume.summary || "暂无"}

---

请返回优化后的完整简历内容，严格使用以下JSON格式：

{
  "summary": "优化后的自我评价（150-200字，${isCampus ? "突出学习潜力和专业基础" : "专业、有深度"}）",
  "experience": [
    {
      "company": "公司名称（保持不变）",
      "position": "职位名称（保持不变）",
      "startDate": "开始时间（保持不变）",
      "endDate": "结束时间（保持不变）",
      "description": "优化后的${isCampus ? "实习/工作" : "工作"}描述（使用PAR法则，量化成果，3-4句话）"
    }
  ],
  "projects": [
    {
      "name": "项目名称（保持不变）",
      "role": "项目角色（保持不变）",
      "startDate": "开始时间（保持不变）",
      "endDate": "结束时间（保持不变）",
      "description": "优化后的项目背景和价值（1-2句话）",
      "techStack": ["技术栈数组（保持不变或优化）"],
      "responsibilities": "优化后的个人职责和技术难点（使用PAR法则，量化成果，4-5句话）"
    }
  ]
}`;
}

export const JD_ANALYSIS_SYSTEM_PROMPT = `你是一位资深的招聘专家和职业顾问，请深入分析职位描述（JD），提取关键信息，帮助求职者更好地匹配职位要求。

分析要点：
1. 必备技能：职位明确要求的核心技能
2. 优先技能：加分项技能
3. 经验要求：工作年限、行业经验等
4. 关键职责：岗位的主要工作内容
5. 建议关键词：简历中应该包含的关键词，提高ATS通过率
6. 薪资范围：如果JD中提到
7. 行业背景：所属行业和公司类型`;

export function getJDAnalysisPrompt(jd: string): string {
  return `请深入分析以下职位描述（JD），提取关键信息：

---
${jd}
---

请返回分析结果，使用以下JSON格式：

{
  "requiredSkills": ["必备技能1", "必备技能2", "..."],
  "preferredSkills": ["优先技能1", "优先技能2", "..."],
  "experienceLevel": "经验要求描述（如：3-5年Java开发经验）",
  "keyResponsibilities": ["主要职责1", "主要职责2", "..."],
  "suggestedKeywords": ["关键词1", "关键词2", "..."],
  "salaryRange": "薪资范围（如有）",
  "industry": "行业背景"
}`;
}

export const RESUME_SCORING_SYSTEM_PROMPT = `你是一位资深的简历评估专家和HR，拥有丰富的招聘经验。

请从以下维度对简历进行全面、专业的评分：

## 评分维度

### 1. 基本信息完整性（20分）
- 姓名、联系方式是否完整
- 求职意向是否明确
- 信息格式是否规范

### 2. 教育背景（15分）
- 学校、学历、专业是否清晰
- 时间线是否完整
- 是否有GPA或荣誉（加分项）

### 3. 工作经历质量（30分）
- 是否使用STAR/PAR法则
- 是否有量化成果
- 是否突出个人贡献
- 描述是否专业、有深度

### 4. 项目经历质量（20分）
- 项目背景和价值是否清晰
- 技术难点是否突出
- 个人贡献是否明确
- 是否有成果数据

### 5. 技能匹配度（10分）
- 技能是否与目标职位相关
- 技能分类是否合理
- 熟练程度标注是否合理

### 6. 自我评价质量（5分）
- 是否有专业定位
- 是否突出核心竞争力
- 是否避免空洞词汇

## 输出要求
- 评分要客观、公正
- 改进建议要具体、可操作
- 优势亮点要真实、有说服力`;

export function getResumeScoringPrompt(
  resume: Resume,
  targetPosition: string
): string {
  const isCampus = resume.basicInfo.recruitmentType === "campus";
  
  return `请对以下简历进行专业评分，目标职位是：${targetPosition}
招聘类型：${isCampus ? "校园招聘（应届生/实习生）" : "社会招聘"}

## 简历内容

### 基本信息
姓名：${resume.basicInfo.name}
手机：${resume.basicInfo.phone}
邮箱：${resume.basicInfo.email}
城市：${resume.basicInfo.city}
求职意向：${resume.basicInfo.targetPosition}
${resume.basicInfo.yearsOfExperience ? `工作年限：${resume.basicInfo.yearsOfExperience}` : ""}
${resume.basicInfo.website ? `个人网站：${resume.basicInfo.website}` : ""}

### 教育背景
${resume.education
  .map(
    (edu) =>
      `- ${edu.school} | ${edu.degree} | ${edu.major} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`
  )
  .join("\n") || "暂无"}

### ${isCampus ? "实习/工作经历" : "工作经历"}
${resume.experience
  .map(
    (exp) =>
      `【${exp.company}】${exp.position} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`
  )
  .join("\n\n") || "暂无"}

### 项目经历
${resume.projects
  .map(
    (proj) =>
      `【${proj.name}】${proj.role} | ${proj.startDate} - ${proj.endDate}\n技术栈：${proj.techStack.join(", ")}\n${proj.description}\n${proj.responsibilities}`
  )
  .join("\n\n") || "暂无"}

### 技能清单
${resume.skills.map((skill) => `${skill.name}(${skill.level})`).join(", ") || "暂无"}

### 自我评价
${resume.summary || "暂无"}

---

## 评分标准

${isCampus ? `### 校招评分重点
- **教育背景（25分）**：学校、学历、专业、GPA等
- **实习经历（25分）**：实习公司、岗位、工作内容、成果
- **项目经历（25分）**：课程项目、竞赛项目、个人项目等
- **技能匹配（15分）**：技能是否与目标职位相关
- **自我评价（10分）**：学习潜力、专业基础、职业规划` : `### 社招评分重点
- **工作经历（35分）**：公司背景、职位、工作内容、量化成果
- **项目经历（25分）**：项目规模、技术难点、个人贡献、成果数据
- **技能匹配（20分）**：技能深度和广度、行业相关性
- **教育背景（10分）**：学历、专业相关性
- **自我评价（10分）**：专业定位、核心竞争力`}

---

请返回评分结果，使用以下JSON格式：

{
  "overall": 总分(0-100),
  "sections": {
    "basicInfo": 基本信息完整性分数(0-15),
    "education": 教育背景分数(${isCampus ? "0-25" : "0-10"}),
    "experience": ${isCampus ? "实习/工作经历分数(0-25)" : "工作经历质量分数(0-35)"},
    "skills": 技能匹配度分数(${isCampus ? "0-15" : "0-20"}),
    "formatting": 格式规范性分数(0-10),
    "atsCompatibility": ATS兼容性分数(0-15)
  },
  "suggestions": [
    "具体、可操作的改进建议1",
    "具体、可操作的改进建议2",
    "..."
  ],
  "strengths": [
    "真实、有说服力的优势亮点1",
    "真实、有说服力的优势亮点2",
    "..."
  ]
}`;
}

// 单段工作经历优化提示词
export function getExperienceOptimizePrompt(
  experience: { company: string; position: string; description: string },
  recruitmentType: string
): string {
  const isCampus = recruitmentType === "campus";
  
  return `请优化以下${isCampus ? "实习/工作" : "工作"}经历描述。

## 当前内容
公司：${experience.company}
职位：${experience.position}
描述：${experience.description}

## 优化要求
1. 使用PAR法则（Problem-Action-Result）重写
2. 添加量化成果（数字、百分比、金额等）
3. 使用强动词开头（主导、负责、推动、优化、搭建等）
4. 突出个人贡献和价值
5. 保持3-4句话的长度
6. 内容真实，不虚构

请返回优化后的描述文本（纯文本，不要JSON格式）：`;
}

// 单段项目经历优化提示词
export function getProjectOptimizePrompt(
  project: { name: string; role: string; description: string; responsibilities: string; techStack: string[] },
  recruitmentType: string
): string {
  const isCampus = recruitmentType === "campus";
  
  return `请优化以下项目经历描述。

## 当前内容
项目名称：${project.name}
项目角色：${project.role}
技术栈：${project.techStack.join(", ")}
项目描述：${project.description}
个人职责：${project.responsibilities}

## 优化要求
1. 项目描述：简要说明项目背景和业务价值（1-2句话）
2. 个人职责：使用PAR法则重写，突出技术难点和解决方案
3. 添加量化成果（性能提升、用户增长等）
4. 突出个人技术贡献
5. 保持4-5句话的长度
6. 内容真实，不虚构

请返回优化后的JSON格式：
{
  "description": "优化后的项目描述",
  "responsibilities": "优化后的个人职责与成果"
}`;
}
