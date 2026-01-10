package dao

import (
	"context"

	"realm/dao/model"
	"realm/dao/query"

	"gorm.io/gorm"
)

// https://gorm.io/gen/
type RealmDao struct{}

var QRealm = &RealmDao{}

type SettingDao struct{}

var QSetting = &SettingDao{}

// count number of domain
func (rd *RealmDao) CounterDomain(ctx context.Context, db *gorm.DB) (int64, error) {
	u := query.Use(db).Realm
	cnt, err := u.WithContext(ctx).Where().Count()
	if err != nil {
		return 0, err
	}
	return cnt, err
}

// Query all domain and passwd without main domain
func (rd *RealmDao) ListAllWithoutMainDomain(ctx context.Context, db *gorm.DB, mainDomain string) ([]*model.Realm, error) {
	u := query.Use(db).Realm
	return u.WithContext(ctx).Where(u.Domain.Neq(mainDomain)).Find()
}

// Add a domain and passwd
func (rd *RealmDao) AddRealm(ctx context.Context, db *gorm.DB, realm *model.Realm) (int64, error) {
	u := query.Use(db).Realm
	err := u.WithContext(ctx).Create(realm)
	if err != nil {
		return 0, err
	}
	return realm.ID, err
}

// Query a domain and passwd
func (rd *RealmDao) QueryDomain(ctx context.Context, db *gorm.DB, domain string) (*model.Realm, error) {
	u := query.Use(db).Realm
	// 在查询数据库时会自动添加 LIMIT 1 条件，如果没有找到记录则返回错误 ErrRecordNotFound
	return u.WithContext(ctx).Where(u.Domain.Eq(domain)).First()
}

// Query passwords by category
func (rd *RealmDao) QueryPasswordsByCategory(ctx context.Context, db *gorm.DB, category string, mainDomain string) ([]*model.Realm, error) {
	u := query.Use(db).Realm
	return u.WithContext(ctx).Where(u.Category.Eq(category)).Where(u.Domain.Neq(mainDomain)).Find()
}

// Update a domain's passwd
func (rd *RealmDao) UpdateDomainPasswd(ctx context.Context, db *gorm.DB, realm *model.Realm) error {
	u := query.Use(db).Realm
	// Update by two fields
	// Update(u.Username.Value(realm.Username), u.Pwdd.Value(realm.Pwdd))

	// Update by three fields
	_, err := u.WithContext(ctx).
		Where(u.Domain.Eq(realm.Domain)).
		Updates(map[string]interface{}{
			"username": realm.Username,
			"pwdd":     realm.Pwdd,
			"category": realm.Category,
		})
	return err
}

// Query a settings from database
func (sd *SettingDao) QuerySettings(ctx context.Context, db *gorm.DB) (*model.Setting, error) {
	u := query.Use(db).Setting
	// 在查询数据库时会自动添加 LIMIT 1 条件，如果没有,则创建一台默认记录
	setting, err := u.WithContext(ctx).First()
	if err != nil {
		u.WithContext(ctx).Create(&model.Setting{
			ID:       1,
			Language: "en",
			Theme:    "light",
		})
	}
	setting, err = u.WithContext(ctx).First()
	return setting, nil
}

// Update a settings to database
func (sd *SettingDao) UpdateSettings(ctx context.Context, db *gorm.DB, language string, theme string) error {
	u := query.Use(db).Setting
	// 更新设置
	_, err := u.WithContext(ctx).
		Where(u.ID.Eq(1)).
		Updates(map[string]interface{}{
			"language": language,
			"theme":    theme,
		})
	return err
}
