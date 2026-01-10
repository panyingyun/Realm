package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"path"

	"gorm.io/gorm"

	"realm/helper"
)

const (
	DBName     string = "realm.db"
	MainDomain string = "main.passwd"
)

// App struct
type App struct {
	ctx     context.Context
	db      *gorm.DB
	mainPwd string
}

// Category represents a password category
type Category struct {
	Name  string `json:"name"`
	Icon  string `json:"icon"`
	Color string `json:"color"`
}

// Password represents a password entry
type Password struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Domain   string `json:"domain"`
	Username string `json:"username"`
	Password string `json:"password"`
	Category string `json:"category"`
}

// Settings represents application settings
type Settings struct {
	Language string `json:"language"` // "zh" | "en"
	Theme    string `json:"theme"`    // "light" | "dark"
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	dir, err := os.Getwd()
	fmt.Println("pwd dir = ", dir)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("start up dir = ", dir)
	a.db, err = helper.OpenDB(path.Join(dir, DBName))
	if err != nil {
		log.Fatal(err)
	}
}

// Login validates user credentials (empty implementation)
func (a *App) Login(username string, mainPwd string) (bool, error) {
	if helper.IsStringBlank(mainPwd) {
		return false, errors.New("main passwd can not be blank.")
	}
	pwddOri := helper.QueryDomain(a.db, MainDomain)
	pwdd, _ := helper.GetAESEncrypted(mainPwd, mainPwd)
	fmt.Println("username = ", MainDomain)
	fmt.Println("mainPwd = ", pwdd)
	if len(pwddOri) == 0 {
		helper.AddDomain(a.db, MainDomain, "", pwdd)
		a.mainPwd = mainPwd
		return false, errors.New("login success. Your first set your main passwd.")
	}
	if pwdd == pwddOri {
		a.mainPwd = mainPwd
		return true, nil
	} else {
		return false, errors.New("login fail. Your main passwd is not right.")
	}
}

// GetPasswordCategories returns list of password categories (empty implementation)
func (a *App) GetPasswordCategories() (string, error) {
	categories := []Category{
		{Name: "Financial", Icon: "account_balance", Color: "financial"},
		{Name: "Social", Icon: "share", Color: "social"},
		{Name: "Private", Icon: "description", Color: "private"},
		{Name: "Work", Icon: "work", Color: "tech"},
		{Name: "Settings", Icon: "settings", Color: "primary"},
	}
	data, err := json.Marshal(categories)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// GetPasswordsByCategory returns passwords for a specific category (empty implementation)
func (a *App) GetPasswordsByCategory(category string) (string, error) {
	// Empty implementation - return empty array
	passwords := []Password{}
	data, err := json.Marshal(passwords)
	if err != nil {
		return "", err
	}
	fmt.Println("category = ", category)

	fmt.Println("passwords = ", passwords)
	return string(data), nil
}

// AddPassword adds a new password entry (empty implementation)
func (a *App) AddPassword(passwordJSON string) (bool, error) {
	var password Password
	err := json.Unmarshal([]byte(passwordJSON), &password)
	if err != nil {
		return false, err
	}
	fmt.Println("password = ", password)
	// Empty implementation - always return true
	return true, nil
}

// GetSettings returns current application settings (empty implementation)
func (a *App) GetSettings() (string, error) {
	settings := Settings{
		Language: "en",
		Theme:    "light",
	}
	data, err := json.Marshal(settings)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// UpdateSettings updates application settings (empty implementation)
func (a *App) UpdateSettings(settingsJSON string) (bool, error) {
	var settings Settings
	err := json.Unmarshal([]byte(settingsJSON), &settings)
	if err != nil {
		return false, err
	}
	// Empty implementation - always return true
	return true, nil
}

// GeneratePassword generates a strong random password (simulated implementation)
func (a *App) GeneratePassword() (string, error) {
	password := helper.MustGenerate(13, 6, 1, false, false)
	return string(password), nil
}
