package main

import (
	"net/http"
)

type Middleware func(http.Handler) http.Handler

type HWMux struct {
	*http.ServeMux
	middlewares []Middleware
}

func applyMiddlewares(handler http.Handler, middlewares ...Middleware) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}

	return handler
}

// func (m *HWMux) ServeHTTP(w http.ResponseWriter, r *http.Request) {
// 	// ...
// 	h, _ := m.Handler(r)
// 	// 只需要加这一行即可
// 	// h = applyMiddlewares(h, m.middlewares...)
// 	h.ServeHTTP(w, r)
// }

func NewHWMux() *HWMux {
	return &HWMux{
		ServeMux: http.NewServeMux(),
	}
}

func (m *HWMux) Use(middlewares ...Middleware) {
	m.middlewares = append(m.middlewares, middlewares...)
}

func (m *HWMux) MWClear(middlewares ...Middleware) {
	m.middlewares = m.middlewares[0:0]
}

func (m *HWMux) Handle(pattern string, handler http.Handler) {
	handler = applyMiddlewares(handler, m.middlewares...)
	m.ServeMux.Handle(pattern, handler)
}

func (m *HWMux) HandleFunc(pattern string, handler http.HandlerFunc) {
	newHandler := applyMiddlewares(handler, m.middlewares...)
	m.ServeMux.Handle(pattern, newHandler)
}
