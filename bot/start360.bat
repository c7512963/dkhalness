@echo off
chcp 65001 >nul
echo 正在关闭所有 360 浏览器进程（登录态不受影响）...
taskkill /F /IM 360ChromeX.exe /T >nul 2>&1
taskkill /F /IM 360chrome.exe /T >nul 2>&1
timeout /t 3 /nobreak >nul
echo 以调试模式启动 360 浏览器，请在弹出的窗口里打开 BOSS 直聘...
start "" "C:\Users\admin\AppData\Local\360ChromeX\Chrome\Application\360ChromeX.exe" --remote-debugging-port=9222
echo 完成。
