package main

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var nowDate = time.Now().Format("2006-01-02 15")
var secret = fmt.Sprintf("%v%v", nowDate, "dF13ayP")

// GenerateToken 生成Token值
func GenerateToken(mapClaims jwt.MapClaims, key string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, mapClaims)
	return token.SignedString([]byte(key))
}

// token: "eyJhbGciO...解析token"
func ParseToken(tokenString string, secret string) (map[string]interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Println(claims["UserID"])
		return claims, nil
	} else {
		return nil, fmt.Errorf("token unexcepted")
	}

	// return claim.Claims.(jwt.MapClaims)["cmd"].(string), nil
}

// func main() {
// 	dict := make(map[string]interface{})
// 	dict["name"] = "xxxx"
// 	dict["age"] = 18
// 	tokenNew, e := GenerateToken(dict, secret) // 生成token
// 	fmt.Println(tokenNew, e, "777777777777777")
// 	q, _ := ParseToken(tokenNew, secret) // 解析token
// 	fmt.Println(q, "4444444444444444")
// }

// func cacheModel() {
// 	for {
// 		result := db.Model(&Message{}).Joins("User").Find(&messages)
// 		if result.Error != nil {
// 			log.Println(result.Error)
// 		} else {
// 			log.Println("Messages cache success")
// 		}
// 		time.Sleep(5 * time.Second)
// 	}
// }
