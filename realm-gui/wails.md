go install github.com/wailsapp/wails/v2/cmd/wails@latest
wails init -n realm -t react-ts
wails dev 
wails build -tags webkit2_41
sudo apt install libwebkit