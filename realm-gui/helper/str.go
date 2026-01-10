package helper

import "strings"

func IsStringBlank(s string) bool {
	return len(strings.TrimSpace(s)) == 0
}
