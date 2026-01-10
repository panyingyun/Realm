package main

import (
	"context"
	"encoding/json"
	"math/rand"
	"time"
)

// App struct
type App struct {
	ctx context.Context
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
	Url      string `json:"url"`
	Username string `json:"username"`
	Password string `json:"password"`
	Category string `json:"category"`
	Priority string `json:"priority"`
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
}

// Login validates user credentials (empty implementation)
func (a *App) Login(username string, password string) (bool, error) {
	// Empty implementation - always return true for now
	return true, nil
}

// GetPasswordCategories returns list of password categories (empty implementation)
func (a *App) GetPasswordCategories() (string, error) {
	categories := []Category{
		{Name: "Dashboard", Icon: "grid_view", Color: "primary"},
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
	return string(data), nil
}

// AddPassword adds a new password entry (empty implementation)
func (a *App) AddPassword(passwordJSON string) (bool, error) {
	var password Password
	err := json.Unmarshal([]byte(passwordJSON), &password)
	if err != nil {
		return false, err
	}
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
	// Simulated password generation
	// Generate a strong password with letters, numbers, and special characters
	const (
		lowercase = "abcdefghijklmnopqrstuvwxyz"
		uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		numbers   = "0123456789"
		symbols   = "!@#$%^&*"
	)
	
	allChars := lowercase + uppercase + numbers + symbols
	length := 16
	
	// Seed random number generator
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	
	// Ensure at least one character from each category
	password := make([]byte, length)
	password[0] = lowercase[r.Intn(len(lowercase))]
	password[1] = uppercase[r.Intn(len(uppercase))]
	password[2] = numbers[r.Intn(len(numbers))]
	password[3] = symbols[r.Intn(len(symbols))]
	
	// Fill the rest randomly
	for i := 4; i < length; i++ {
		password[i] = allChars[r.Intn(len(allChars))]
	}
	
	// Shuffle the password to avoid predictable patterns
	for i := len(password) - 1; i > 0; i-- {
		j := r.Intn(i + 1)
		password[i], password[j] = password[j], password[i]
	}
	
	return string(password), nil
}
