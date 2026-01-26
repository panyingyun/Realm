# Windows 资源 (exe 图标与版本信息)

本目录用于 [go-winres](https://github.com/tc-hib/go-winres) 为 Windows 构建嵌入 exe 图标和清单。

- `winres.json`：资源描述（图标、manifest、版本信息）
- `manifest.xml`：应用程序清单（DPI 感知等）
- 图标文件使用 `build/windows/icon.ico`

**使用方式：**

- **GoReleaser 构建**：`.goreleaser.windows.yml` 的 before 钩子会自动执行 `go-winres make`，无需手动操作。
- **本地 Windows 构建**：构建前在项目根目录执行：
  ```bash
  go install github.com/tc-hib/go-winres@latest
  go-winres make
  ```
  然后执行 `wails build` 或 `go build`。生成的 `rsrc_windows_amd64.syso` 会被 Go 编译器自动链接进 exe。

更新 exe 图标请替换 `build/windows/icon.ico`。更新版本号可编辑 `winres.json` 中的 `RT_VERSION` 或通过 GoReleaser 的 ldflags 注入（需另行配置 go-winres 的版本来源）。
