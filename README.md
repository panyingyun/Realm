# Realm 密码本

Realm 是一个安全、易用的密码管理工具，提供命令行和图形界面两个版本，帮助您安全地管理各种网站和应用的密码信息。Realm 是 1password 的本地替代品

## 📋 项目概述

Realm 密码本是一个基于 Go 语言开发的密码管理工具，使用 SQLite 数据库存储加密的密码信息。所有密码都通过 AES-256-CBC 算法加密存储，确保数据安全。项目采用主密码保护机制，只有输入正确的主密码才能访问存储的密码数据。

## 🎯 项目特点

- 🔐 **强大的加密保护**: 使用 AES-256-CBC 算法加密存储所有密码
- 🔑 **主密码机制**: 通过单一主密码保护所有数据访问
- 💾 **本地存储**: 数据完全存储在本地 SQLite 数据库，不会上传到任何服务器
- 📦 **双版本支持**: 提供命令行和图形界面两个完整版本，满足不同用户需求
- 🌐 **多语言支持**: GUI 版本支持中文和英文界面
- 🎨 **现代化界面**: GUI 版本提供美观的图形界面，支持深色/浅色主题
- 🆓 **开源免费**: 基于 GPL-3.0 许可证，完全开源
- 🚀 **轻量高效**: 程序小巧，运行快速，资源占用低

## 📁 项目结构

```
Realm/
├── realm-cmder/          # 命令行版本（Realm CLI）✅
│   ├── main.go          # 程序入口
│   ├── helper/          # 核心功能模块
│   ├── dao/             # 数据访问层
│   ├── docs/            # 命令行版本文档和截图
│   └── README.md        # 命令行版本详细文档
├── realm-gui/           # 图形界面版本（Realm GUI）✅
│   ├── main.go          # 程序入口
│   ├── app.go           # 应用逻辑
│   ├── helper/          # 核心功能模块
│   ├── dao/             # 数据访问层
│   ├── frontend/        # 前端代码（React + TypeScript）
│   ├── docs/            # GUI 版本文档和截图
│   └── build/           # 构建配置
├── docs/                # 项目文档和截图
│   ├── realm_login/     # 登录功能演示
│   ├── realm_add/       # 添加密码功能演示
│   └── realm_query/     # 查询密码功能演示
├── LICENSE              # GPL-3.0 许可证
└── README.md            # 本文件
```

## 🚀 快速开始

### 命令行版本（Realm CLI）

命令行版本提供了完整的密码管理功能，适合喜欢使用命令行工具的用户。

#### 系统要求

- Go 1.23.4 或更高版本
- Linux/macOS/Windows 操作系统

#### 安装使用

1. **进入命令行版本目录**:
```bash
cd realm-cmder
```

2. **安装依赖**:
```bash
go mod tidy
```

3. **构建程序**:
```bash
make build
# 或
go build -o Realm .
```

4. **运行程序**:
```bash
./Realm
# 或
make run
```

详细的命令说明和使用指南请参考 [realm-cmder/README.md](realm-cmder/README.md)。

#### 主要功能

- ✅ 主密码登录/设置
- ✅ 添加/更新密码记录
- ✅ 查询密码
- ✅ 列出所有密码
- ✅ 密码统计
- ✅ 密码生成器
- ✅ 导出密码列表

#### 功能演示

项目提供了详细的功能演示文档，位于 `docs/` 目录：

- **登录功能**: 查看 [realm_login/](docs/realm_login/screen.png) 了解登录流程
- **添加密码**: 查看 [realm_add/](docs/realm_add/screen.png) 了解如何添加密码
- **查询密码**: 查看 [realm_query/](docs/realm_query/screen.png) 了解如何查询密码

### 图形界面版本（Realm GUI）

图形界面版本提供了现代化的图形用户界面，操作更加直观便捷。

#### 系统要求

- Go 1.23.4 或更高版本
- Node.js 和 npm（用于前端开发）
- Wails v2 框架
- **Windows**: 无需额外依赖
- **macOS**: 无需额外依赖
- **Linux**: 
  - Ubuntu 24.04: `libwebkit2gtk-4.1-dev libgtk-3-dev`
  - Ubuntu 22.04: `libwebkit2gtk-4.0-dev libgtk-3-dev`

#### 安装使用

1. **进入 GUI 版本目录**:
```bash
cd realm-gui
```

2. **安装开发环境**（首次使用）:
```bash
make env
```

这会安装以下工具：
- `gofumpt`: Go 代码格式化工具
- `gentool`: GORM 代码生成工具
- `goreleaser`: 发布工具
- `wails`: Wails 框架 CLI

3. **安装依赖**:
```bash
# 后端依赖
go mod tidy

# 前端依赖
cd frontend
npm install
cd ..
```

4. **开发模式运行**:
```bash
make dev
# 或
wails dev -tags webkit2_41
```

5. **构建生产版本**:
```bash
make build
# 或
wails build -tags webkit2_41
```

构建完成后，可执行文件位于 `build/bin/` 目录。

#### 主要功能

- ✅ 主密码登录/设置
- ✅ 密码分类管理（Financial、Social、Private、Work）
- ✅ 按分类查看密码
- ✅ 添加密码（支持密码生成）
- ✅ 密码搜索功能
- ✅ 密码显示/隐藏和复制
- ✅ 设置页面（语言、主题）
- ✅ 多语言支持（中文/英文）
- ✅ 深色/浅色主题切换
- ✅ 现代化图形界面

