.PHONY: env  clean lint build

all: env  clean lint build

env:
	@echo "=========install goimports ==========="
	GOPROXY=https://goproxy.cn/,direct go install -v github.com/incu6us/goimports-reviser/v3@latest
	@echo "=========install gentool ==========="
	GOPROXY=https://goproxy.cn/,direct go install -v gorm.io/gen/tools/gentool@latest
	@echo "=========install gofmt ==========="
	GOPROXY=https://goproxy.cn/,direct go install mvdan.cc/gofumpt@latest
	# install sqlite3 for ubuntu
	sudo apt install sqlite3

build:
	go mod tidy
	gofumpt -l -w .
	CGO_ENABLED=0 go build  -ldflags "$(LDFLAGS)" -v .
	
gensql:
	gentool -dsn "root:xxxxxx@tcp(192.168.1.120:6306)/realmdb?charset=utf8mb4&parseTime=True&loc=Local" -outPath "/mnt/e/panyingyun/gogo/Realm/dao/query"

clean:
	go clean -i .

run:
	go mod tidy
	gofumpt -l -w .
	CGO_ENABLED=0 go build  -ldflags "$(LDFLAGS)" -v .
	./Realm

sqlite:	
	sqlite3 realm.db
	sqlite3 realm.db < realm.sql