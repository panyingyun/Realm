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

项目配置了 GoReleaser 用于自动化构建和发布。配置文件：`.goreleaser.yml`

使用 GoReleaser 发布：
```bash
goreleaser release
```

## 参考资源

- [Wails 官方文档](https://wails.io/docs/)
- [Wails 构建指南](https://wails.io/docs/gettingstarted/building/)
- [详细构建文档](BUILD.md)
