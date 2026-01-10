package main

import (
	_ "embed"
	"fmt"
	"os"

	"Realm/helper"
)

//go:embed tpl/realm.db
var sqlite3Tpl []byte

func main() {
	// create realm.db file
	if _, err := os.Stat("realm.db"); os.IsNotExist(err) {
		os.WriteFile("realm.db", sqlite3Tpl, 0o644)
	}

	fmt.Println("=== Welcome to Realm ===")

	helper.RunReplCmder()
}
