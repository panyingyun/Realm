#!/bin/bash
set -e
VERSION=0.1.0

# 修复权限，避免 EACCES
sudo chown -R $(whoami) frontend

mkdir -p build/bin

# -----------------------
# 1️⃣ Intel (amd64)
# -----------------------
echo "🚀 构建 Intel (amd64) .app..."
wails build -platform darwin/amd64 -tags desktop,production
mv build/bin/realm.app build/bin/realm-amd64.app

# -----------------------
# 2️⃣ Apple Silicon (arm64)
# -----------------------
echo "🚀 构建 Apple Silicon (arm64) .app..."
wails build -platform darwin/arm64 -tags desktop,production
mv build/bin/realm.app build/bin/realm-arm64.app

# -----------------------
# 3️⃣ 验证架构
# -----------------------
lipo -info build/bin/realm-amd64.app/Contents/MacOS/realm
lipo -info build/bin/realm-arm64.app/Contents/MacOS/realm

echo "✅ 构建完成！"
echo "输出目录：build/bin"
echo "Intel:  build/bin/realm-amd64.app"
echo "Apple Silicon: build/bin/realm-arm64.app"
