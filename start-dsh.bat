@echo off
title DeepSeek Harness Launcher
rem Start DSH web profile (D drive only) and open the browser.
rem If DSH is already running on port 3080, just open the browser.

set "DSH_CMD=D:\deepseek\dsh.cmd"

netstat -ano | findstr ":3080" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 goto open

echo Starting DeepSeek Harness...
start "DSH" /min cmd /c ""%DSH_CMD%" web"

:wait
timeout /t 2 /nobreak >nul
netstat -ano | findstr ":3080" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 goto wait

:open
echo Opening http://127.0.0.1:3080
start "" "http://127.0.0.1:3080"
exit /b 0
