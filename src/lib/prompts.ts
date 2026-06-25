import { Resume, JDAnalysis, ResumeScore, ResumeDiagnosis } from "@/types/resume";

// ============================================================
// 第一步：简历诊断（大厂HR视角）
// ============================================================

export const RESUME_DIAGNOSIS_SYSTEM_PROMPT = `你是一位在字节跳动、阿里巴巴、腾讯、华为等头部科技公司拥有10年以上招聘经验的资深HR总监。你曾主导过数千人的校招和社招，对简历筛选、面试评估、人才画像有极其深刻的理解。

你的任务是站在大厂HR的视角，对候选人简历进行全面、深入、犀利的诊断。你要像真正的HR在15秒快速扫读和5分钟深度审阅时那样思考。

## 诊断框架

### 一、硬伤检测（必须解决的问题）
从HR的视角，逐项检查以下高危信号：
1. **稳定性风险**：在职时长、跳槽频率、职业连续性
2. **数据可信度**：量化数据是否有基线支撑、是否存在逻辑矛盾（如"离线系统"却写"高并发优化"）
3. **时间线完整性**：是否存在项目真空期、经历重叠、时间矛盾
4. **信息真实性**：链接是否可访问、证书是否可验证、公司是否存在
5. **用词风险**：是否使用了"精通"等高危词汇、是否有暴露局限性的措辞
6. **逻辑自洽性**：各段经历之间是否自洽、技术描述与业务场景是否匹配

### 二、结构性缺陷
1. **模块完整性**：是否缺少技术栈总览、研究方向等关键模块
2. **信息层级**：HR在15秒内能否抓住核心亮点
3. **关键词覆盖**：是否包含目标岗位的高频关键词
4. **调性把控**：整体语言风格是否专业得体

### 三、隐性风险评估
1. **学历竞争力**：院校层次、专业匹配度
2. **地域因素**：工作地点变动的合理性
3. **职级匹配**：经验年限与目标职级是否匹配
4. **行业转换**：行业跨度是否合理

## 输出要求
- 诊断要犀利、具体、可操作，避免泛泛而谈
- 每个问题必须给出明确的修改建议
- 需要用户补充信息的问题，要明确提出具体问题
- 使用专业但不晦涩的语言
- **JSON格式要求**：所有字符串值中不能包含未转义的双引号（用中文引号""替代），不能包含换行符（用空格替代），确保返回的JSON可以被标准JSON.parse解析`;

