# 字体文件说明

PDF导出功能需要中文字体支持。请下载以下字体文件并放置在此目录：

## 需要的字体文件

1. **NotoSansSC-Regular.ttf** - 思源黑体常规
2. **NotoSerifSC-Regular.ttf** - 思源宋体常规

## 下载方式

### 方式一：从Google Fonts下载
- 思源黑体: https://fonts.google.com/noto/specimen/Noto+Sans+SC
- 思源宋体: https://fonts.google.com/noto/specimen/Noto+Serif+SC

### 方式二：从GitHub下载
- Noto Sans SC: https://github.com/googlefonts/noto-cjk/releases
- Noto Serif SC: https://github.com/googlefonts/noto-cjk/releases

## 文件放置

下载后将字体文件重命名并放置在 `public/fonts/` 目录下：

```
public/fonts/
├── NotoSansSC-Regular.ttf
├── NotoSerifSC-Regular.ttf
└── README.md
```

## 注意事项

- 字体文件较大（约5-15MB），请确保网络环境良好
- 如果不需要PDF导出功能，可以忽略此步骤
