# Realm Password Manager

Realm is a secure and easy-to-use password management tool that provides both command-line and graphical interface versions to help you securely manage passwords for various websites and applications. Realm is a local alternative to 1Password.

## 📋 Project Overview

Realm Password Manager is a password management tool developed in Go, using SQLite database to store encrypted password information. All passwords are encrypted using the AES-256-CBC algorithm to ensure data security. The project uses a master password protection mechanism, and only by entering the correct master password can you access the stored password data.

## 🎯 Features

- 🔐 **Strong Encryption**: All passwords are encrypted and stored using AES-256-CBC algorithm
- 🔑 **Master Password**: Protect all data access through a single master password
- 💾 **Local Storage**: Data is completely stored in local SQLite database, never uploaded to any server
- 📦 **Dual Version Support**: Provides both command-line and graphical interface versions to meet different user needs
- 🌐 **Multi-language Support**: GUI version supports Chinese and English interfaces
- 🎨 **Modern Interface**: GUI version provides beautiful graphical interface with dark/light theme support
- 🆓 **Open Source**: Based on GPL-3.0 license, completely open source
- 🚀 **Lightweight & Efficient**: Small program size, fast execution, low resource usage

## 📁 Project Structure

```
Realm/
├── realm-cmder/          # Command-line version (Realm CLI) ✅
│   ├── main.go          # Program entry
│   ├── helper/          # Core functional modules
│   ├── dao/             # Data access layer
│   ├── docs/            # CLI version documentation and screenshots
│   └── README.md        # CLI version detailed documentation
├── realm-gui/           # Graphical interface version (Realm GUI) ✅
│   ├── main.go          # Program entry
│   ├── app.go           # Application logic
│   ├── helper/          # Core functional modules
│   ├── dao/             # Data access layer
│   ├── frontend/        # Frontend code (React + TypeScript)
│   ├── docs/            # GUI version documentation and screenshots
│   └── build/           # Build configuration
├── docs/                # Project documentation and screenshots
│   ├── realm_login/     # Login feature demo
│   ├── realm_add/       # Add password feature demo
│   └── realm_query/     # Query password feature demo
├── LICENSE              # GPL-3.0 License
└── README.md            # This file
```

## 🚀 Quick Start

### Command-line Version (Realm CLI)

The command-line version provides complete password management functionality, suitable for users who prefer command-line tools.

#### System Requirements

- Go 1.23.4 or higher
- Linux/macOS/Windows operating system

#### Installation & Usage

1. **Enter the command-line version directory**:
```bash
cd realm-cmder
```

2. **Install dependencies**:
```bash
go mod tidy
```

3. **Build the program**:
```bash
make build
# or
go build -o Realm .
```

4. **Run the program**:
```bash
./Realm
# or
make run
```

For detailed command descriptions and usage guide, please refer to [realm-cmder/README.md](realm-cmder/README.md).

#### Main Features

- ✅ Master password login/setup
- ✅ Add/update password records
- ✅ Query passwords
- ✅ List all passwords
- ✅ Password statistics
- ✅ Password generator
- ✅ Export password list

#### Feature Demos

The project provides detailed feature demonstration documents in the `docs/` directory:

- **Login Feature**: View [realm_login/](docs/realm_login/screen.png) to learn about the login process
- **Add Password**: View [realm_add/](docs/realm_add/screen.png) to learn how to add passwords
- **Query Password**: View [realm_query/](docs/realm_query/screen.png) to learn how to query passwords

### Graphical Interface Version (Realm GUI)

The graphical interface version provides a modern graphical user interface with more intuitive and convenient operations.

#### System Requirements

- Go 1.23.4 or higher
- Node.js and npm (for frontend development)
- Wails v2 framework
- **Windows**: No additional dependencies required
- **macOS**: No additional dependencies required
- **Linux**: 
  - Ubuntu 24.04: `libwebkit2gtk-4.1-dev libgtk-3-dev`
  - Ubuntu 22.04: `libwebkit2gtk-4.0-dev libgtk-3-dev`

#### Installation & Usage

1. **Enter the GUI version directory**:
```bash
cd realm-gui
```

2. **Install development environment** (first time use):
```bash
make env
```

This will install the following tools:
- `gofumpt`: Go code formatting tool
- `gentool`: GORM code generation tool
- `goreleaser`: Release tool
- `wails`: Wails framework CLI

3. **Install dependencies**:
```bash
# Backend dependencies
go mod tidy

# Frontend dependencies
cd frontend
npm install
cd ..
```

4. **Run in development mode**:
```bash
make dev
# or
wails dev -tags webkit2_41
```

5. **Build production version**:
```bash
make build
# or
wails build -tags webkit2_41
```

After building, the executable file will be located in the `build/bin/` directory.

#### Main Features

