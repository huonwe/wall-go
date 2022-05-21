package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var nowDate = time.Now().Format("2006-01-02 15")
var secret = fmt.Sprintf("%v%v", nowDate, "dF13ayZ")

type MapClaims map[string]interface{}
type StrStr map[string]string

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

type Response map[string]interface{}

func makeResp(w http.ResponseWriter, code int16, msg string, data interface{}) {
	resp := Response{
		"code": code,
		"msg":  msg,
	}
	if data != nil {
		resp["data"] = data
	}
	respJson, err := json.Marshal(resp)
	if err != nil {
		resp := Response{
			"code": 201,
			"msg":  err.Error(),
		}
		respJson, _ := json.Marshal(resp)
		w.Write(respJson)
		return
	}
	w.Write(respJson)
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
func showLocalHost() {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		fmt.Println(err)
		return
	}
	for _, value := range addrs {
		if ipnet, ok := value.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				fmt.Print(ipnet.IP.String())
			}
		}
	}
}

func tokenReader(req *http.Request) map[string]interface{} {
	token, _ := req.Cookie("token")
	q, _ := ParseToken(token.Value, secret) // 解析token
	return q
}

func UIDReader(q map[string]interface{}) uint64 {
	UserID := q["UserID"].(string)
	uid, _ := strconv.Atoi(UserID)
	return uint64(uid)
}

func postReader(req *http.Request) map[string]string {
	con, _ := ioutil.ReadAll(req.Body)
	data := make(StrStr)
	_ = json.Unmarshal(con, &data)
	return data
}

func RemoteIp(req *http.Request) string {
	var remoteAddr string
	// RemoteAddr
	remoteAddr = req.RemoteAddr
	if remoteAddr != "" {
		return remoteAddr
	}
	// ipv4
	remoteAddr = req.Header.Get("ipv4")
	if remoteAddr != "" {
		return remoteAddr
	}
	//
	remoteAddr = req.Header.Get("XForwardedFor")
	if remoteAddr != "" {
		return remoteAddr
	}
	// X-Forwarded-For
	remoteAddr = req.Header.Get("X-Forwarded-For")
	if remoteAddr != "" {
		return remoteAddr
	}
	// X-Real-Ip
	remoteAddr = req.Header.Get("X-Real-Ip")
	if remoteAddr != "" {
		return remoteAddr
	} else {
		remoteAddr = "127.0.0.1"
	}
	return remoteAddr
}
