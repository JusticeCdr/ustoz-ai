@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
title Ustoz AI - Barcha Xizmatlarni Ishga Tushirish
echo ========================================================
echo   Ustoz AI: Web-sayt va Telegram Bot ishga tushirilmoqda
echo ========================================================

start "Ustoz AI Web Sayt" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"
start "Ustoz AI Telegram Bot" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && npm run bot"

echo.
echo Ikkala xizmat ham alohida oynalarda muvaffaqiyatli ishga tushirildi!
echo Web sayt: http://localhost:3000
echo Telegram Bot: @zamonaviy_kasblarr_bot
echo.
timeout /t 5
