import React from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { Resume } from "@/types/resume";
import { formatDate } from "@/lib/utils";
import { getTemplateTheme, TemplateTheme } from "@/lib/template-themes";

export async function exportToWord(resume: Resume, templateId: string = "classic"): Promise<void> {
  const theme = getTemplateTheme(templateId);
  const C = theme.colors;
  const font = theme.style.fontFamily;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font,
            size: 21,
            color: C.text,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
            },
          },
        },
        children: [
          // 头部
          ...createHeaderByStyle(resume, theme),
          // 分隔线
          createSeparator(theme),
          // 教育背景
          ...(resume.education.length > 0 ? createEducationSection(resume, theme) : []),
          // 工作经历
          ...(resume.experience.length > 0 ? createExperienceSection(resume, theme) : []),
          // 项目经历
          ...(resume.projects.length > 0 ? createProjectsSection(resume, theme) : []),
          // 技能清单
          ...(resume.skills.length > 0 ? createSkillsSection(resume, theme) : []),
          // 自我评价
          ...(resume.summary ? createSummarySection(resume, theme) : []),
          // 底部
          createFooter(theme),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${resume.basicInfo.name || "简历"}_${theme.name}.docx`);
}

// 根据模板风格创建不同的头部
function createHeaderByStyle(resume: Resume, theme: TemplateTheme): Paragraph[] {
  switch (theme.style.headerLayout) {
    case "center":
      return createCenterHeader(resume, theme);
    case "left":
      return createLeftHeader(resume, theme);
    case "split":
      return createSplitHeader(resume, theme);
    default:
      return createCenterHeader(resume, theme);
  }
}

// 居中布局头部（经典）
function createCenterHeader(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const { basicInfo } = resume;
  const C = theme.colors;

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.name || "姓名",
          bold: true,
          size: 52,
          font: theme.style.fontFamily,
          color: C.primary,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.targetPosition || "求职意向",
          size: 24,
          color: C.text,
        }),
        ...(basicInfo.yearsOfExperience
          ? [
              new TextRun({
                text: `  ·  ${basicInfo.yearsOfExperience}经验`,
                size: 22,
                color: C.textLight,
              }),
            ]
          : []),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: basicInfo.phone || "", size: 20, color: C.textLight }),
        new TextRun({ text: "   |   ", size: 20, color: C.border }),
        new TextRun({ text: basicInfo.email || "", size: 20, color: C.textLight }),
        new TextRun({ text: "   |   ", size: 20, color: C.border }),
        new TextRun({ text: basicInfo.city || "", size: 20, color: C.textLight }),
        ...(basicInfo.website
          ? [
              new TextRun({ text: "   |   ", size: 20, color: C.border }),
              new TextRun({ text: basicInfo.website, size: 20, color: C.textLight }),
            ]
          : []),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
  ];
}

// 左对齐布局头部（现代）
function createLeftHeader(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const { basicInfo } = resume;
  const C = theme.colors;

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.name || "姓名",
          bold: true,
          size: 48,
          font: theme.style.fontFamily,
          color: C.primary,
        }),
      ],
      spacing: { before: 100, after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.targetPosition || "求职意向",
          size: 24,
          color: C.text,
        }),
        ...(basicInfo.yearsOfExperience
          ? [
              new TextRun({
                text: `  ·  ${basicInfo.yearsOfExperience}经验`,
                size: 22,
                color: C.textLight,
              }),
            ]
          : []),
      ],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: basicInfo.phone || "", size: 20, color: C.textLight }),
        new TextRun({ text: "  |  ", size: 20, color: C.border }),
        new TextRun({ text: basicInfo.email || "", size: 20, color: C.textLight }),
        new TextRun({ text: "  |  ", size: 20, color: C.border }),
        new TextRun({ text: basicInfo.city || "", size: 20, color: C.textLight }),
        ...(basicInfo.website
          ? [
              new TextRun({ text: "  |  ", size: 20, color: C.border }),
              new TextRun({ text: basicInfo.website, size: 20, color: C.textLight }),
            ]
          : []),
      ],
      spacing: { after: 100 },
    }),
  ];
}

// 分栏布局头部（技术）
function createSplitHeader(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const { basicInfo } = resume;
  const C = theme.colors;

  return [
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.name || "姓名",
          bold: true,
          size: 48,
          font: theme.style.fontFamily,
          color: C.primary,
        }),
      ],
      spacing: { before: 100, after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: basicInfo.targetPosition || "求职意向",
          bold: true,
          size: 24,
          color: C.primaryDark,
        }),
        ...(basicInfo.yearsOfExperience
          ? [
              new TextRun({
                text: `  ·  ${basicInfo.yearsOfExperience}经验`,
                size: 22,
                color: C.textLight,
              }),
            ]
          : []),
      ],
      spacing: { after: 40 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `📱 ${basicInfo.phone || ""}`, size: 20, color: C.textLight }),
        new TextRun({ text: "  ", size: 20 }),
        new TextRun({ text: `📧 ${basicInfo.email || ""}`, size: 20, color: C.textLight }),
        new TextRun({ text: "  ", size: 20 }),
        new TextRun({ text: `📍 ${basicInfo.city || ""}`, size: 20, color: C.textLight }),
        ...(basicInfo.website
          ? [
              new TextRun({ text: "  ", size: 20 }),
              new TextRun({ text: `🌐 ${basicInfo.website}`, size: 20, color: C.textLight }),
            ]
          : []),
      ],
      spacing: { after: 80 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 1,
          color: C.primary,
        },
      },
    }),
  ];
}

// 分隔线
function createSeparator(theme: TemplateTheme): Paragraph {
  const C = theme.colors;
  
  return new Paragraph({
    children: [new TextRun({ text: " ", size: 1 })],
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 2,
        color: C.primary,
      },
    },
    spacing: { after: 80 },
  });
}

// 专业标题设计 - 简洁优雅
function createSectionTitle(title: string, theme: TemplateTheme): Paragraph {
  const C = theme.colors;
  
  return new Paragraph({
    children: [
      // 左侧小色块
      new TextRun({
        text: "■ ",
        size: 20,
        color: C.primary,
        font: theme.style.fontFamily,
      }),
      // 标题文字 - 小字号、适中粗细
      new TextRun({
        text: title,
        bold: true,
        size: 22,
        font: theme.style.fontFamily,
        color: C.primary,
      }),
    ],
    spacing: { before: 240, after: 120 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 1,
        color: C.primaryLight,
      },
    },
  });
}

// 教育背景
function createEducationSection(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const C = theme.colors;
  const paragraphs: Paragraph[] = [
    createSectionTitle("教育背景", theme),
  ];

  resume.education.forEach((edu) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: edu.school,
            bold: true,
            size: 22,
            color: C.text,
          }),
          new TextRun({
            text: `  |  ${edu.degree}  |  ${edu.major}`,
            size: 21,
            color: C.textLight,
          }),
        ],
        spacing: { after: 20 },
      })
    );

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
            size: 20,
            color: C.textLight,
          }),
          ...(edu.gpa
            ? [
                new TextRun({
                  text: `    GPA: ${edu.gpa}`,
                  size: 20,
                  color: C.primary,
                  bold: true,
                }),
              ]
            : []),
        ],
        spacing: { after: 100 },
      })
    );
  });

  return paragraphs;
}

// 工作经历
function createExperienceSection(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const C = theme.colors;
  const paragraphs: Paragraph[] = [
    createSectionTitle("工作经历", theme),
  ];

  resume.experience.forEach((exp) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: exp.company,
            bold: true,
            size: 22,
            color: C.text,
          }),
          new TextRun({
            text: "  |  ",
            size: 21,
            color: C.border,
          }),
          new TextRun({
            text: exp.position,
            size: 21,
            color: C.primary,
          }),
          new TextRun({
            text: `    ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`,
            size: 20,
            color: C.textLight,
          }),
        ],
        spacing: { after: 60 },
      })
    );

    if (exp.description) {
      const lines = exp.description.split("\n").filter((l) => l.trim());
      lines.forEach((line) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "·  ",
                color: C.primary,
                size: 22,
              }),
              new TextRun({
                text: line.trim(),
                size: 21,
                color: C.text,
              }),
            ],
            spacing: { after: 40 },
            indent: { left: convertInchesToTwip(0.15) },
          })
        );
      });
    }

    paragraphs.push(new Paragraph({ children: [], spacing: { after: 60 } }));
  });

  return paragraphs;
}

// 项目经历
function createProjectsSection(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const C = theme.colors;
  const paragraphs: Paragraph[] = [
    createSectionTitle("项目经历", theme),
  ];

  resume.projects.forEach((proj) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: proj.name,
            bold: true,
            size: 22,
            color: C.text,
          }),
          new TextRun({
            text: "  |  ",
            size: 21,
            color: C.border,
          }),
          new TextRun({
            text: proj.role,
            size: 21,
            color: C.primary,
          }),
          new TextRun({
            text: `    ${formatDate(proj.startDate)} - ${formatDate(proj.endDate)}`,
            size: 20,
            color: C.textLight,
          }),
        ],
        spacing: { after: 60 },
      })
    );

    if (proj.techStack.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: proj.techStack.flatMap((tech, index) => [
            ...(index > 0 ? [new TextRun({ text: " ", size: 18 })] : []),
            new TextRun({
              text: ` ${tech} `,
              size: 18,
              color: C.primaryDark,
              shading: {
                type: ShadingType.CLEAR,
                fill: C.primaryLight,
                color: "auto",
              },
            }),
          ]),
          spacing: { after: 60 },
        })
      );
    }

    if (proj.description) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: proj.description,
              size: 21,
              color: C.text,
            }),
          ],
          spacing: { after: 40 },
          indent: { left: convertInchesToTwip(0.15) },
        })
      );
    }

    if (proj.responsibilities) {
      const lines = proj.responsibilities.split("\n").filter((l) => l.trim());
      lines.forEach((line) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "·  ",
                color: C.primary,
                size: 22,
              }),
              new TextRun({
                text: line.trim(),
                size: 21,
                color: C.text,
              }),
            ],
            spacing: { after: 40 },
            indent: { left: convertInchesToTwip(0.15) },
          })
        );
      });
    }

    paragraphs.push(new Paragraph({ children: [], spacing: { after: 60 } }));
  });

  return paragraphs;
}

// 技能清单
function createSkillsSection(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const C = theme.colors;
  const paragraphs: Paragraph[] = [
    createSectionTitle("专业技能", theme),
  ];

  paragraphs.push(
    new Paragraph({
      children: resume.skills.flatMap((skill, index) => [
        ...(index > 0 ? [new TextRun({ text: "  ", size: 20 })] : []),
        new TextRun({
          text: skill.name,
          size: 20,
          color: C.primaryDark,
        }),
        new TextRun({
          text: `(${skill.level})`,
          size: 18,
          color: C.textLight,
        }),
      ]),
      spacing: { after: 100 },
    })
  );

  return paragraphs;
}

// 自我评价
function createSummarySection(resume: Resume, theme: TemplateTheme): Paragraph[] {
  const C = theme.colors;
  const paragraphs: Paragraph[] = [
    createSectionTitle("个人总结", theme),
  ];

  const lines = resume.summary.split("\n").filter((l) => l.trim());
  lines.forEach((line) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: line.trim(),
            size: 21,
            color: C.text,
          }),
        ],
        spacing: { after: 60 },
        indent: { left: convertInchesToTwip(0.15) },
      })
    );
  });

  return paragraphs;
}

// 底部
function createFooter(theme: TemplateTheme): Paragraph {
  const C = theme.colors;
  
  return new Paragraph({
    children: [
      new TextRun({
        text: "OpenCurator",
        size: 16,
        color: C.textLight,
        italics: true,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 300 },
  });
}

// PDF导出
export async function exportToPDF(resume: Resume, templateId: string = "classic"): Promise<void> {
  const { pdf } = await import("@react-pdf/renderer");
  const { ResumePDFDocument } = await import("@/components/preview/resume-pdf");
  const { saveAs } = await import("file-saver");

  // @ts-ignore
  const blob = await pdf(React.createElement(ResumePDFDocument, { resume, templateId })).toBlob();
  saveAs(blob, `${resume.basicInfo.name || "简历"}_${templateId}.pdf`);
}
