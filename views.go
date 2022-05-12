package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

type Response map[string]interface{}

// type Hanashi struct{

// }
var messages []MessageFront

func wallView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET" {
		path := req.URL.Path
		log.Println(path)
		// t, err := template.ParseFiles("./templates/wallPage.html")
		data, err := ioutil.ReadFile("./templates/wallPage.html")

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
		path := req.URL.Path
		log.Println(path)

		result := db.Model(&Message{}).Joins("User").Find(&messages)
		if result.Error != nil {
			log.Println(result.Error)
		}
		// fmt.Println(result)

		resp := Response{
			"code": 200,
			"data": messages,
			"msg":  "success",
		}

		respJson, err := json.Marshal(resp)
		if err != nil {
			log.Println(err)
		}
		// fmt.Println(string(respJson))
		w.Write(respJson)
		// io.WriteString(w, string(respJson))
	}
}

func addView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		con, _ := ioutil.ReadAll(req.Body)
		// fmt.Println(string(con))
		hanashi := new(Message)
		err := json.Unmarshal(con, hanashi)
		if err != nil {
			panic(err)
		}
		hanashi.UserID = 1
		tx := db.Create(&hanashi)
		fmt.Println(tx == nil)
		resp := Response{
			"code": 200,
			"msg":  "success",
		}
		respJson, err := json.Marshal(resp)
		if err != nil {
			log.Println(err)
		}
		w.Write(respJson)
	} else {
		w.Write([]byte("method incorrect"))
	}
}

func signUpView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		log.Println(req.URL)
		con, _ := ioutil.ReadAll(req.Body)
		user := new(User)
		err := json.Unmarshal(con, user)
		if err != nil {
			log.Println(err)
		}
		// fmt.Println(user)
		db.Create(&user)
		resp := Response{
			"code": 200,
			"msg":  "success",
		}
		respJson, _ := json.Marshal(resp)
		w.Write(respJson)
	} else {
		w.Write([]byte("method incorrect"))
	}
}

func signInView(w http.ResponseWriter, req *http.Request) {
	if req.Method == "POST" {
		log.Println(req.URL)
		con, _ := ioutil.ReadAll(req.Body)
		user := new(User)
		err := json.Unmarshal(con, user)
		if err != nil {
			log.Println(err)
		}

		// user_found := new(User)
		db.Where(&User{UserName: user.UserName, Password: user.Password}).First(&user)
		if user.ID == 0 {
			resp := Response{
				"code": 201,
				"msg":  "账号名或密码错误",
			}
			respJson, _ := json.Marshal(resp)
			w.Write(respJson)

		} else {
			dict := make(map[string]interface{})
			dict["UserID"] = user.ID
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
			resp := Response{
				"code": 200,
				"msg":  "success",
			}

			respJson, _ := json.Marshal(resp)

			w.Write(respJson)
		}
	}
}

func getUserInfoView(w http.ResponseWriter, req *http.Request) {
	log.Println(req.URL)
	token, err := req.Cookie("token")
	if err != nil {
		log.Println("ERROR", err)
	}
	q, err := ParseToken(token.Value, secret) // 解析token
	if err != nil {
		log.Println("ERROR", err)
	}
	// fmt.Println(q, "4444444444444444")
	user := new(UserFront)
	db.Model(&User{}).First(&user, q["UserID"])

	resp := Response{
		"code": 200,
		"data": user,
		"msg":  "success",
	}

	respJson, _ := json.Marshal(resp)
	w.Write(respJson)

}
