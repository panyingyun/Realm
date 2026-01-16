package main

import (
	"embed"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed tpl/realm.db
var sqlite3Tpl []byte

func main() {
	// Get application data directory
	appDataDir, err := getAppDataDir()
	if err != nil {
		println("Error getting app data directory:", err.Error())
		os.Exit(1)
	}

	// Create realm.db file in app data directory
	dbPath := filepath.Join(appDataDir, "realm.db")
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		if err := os.WriteFile(dbPath, sqlite3Tpl, 0644); err != nil {
			println("Error creating realm.db:", err.Error())
			os.Exit(1)
		}
	}

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "realm",
		Width:  1200,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
