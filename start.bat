@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
title Ustoz AI - Zamonaviy Kasblar Tanlovi
echo ========================================================
echo   Ustoz AI - Zamonaviy Kasblar Tanlovi (Platforma)
echo   Web-sayt: http://localhost:3000
echo ========================================================

:: 3000-portni band qilib turgan eski jarayon bo'lsa tozalash (EADDRINUSE oldini olish)
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :3000 ^| findstr LISTENING') do (
  taskkill /f /pid %%a >nul 2>&1
)

npm run dev
pause
