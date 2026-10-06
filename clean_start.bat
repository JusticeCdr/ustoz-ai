@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
title Ustoz AI - Keshlarni Tozalash va Qayta Ishga Tushirish
echo ========================================================
echo   Ustoz AI: Keshlar tozalanmoqda va qayta ishga tushirilmoqda...
echo ========================================================

:: 3000-portni tozalash
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :3000 ^| findstr LISTENING') do (
  taskkill /f /pid %%a >nul 2>&1
)

:: .next kesh papkasini tozalash
if exist ".next" (
  echo .next kesh papkasi tozalanmoqda...
  rmdir /s /q ".next"
)

echo Kesh muvaffaqiyatli tozalandi!
echo Server ishga tushmoqda...
npm run dev
pause
