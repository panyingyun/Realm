package main

import (
	_ "embed"
	"fmt"
	"os"

	"Realm/helper"
)

//go:embed tpl/realm.db
var sqlite3Tpl string

func main() {
	// create realm.db file
	if _, err := os.Stat("realm.db"); os.IsNotExist(err) {
		os.WriteFile("realm.db", []byte(sqlite3Tpl), 0o644)
	}

	fmt.Println("=== Welcome to Realm ===")

	helper.RunReplCmder()
}
