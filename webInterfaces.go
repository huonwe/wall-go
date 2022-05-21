package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
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
	db.Model(&Message{}).Where("id = ?", hanashi.ID).Update("thumbs", "thumbs + 1")

	makeResp(w, 200, "success", nil)

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
	makeResp(w, 200, "success", nil)

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
