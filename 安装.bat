@echo off
chcp 65001 >nul
title DSH 定制环境一键安装
echo.
echo  ==============================================
echo    DeepSeek Harness 定制环境 一键安装
echo  ==============================================
echo.
echo  正在解压安装包...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%~dp0DSH-Setup.zip' -DestinationPath '%TEMP%\dsh-setup' -Force" >nul 2>&1
if not exist "%TEMP%\dsh-setup\install.ps1" (
  echo  解压失败，请确认 DSH-Setup.zip 与本文件在同一目录
  pause
  exit /b 1
)
echo  正在安装（插件/技能/预设/文件）...
powershell -NoProfile -ExecutionPolicy Bypass -File "%TEMP%\dsh-setup\install.ps1"
rd /s /q "%TEMP%\dsh-setup" >nul 2>&1
echo.
echo  安装过程结束，按任意键关闭窗口...
pause >nul
