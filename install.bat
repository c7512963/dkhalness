@echo off
title DSH Custom Environment Setup
echo.
echo ==============================================
echo   DeepSeek Harness Custom Environment Setup
echo ==============================================
echo.
echo [1/2] Extracting package...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%~dp0DSH-Setup.zip' -DestinationPath '%TEMP%\dsh-setup' -Force" >nul 2>&1
if not exist "%TEMP%\dsh-setup\install.ps1" (
  echo Extract failed - make sure DSH-Setup.zip is in the same folder as this file.
  pause
  exit /b 1
)
echo [2/2] Installing to D:\deepskhaness (C drive untouched)...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\dsh-setup\install.ps1"
rd /s /q "%TEMP%\dsh-setup" >nul 2>&1
echo.
echo Done. Press any key to close...
pause >nul