export function getResumeDiagnosisPrompt(
  resume: Resume,
  targetPosition?: string
): string {
  const isCampus = resume.basicInfo.recruitmentType === "campus";
  const isTech = resume.basicInfo.jobCategory === "tech";

  return `请以大厂资深HR的视角，对以下简历进行全面深度诊断。

## 候选人信息
- 姓名：${resume.basicInfo.name}
- 目标职位：${targetPosition || resume.basicInfo.targetPosition}
- 招聘类型：${isCampus ? "校园招聘" : "社会招聘"}
- 岗位类型：${isTech ? "技术岗位" : "非技术岗位"}
- 工作城市：${resume.basicInfo.city}
${resume.basicInfo.yearsOfExperience ? `- 工作年限：${resume.basicInfo.yearsOfExperience}` : ""}
${resume.basicInfo.website ? `- 个人网站：${resume.basicInfo.website}` : ""}

## 教育背景
${resume.education
  .map(
    (edu) =>
      `- ${edu.school} | ${edu.degree} | ${edu.major} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}${edu.courses && edu.courses.length > 0 ? `\n  核心课程：${edu.courses.join("、")}` : ""}`
  )
  .join("\n") || "暂无"}

## 工作经历
${resume.experience
  .map(
    (exp) =>
      `【${exp.company}】${exp.position} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`
  )
  .join("\n\n") || "暂无"}

## 项目经历
${resume.projects
  .map(
    (proj) =>
      `【${proj.name}】${proj.role} | ${proj.startDate} - ${proj.endDate}\n技术栈：${proj.techStack.join(", ")}\n项目描述：${proj.description}\n个人职责：${proj.responsibilities}`
  )
  .join("\n\n") || "暂无"}

## 技能清单
${resume.skills.map((skill) => `${skill.name}(${skill.level})`).join(", ") || "暂无"}

## 自我评价
${resume.summary || "暂无"}

---

请从以下三个维度进行诊断，严格返回JSON格式：

${isTech ? `### 技术岗位重点关注
- **技术深度**：是否展示了架构设计、系统优化、技术选型等深层能力，而非仅罗列API调用
- **技术广度**：技术栈是否有合理的深度和广度，是否与目标岗位匹配
- **技术成果量化**：性能指标（QPS、延迟、吞吐量）、系统可用性、代码质量等是否有具体数据
- **技术难点**：是否突出了遇到的技术挑战和解决方案，而非简单的业务功能实现
- **工程化能力**：CI/CD、容器化、监控告警、代码规范等工程实践是否有体现
- **技术影响力**：是否有技术分享、开源贡献、专利论文等技术影响力证明` : `### 非技术岗位重点关注
- **业务洞察**：是否展示了对行业、用户、市场的深刻理解
- **数据驱动**：是否用数据支撑业务决策和成果（转化率、ROI、用户增长等）
- **项目管理**：是否体现了跨部门协作、资源协调、项目推进能力
- **商业价值**：成果是否与商业目标挂钩（营收、成本、效率等）
- **沟通能力**：表述是否清晰、有逻辑、有说服力
- **行业经验**：是否有垂直行业的深度积累`}

1. **issues（硬伤列表）**：逐项列出简历中的实质性问题，每个问题标注严重程度(severity: critical/warning/info)、是否需要用户补充信息(needsUserInput)
2. **structural（结构性建议）**：模块完整性、信息层级、关键词覆盖等
3. **risks（隐性风险）**：学历、地域、职级匹配等HR不会明说但会默默扣分的点

返回格式：
{
  "overallAssessment": "200-300字的整体评价，要像真正HR在心里默默评价的那样真实犀利",
  "issues": [
    {
      "title": "问题标题（简短有力）",
      "severity": "critical|warning|info",
      "description": "问题的详细描述和HR视角的解读",
      "suggestion": "具体的修改建议",
      "needsUserInput": true/false,
      "userPrompt": "如果需要用户补充信息，在这里明确提出具体问题（needsUserInput为false时省略此字段）"
    }
  ],
  "structural": [
    {
      "title": "建议标题",
      "description": "现状描述",
      "action": "具体改进措施"
    }
  ],
  "risks": [
    {
      "category": "风险类别（如：学历竞争力、地域因素、职级匹配等）",
      "description": "HR视角的风险分析",
      "mitigation": "应对策略"
    }
  ],
  "userFeedbackPrompts": ["需要用户回答的问题1", "需要用户回答的问题2"]
}`;
}

// ============================================================
// 第二步：基于诊断结果的智能优化
// ============================================================