- ✅ Master password login/setup
- ✅ Password category management (Financial, Social, Private, Work)
- ✅ View passwords by category
- ✅ Add passwords (with password generation support)
- ✅ Password search functionality
- ✅ Password show/hide and copy
- ✅ Settings page (language, theme)
- ✅ Multi-language support (Chinese/English)
- ✅ Dark/light theme switching
- ✅ Modern graphical interface

#### Interface Screenshots

The GUI version provides complete interface screenshots in the `realm-gui/docs/` directory:

- **Login Page**: View [01login/](realm-gui/docs/01login/extracted/screen.png)
- **Main Interface**: View [02main/](realm-gui/docs/02main/extracted/screen.png)
- **Add Password**: View [03add/](realm-gui/docs/03add/extracted/screen.png)
- **Settings Page**: View [04settings/](realm-gui/docs/04settings/extracted/screen.png)

## 🔒 Security Features

### Encryption Mechanism

- **Encryption Algorithm**: AES-256-CBC
- **Key Generation**: Generate keys and IV based on MD5 hash of master password
- **Data Storage**: All passwords are stored encrypted in SQLite database

### Security Recommendations

1. **Use Strong Master Password**: It is recommended to use a complex password containing uppercase and lowercase letters, numbers, and special characters
2. **Regular Backup**: Regularly backup the `realm.db` database file
3. **Protect Database File**: Ensure database file permissions are set correctly to prevent unauthorized access
4. **Remember Master Password**: The master password is not stored in the system. Losing the master password will make data unrecoverable
5. **Local Storage**: Database files are stored locally, please keep them safe

## 📊 Database Structure

The project uses SQLite database to store password information. The data structure is as follows:

### realm Table (Password Storage)

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

### setting Table (Settings Storage, GUI Version Only)

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

## 🛠️ Tech Stack

### Command-line Version

- **Programming Language**: Go 1.23.4
- **Database**: SQLite (using `github.com/glebarez/sqlite`)
- **ORM**: GORM (`gorm.io/gorm`, `gorm.io/gen`)
- **REPL**: `github.com/openengineer/go-repl`
- **Encryption Algorithm**: AES-256-CBC

### Graphical Interface Version

- **Backend Language**: Go 1.23.4
- **Frontend Framework**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS
- **Icons**: Material Symbols
- **Desktop Framework**: Wails v2
- **Database**: SQLite (using `github.com/glebarez/sqlite`)
- **ORM**: GORM (`gorm.io/gorm`, `gorm.io/gen`)
- **Routing**: React Router
- **Build Tool**: Vite
- **Encryption Algorithm**: AES-256-CBC

## 📖 Documentation

- **Command-line Version Detailed Documentation**: [realm-cmder/README.md](realm-cmder/README.md)
- **Feature Demos**: View the [docs/](docs/) directory to learn about the usage of each feature
- **GUI Version Development Documentation**: View the [realm-gui/docs/](realm-gui/docs/) directory

## 🗺️ Development Roadmap

### Completed ✅

- [x] Command-line version core functionality development
- [x] AES encryption/decryption implementation
- [x] SQLite database integration
- [x] Password generator
- [x] Command-line version documentation
- [x] Graphical interface version development
- [x] GUI version interface design
- [x] GUI version data compatibility
- [x] Multi-language support (Chinese/English)
- [x] Dark/light theme switching
- [x] Password strength detection
- [x] More language support

## 🤝 Contributing

Issues and Pull Requests are welcome!

Before contributing code, please ensure:

1. Code follows the project's coding standards
2. Add necessary tests
3. Update relevant documentation
4. Follow the GPL-3.0 license

## 📄 License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). For details, please refer to the [LICENSE](LICENSE) file.

## ⚠️ Important Notes

1. **Master Password Security**: The master password is not stored in the system. Please remember your master password. Forgetting the master password will make data unrecoverable.

2. **Data Backup**: It is recommended to regularly backup the `realm.db` database file to avoid data loss.

3. **Data Security**: Please keep the database file safe and avoid exposing it to unauthorized personnel.

4. **Version Compatibility**: The command-line version and GUI version use the same data format, ensuring data can be shared between the two versions.

5. **Data Migration**: If you created a database in the command-line version, you can directly use the same database file in the GUI version.

## 📞 Contact

If you have questions or suggestions, please contact us through:

- Submit an Issue
- Send a Pull Request

## 🙏 Acknowledgments

Thanks to all developers who have contributed to the development of open source password management tools!

Special thanks to the following open source projects:

- [Wails](https://wails.io/) - Excellent Go desktop application framework
- [GORM](https://gorm.io/) - Powerful Go ORM library
- [React](https://react.dev/) - Modern frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## Support the Author

If you find Realm useful, consider buying the author a coffee ☕

<div style="display: flex; gap: 10px;">
  <img src="realm-gui/docs/alipay.jpg" alt="Alipay" width="200" height="373"/>
  <img src="realm-gui/docs/wcpay.png" alt="WeChat Pay" width="200" height="373"/>
</div>
