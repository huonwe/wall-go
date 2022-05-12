package main

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint   `gorm:"primarykey;autoIncrement"`
	UserName  string `gorm:"unique"`
	Phone     string
	Password  string
	Messages  []Message
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Message struct {
	ID           uint `gorm:"primarykey;autoIncrement"`
	UserID       uint
	User         User
	Content      string
	FontSize     float32
	CenterRelX   float32
	CenterRelY   float32
	Width        float32
	Height       float32
	BorderRadius float32
	Remark       string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type MessageFront struct {
	ID           uint
	UserID       uint
	User         UserFront
	Content      string
	FontSize     float32
	CenterRelX   float32
	CenterRelY   float32
	Width        float32
	Height       float32
	BorderRadius float32
	Remark       string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type UserFront struct {
	ID       uint
	UserName string
	Phone    string
}

func initDB(db *gorm.DB) {
	// db.Exec("DROP TABLE messages")
	// db.Exec("DROP TABLE users")
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Message{})

	// user := User{UserName: "admin", Phone: "19813452541", Password: "1234567"}
	// db.Create(&user)

	// user = User{UserName: "gggggg", Phone: "19813452541", Password: "1234567"}

	// db.Create(&user)

	// msg := Message{Content: "content", UserID: 1}
	// db.Create(&msg)

	// msg = Message{Content: "content1", UserID: 1}
	// db.Create(&msg)

	// var se User
	// db.First(&se, 1)
	// fmt.Println(se.Username + "\n")

	// var see Message

	// db.Preload("User").Find(&see, 11)
	// fmt.Println(see.UserID)
}
