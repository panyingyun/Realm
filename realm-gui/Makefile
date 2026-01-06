# 获取版本信息
GIT_COMMIT := $(shell git rev-parse --short HEAD)
BUILD_TIME := $(shell date +%FT%T%z)
VERSION    := $(shell git describe --tags --always --dirty)

# 定义变量注入路径 (根据你的实际 module 修改)
LDFLAGS := -X 'main.GitCommit=$(GIT_COMMIT)' \
           -X 'main.BuildTime=$(BUILD_TIME)' \
           -X 'main.Version=$(VERSION)'

.PHONY: env  clean lint build

all: env  clean lint build

env:
	@echo "=========install gofmt ==========="
	GOPROXY=https://goproxy.cn/,direct go install mvdan.cc/gofumpt@latest
	@echo "=========install goreleaser ==========="
	GOPROXY=https://goproxy.cn/,direct go install github.com/goreleaser/goreleaser/v2@latest
	@echo "=========install wails ==========="
	GOPROXY=https://goproxy.cn/,direct go install github.com/wailsapp/wails/v2/cmd/wails@latest

dev:
	go mod tidy
	gofumpt -l -w .
	wails dev 
		
clean:
	go clean -i .


build:
	go mod tidy
	gofumpt -l -w .
	wails build -tags webkit2_41