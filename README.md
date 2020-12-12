# memory-monitor
Consists of three parts. 

    - One kernel module that monitors RAM
    - One Golang APP that reads kernel output
    - UI to present the results.

## compiling
Install 

``sudo apt-get install build-essentials``

``sudo apt-get install libprocps-dev``

To compile and install the kernel modules simply run ``./build.sh``

## Go APP
Create a systemd process to run the go app pertpetually in the server

To run the app just do:

``go run main.go``

and visit:
http://localhost:10000/ui/

For the UI

# AUTHOR
Ricardo Fernandez
200611606

