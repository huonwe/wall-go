package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
)

// type Hanashi struct{

// }
var messages []MessageFront

func wallView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		// t, err := template.ParseFiles("./templates/wallPage.html")
		data, err := ioutil.ReadFile("./HTMLStatic/html/wallPage.html")

		if err == nil {
			w.Write(data)
			// t.Execute(w, "")
		} else {
			log.Println(err)
			w.WriteHeader(404)
			w.Write([]byte("404 - " + http.StatusText(404)))
		}
	}
}

func getMessageView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		result := db.Model(&Message{}).Joins("User").Find(&messages)
		if result.Error != nil {
			log.Println(result.Error)
			makeResp(w, 201, result.Error.Error(), nil)
			return
		}

		makeResp(w, 200, "success", messages)
		return
	}
}

func addView(w http.ResponseWriter, req *http.Request) {
	// resp := Response{
	// 	"code": 201,
	// 	"msg":  "LOGIN OUTDATED",
	// }
	if req.Method == "POST" {
		token, err := req.Cookie("token")
		if err != nil {
			makeResp(w, 201, "login require", nil)
			return
		}
		q, err := ParseToken(token.Value, secret) // 解析token
		if err != nil {
			makeResp(w, 201, "login outdated", nil)
			return
		}
		con, _ := ioutil.ReadAll(req.Body)
		// fmt.Println(string(con))
		hanashi := new(Message)
		err = json.Unmarshal(con, hanashi)
		if err != nil {
			makeResp(w, 201, err.Error(), nil)
			return
		}

		// fmt.Println(q["UserID"])
		UserID := q["UserID"].(string)

		uid, _ := strconv.Atoi(UserID)
		hanashi.UserID = uint64(uid)
		tx := db.Create(&hanashi)
		if tx.Error != nil {
			makeResp(w, 201, "sql error", nil)
			return
		}

		makeResp(w, 200, "success", nil)
		return
	} else {
		w.Write([]byte("method incorrect"))
	}
}

func signUpView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		con, _ := ioutil.ReadAll(req.Body)
		user := new(User)
		err := json.Unmarshal(con, user)
		if err != nil {
			log.Println(err)
		}
		// fmt.Println(user)
		result := db.Create(&user)
		if result.Error != nil {
			makeResp(w, 201, "sql error", nil)
			return
		}

		makeResp(w, 200, "success", nil)
	} else {
		w.Write([]byte("method incorrect"))
	}
}

func signInView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		con, _ := ioutil.ReadAll(req.Body)
		user := new(User)
		err := json.Unmarshal(con, user)
		if err != nil {
			log.Println(err)
			makeResp(w, 201, err.Error(), nil)
			return
		}

		// user_found := new(User)
		db.Where(&User{UserName: user.UserName, Password: user.Password}).First(&user)
		if user.ID == 0 {
			makeResp(w, 201, "账号名或密码错误", nil)
			return
		} else {
			dict := make(map[string]interface{})
			dict["UserID"] = strconv.FormatUint(user.ID, 10)
			// dict[""] = 18
			// fmt.Println(secret)
			tokenNew, err := GenerateToken(dict, secret) // 生成token
			if err != nil {
				fmt.Println(err)
			}
			cookie := http.Cookie{
				Name:    "token",
				Value:   tokenNew,
				Expires: time.Now().AddDate(0, 1, 0),
				MaxAge:  0,
			}
			http.SetCookie(w, &cookie)
			makeResp(w, 200, "success", nil)
			return
		}
	}
}

func getUserInfoView(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)
	user := new(UserFront)
	tx := db.Model(&User{}).First(&user, q["UserID"])
	if tx.Error != nil {
		makeResp(w, 201, "sql error", nil)
	}
	makeResp(w, 200, "success", user)
}

// func panicView(w http.ResponseWriter, req *http.Request) {
// 	// w.Write([]byte("closed"))
// 	panic("999")
// }

// func hellowView(w http.ResponseWriter, req *http.Request) {
// 	w.Write([]byte("hellow"))
// }

func userView(w http.ResponseWriter, req *http.Request) {
	data, err := ioutil.ReadFile("./HTMLStatic/html/user.html")
	if err != nil {
		makeResp(w, 201, "read failed", nil)
		return
	}
	w.Write(data)

}
