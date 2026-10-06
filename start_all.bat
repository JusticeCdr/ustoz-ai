@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
title Ustoz AI - Barcha Xizmatlarni Ishga Tushirish
echo ========================================================
echo   Ustoz AI: Web-sayt va Telegram Bot ishga tushirilmoqda
echo ========================================================

:: 3000-portni band qilib turgan eski jarayon bo'lsa tozalash
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :3000 ^| findstr LISTENING') do (
  taskkill /f /pid %%a >nul 2>&1
)

start "Ustoz AI Web Sayt" "%~dp0start.bat"
start "Ustoz AI Telegram Bot" "%~dp0start_bot.bat"

echo.
echo Ikkala xizmat ham alohida oynalarda muvaffaqiyatli ishga tushirildi!
echo Web sayt: http://localhost:3000
echo Telegram Bot: @zamonaviy_kasblarr_bot
echo.
pause
