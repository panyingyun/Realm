# Realm - 密码管理器应用

## 关于

Realm 是一个基于 Wails + React + TypeScript 开发的跨平台密码管理器应用。

你可以通过编辑 `wails.json` 来配置项目。更多关于项目设置的信息可以在这里找到：
https://wails.io/docs/reference/project-config

## 开发环境

### 安装依赖

#### Linux 系统依赖
```bash
# Ubuntu 24.04
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev -y

# Ubuntu 22.04
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev -y
```

#### 安装 Wails CLI
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### 实时开发

在项目目录中运行 `wails dev` 进入实时开发模式。这将运行一个 Vite 开发服务器，提供快速的前端热重载。
如果你想在浏览器中开发并访问 Go 方法，还有一个运行在 http://localhost:34115 的开发服务器。
在浏览器中连接到此地址，你可以在开发者工具中调用 Go 代码。

**Linux 平台开发命令**：
```bash
wails dev -tags webkit2_41
```

## 手动构建

### 前置准备

```bash
# 整理 Go 依赖
go mod tidy

# 安装前端依赖
npm --prefix frontend install

# 构建前端资源
npm --prefix frontend run build
```

### 配置文件说明

- **`.goreleaser.yml`**: 主配置文件，支持所有平台构建
  - Linux (Ubuntu 24.04): `webkit2_41` 标签
  - Linux (Ubuntu 22.04): `webkit2_40` 标签
  - Windows: amd64 版本
  - macOS: amd64 版本

- **`.goreleaser.windows.yml`**: Windows 专用配置文件，用于在 Windows 系统上只构建 Windows 版本

- **`.goreleaser.ubuntu22.04.yml`**: Ubuntu 22.04 专用配置文件，用于在 Ubuntu 22.04 系统上构建 Linux 版本（使用 `webkit2_40` 标签）

- **`.goreleaser.ubuntu24.04.yml`**: Ubuntu 24.04 专用配置文件，用于在 Ubuntu 24.04 系统上构建 Linux 版本（使用 `webkit2_41` 标签）

- **`.goreleaser.macos.yml`**: macOS 专用配置文件，用于在 macOS 系统上只构建 macOS 版本

### 使用方法

#### 1. 测试构建（快照模式）

**在 Windows 系统上**：
```bash
# 只构建 Windows 版本
goreleaser build --snapshot --clean -f .goreleaser.windows.yml

# 验证配置文件
goreleaser check -f .goreleaser.windows.yml
```

**在 Ubuntu 22.04 系统上**：
```bash
# 只构建 Ubuntu 22.04 版本（使用 webkit2_40）
goreleaser build --snapshot --clean -f .goreleaser.ubuntu22.04.yml

# 验证配置文件
goreleaser check -f .goreleaser.ubuntu22.04.yml
```

**在 Ubuntu 24.04 系统上**：
```bash
# 只构建 Ubuntu 24.04 版本（使用 webkit2_41）
goreleaser build --snapshot --clean -f .goreleaser.ubuntu24.04.yml

# 验证配置文件
goreleaser check -f .goreleaser.ubuntu24.04.yml
```

**在 macOS 系统上**：
```bash
# 只构建 macOS 版本
goreleaser build --snapshot --clean -f .goreleaser.macos.yml

# 验证配置文件
goreleaser check -f .goreleaser.macos.yml

# 或构建所有平台（需要 Xcode）
goreleaser build --snapshot --clean
```

#### 2. 发布版本

**前提条件**：
- 需要创建 Git 标签（如 `v1.0.0`）
- 需要设置 GitHub Token（环境变量 `GITHUB_TOKEN`）

**在 Ubuntu 22.04 上发布**：
```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 设置 GitHub Token
export GITHUB_TOKEN=your_github_token

# 发布 Ubuntu 22.04 版本
goreleaser release -f .goreleaser.ubuntu22.04.yml
```

**在 Ubuntu 24.04 上发布**：
```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 设置 GitHub Token
export GITHUB_TOKEN=your_github_token

# 发布 Ubuntu 24.04 版本
goreleaser release -f .goreleaser.ubuntu24.04.yml
```

**在 macOS 上发布**：
```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 设置 GitHub Token
export GITHUB_TOKEN=your_github_token

# 发布 macOS 版本
goreleaser release -f .goreleaser.macos.yml
```

**在 Windows 上发布**：
```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 设置 GitHub Token（PowerShell）
$env:GITHUB_TOKEN="your_github_token"

# 发布 Windows 版本
goreleaser release -f .goreleaser.windows.yml
```

### 构建输出

构建完成后，文件位于 `dist/` 目录：

- `realm_linux_amd64_webkit2_41.tar.gz` - Ubuntu 24.04 版本
- `realm_linux_amd64_webkit2_40.tar.gz` - Ubuntu 22.04 版本
- `realm_windows_amd64.zip` - Windows 版本
- `realm_darwin_amd64.tar.gz` - macOS 版本
- `realm_1.6.0_checksums.txt` - 校验和文件

### 常见问题

#### 1. Linux 构建失败：找不到 gcc

**错误信息**: `cgo: C compiler "gcc" not found`

**解决方案**：
- Linux 版本需要在 Linux 系统上构建
- 或安装 gcc 工具链（Windows 上可安装 MinGW 或 TDM-GCC）

#### 2. npm 命令未找到

**错误信息**: `exec: "npm": executable file not found`

**解决方案**：
- 确保前端资源已构建（`frontend/dist` 目录存在）
- 或安装 Node.js 和 npm
- 或注释掉 `.goreleaser.yml` 中的 npm 相关钩子

#### 3. 归档配置弃用警告

**警告信息**: `DEPRECATED: archives.builds should not be used anymore`

**解决方案**：
- 已修复：移除了 `archives.builds` 字段
- GoReleaser 会自动根据 `id` 匹配构建和归档配置

#### 4. 构建标签错误

**错误信息**: `Error: Wails applications will not build without the correct build tags.`

**解决方案**：
- Linux 平台必须使用 `webkit2_41` 或 `webkit2_40` 标签
- Windows 和 macOS 平台使用 `desktop` 和 `production` 标签

### 构建配置说明

#### Linux 构建要求

- **Ubuntu 24.04**: 需要 `libwebkit2gtk-4.1-dev` 和 `libgtk-3-dev`
- **Ubuntu 22.04**: 需要 `libwebkit2gtk-4.0-dev` 和 `libgtk-3-dev`
- 需要 CGO 支持（`CGO_ENABLED=1`）
- 需要 gcc 编译器

#### Windows 构建要求

- 不需要 CGO（`CGO_ENABLED=0`）
- 可以在任何系统上交叉编译
- 使用 `-H=windowsgui` 隐藏控制台窗口

#### macOS 构建要求

- 需要在 macOS 系统上构建
- 需要安装 Xcode
- 不需要 CGO（交叉编译时）

### 参考资源

- [GoReleaser 官方文档](https://goreleaser.com/)
- [GoReleaser 配置参考](https://goreleaser.com/reference/)
- [Wails 官方文档](https://wails.io/docs/)

## 参考资源

- [Wails 官方文档](https://wails.io/docs/)
- [Wails 构建指南](https://wails.io/docs/gettingstarted/building/)
- [详细构建文档](BUILD.md)
