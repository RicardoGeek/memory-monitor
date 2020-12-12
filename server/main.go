package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

func monitor(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadFile("/proc/monitor_g0")

	if err != nil {
		fmt.Fprintf(w, "Cuac! No pudimos leer /proc/monitor_g0")
		fmt.Println(err)
		return
	}

	fmt.Fprintf(w, string(data))
}

func montiorProcess(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadFile("/proc/process_g0")

	if err != nil {
		fmt.Fprintf(w, "Cuac! No pudimos leer /proc/monitor_g0")
		fmt.Println(err)
		return
	}

	fmt.Fprintf(w, string(data))
}

func handleRequests() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/ui/", http.StripPrefix("/ui/", fs))
	http.HandleFunc("/api", monitor)
	http.HandleFunc("/api/process", montiorProcess)
	log.Fatal(http.ListenAndServe(":10000", nil))
}

func main() {
	handleRequests()
}
