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
func (rd *RealmDao) AddDomain(ctx context.Context, db *gorm.DB, realm *model.Realm) (int64, error) {
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

// Update a domain's passwd
func (rd *RealmDao) UpdateDomainPasswd(ctx context.Context, db *gorm.DB, realm *model.Realm) error {
	u := query.Use(db).Realm
	_, err := u.WithContext(ctx).
		Where(u.Domain.Eq(realm.Domain)).
		Update(u.User.Value(realm.User), u.Pwdd.Value(realm.Pwdd))
	return err
}