export function getResumeOptimizeSystemPrompt(recruitmentType: string, jobCategory?: string): string {
  const isCampus = recruitmentType === "campus";
  const isTech = jobCategory === "tech";

  return `你是一位拥有10年经验的资深HR和简历优化专家，曾为世界500强企业筛选过数万份简历。你同时也是专业的职业顾问和人才评估专家。

你的任务是将用户的简历内容优化为专业级求职简历，使其能够在激烈的求职竞争中脱颖而出。

## 招聘类型：${isCampus ? "校园招聘（应届生/实习生）" : "社会招聘"}
## 岗位类型：${isTech ? "技术岗位" : "非技术岗位"}

## 优化原则

### 核心理念
- **真实为本**：优化表述但绝不虚构经历，所有数据必须基于候选人提供的原始信息
- **HR视角**：每一句话都要思考"大厂HR看到这句话会怎么想"
- **ATS友好**：确保关键词密度和格式符合ATS自动筛选系统
- **扬长避短**：对弱点进行包装和弱化，对亮点进行突出和放大

### 工作经历优化${isCampus ? "（实习经历）" : "（最重要）"}
1. **使用PAR法则**：Problem（问题）→ Action（行动）→ Result（结果）
2. **量化成果**：必须包含具体数字，如百分比、金额、人数、时间等。如果原始数据缺乏基线，补充合理的上下文让数据更有说服力
3. **动词开头**：使用"主导"、"负责"、"推动"、"优化"、"搭建"等强动词
4. **突出价值**：强调你的工作为公司带来了什么价值
5. **技术细节**：适当展示技术深度，但避免暴露业务局限性
6. **避免暴露弱点**：如果原始描述中有"离线""测试""内部"等可能降低可信度的词汇，用更专业的表述替代（如"离线"→"批处理"，"测试"→"质量保障"）
${isCampus ? "7. **实习优先**：如果有实习经历，重点优化实习内容" : ""}
${isTech ? `
### 技术岗位特别优化
1. **突出技术深度**：强调架构设计、系统优化、技术选型的思考过程，而非仅罗列功能实现
2. **量化技术指标**：性能提升（QPS/延迟/吞吐量）、系统可用性（SLA）、代码覆盖率、部署频率等
3. **展示技术难点**：描述遇到的技术挑战、排查过程、最终解决方案
4. **工程化实践**：CI/CD流水线、容器化部署、监控告警体系、代码审查规范等
5. **技术影响力**：技术分享、开源贡献、专利论文、内部工具建设等
6. **技术栈深度**：不要泛泛罗列，要体现对核心技术的深入理解和实战经验` : `
### 非技术岗位特别优化
1. **突出业务洞察**：展示对行业趋势、用户需求、市场竞争的理解
2. **数据驱动决策**：用转化率、ROI、用户增长、营收等业务数据支撑成果
3. **项目管理能力**：强调跨部门协作、资源协调、进度把控、风险应对
4. **商业价值导向**：所有成果尽量与商业目标挂钩（降本、增收、提效）
5. **沟通与影响力**：体现方案说服力、利益相关方管理、团队赋能
6. **行业深度**：垂直行业的专业积累和方法论沉淀`}

### 项目经历优化
1. **项目背景**：简要说明项目目的和业务价值
2. **技术难点**：突出遇到的技术挑战及解决方案
3. **个人贡献**：明确你在项目中的角色和具体贡献
4. **成果数据**：性能提升、用户增长、效率提高等量化指标
5. **一致性**：确保项目描述与工作经历中的描述自洽
${isCampus ? "6. **课程项目**：可以包括课程设计、毕业设计、竞赛项目等" : ""}

### 教育背景优化
- 如有研究方向，应补充说明（尤其是AI/算法相关岗位）
- 如有GPA优势或荣誉奖项，应突出展示
- 核心课程应与目标岗位强相关

### 自我评价优化
${isCampus
  ? `1. **学习能力**：用具体事例而非空话来证明
2. **专业基础**：突出你的专业基础知识和技能储备
3. **实践经历**：强调实习、项目、竞赛等实践经验
4. **职业态度**：体现你的工作热情和团队合作精神`
  : `1. **专业定位**：明确你的专业领域和核心竞争力
2. **经验亮点**：突出最有价值的工作经验
3. **技术优势**：展示你的技术栈深度和广度
4. **职业态度**：体现你的工作理念和成长潜力`
}
5. **用词克制**：避免"精通"（1-3年经验用"熟练掌握""深度实践"），避免空洞词汇（"吃苦耐劳""学习能力强"）
6. **字数要求**：150-200字
7. **结尾得体**：不要出现"熟练使用cursor、trae等编程工具"等拉低调性的表述

### 技能优化
1. **分类展示**：按类别分组（编程语言、框架、工具、软技能）
2. **熟练程度**：合理标注熟练程度，1年经验避免"精通"
3. **相关性**：优先展示与目标职位相关的技能
4. **技术栈总览**：如简历缺少技术栈总览模块，在自我评价中自然融入核心技术栈关键词
${isCampus ? "5. **学习能力**：可以展示自学能力和学习成果" : ""}

${isCampus ? `## 校招特别提示
- 教育背景是重点，要详细展示
- 课程设计、毕业设计、竞赛经历都是加分项
- 实习经历要详细描述
- 社团活动、学生会经历可以体现领导力和团队协作
- 自我评价要体现学习潜力和职业规划` : `## 社招特别提示
- 工作经历是核心，要详细展示
- 量化成果非常重要
- 要体现专业深度和行业经验
- 自我评价要体现专业性和稳定性
- 跳槽动机要有合理的成长诉求`}

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
  optimizationContext?: string,
  diagnosis?: ResumeDiagnosis,
  userFeedback?: string
): string {
  const isCampus = resume.basicInfo.recruitmentType === "campus";
  const isTech = resume.basicInfo.jobCategory === "tech";

  let diagnosisContext = "";
  if (diagnosis) {
    diagnosisContext = `## 简历诊断结果（请重点修复以下问题）

### 整体评价
${diagnosis.overallAssessment}

### 需要修复的硬伤
${diagnosis.issues
  .map(
    (issue, i) =>
      `${i + 1}. [${issue.severity === "critical" ? "严重" : issue.severity === "warning" ? "警告" : "提示"}] ${issue.title}\n   问题：${issue.description}\n   修改建议：${issue.suggestion}`
  )
  .join("\n")}

### 结构性改进建议
${diagnosis.structural.map((s, i) => `${i + 1}. ${s.title}：${s.action}`).join("\n")}

### 应对策略
${diagnosis.risks.map((r) => `- ${r.category}：${r.mitigation}`).join("\n")}

`;
  }

  let userFeedbackContext = "";
  if (userFeedback && userFeedback.trim()) {
    userFeedbackContext = `## 用户补充信息（优化时请充分利用这些信息）
${userFeedback}

`;
  }

  return `请优化以下简历内容，目标职位是：${targetPosition}
招聘类型：${isCampus ? "校园招聘（应届生/实习生）" : "社会招聘"}
岗位类型：${isTech ? "技术岗位（请重点突出技术深度、架构能力、工程化实践）" : "非技术岗位（请重点突出业务洞察、数据驱动、项目管理能力）"}

${diagnosisContext}${userFeedbackContext}${optimizationContext ? `## 针对性优化要求\n${optimizationContext}\n---\n` : ""}
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

请根据诊断结果和用户补充信息，针对性地优化简历。返回优化后的完整简历内容，严格使用以下JSON格式：

{
  "summary": "优化后的自我评价（150-200字，${isCampus ? "突出学习潜力和专业基础" : "专业、有深度，避免'精通'等高危词汇"}）",
  "experience": [
    {
      "company": "公司名称（保持不变）",
      "position": "职位名称（保持不变）",
      "startDate": "开始时间（保持不变）",
      "endDate": "结束时间（保持不变）",
      "description": "优化后的${isCampus ? "实习/工作" : "工作"}描述（使用PAR法则，量化成果，3-4句话，避免暴露业务局限性）"
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

// ============================================================
// 第三步：反思审查（优化结果的质量检查）
// ============================================================

export const RESUME_REVIEW_SYSTEM_PROMPT = `你是一位严格的简历质量审核专家，同时也是大厂的终面面试官。你的任务是审查优化后的简历，确保：
1. 内容真实，没有虚构经历
2. 数据逻辑自洽，没有前后矛盾
3. 没有暴露候选人的弱点或局限性
4. 用词专业得体，没有"精通"等危险词汇（除非候选人确实有5年以上深度经验）
5. 优化幅度合理，没有过度包装
6. 关键问题已经得到修复
7. 用户补充的信息已经被合理利用

审查时要像真正的面试官那样追问：
- 这个数据的基线是什么？
- 这个表述是否经得起面试追问？
- 优化前后的差异是否合理？

返回一个简洁的审查报告，指出仍然存在的问题（如果有的话）。如果质量合格，也要明确说明。`;

export function getResumeReviewPrompt(
  originalResume: Resume,
  optimizedSummary: string,
  optimizedExperience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
  optimizedProjects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>,
  diagnosis: ResumeDiagnosis,
  userFeedback?: string
): string {
  return `请审查以下优化后的简历，对照原始诊断结果，检查所有问题是否已修复。

## 原始诊断发现的关键问题
${diagnosis.issues.map((issue, i) => `${i + 1}. [${issue.severity}] ${issue.title}：${issue.suggestion}`).join("\n")}

${userFeedback ? `## 用户补充的信息
${userFeedback}

` : ""}
## 优化后的简历内容

### 自我评价
${optimizedSummary}

### 工作经历
${optimizedExperience
  .map(
    (exp) =>
      `【${exp.company}】${exp.position} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`
  )
  .join("\n\n")}

### 项目经历
${optimizedProjects
  .map(
    (proj) =>
      `【${proj.name}】${proj.role} | ${proj.startDate} - ${proj.endDate}\n技术栈：${proj.techStack.join(", ")}\n项目描述：${proj.description}\n个人职责：${proj.responsibilities}`
  )
  .join("\n\n")}

---

请返回审查结果，严格使用以下JSON格式：

{
  "passed": true/false,
  "score": 0-100,
  "fixedIssues": ["已修复的问题1", "已修复的问题2"],
  "remainingIssues": [
    {
      "title": "问题标题",
      "description": "问题描述",
      "suggestion": "修改建议"
    }
  ],
  "qualityNotes": "对整体优化质量的简短评价（1-2句话）"
}`;
}

// ============================================================
// 第四步：基于反思的最终修正
// ============================================================

export function getRevisionPrompt(
  currentSummary: string,
  currentExperience: Array<{ company: string; position: string; startDate: string; endDate: string; description: string }>,
  currentProjects: Array<{ name: string; role: string; startDate: string; endDate: string; description: string; techStack: string[]; responsibilities: string }>,
  remainingIssues: Array<{ title: string; description: string; suggestion: string }>
): string {
  return `请根据审查反馈，修正简历中仍然存在的问题。

## 需要修正的问题
${remainingIssues.map((issue, i) => `${i + 1}. ${issue.title}\n   ${issue.description}\n   修改建议：${issue.suggestion}`).join("\n\n")}

## 当前简历内容

### 自我评价
${currentSummary}

### 工作经历
${currentExperience
  .map(
    (exp) =>
      `【${exp.company}】${exp.position} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`
  )
  .join("\n\n")}

### 项目经历
${currentProjects
  .map(
    (proj) =>
      `【${proj.name}】${proj.role} | ${proj.startDate} - ${proj.endDate}\n技术栈：${proj.techStack.join(", ")}\n项目描述：${proj.description}\n个人职责：${proj.responsibilities}`
  )
  .join("\n\n")}

---

请只修正有问题的部分，保持已通过审查的内容不变。返回修正后的完整内容，使用以下JSON格式：

{
  "summary": "修正后的自我评价（如有问题）",
  "experience": [
    {
      "company": "公司名称",
      "position": "职位名称",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "description": "修正后的工作描述"
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "项目角色",
      "startDate": "开始时间",
      "endDate": "结束时间",
      "description": "修正后的项目描述",
      "techStack": ["技术栈"],
      "responsibilities": "修正后的个人职责"
    }
  ]
}`;
}

// ============================================================
// 保留原有的评分和JD分析提示词（也做增强）
// ============================================================

export const JD_ANALYSIS_SYSTEM_PROMPT = `你是一位资深的招聘专家和职业顾问，同时也是ATS（自动简历筛选系统）的资深配置专家。请深入分析职位描述（JD），提取关键信息，帮助求职者更好地匹配职位要求。

分析要点：
1. **必备技能**：职位明确要求的核心技能（硬性要求，不满足会被直接筛掉）
2. **优先技能**：加分项技能（软性要求，有则加分）
3. **经验要求**：工作年限、行业经验、职级要求等
4. **关键职责**：岗位的主要工作内容和考核指标
5. **建议关键词**：简历中应该包含的高频关键词，提高ATS通过率。包括：技术关键词、行业关键词、软技能关键词
6. **薪资范围**：如果JD中提到
7. **行业背景**：所属行业、公司类型、业务阶段
8. **隐含要求**：JD没有明说但根据行业惯例通常会考察的点`;

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
- 是否有研究方向说明

### 3. 工作经历质量（30分）
- 是否使用STAR/PAR法则
- 是否有量化成果
- 是否突出个人贡献
- 描述是否专业、有深度
- 数据是否可信、有基线支撑
- 是否暴露了业务局限性

### 4. 项目经历质量（20分）
- 项目背景和价值是否清晰
- 技术难点是否突出
- 个人贡献是否明确
- 是否有成果数据
- 项目时间线是否合理

### 5. 技能匹配度（10分）
- 技能是否与目标职位相关
- 技能分类是否合理
- 熟练程度标注是否合理（1年经验不应写"精通"）

### 6. 自我评价质量（5分）
- 是否有专业定位
- 是否突出核心竞争力
- 是否避免空洞词汇和"精通"等高危用词

## 输出要求
- 评分要客观、公正
- 改进建议要具体、可操作
- 优势亮点要真实、有说服力
- 如发现数据可信度问题，要明确指出`;

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

// ============================================================
// 单段优化提示词（也做了增强）
// ============================================================

export function getExperienceOptimizePrompt(
  experience: { company: string; position: string; description: string },
  recruitmentType: string,
  jobCategory?: string
): string {
  const isCampus = recruitmentType === "campus";
  const isTech = jobCategory === "tech";

  return `请优化以下${isCampus ? "实习/工作" : "工作"}经历描述。

## 当前内容
公司：${experience.company}
职位：${experience.position}
描述：${experience.description}

## 优化要求
1. 使用PAR法则（Problem-Action-Result）重写
2. 添加量化成果（数字、百分比、金额等），确保数据有上下文支撑
3. 使用强动词开头（主导、负责、推动、优化、搭建等）
4. 突出个人贡献和价值
5. 保持3-4句话的长度
6. 内容真实，不虚构
7. 避免暴露业务局限性（如"离线""测试""内部"等词汇用更专业的表述替代）
${isTech ? `8. 突出技术深度：架构设计、性能优化、技术选型等技术决策过程
9. 量化技术指标：QPS、延迟、可用性、代码覆盖率等` : `8. 突出业务价值：用业务数据（转化率、ROI、用户增长等）量化成果
9. 体现管理能力：跨部门协作、资源协调、项目推进等`}

请返回优化后的描述文本（纯文本，不要JSON格式）：`;
}

export function getProjectOptimizePrompt(
  project: { name: string; role: string; description: string; responsibilities: string; techStack: string[] },
  recruitmentType: string,
  jobCategory?: string
): string {
  const isCampus = recruitmentType === "campus";
  const isTech = jobCategory === "tech";

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
3. 添加量化成果（性能提升、用户增长等），确保数据可信
4. 突出个人贡献
5. 保持4-5句话的长度
6. 内容真实，不虚构
7. 确保数据逻辑自洽（如声称"高并发优化"，业务场景应支持这一说法）
${isTech ? `8. 突出技术深度：系统架构设计、技术选型理由、性能优化方案
9. 量化技术指标：QPS、延迟、吞吐量、可用性、代码质量等
10. 展示技术难点：遇到的技术挑战、排查过程、创新解决方案` : `8. 突出业务价值：项目对业务的实际影响（营收、效率、用户满意度等）
9. 体现管理能力：团队协调、资源分配、进度管控
10. 展示方法论：使用的分析框架、决策模型、优化方法论`}

请返回优化后的JSON格式：
{
  "description": "优化后的项目描述",
  "responsibilities": "优化后的个人职责与成果"
}`;
}
