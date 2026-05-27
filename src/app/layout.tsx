import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenCurator - AI智能简历制作工具 | 免费在线简历优化",
  description:
    "OpenCurator是一款免费的AI智能简历制作工具，支持AI简历优化、简历评分、JD职位分析、多模板导出PDF/Word。使用OpenAI、Claude等大模型一键优化简历，提升求职成功率。",
  keywords: [
    "简历制作",
    "AI简历",
    "简历优化",
    "在线简历",
    "简历模板",
    "求职简历",
    "resume builder",
    "AI resume",
    "简历工具",
    "PDF简历",
    "Word简历",
    "简历评分",
    "JD分析",
  ],
  authors: [{ name: "BranchNorth" }, { name: "星林纪" }],
  creator: "OpenCurator",
  publisher: "OpenCurator",
  robots: "index, follow",
  alternates: {
    canonical: "https://github.com/chenglin-yi/opencurator",
  },
  openGraph: {
    title: "OpenCurator - AI智能简历制作工具",
    description:
      "免费AI简历优化工具，支持简历评分、JD分析、多模板导出，让求职更高效。",
    url: "https://github.com/chenglin-yi/opencurator",
    siteName: "OpenCurator",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenCurator - AI智能简历制作工具",
    description:
      "免费AI简历优化工具，支持简历评分、JD分析、多模板导出，让求职更高效。",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "OpenCurator - AI智能简历制作工具",
              description:
                "免费的AI智能简历制作工具，支持AI简历优化、简历评分、JD职位分析、多模板导出PDF/Word。",
              url: "https://github.com/chenglin-yi/opencurator",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
              author: {
                "@type": "Organization",
                name: "OpenCurator",
                url: "https://branchnorth.cc.cd/",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
