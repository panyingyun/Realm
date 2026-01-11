# Realm 应用手动构建指南

本文档说明如何手动构建 Realm 应用的各个平台版本。

## 前置准备

### 1. 安装依赖

#### Linux 系统依赖
```bash
# Ubuntu 24.04
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev -y

# Ubuntu 22.04
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev -y

# 其他 Linux 发行版，请参考 Wails 官方文档
```

#### 安装 Wails CLI
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### 2. 准备构建环境

```bash
# 整理 Go 依赖
go mod tidy

# 安装前端依赖
cd frontend
npm install
cd ..

# 构建前端资源
npm --prefix frontend run build
```

## 构建命令

### Linux amd64 版本

```bash
# 方法 1: 使用 wails build（推荐）
wails build -tags webkit2_41 -platform linux/amd64

# 方法 2: 使用 Makefile
make build

# 输出位置: build/bin/realm
```

**说明**：
- `-tags webkit2_41` 是 Linux 平台必需的构建标签
- 构建产物位于 `build/bin/realm`

### Windows amd64 版本

#### 在 Windows 系统上构建

```bash
# 方法 1: 直接构建（当前平台）
wails build -platform windows/amd64

# 方法 2: 使用 Makefile（如果已配置）
make build-windows
```

#### 在 Linux/macOS 上交叉编译 Windows 版本

```bash
# 设置环境变量
export GOOS=windows
export GOARCH=amd64
export CGO_ENABLED=0

# 构建
wails build -platform windows/amd64

# 输出位置: build/bin/realm.exe
```

**说明**：
- Windows 版本不需要 `webkit2_41` 标签
- 构建产物位于 `build/bin/realm.exe`

### macOS (Darwin) amd64 版本

#### 在 macOS 系统上构建

```bash
# 方法 1: 直接构建（当前平台）
wails build -platform darwin/amd64

# 方法 2: 构建为 .app 包
wails build -platform darwin/amd64 -package
```

#### 在 Linux/Windows 上交叉编译 macOS 版本（需要 macOS SDK）

```bash
# 注意：交叉编译 macOS 版本需要 macOS SDK，通常只能在 macOS 上构建
# 如果必须交叉编译，需要配置 Xcode 和 macOS SDK

export GOOS=darwin
export GOARCH=amd64
export CGO_ENABLED=0

wails build -platform darwin/amd64
```

**说明**：
- macOS 版本通常需要在 macOS 系统上构建
- 构建产物位于 `build/bin/realm` 或 `build/bin/realm.app`

## 完整构建脚本示例

### 构建所有平台（在对应系统上）

#### Linux 系统

```bash
#!/bin/bash
# build-all-linux.sh

echo "构建 Linux 版本..."
wails build -tags webkit2_41 -platform linux/amd64

echo "构建 Windows 版本（交叉编译）..."
export GOOS=windows
export GOARCH=amd64
export CGO_ENABLED=0
wails build -platform windows/amd64

echo "构建完成！"
echo "Linux 版本: build/bin/realm"
echo "Windows 版本: build/bin/realm.exe"
```

#### macOS 系统

```bash
#!/bin/bash
# build-all-macos.sh

echo "构建 macOS 版本..."
wails build -platform darwin/amd64

echo "构建 Windows 版本（交叉编译）..."
export GOOS=windows
export GOARCH=amd64
export CGO_ENABLED=0
wails build -platform windows/amd64

echo "构建 Linux 版本（交叉编译）..."
export GOOS=linux
export GOARCH=amd64
export CGO_ENABLED=1
wails build -tags webkit2_41 -platform linux/amd64

echo "构建完成！"
echo "macOS 版本: build/bin/realm.app"
echo "Windows 版本: build/bin/realm.exe"
echo "Linux 版本: build/bin/realm"
```

#### Windows 系统（PowerShell）

```powershell
# build-all-windows.ps1

Write-Host "构建 Windows 版本..."
wails build -platform windows/amd64

Write-Host "构建完成！"
Write-Host "Windows 版本: build\bin\realm.exe"
```

## 构建参数说明

### Wails Build 常用参数

- `-platform <os/arch>`: 指定目标平台和架构
  - `linux/amd64`: Linux 64位
  - `windows/amd64`: Windows 64位
  - `darwin/amd64`: macOS Intel
  - `darwin/arm64`: macOS Apple Silicon

- `-tags <tags>`: 指定构建标签
  - `webkit2_41`: Linux 平台使用 WebKit2GTK 4.1
  - `webkit2_40`: Linux 平台使用 WebKit2GTK 4.0

- `-package`: 打包为平台特定的安装包（如 .app、.dmg、.deb 等）

- `-clean`: 清理构建缓存

- `-o <output>`: 指定输出文件名

### 环境变量

- `GOOS`: 目标操作系统（linux, windows, darwin）
- `GOARCH`: 目标架构（amd64, arm64）
- `CGO_ENABLED`: 是否启用 CGO（0=禁用, 1=启用）

## 版本信息注入

如果需要注入版本信息，可以使用 LDFlags：

```bash
# 获取版本信息
GIT_COMMIT=$(git rev-parse --short HEAD)
BUILD_TIME=$(date +%FT%T%z)
VERSION=$(git describe --tags --always --dirty)

# 构建时注入版本信息
wails build \
  -tags webkit2_41 \
  -platform linux/amd64 \
  -ldflags "-X main.Version=$VERSION -X main.GitCommit=$GIT_COMMIT -X main.BuildTime=$BUILD_TIME"
```

## 常见问题

### 1. Linux 构建失败：找不到 webkit2gtk

**解决方案**：
```bash
# Ubuntu 24.04
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev -y

# Ubuntu 22.04
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev -y
```

### 2. 交叉编译 Windows 版本失败

**解决方案**：
- 确保设置了 `CGO_ENABLED=0`
- Windows 版本不需要 CGO

### 3. macOS 交叉编译失败

**解决方案**：
- macOS 版本通常需要在 macOS 系统上构建
- 如果必须交叉编译，需要配置 macOS SDK 和 Xcode

### 4. 构建标签错误

**错误信息**：`Error: Wails applications will not build without the correct build tags.`

**解决方案**：
- Linux 平台必须使用 `-tags webkit2_41` 或 `-tags webkit2_40`
- Windows 和 macOS 平台不需要此标签

## 输出文件位置

构建完成后，文件位置：

- **Linux**: `build/bin/realm`
- **Windows**: `build/bin/realm.exe`
- **macOS**: `build/bin/realm` 或 `build/bin/realm.app`

## 参考资源

- [Wails 官方文档](https://wails.io/docs/)
- [Wails 构建指南](https://wails.io/docs/gettingstarted/building/)
- [Go 交叉编译指南](https://go.dev/doc/install/source#environment)
