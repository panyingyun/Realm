package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"path"

	"gorm.io/gorm"

	"realm/helper"
)

const (
	DBName string = "realm.db"
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
	//fmt.Println("pwd dir = ", dir)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Println("start up dir = ", dir)
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
	pwddOri := helper.QueryDomain(a.db, helper.MainDomain)
	pwdd, _ := helper.GetAESEncrypted(mainPwd, mainPwd)
	//fmt.Println("username = ", helper.MainDomain)
	//fmt.Println("mainPwd = ", pwdd)
	if len(pwddOri) == 0 {
		helper.AddPassword(a.db, mainPwd, helper.MainName, helper.MainDomain, helper.MainUser, mainPwd, helper.MainCategory)
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
func (a *App) GetPasswordCategories() ([]Category, error) {
	categories := []Category{
		{Name: "Financial", Icon: "account_balance", Color: "financial"},
		{Name: "Social", Icon: "share", Color: "social"},
		{Name: "Private", Icon: "description", Color: "private"},
		{Name: "Work", Icon: "work", Color: "tech"},
		{Name: "Settings", Icon: "settings", Color: "primary"},
	}
	return categories, nil
}

// GetPasswordsByCategory returns passwords for a specific category
func (a *App) GetPasswordsByCategory(category string) ([]Password, error) {
	if helper.IsStringBlank(a.mainPwd) {
		return []Password{}, errors.New("main password is not set, please login first")
	}

	data, err := helper.QueryPasswordsByCategory(a.db, a.mainPwd, category)
	if err != nil {
		return []Password{}, err
	}

	passwords := []Password{}
	for _, password := range data {
		passwords = append(passwords, Password{
			ID:       fmt.Sprintf("%d", password.ID),
			Name:     password.Name,
			Domain:   password.Domain,
			Username: password.Username,
			Password: password.Password,
			Category: password.Category,
		})
	}

	//fmt.Println("category = ", category)
	//fmt.Println("passwords = ", passwords)
	return passwords, nil
}

// AddPassword adds a new password entry
func (a *App) AddPassword(pwd Password) (bool, error) {
	//fmt.Println("password = ", pwd)
	if helper.IsStringBlank(a.mainPwd) {
		return false, errors.New("main password is not set, please login first")
	}
	id := helper.AddPassword(a.db, a.mainPwd, pwd.Name, pwd.Domain, pwd.Username, pwd.Password, pwd.Category)
	if id < 0 {
		return false, errors.New("failed to add password")
	}
	return true, nil
}

// GetSettings returns current application settings
// Returns: language, theme, error
func (a *App) GetSettings() (string, string, error) {
	language, theme := helper.QuerySettings(a.db)
	return language, theme, nil
}

// UpdateSettings updates application settings
func (a *App) UpdateSettings(language string, theme string) (bool, error) {
	err := helper.UpdateSettings(a.db, language, theme)
	if err != nil {
		return false, err
	}
	return true, nil
}

// GeneratePassword generates a strong random password (simulated implementation)
func (a *App) GeneratePassword() (string, error) {
	password := helper.MustGenerate(13, 6, 1, false, false)
	return string(password), nil
}
