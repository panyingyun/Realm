# Realm - Password Manager Application

## About

Realm is a cross-platform password manager application built with Wails + React + TypeScript. Realm is Local alternatives to 1password

You can configure the project by editing `wails.json`. More information about project settings can be found here:
https://wails.io/docs/reference/project-config

## Development Environment

### Installing Dependencies

#### Linux System Dependencies
```bash
# Ubuntu 24.04
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev -y

# Ubuntu 22.04
sudo apt install libwebkit2gtk-4.0-dev libgtk-3-dev -y
```

#### Installing Wails CLI
```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

### Live Development

Run `wails dev` in the project directory to enter live development mode. This will run a Vite development server with fast frontend hot-reload.
If you want to develop in a browser and access Go methods, there's also a development server running at http://localhost:34115.
Connect to this address in your browser, and you can call Go code from the developer tools.

**Linux Platform Development Command**:
```bash
wails dev -tags webkit2_41
```

### Common Issues

#### 1. Linux Build Failed: gcc Not Found

**Error Message**: `cgo: C compiler "gcc" not found`

**Solution**:
- Linux version needs to be built on Linux systems
- Or install gcc toolchain (on Windows, you can install MinGW or TDM-GCC)

#### 2. npm Command Not Found

**Error Message**: `exec: "npm": executable file not found`

**Solution**:
- Ensure frontend assets are built (`frontend/dist` directory exists)
- Or install Node.js and npm
- Or comment out npm-related hooks in `.goreleaser.yml`

#### 3. Archive Configuration Deprecation Warning

**Warning Message**: `DEPRECATED: archives.builds should not be used anymore`

**Solution**:
- Fixed: Removed `archives.builds` field
- GoReleaser automatically matches builds and archives by `id`

#### 4. Build Tag Error

**Error Message**: `Error: Wails applications will not build without the correct build tags.`

**Solution**:
- Linux platform must use `webkit2_41` or `webkit2_40` tags
- Windows and macOS platforms use `desktop` and `production` tags

### Build Configuration

#### Linux Build Requirements

- **Ubuntu 24.04**: Requires `libwebkit2gtk-4.1-dev` and `libgtk-3-dev`
- **Ubuntu 22.04**: Requires `libwebkit2gtk-4.0-dev` and `libgtk-3-dev`
- Requires CGO support (`CGO_ENABLED=1`)
- Requires gcc compiler

#### Windows Build Requirements

- No CGO required (`CGO_ENABLED=0`)
- Can be cross-compiled on any system
- Uses `-H=windowsgui` to hide console window

#### macOS Build Requirements

- Needs to be built on macOS systems
- Requires Xcode installation
- No CGO required (when cross-compiling)

## Support the Author

If you find Realm useful, consider buying the author a coffee ☕

<div style="display: flex; gap: 10px;">
  <img src="docs/alipay.jpg" alt="Alipay" width="200" />
  <img src="docs/wcpay.png" alt="WeChat Pay" width="200" />
</div>
