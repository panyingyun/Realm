#!/bin/bash
# Material Symbols Outlined 字体下载脚本
# Bash 脚本（适用于 Linux/Mac）

FONT_URL="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700"
OUTPUT_FILE="MaterialSymbolsOutlined.woff2"
CSS_FILE="temp_font.css"

echo "正在获取字体文件 URL..."

# 下载 CSS 文件
if curl -s -o "$CSS_FILE" "$FONT_URL"; then
    # 提取字体文件 URL
    WOFF2_URL=$(grep -oP 'url\(\K[^)]+\.woff2' "$CSS_FILE" | head -1)
    
    if [ -n "$WOFF2_URL" ]; then
        echo "找到字体文件 URL: $WOFF2_URL"
        echo "正在下载字体文件..."
        
        # 下载字体文件
        if curl -L -o "$OUTPUT_FILE" "$WOFF2_URL"; then
            FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
            echo "字体文件下载成功！"
            echo "文件大小: $FILE_SIZE"
            echo "文件位置: $(pwd)/$OUTPUT_FILE"
        else
            echo "下载失败"
            exit 1
        fi
    else
        echo "无法从 CSS 中提取字体文件 URL"
        echo "请手动访问以下 URL 并下载字体文件："
        echo "$FONT_URL"
        exit 1
    fi
else
    echo "无法下载 CSS 文件"
    exit 1
fi

# 清理临时文件
rm -f "$CSS_FILE"
