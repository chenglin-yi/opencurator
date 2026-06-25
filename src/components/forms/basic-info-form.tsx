"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/stores/resume-store";
import { RecruitmentType, JobCategory } from "@/types/resume";
import { User, Briefcase, GraduationCap, Sparkles, Code, Users } from "lucide-react";

export function BasicInfoForm() {
  const { basicInfo, setBasicInfo } = useResumeStore();

  const handleChange = (field: string, value: string) => {
    setBasicInfo({ ...basicInfo, [field]: value });
  };

  const handleRecruitmentTypeChange = (type: RecruitmentType) => {
    setBasicInfo({ ...basicInfo, recruitmentType: type });
  };

  const handleJobCategoryChange = (category: JobCategory) => {
    setBasicInfo({ ...basicInfo, jobCategory: category });
  };

  return (
    <Card className="card-elegant border-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-serif">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>基本信息</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 招聘类型选择 */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            招聘类型
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all hover-lift ${
                basicInfo.recruitmentType === "social"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-transparent bg-muted/30 hover:border-primary/30"
              }`}
              onClick={() => handleRecruitmentTypeChange("social")}
            >
              {basicInfo.recruitmentType === "social" && (
                <div className="absolute right-2 top-2">
                  <div className="rounded-full bg-primary p-0.5">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  basicInfo.recruitmentType === "social" 
                    ? "bg-primary/10" 
                    : "bg-muted"
                }`}>
                  <Briefcase className={`h-5 w-5 ${
                    basicInfo.recruitmentType === "social" 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">社会招聘</p>
                  <p className="text-[11px] text-muted-foreground">
                    有工作经验
                  </p>
                </div>
              </div>
            </div>
            
            <div
              className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all hover-lift ${
                basicInfo.recruitmentType === "campus"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-transparent bg-muted/30 hover:border-primary/30"
              }`}
              onClick={() => handleRecruitmentTypeChange("campus")}
            >
              {basicInfo.recruitmentType === "campus" && (
                <div className="absolute right-2 top-2">
                  <div className="rounded-full bg-primary p-0.5">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  basicInfo.recruitmentType === "campus" 
                    ? "bg-primary/10" 
                    : "bg-muted"
                }`}>
                  <GraduationCap className={`h-5 w-5 ${
                    basicInfo.recruitmentType === "campus" 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">校园招聘</p>
                  <p className="text-[11px] text-muted-foreground">
                    应届生/实习生
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 岗位类型选择 */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            岗位类型
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all hover-lift ${
                basicInfo.jobCategory === "tech"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-transparent bg-muted/30 hover:border-primary/30"
              }`}
              onClick={() => handleJobCategoryChange("tech")}
            >
              {basicInfo.jobCategory === "tech" && (
                <div className="absolute right-2 top-2">
                  <div className="rounded-full bg-primary p-0.5">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  basicInfo.jobCategory === "tech" 
                    ? "bg-primary/10" 
                    : "bg-muted"
                }`}>
                  <Code className={`h-5 w-5 ${
                    basicInfo.jobCategory === "tech" 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">技术岗位</p>
                  <p className="text-[11px] text-muted-foreground">
                    开发、算法、运维、数据等
                  </p>
                </div>
              </div>
            </div>
            
            <div
              className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all hover-lift ${
                basicInfo.jobCategory === "non-tech"
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-transparent bg-muted/30 hover:border-primary/30"
              }`}
              onClick={() => handleJobCategoryChange("non-tech")}
            >
              {basicInfo.jobCategory === "non-tech" && (
                <div className="absolute right-2 top-2">
                  <div className="rounded-full bg-primary p-0.5">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  basicInfo.jobCategory === "non-tech" 
                    ? "bg-primary/10" 
                    : "bg-muted"
                }`}>
                  <Users className={`h-5 w-5 ${
                    basicInfo.jobCategory === "non-tech" 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">非技术岗位</p>
                  <p className="text-[11px] text-muted-foreground">
                    产品、运营、市场、管理等
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 表单字段 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
              姓名 <span className="text-primary">*</span>
            </Label>
            <Input
              id="name"
              placeholder="请输入姓名"
              value={basicInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
              手机号码 <span className="text-primary">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号码"
              value={basicInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
              电子邮箱 <span className="text-primary">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入电子邮箱"
              value={basicInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-xs font-medium text-muted-foreground">
              所在城市
            </Label>
            <Input
              id="city"
              placeholder="请输入所在城市"
              value={basicInfo.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetPosition" className="text-xs font-medium text-muted-foreground">
              求职意向 <span className="text-primary">*</span>
            </Label>
            <Input
              id="targetPosition"
              placeholder="如：前端开发工程师"
              value={basicInfo.targetPosition}
              onChange={(e) => handleChange("targetPosition", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
          {basicInfo.recruitmentType === "social" && (
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience" className="text-xs font-medium text-muted-foreground">
                工作年限
              </Label>
              <Input
                id="yearsOfExperience"
                placeholder="如：3年、5年+"
                value={basicInfo.yearsOfExperience || ""}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
              />
            </div>
          )}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="website" className="text-xs font-medium text-muted-foreground">
              个人网站/GitHub
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="请输入个人网站或GitHub地址（选填）"
              value={basicInfo.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="h-10 bg-muted/30 border-transparent focus:border-primary/30 focus:bg-background transition-all"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
