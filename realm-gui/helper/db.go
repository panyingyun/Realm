package helper

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"realm/dao"
	"realm/dao/model"

	"github.com/glebarez/sqlite"

	gorm "gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	MainName     string = "main.name"
	MainDomain   string = "main.domain"
	MainUser     string = "main.user"
	MainCategory string = "main.category"
)

// https://gorm.io/gen/

func OpenDB(dbname string) (db *gorm.DB, err error) {
	db, err = gorm.Open(sqlite.Open(dbname), &gorm.Config{})
	db.Logger = logger.Default.LogMode(logger.Silent)

	//_ = db.Exec("PRAGMA journal_mode=WAL;") // 开启 SQLite3 WAL 模式，读写不会互相阻塞，降低锁库的概率
	//fmt.Println("db = ", db)
	//fmt.Println("err = ", err)
	return
}

func Counter(realmdb *gorm.DB) int64 {
	ctx := context.Background()
	cnt, _ := dao.QRealm.CounterDomain(ctx, realmdb)
	return cnt
}

func ListAll(realmdb *gorm.DB, mainPwd string) string {
	ctx := context.Background()
	items, err := dao.QRealm.ListAllWithoutMainDomain(ctx, realmdb, MainDomain)
	if err != nil {
		return err.Error()
	}
	var results []string
	ret := ""
	for _, item := range items {
		pwd, _ := GetAESDecrypted(mainPwd, item.Pwdd)
		results = append(results, fmt.Sprintf("%s %s %s", item.Domain, item.Username, pwd))
	}
	ret = strings.Join(results, "\n")
	return ret
}

func AddPassword(realmdb *gorm.DB, mainPwd string, name string, domain string, user string, password string, category string) int64 {
	// Domain is optional, only check password and mainPwd
	if IsStringBlank(password) || IsStringBlank(mainPwd) {
		return -1
	}
	// Encrypt password using main password
	pwdd, err := GetAESEncrypted(mainPwd, password)
	if err != nil {
		fmt.Println("AddPassword encrypt error: ", err)
		return -1
	}
	ctx := context.Background()
	var realm model.Realm
	realm.Name = name
	realm.Domain = domain
	realm.Username = user
	realm.Pwdd = pwdd
	realm.Category = category
	id, _ := dao.QRealm.AddRealm(ctx, realmdb, &realm)
	return id
}

func QueryDomain(realmdb *gorm.DB, domain string) string {
	ctx := context.Background()
	realm, err := dao.QRealm.QueryDomain(ctx, realmdb, domain)
	if err != nil {
		return ""
	}
	return realm.Pwdd
}

func UpdateDomainPasswd(realmdb *gorm.DB, domain string, user string, pwdd string) error {
	if IsStringBlank(domain) || IsStringBlank(pwdd) {
		return errors.New("domain or pwdd cannot be blank")
	}
	ctx := context.Background()
	var realm model.Realm
	realm.Domain = domain
	realm.Username = user
	realm.Pwdd = pwdd
	return dao.QRealm.UpdateDomainPasswd(ctx, realmdb, &realm)
}

func QuerySettings(realmdb *gorm.DB) (string, string) {
	ctx := context.Background()
	settings, err := dao.QSetting.QuerySettings(ctx, realmdb)
	if err != nil {
		fmt.Println("QuerySettings error: ", err)
		return "en", "light"
	}
	return settings.Language, settings.Theme
}

func UpdateSettings(realmdb *gorm.DB, language string, theme string) error {
	ctx := context.Background()
	return dao.QSetting.UpdateSettings(ctx, realmdb, language, theme)
}

// PasswordResult represents a decrypted password entry
type PasswordResult struct {
	ID       int64
	Name     string
	Domain   string
	Username string
	Password string
	Category string
}

func QueryPasswordsByCategory(realmdb *gorm.DB, mainPwd string, category string) ([]PasswordResult, error) {
	ctx := context.Background()
	realms, err := dao.QRealm.QueryPasswordsByCategory(ctx, realmdb, category, MainDomain)
	if err != nil {
		return nil, err
	}

	var results []PasswordResult
	for _, realm := range realms {
		// Decrypt password using main password
		decryptedPwd, err := GetAESDecrypted(mainPwd, realm.Pwdd)
		if err != nil {
			fmt.Printf("QueryPasswordsByCategory decrypt error for domain %s: %v\n", realm.Domain, err)
			decryptedPwd = "" // Continue with empty password if decryption fails
		}

		results = append(results, PasswordResult{
			ID:       realm.ID,
			Name:     realm.Name,
			Domain:   realm.Domain,
			Username: realm.Username,
			Password: decryptedPwd,
			Category: realm.Category,
		})
	}
	return results, nil
}

// CalculateRealmHealth calculates password health based on password duplication
// Returns health percentage: 100% - duplicate ratio
// Health = 100% - (total passwords - unique passwords) / total passwords
func CalculateRealmHealth(realmdb *gorm.DB, mainPwd string) (float64, error) {
	ctx := context.Background()
	// Get all passwords excluding main domain
	realms, err := dao.QRealm.ListAllWithoutMainDomain(ctx, realmdb, MainDomain)
	if err != nil {
		return 0, err
	}

	// If no passwords, return 100% health
	if len(realms) == 0 {
		return 100.0, nil
	}

	// Decrypt all passwords and count duplicates
	passwordCount := make(map[string]int)
	totalPasswords := 0

	for _, realm := range realms {
		decryptedPwd, err := GetAESDecrypted(mainPwd, realm.Pwdd)
		if err != nil {
			// Skip passwords that can't be decrypted
			continue
		}
		// Only count non-empty passwords
		if !IsStringBlank(decryptedPwd) {
			passwordCount[decryptedPwd]++
			totalPasswords++
		}
	}

	// If no valid passwords, return 100% health
	if totalPasswords == 0 {
		return 100.0, nil
	}

	// Calculate unique passwords count
	uniquePasswords := len(passwordCount)

	// Calculate duplicate ratio
	// duplicateRatio = (total - unique) / total
	duplicateRatio := float64(totalPasswords-uniquePasswords) / float64(totalPasswords)

	// Health = 100% - duplicate ratio
	health := (1.0 - duplicateRatio) * 100.0

	// Ensure health is between 0 and 100
	if health < 0 {
		health = 0
	}
	if health > 100 {
		health = 100
	}

	return health, nil
}
