package helper

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"Realm/dao"
	"Realm/dao/model"

	"github.com/glebarez/sqlite"

	gorm "gorm.io/gorm"
	"gorm.io/gorm/logger"
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
		results = append(results, fmt.Sprintf("%s %s %s", item.Domain, item.User, pwd))
	}
	ret = strings.Join(results, "\n")
	return ret
}

func AddDomain(realmdb *gorm.DB, domain string, user string, pwdd string) int64 {
	if isStringBlank(domain) || isStringBlank(pwdd) {
		return -1
	}
	ctx := context.Background()
	var realm model.Realm
	realm.Domain = domain
	realm.User = user
	realm.Pwdd = pwdd
	id, _ := dao.QRealm.AddDomain(ctx, realmdb, &realm)
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
	if isStringBlank(domain) || isStringBlank(pwdd) {
		return errors.New("domain or pwdd cannot be blank")
	}
	ctx := context.Background()
	var realm model.Realm
	realm.Domain = domain
	realm.User = user
	realm.Pwdd = pwdd
	return dao.QRealm.UpdateDomainPasswd(ctx, realmdb, &realm)
}
