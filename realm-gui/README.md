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

### 构建各平台版本

#### Linux amd64 版本

```bash
wails build -tags webkit2_41 -platform linux/amd64
```

**输出位置**: `build/bin/realm`

**说明**: Linux 平台必须使用 `-tags webkit2_41` 构建标签

#### Windows amd64 版本

**在 Windows 系统上**：
```bash
wails build -platform windows/amd64
```

**在 Linux/macOS 上交叉编译**：
```bash
export GOOS=windows
export GOARCH=amd64
export CGO_ENABLED=0
wails build -platform windows/amd64
```

**输出位置**: `build/bin/realm.exe`

#### macOS (Darwin) amd64 版本

```bash
wails build -platform darwin/amd64
```

**输出位置**: `build/bin/realm` 或 `build/bin/realm.app`

**说明**: macOS 版本通常需要在 macOS 系统上构建

### 使用 Makefile 构建

```bash
# 构建当前平台版本
make build

# 开发模式
make dev
```

### 构建参数说明

- `-platform <os/arch>`: 指定目标平台和架构
  - `linux/amd64`: Linux 64位
  - `windows/amd64`: Windows 64位
  - `darwin/amd64`: macOS Intel
  - `darwin/arm64`: macOS Apple Silicon

- `-tags <tags>`: 指定构建标签
  - `webkit2_41`: Linux 平台使用 WebKit2GTK 4.1（必需）
  - `webkit2_40`: Linux 平台使用 WebKit2GTK 4.0

- `-package`: 打包为平台特定的安装包（如 .app、.dmg、.deb 等）

### 常见问题

#### 1. Linux 构建失败：找不到 webkit2gtk

```bash
# Ubuntu 24.04
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev -y

# Ubuntu 22.04
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev -y
```

#### 2. 构建标签错误

**错误信息**: `Error: Wails applications will not build without the correct build tags.`

**解决方案**: Linux 平台必须使用 `-tags webkit2_41` 或 `-tags webkit2_40`

#### 3. 交叉编译 Windows 版本

确保设置了 `CGO_ENABLED=0`，Windows 版本不需要 CGO

## 自动化构建和发布

项目配置了 GoReleaser 用于自动化构建和发布多个平台版本。

### 安装 GoReleaser

```bash
# 使用 Go 安装
go install github.com/goreleaser/goreleaser/v2@latest

# 或使用包管理器（Windows）
choco install goreleaser

# 或使用包管理器（macOS）
brew install goreleaser
```

### 配置文件说明

- **`.goreleaser.yml`**: 主配置文件，支持所有平台构建
  - Linux (Ubuntu 24.04): `webkit2_41` 标签
  - Linux (Ubuntu 22.04): `webkit2_40` 标签
  - Windows: amd64 版本
  - macOS: amd64 版本

- **`.goreleaser.windows.yml`**: Windows 专用配置文件，用于在 Windows 系统上只构建 Windows 版本

### 使用方法

#### 1. 测试构建（快照模式）

```bash
# 使用主配置文件测试构建（会尝试构建所有平台）
goreleaser build --snapshot --clean

# 在 Windows 上只构建 Windows 版本
goreleaser build --snapshot --clean -f .goreleaser.windows.yml

# 跳过验证步骤
goreleaser build --snapshot --clean --skip=validate
```

#### 2. 验证配置文件

```bash
# 检查配置文件语法
goreleaser check
```

#### 3. 发布版本

**前提条件**：
- 需要创建 Git 标签（如 `v1.0.0`）
- 需要设置 GitHub Token（环境变量 `GITHUB_TOKEN`）

```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 设置 GitHub Token（Windows PowerShell）
$env:GITHUB_TOKEN="your_github_token"

# 设置 GitHub Token（Linux/macOS）
export GITHUB_TOKEN=your_github_token

# 发布版本
goreleaser release

# 发布版本（跳过发布，只构建）
goreleaser release --skip=publish
```

#### 4. 平台特定构建

**在 Windows 系统上**：
```bash
# 只构建 Windows 版本
goreleaser build --snapshot --clean -f .goreleaser.windows.yml
```

**在 Linux 系统上**：
```bash
# 构建所有平台（需要安装 gcc 和 webkit2gtk）
goreleaser build --snapshot --clean

# 或只构建 Linux 版本（需要修改配置文件）
```

**在 macOS 系统上**：
```bash
# 构建所有平台（需要 Xcode）
goreleaser build --snapshot --clean
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
