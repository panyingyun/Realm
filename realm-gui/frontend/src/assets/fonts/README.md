# Material Symbols 字体文件

## 下载字体文件

为了确保编译后的二进制文件能正确显示 Material Symbols 图标，需要下载字体文件到本地。

### 方法一：手动下载（推荐）

1. **访问 Google Fonts API 获取字体 URL**：
   - 打开浏览器访问：`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700`
   - 在返回的 CSS 中找到类似这样的行：
     ```css
     src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/v227/xxxxx.woff2) format('woff2');
     ```
   - 复制 URL（`https://fonts.gstatic.com/s/materialsymbolsoutlined/v227/xxxxx.woff2`）

2. **下载字体文件**：
   - 在浏览器中打开复制的 URL，或使用下载工具下载
   - 将下载的文件重命名为 `MaterialSymbolsOutlined.woff2`
   - 放置到当前目录：`frontend/src/assets/fonts/MaterialSymbolsOutlined.woff2`

### 方法二：使用 PowerShell 下载

```powershell
# 切换到字体目录
cd frontend\src\assets\fonts

# 下载字体文件（需要先获取正确的 URL，见方法一）
Invoke-WebRequest -Uri "字体文件URL" -OutFile "MaterialSymbolsOutlined.woff2"
```

### 方法三：使用 npm 包（备选方案）

如果手动下载困难，可以考虑使用 npm 包：

```bash
cd frontend
npm install material-symbols
```

然后修改 `material-symbols.css` 文件，指向 node_modules 中的字体文件。

### 验证

确保文件存在：
- `frontend/src/assets/fonts/MaterialSymbolsOutlined.woff2`

文件大小应该约为 1-2 MB。

### 注意事项

- 字体文件会被 Vite 自动打包到 `dist` 目录
- Wails 构建时会自动包含 `frontend/dist` 目录中的所有资源
- 如果字体文件不存在，图标会显示为英文文本（fallback）
- 开发环境（`wails dev`）可能仍使用 CDN，但生产构建（`wails build`）会使用本地字体
