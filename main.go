package main

import (
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	dsn := "wallMaster:password123456@tcp(120.55.170.139:3306)/wall?charset=utf8mb4&parseTime=True"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	initDB(db)
	// go cacheModel()

	http.Handle("/HTMLStatic/", http.StripPrefix("/HTMLStatic/", http.FileServer(http.Dir("./HTMLStatic"))))
	http.HandleFunc("/wall", wallView)
	http.HandleFunc("/getMessage", getMessageView)
	http.HandleFunc("/add", addView)
	http.HandleFunc("/signUp", signUpView)
	http.HandleFunc("/signIn", signInView)
	http.HandleFunc("/getUserInfo", getUserInfoView)
	http.ListenAndServe(":5500", nil)
}
