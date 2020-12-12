# memory-monitor
Consists of three parts. 

    - One kernel module that monitors RAM
    - One Golang APP that reads kernel output
    - UI to present the results.

## compiling
To compile and install the kernel module simply run ``./build.sh``

## Go APP
Create a systemd process to run the go app pertpetually in the server

