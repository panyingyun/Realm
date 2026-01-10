package helper

import (
	"crypto/md5"
	"encoding/hex"
)

func MD5Secrets(secrets string) (key string, iv string) {
	h := md5.New()
	h.Write([]byte(secrets))
	bytes := h.Sum(nil)
	key = hex.EncodeToString(bytes)
	iv = hex.EncodeToString(bytes[:8])
	return
}
