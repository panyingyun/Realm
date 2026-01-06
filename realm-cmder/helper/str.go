package helper

import "strings"

func isStringBlank(s string) bool {
	return len(strings.TrimSpace(s)) == 0
}
