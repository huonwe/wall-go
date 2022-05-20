package main

import (
	"log"
	"net/http"
	"runtime/debug"
	"time"
)

func jsonTag(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		handler.ServeHTTP(w, r)
	})
}

func TokenVerify(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := r.Cookie("token")
		if err != nil {
			// log.Println("ERROR", err)
			makeResp(w, 202, "login outdated", nil)
			return
		}
		_, err = ParseToken(token.Value, secret) // 解析token
		if err != nil {
			// log.Println("ERROR", err)
			makeResp(w, 202, "login outdated", nil)
			return
		}
		// fmt.Println(r.URL.Path, q["UserID"])
		handler.ServeHTTP(w, r)
	})
}

func Metric(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		defer func() {
			log.Printf("path:%s elapseed:%fs\n", r.URL.Path, time.Since(start).Seconds())
		}()
		handler.ServeHTTP(w, r)

	})
}

func PanicRecover(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Println(string(debug.Stack()))
			}
		}()

		handler.ServeHTTP(w, r)
	})
}

func WithLog(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("path:%s process start...\n", r.URL.Path)
		defer func() {
			log.Printf("path:%s process end...\n", r.URL.Path)
		}()
		handler.ServeHTTP(w, r)
	})
}

func WithRecord(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("IP:%s --> %s %s \n", RemoteIp(r), r.URL.Path, r.Method)
		handler.ServeHTTP(w, r)
	})
}
