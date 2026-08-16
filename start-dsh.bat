@echo off
title DeepSeek Harness
rem Launch DeepSeek Harness as a standalone app window (Edge --app mode).
rem D drive only; starts the dsh web service if it is not already running.

set "DSH_CMD=D:\deepseek\dsh.cmd"
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "APPURL=http://127.0.0.1:3080"
set "APPDATA_DIR=D:\deepskhaness\.dsh-app-profile"

netstat -ano | findstr ":3080" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 goto open

echo Starting DeepSeek Harness service...
start "DSH-Service" /min cmd /c ""%DSH_CMD%" web"

:wait
timeout /t 2 /nobreak >nul
netstat -ano | findstr ":3080" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 goto wait

:open
if not exist "%APPDATA_DIR%" mkdir "%APPDATA_DIR%"
start "" "%EDGE%" --app="%APPURL%" --user-data-dir="%APPDATA_DIR%" --no-first-run --no-default-browser-check
exit /b 0
