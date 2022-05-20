package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	dsn := "wallMaster:password123456@tcp(120.55.170.139:3306)/wall?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	initDB(db)
	// go cacheModel()
	fmt.Print("server running on http://")
	showLocalHost()
	fmt.Print(":5500\n")
	mux := NewHWMux()

	// fmt.Println(mux.middlewares)
	mux.Handle("/HTMLStatic/", http.StripPrefix("/HTMLStatic/", http.FileServer(http.Dir("./HTMLStatic"))))
	// mux.Handle("/favicon.ico",)
	mux.Use(WithRecord)
	mux.HandleFunc("/wall", wallView)
	// mux.Use(jsonTag)
	mux.HandleFunc("/getMessage", getMessageView)
	mux.HandleFunc("/signIn", signInView)
	mux.HandleFunc("/signUp", signUpView)

	mux.Use(TokenVerify)
	mux.HandleFunc("/add", addView)
	mux.HandleFunc("/user", userView)
	mux.HandleFunc("/getUserInfo", getUserInfoView)

	// mux.HandleFunc("/hellow", hellowView)

	// mux.HandleFunc("/panic", panicView)
	server := &http.Server{
		Addr:         ":5500",
		Handler:      mux,
		ReadTimeout:  20 * time.Second,
		WriteTimeout: 20 * time.Second,
	}

	server.ListenAndServe()
}
