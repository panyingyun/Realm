# 字体资源说明

本目录包含应用程序使用的所有字体文件，确保软件可以在离线环境下运行。

## 字体文件

### Material Symbols Outlined
- **文件**: `MaterialSymbolsOutlined.woff2`
- **来源**: npm 包 `material-symbols`
- **用途**: 图标字体

### Inter 字体
- **目录**: `Inter/`
- **文件**:
  - `Inter-Light.ttf` (300)
  - `Inter-Regular.ttf` (400)
  - `Inter-Medium.ttf` (500)
  - `Inter-SemiBold.ttf` (600)
  - `Inter-Bold.ttf` (700)
  - `Inter-Black.ttf` (900)
- **来源**: Google Fonts
- **用途**: 主要文本字体

## 更新字体

如果需要更新字体文件，请运行相应的下载脚本：
- Material Symbols: 已通过 npm 包管理
- Inter: 使用 `download-inter-font.ps1` (Windows) 或手动从 Google Fonts 下载
