# Realm

Realm 是一个基于命令行的密码管理器，使用 SQLite 数据库存储加密的密码信息。通过 AES-256-CBC 加密算法保护您的密码数据安全。

## 功能特性

- 🔐 **安全加密**: 使用 AES-256-CBC 算法加密存储所有密码
- 🔑 **主密码保护**: 通过主密码登录系统，保护所有数据访问
- 📝 **密码管理**: 添加、查询、更新域名和对应的用户名密码
- 📊 **数据统计**: 统计已保存的域名数量
- 📋 **批量导出**: 列出所有保存的密码信息，支持导出到文件
- 🔢 **密码生成**: 内置密码生成器，生成安全的随机密码
- 💾 **本地存储**: 使用 SQLite 数据库，数据完全本地化存储
- 🖥️ **交互式界面**: 基于 REPL 的命令行交互界面，使用便捷

## 系统要求

- Go 1.23.4 或更高版本
- Linux/macOS/Windows 操作系统

## 安装

### 从源码构建

1. 克隆仓库（如果从远程仓库获取）：
```bash
git clone <repository-url>
cd Realm/cmder
```

2. 安装依赖：
```bash
go mod tidy
```

3. 使用 Makefile 构建：
```bash
make build
```

或者直接构建：
```bash
go build -o Realm .
```

4. 运行程序：
```bash
./Realm
```

或者使用 Makefile 直接运行：
```bash
make run
```

## 使用说明

### 启动程序

运行程序后，您将看到欢迎信息：
```
=== Welcome to Realm ===
type "help" for more info
>
```

### 命令列表

#### `help`
显示帮助信息，列出所有可用命令。

#### `login <password>`
使用主密码登录系统。首次使用时会自动设置主密码。

**示例**:
```
> login myMainPassword
login success. Your first set your main passwd.
```

#### `add <domain> <username> <password>`
添加或更新域名、用户名和密码。如果域名已存在，将更新该记录。

**示例**:
```
> add www.example.com user123 myPassword123
add www.example.com success.
```

#### `query <domain>`
查询指定域名的密码。需要先登录。

**示例**:
```
> query www.example.com
myPassword123
```

#### `list`
列出所有保存的域名、用户名和密码。需要先登录。

**示例**:
```
> list
www.example.com user123 myPassword123
www.google.com user456 password789
```

#### `count`
统计已保存的域名数量。需要先登录。

**示例**:
```
> count
2
```

#### `genpwd`
生成一个新的随机密码。默认生成 13 位密码，包含 6 位数字和 1 个符号。需要先登录。

**示例**:
```
> genpwd
aB3cD9@fGhIjK
```

#### `save`
将所有密码信息保存到 `delete.txt` 文件。需要先登录。

**示例**:
```
> save
Save to delete.txt Success.
```

#### `quit` 或 `exit`
退出程序。退出时会自动删除临时文件。

**示例**:
```
> quit
```

## 使用流程示例

```bash
# 1. 启动程序
./Realm

# 2. 登录（首次使用会设置主密码）
> login mySecurePassword
login success. Your first set your main passwd.

# 3. 添加密码
> add www.example.com myuser mypassword
add www.example.com success.

# 4. 查询密码
> query www.example.com
mypassword

# 5. 生成新密码
> genpwd
xY7zA2!bC3dEf

# 6. 添加使用生成密码的账户
> add www.site.com username xY7zA2!bC3dEf
add www.site.com success.

# 7. 查看所有密码
> list
www.example.com myuser mypassword
www.site.com username xY7zA2!bC3dEf

# 8. 统计数量
> count
2

# 9. 退出程序
> quit
```

## 项目结构

```
cmder/
├── main.go              # 程序入口
├── helper/              # 辅助功能模块
│   ├── cmd.go          # 命令行处理逻辑
│   ├── db.go           # 数据库操作
│   ├── ase.go          # AES 加密/解密
│   ├── pwd.go          # 密码生成器
│   ├── md5.go          # MD5 哈希（用于密钥生成）
│   └── str.go          # 字符串工具函数
├── dao/                 # 数据访问层
│   ├── realmdb.go      # Realm 数据库操作
│   ├── model/          # 数据模型
│   └── query/          # GORM 生成的查询代码
├── docs/                # 文档和截图
├── realm.db            # SQLite 数据库文件（运行时生成）
├── schema.md           # 数据库结构说明
├── Makefile            # 构建脚本
└── README.md           # 本文档
```

## 技术栈

- **编程语言**: Go 1.23.4
- **数据库**: SQLite (使用 `github.com/glebarez/sqlite`)
- **ORM**: GORM (`gorm.io/gorm`, `gorm.io/gen`)
- **REPL**: `github.com/openengineer/go-repl`
- **加密算法**: AES-256-CBC

## 安全说明

1. **加密存储**: 所有密码都使用 AES-256-CBC 算法加密存储，密钥和 IV 由主密码通过 MD5 生成。

2. **主密码**: 主密码不会存储在数据库中，只有正确的哈希值被存储。丢失主密码将无法恢复数据。

3. **本地存储**: 所有数据存储在本地 SQLite 数据库中（`realm.db`），不会上传到任何服务器。

4. **临时文件**: `delete.txt` 文件包含明文密码，仅在您使用 `save` 命令时创建。程序退出时会自动删除该文件。

5. **安全建议**:
   - 使用强主密码
   - 定期备份 `realm.db` 文件
   - 不要将 `realm.db` 文件分享给他人
   - 在生产环境中使用时，确保数据库文件权限设置正确

## 数据库结构

数据库使用 `realm` 表存储数据，结构如下：

```sql
CREATE TABLE `realm` (
   `id` INTEGER PRIMARY KEY NOT NULL,
   `domain` varchar(255) NOT NULL,
   `user` varchar(255) NOT NULL,
   `pwdd` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);
```

## 开发说明

### 代码生成

项目使用 GORM Gen 生成查询代码。如果需要重新生成：

1. 安装 gentool：
```bash
make env
```

2. 配置数据库连接并运行生成命令（参考 Makefile 中的 `gensql` 目标）。

### 代码格式化

项目使用 `gofumpt` 进行代码格式化：

```bash
gofumpt -l -w .
```

### 构建选项

使用 Makefile 可以执行以下操作：

- `make env`: 安装开发工具（goimports-reviser, gentool, gofumpt）
- `make build`: 构建项目
- `make clean`: 清理构建文件
- `make run`: 构建并运行程序
- `make all`: 执行环境设置、清理、格式化和构建

## 许可证

本项目采用 GNU General Public License v3.0 (GPL-3.0) 许可证。详情请参阅 [LICENSE](../LICENSE) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 注意事项

- 首次使用需要设置主密码，请务必记住您的主密码
- 忘记主密码将无法恢复数据
- 建议定期备份 `realm.db` 数据库文件
- `delete.txt` 文件包含明文密码，使用后请及时删除

## 更新日志

查看 Git 提交历史了解项目更新情况。

