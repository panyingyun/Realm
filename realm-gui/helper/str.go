package helper

import (
	"strconv"
	"strings"
)

func IsStringBlank(s string) bool {
	return len(strings.TrimSpace(s)) == 0
}

// StrToInt64 converts string to int64
func StrToInt64(s string) (int64, error) {
	return strconv.ParseInt(s, 10, 64)
}
