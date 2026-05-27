"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Resume } from "@/types/resume";
import { formatDate } from "@/lib/utils";
import { getTemplateTheme, TemplateTheme } from "@/lib/template-themes";

interface ResumePDFProps {
  resume: Resume;
  templateId?: string;
}

export function ResumePDFDocument({ resume, templateId = "classic" }: ResumePDFProps) {
  const theme = getTemplateTheme(templateId);
  const C = theme.colors;
  const { basicInfo, education, experience, projects, skills, summary } = resume;

  const styles = StyleSheet.create({
    page: {
      padding: 0,
      fontSize: 11,
      color: `#${C.text}`,
    },
    // 顶部装饰条
    headerBar: {
      height: 4,
      backgroundColor: `#${C.primary}`,
    },
    // 头部区域
    headerSection: {
      padding: "25 35 20 35",
      borderBottomWidth: 1.5,
      borderBottomColor: `#${C.primary}`,
      borderBottomStyle: "solid",
    },
    name: {
      fontSize: 26,
      fontWeight: "bold",
      color: `#${C.primary}`,
      marginBottom: 4,
    },
    targetPosition: {
      fontSize: 12,
      color: `#${C.text}`,
      marginBottom: 6,
    },
    contactInfo: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
      fontSize: 9,
      color: `#${C.textLight}`,
    },
    // 内容区域
    contentSection: {
      padding: "15 35 25 35",
    },
    // 专业标题样式
    sectionTitle: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 12,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: `#${C.primaryLight}`,
      borderBottomStyle: "solid",
    },
    sectionIcon: {
      width: 8,
      height: 8,
      backgroundColor: `#${C.primary}`,
      marginRight: 8,
    },
    sectionText: {
      fontSize: 12,
      fontWeight: "bold",
      color: `#${C.primary}`,
      letterSpacing: 0.5,
    },
    // 条目容器
    itemContainer: {
      marginBottom: 14,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: 11,
      fontWeight: "bold",
      color: `#${C.text}`,
    },
    itemSubtitle: {
      fontSize: 10,
      color: `#${C.primary}`,
    },
    itemDate: {
      fontSize: 9,
      color: `#${C.textLight}`,
    },
    bulletPoint: {
      flexDirection: "row",
      marginBottom: 3,
      paddingLeft: 10,
    },
    bullet: {
      color: `#${C.primary}`,
      marginRight: 6,
      fontSize: 10,
    },
    bulletText: {
      fontSize: 10,
      color: `#${C.text}`,
      flex: 1,
    },
    // 技术栈标签
    techStack: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 5,
      marginTop: 4,
      marginBottom: 4,
    },
    techTag: {
      fontSize: 8,
      backgroundColor: `#${C.primaryLight}`,
      color: `#${C.primaryDark}`,
      padding: "2 6",
      borderRadius: 2,
    },
    // 技能标签
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    skillItem: {
      fontSize: 10,
      color: `#${C.primaryDark}`,
    },
    skillLevel: {
      fontSize: 9,
      color: `#${C.textLight}`,
    },
    // 自我评价
    summaryText: {
      fontSize: 10,
      color: `#${C.text}`,
      lineHeight: 1.7,
      paddingLeft: 10,
    },
    // 底部
    footer: {
      marginTop: 30,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: `#${C.primaryLight}`,
      borderTopStyle: "solid",
      textAlign: "center",
    },
    footerText: {
      fontSize: 8,
      color: `#${C.textLight}`,
      fontStyle: "italic",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 顶部装饰条 */}
        <View style={styles.headerBar} />

        {/* 头部区域 */}
        <View style={styles.headerSection}>
          <Text style={styles.name}>{basicInfo.name || "姓名"}</Text>
          <Text style={styles.targetPosition}>
            {basicInfo.targetPosition || "求职意向"}
            {basicInfo.yearsOfExperience ? ` · ${basicInfo.yearsOfExperience}经验` : ""}
          </Text>
          <View style={styles.contactInfo}>
            {basicInfo.phone && <Text>{basicInfo.phone}</Text>}
            {basicInfo.email && <Text>{basicInfo.email}</Text>}
            {basicInfo.city && <Text>{basicInfo.city}</Text>}
            {basicInfo.website && <Text>{basicInfo.website}</Text>}
          </View>
        </View>

        {/* 内容区域 */}
        <View style={styles.contentSection}>
          {/* 教育背景 */}
          {education.length > 0 && (
            <View>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon} />
                <Text style={styles.sectionText}>教育背景</Text>
              </View>
              {education.map((edu, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemTitle}>{edu.school}</Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.degree} · {edu.major}
                        {edu.gpa ? ` · GPA: ${edu.gpa}` : ""}
                      </Text>
                    </View>
                    <Text style={styles.itemDate}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* 工作经历 */}
          {experience.length > 0 && (
            <View>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon} />
                <Text style={styles.sectionText}>工作经历</Text>
              </View>
              {experience.map((exp, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemTitle}>{exp.company}</Text>
                      <Text style={styles.itemSubtitle}>{exp.position}</Text>
                    </View>
                    <Text style={styles.itemDate}>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  {exp.description && (
                    <View>
                      {exp.description.split("\n").filter(l => l.trim()).map((line, lineIndex) => (
                        <View key={lineIndex} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>·</Text>
                          <Text style={styles.bulletText}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* 项目经历 */}
          {projects.length > 0 && (
            <View>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon} />
                <Text style={styles.sectionText}>项目经历</Text>
              </View>
              {projects.map((proj, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemTitle}>{proj.name}</Text>
                      <Text style={styles.itemSubtitle}>{proj.role}</Text>
                    </View>
                    <Text style={styles.itemDate}>
                      {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                    </Text>
                  </View>
                  {proj.techStack.length > 0 && (
                    <View style={styles.techStack}>
                      {proj.techStack.map((tech, techIndex) => (
                        <Text key={techIndex} style={styles.techTag}>
                          {tech}
                        </Text>
                      ))}
                    </View>
                  )}
                  {proj.description && (
                    <Text style={{ ...styles.bulletText, paddingLeft: 10, marginBottom: 4 }}>
                      {proj.description}
                    </Text>
                  )}
                  {proj.responsibilities && (
                    <View>
                      {proj.responsibilities.split("\n").filter(l => l.trim()).map((line, lineIndex) => (
                        <View key={lineIndex} style={styles.bulletPoint}>
                          <Text style={styles.bullet}>·</Text>
                          <Text style={styles.bulletText}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* 技能清单 */}
          {skills.length > 0 && (
            <View>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon} />
                <Text style={styles.sectionText}>专业技能</Text>
              </View>
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <Text key={index} style={styles.skillItem}>
                    {skill.name}
                    <Text style={styles.skillLevel}> ({skill.level})</Text>
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* 个人总结 */}
          {summary && (
            <View>
              <View style={styles.sectionTitle}>
                <View style={styles.sectionIcon} />
                <Text style={styles.sectionText}>个人总结</Text>
              </View>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          )}
        </View>

        {/* 底部 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>OpenCurator</Text>
        </View>
      </Page>
    </Document>
  );
}