#### 界面截图

GUI 版本提供了完整的界面截图，位于 `realm-gui/docs/` 目录：

- **登录页面**: 查看 [01login/](realm-gui/docs/01login/extracted/screen.png)
- **主界面**: 查看 [02main/](realm-gui/docs/02main/extracted/screen.png)
- **添加密码**: 查看 [03add/](realm-gui/docs/03add/extracted/screen.png)
- **设置页面**: 查看 [04settings/](realm-gui/docs/04settings/extracted/screen.png)

## 🔒 安全特性

### 加密机制

- **加密算法**: AES-256-CBC
- **密钥生成**: 基于主密码的 MD5 哈希生成密钥和 IV
- **数据存储**: 所有密码以加密形式存储在 SQLite 数据库中

### 安全建议

1. **使用强主密码**: 建议使用包含大小写字母、数字和特殊字符的复杂密码
2. **定期备份**: 定期备份 `realm.db` 数据库文件
3. **保护数据库文件**: 确保数据库文件权限设置正确，避免未授权访问
4. **记住主密码**: 主密码不会存储在系统中，丢失主密码将无法恢复数据
5. **本地存储**: 数据库文件存储在本地，请妥善保管

## 📊 数据库结构

项目使用 SQLite 数据库存储密码信息，数据结构如下：

### realm 表（密码存储）

```sql
CREATE TABLE `realm` (
   `id` INTEGER PRIMARY KEY NOT NULL,
   `name` varchar(255) NOT NULL,
   `domain` varchar(255) NOT NULL,
   `category` varchar(255) NOT NULL,
   `username` varchar(255) NOT NULL,
   `pwdd` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);
```

### setting 表（设置存储，仅 GUI 版本）

```sql
CREATE TABLE `setting` (
   `id` INTEGER PRIMARY KEY NOT NULL,
   `language` varchar(255) NOT NULL,
   `theme` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);
```

## 🛠️ 技术栈

### 命令行版本

- **编程语言**: Go 1.23.4
- **数据库**: SQLite (使用 `github.com/glebarez/sqlite`)
- **ORM**: GORM (`gorm.io/gorm`, `gorm.io/gen`)
- **REPL**: `github.com/openengineer/go-repl`
- **加密算法**: AES-256-CBC

### 图形界面版本

- **后端语言**: Go 1.23.4
- **前端框架**: React 18 + TypeScript
- **UI 框架**: Tailwind CSS
- **图标**: Material Symbols
- **桌面框架**: Wails v2
- **数据库**: SQLite (使用 `github.com/glebarez/sqlite`)
- **ORM**: GORM (`gorm.io/gorm`, `gorm.io/gen`)
- **路由**: React Router
- **构建工具**: Vite
- **加密算法**: AES-256-CBC

## 📖 使用文档

- **命令行版本详细文档**: [realm-cmder/README.md](realm-cmder/README.md)
- **功能演示**: 查看 [docs/](docs/) 目录了解各功能的使用方法
- **GUI 版本开发文档**: 查看 [realm-gui/docs/](realm-gui/docs/) 目录

## 🗺️ 开发路线图

### 已完成 ✅

- [x] 命令行版本核心功能开发
- [x] AES 加密/解密实现
- [x] SQLite 数据库集成
- [x] 密码生成器
- [x] 命令行版本文档
- [x] 图形界面版本开发
- [x] GUI 版本界面设计
- [x] GUI 版本数据兼容性
- [x] 多语言支持（中英文）
- [x] 深色/浅色主题切换
- [x] 密码强度检测
- [x] 更多语言支持


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

在贡献代码之前，请确保：

1. 代码符合项目的编码规范
2. 添加必要的测试
3. 更新相关文档
4. 遵循 GPL-3.0 许可证

## 📄 许可证

本项目采用 GNU General Public License v3.0 (GPL-3.0) 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## ⚠️ 重要提示

1. **主密码安全**: 主密码不会存储在系统中，请务必牢记您的主密码。忘记主密码将无法恢复数据。

2. **数据备份**: 建议定期备份 `realm.db` 数据库文件，避免数据丢失。

3. **数据安全**: 请妥善保管数据库文件，避免泄露给未授权人员。

4. **版本兼容性**: 命令行版本和 GUI 版本使用相同的数据格式，确保数据可以在两个版本间共享。

5. **数据迁移**: 如果您在命令行版本中创建了数据库，可以直接在 GUI 版本中使用相同的数据库文件。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送 Pull Request

## 🙏 致谢

感谢所有为开源密码管理工具发展做出贡献的开发者！

特别感谢以下开源项目：

- [Wails](https://wails.io/) - 优秀的 Go 桌面应用框架
- [GORM](https://gorm.io/) - 强大的 Go ORM 库
- [React](https://react.dev/) - 现代前端框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

---

## 支持作者

如果你觉得 Realm 软件对你有帮助，欢迎请作者喝一杯咖啡 ☕

<div style="display: flex; gap: 10px;">
  <img src="realm-gui/docs/alipay.jpg" alt="支付宝" width="200"  height="373"/>
  <img src="realm-gui/docs/wcpay.png" alt="微信支付" width="200" height="373"/>
</div>

