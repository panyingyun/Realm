# Realm - 密码管理器应用

<img src="build/appicon.png" width="20%" height="20%">


## 关于

Realm 是一个基于 Wails + React + TypeScript 开发的跨平台密码管理器应用。Realm 是1password的本地替代品

## 安装下载

直接下载release包是最简单的途径

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

## 支持作者

如果你觉得 Realm 软件对你有帮助，欢迎请作者喝一杯咖啡 ☕

<div style="display: flex; gap: 10px;">
  <img src="docs/alipay.jpg" alt="支付宝" width="200"  height="373"/>
  <img src="docs/wcpay.png" alt="微信支付" width="200" height="373"/>
</div>
