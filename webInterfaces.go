package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"

	"gorm.io/gorm"
)

func likeInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)

	con, _ := ioutil.ReadAll(req.Body)
	hanashi := new(Message)
	err := json.Unmarshal(con, hanashi)
	if err != nil {
		log.Println(err)
		makeResp(w, 201, err.Error(), nil)
		return
	}
	// fmt.Println("SSSS", con)

	comb := &ThumbComb{
		UserID:    UIDReader(q),
		MessageID: hanashi.ID,
	}

	// db.Where(&ThumbComb{UserID: q["UserID"].(uint64), MessageID: hanashi.ID}).Find(&comb)
	// if comb.ID != 0 {
	// 	makeResp(w, 202, "请勿重复操作", nil)
	// 	return
	// }
	tx := db.Create(&comb)
	if tx.Error != nil {
		makeResp(w, 201, "sql error", nil)
		return
	}

	// message := new(Message)
	// db.First(&message, hanashi.ID)
	// message.Thumbs += 1
	db.Model(&Message{}).Where("id = ?", hanashi.ID).Update("thumbs", gorm.Expr("thumbs + 1"))

	r := &Message{}
	db.First(&r, hanashi.ID)
	fmt.Println(r.Thumbs)

	makeResp(w, 200, "liked", nil)

}

func unlikeInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)

	con, _ := ioutil.ReadAll(req.Body)
	hanashi := new(Message)
	err := json.Unmarshal(con, hanashi)
	if err != nil {
		log.Println(err)
		makeResp(w, 201, err.Error(), nil)
		return
	}

	comb := &ThumbComb{
		UserID:    UIDReader(q),
		MessageID: hanashi.ID,
	}
	tx := db.Where(&comb).Delete(&ThumbComb{})
	if tx.Error != nil {
		makeResp(w, 201, "sql error", nil)
		return
	}
	db.Model(&Message{}).Where("id = ?", hanashi.ID).Update("thumbs", gorm.Expr("thumbs - 1"))

	makeResp(w, 200, "like", nil)

}

func impactInterface(w http.ResponseWriter, req *http.Request) {
	// log.Println("SSSSS")
	q := tokenReader(req)
	con, _ := ioutil.ReadAll(req.Body)
	comb := new(ThumbComb)
	err := json.Unmarshal(con, &comb)
	if err != nil {
		log.Println(err)
		makeResp(w, 201, err.Error(), nil)
		return
	}

	comb.UserID = UIDReader(q)
	// fmt.Println(comb)
	r := new(ThumbComb)
	// fmt.Println(comb)
	tx := db.Where(&comb).Find(&r)
	if tx.Error != nil {
		makeResp(w, 200, "like", nil)
		return
	}
	// fmt.Println(r)

	if r.ID == 0 {
		makeResp(w, 200, "like", nil)
		return
	} else {
		makeResp(w, 200, "liked", nil)
	}

}

func deleteInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)
	UserID := UIDReader(q)
	user := new(User)
	db.Model(&User{}).First(&user, UserID)
	if !user.Administrator {
		makeResp(w, 201, "no permission", nil)
		return
	}

	con, _ := ioutil.ReadAll(req.Body)
	// fmt.Println("post data: ", string(con))
	data := Response{
		"MessageID": 0,
	}
	_ = json.Unmarshal(con, &data)
	// fmt.Println("JSON:", data)

	tx := db.Delete(&Message{}, data["MessageID"])
	if tx.Error != nil {
		makeResp(w, 200, tx.Error.Error(), nil)
		return
	}
	makeResp(w, 200, "success", nil)
}

func storeAddInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)
	UserID := UIDReader(q)
	data := postReader(req)
	d := Storage{UserID: UserID, Key: data["Key"], Value: data["Value"]}
	db.Create(&d)
}

func storeQueryInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)
	UserID := UIDReader(q)
	data := postReader(req)
	d := Storage{UserID: UserID, Key: data["Key"]}
	UserData := new(Storage)
	tx := db.Where(&d).Find(&UserData)
	if tx.Error != nil {
		makeResp(w, 201, tx.Error.Error(), nil)
		return
	}
	makeResp(w, 201, "success", UserData)
}

func storeUpdateInterface(w http.ResponseWriter, req *http.Request) {
	q := tokenReader(req)
	UserID := UIDReader(q)
	data := postReader(req)

	d := Storage{UserID: UserID, Key: data["Key"]}

	exist := new(Storage)
	db.Where(&d).Find(&exist)
	if exist.ID == 0 {
		d.Value = "1"
		db.Create(&d)
		makeResp(w, 200, "success", d.Value)
	} else {
		if data["Value"] == "++" {
			new_Value, _ := strconv.Atoi(exist.Value)
			new_Value += 1
			exist.Value = strconv.Itoa(new_Value)
		} else {
			exist.Value = data["Value"]
		}
		db.Save(&exist)
		makeResp(w, 200, "success", exist.Value)
	}
}
