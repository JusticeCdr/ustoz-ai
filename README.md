# 🚀 "Ustoz AI" — Zamonaviy Kasblar Tanlovi (Futuristic 3D Platform)

> **Platforma:** Zamonaviy Kasblar Tanlovi 2026  
> **Tashkilotchi:** Ustoz AI  
> **Domen / Port:** `http://localhost:3000`  
> **Telegram Bot:** [@zamonaviy_kasblarr_bot](https://t.me/zamonaviy_kasblarr_bot) (Token: `8671700223:AAFd10S_b6giHZszE9oezJas4yHQYwFeTac`)

---

## 🌌 Loyiha Haqida

Ushbu platforma **"Ustoz AI"** tomonidan o'tkazilayotgan **"Zamonaviy Kasblar Tanlovi"** uchun yaratilgan premium, futuristik 3D veb-platformadir.

Loyiha quyidagi asosiy xususiyatlarni o'z ichiga oladi:
- **Interaktiv 3D Hero Markazi:** Three.js va Canvas asosidagi kvant yadrosi, aylanuvchi orbital halqalar, uchuvchi cyber zarrachalar maydoni hamda sichqoncha va mobil giroskop harakatiga sezgir 3D effektlar.
- **Neon / Glassmorphism Dizayn:** Yuqori darajadagi kiberpank estetika, blur effektlari, neon nurlanishlar va silliq mikromotsiyalar.
- **5 ta Zamonaviy Yo'nalish:**
  1. 🤖 Sun'iy Intellekt va Prompt Engineering
  2. 💻 Fullstack Dasturlash va Veb 3.0
  3. 🛡️ Kiberxavfsizlik va Axborot Himoyasi
  4. 🎨 3D Motion & UI/UX Dizayn
  5. 📊 Data Science va Sun'iy Idrok Tahlili
- **100,000,000+ UZS Sovrinlar Jamg'armasi:** MacBook Pro, iPad Pro, aqlli gadjetlar, 100% grantlar va barcha ishtirokchilar uchun tasdiqlangan elektron sertifikatlar.
- **Telegram Bot bilan Xavfsiz Ko'p Bosqichli Integratsiya:**
  1. Anketani to'ldirish (Ism, telefon, yo'nalish).
  2. Telegram deep link (`t.me/zamonaviy_kasblarr_bot?start=CODE`) va dinamik QR-kod orqali tasdiqlash.
  3. Bot orqali kelgan 6 xonali dinamik parolni kiritish (OTP).
  4. Holografik **Cyber Ticket** va shaxsiy ishtirokchi guvohnomasini qo'lga kiritish hamda yuklab olish.

---

## 📁 Loyiha Tuzilmasi (Folder Structure)

```
zamonaviy-kasblar-tanlovi/
├── data/
│   └── sessions.json                # Ro'yxatdan o'tish seanslari va OTP saqlanadigan baza
├── scripts/
│   ├── run-bot.ts                   # Telegram Bot long-polling daemon servisi
│   └── test-flow.ts                 # End-to-end tekshiruv va test skripti
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bot/
│   │   │   │   └── route.ts         # Telegram Webhook & bot status handler
│   │   │   └── register/
│   │   │       ├── initiate/
│   │   │       │   └── route.ts     # Ro'yxatdan o'tishni boshlash (seans kodi & deep link)
│   │   │       ├── status/
│   │   │       │   └── route.ts     # Seans holatini polling orqali tekshirish
│   │   │       └── verify/
│   │   │           └── route.ts     # OTP tekshirish & Cyber Ticket berish
│   │   ├── globals.css              # Cyber neon uslublar, scanline va gridlar
│   │   ├── layout.tsx               # Asosiy SEO metadata va qobiq
│   │   └── page.tsx                 # Asosiy sahifa (Hero, Tracks, Prizes, Timeline, FAQ)
│   ├── components/
│   │   ├── FAQSection.tsx           # Savol-javoblar bo'limi
│   │   ├── Footer.tsx               # Platforma footeri
│   │   ├── Hero3D.tsx               # Interaktiv 3D Three.js qahramon bo'limi
│   │   ├── Navbar.tsx               # Navigatsiya va tezkor tugmalar
│   │   ├── PrizesSection.tsx        # Sovrinlar jamg'armasi kartalari
│   │   ├── RegistrationModal.tsx    # 4 bosqichli ro'yxatdan o'tish & OTP oynasi
│   │   ├── TimelineSection.tsx      # Tanlov bosqichlari xaritasi
│   │   └── TracksSection.tsx        # 3D Tilt yo'nalishlar kartalari
│   ├── lib/
│   │   ├── constants.ts             # Ma'lumotlar (yo'nalishlar, sovrinlar, bosqichlar)
│   │   ├── store.ts                 # Seanslar, OTP va qatnashchilar boshqaruvi
│   │   └── telegram.ts              # Telegram Bot API chaqiruvlari va xabarlar
│   └── types/
│       └── index.ts                 # TypeScript modellar
├── .env.local                       # Bot tokeni va konfiguratsiya
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🛠️ O'rnatish va Ishga Tushirish

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Loyihani ishlab chiqish rejimida ishga tushirish (Dev Server)
```bash
npm run dev
```
Sayt: `http://localhost:3000`

### 3. Telegram Bot servisini ishga tushirish (Long Polling Daemon)
Alohida terminal oynasida:
```bash
npm run bot
```
Bot darhol `@zamonaviy_kasblarr_bot` bilan bog'lanadi va foydalanuvchilar yuborgan `/start <code>` buyruqlarini qabul qilib, ularga 6 xonali tasdiqlash parolini yo'llaydi.

### 4. Ishlab chiqarish rejimida build qilish va ishga tushirish
```bash
npm run build
npm start
```

---

## 🤖 Telegram Bot Integratsiyasi Qanday Ishlaydi?

1. **Veb-saytda anketani to'ldirish:**
   Foydalanuvchi ism-familiyasi, telefon raqami va tanlov yo'nalishini tanlaydi. Sayt `/api/register/initiate` endpointiga murojaat qilib, 6 ta belgidan iborat noyob `sessionCode` generatsiya qiladi.

2. **Telegram botga ulanish:**
   Saytda foydalanuvchiga to'g'ridan-to'g'ri `https://t.me/zamonaviy_kasblarr_bot?start=<code>` havolasi va yuqori aniqlikdagi QR-kod ko'rsatiladi.

3. **Telegram orqali parolni olish:**
   Foydalanuvchi Telegramda «START» tugmasini bosganda, bot xabarni qabul qiladi, 6 xonali xavfsiz OTP parol generatsiya qiladi va uni ishtirokchiga chiroyli kiberpank xabar ko'rinishida yuboradi.

4. **OTP kiritish va tasdiqlash:**
   Foydalanuvchi veb-saytga ushbu 6 xonali parolni kiritadi. `/api/register/verify` parolni tekshiradi, ishtirokchiga rasmiy `UZ-AI-2026-XXXX` seriya raqamini beradi va Telegramga tasdiqlovchi tabrik xabarini yo'llaydi.

5. **Cyber Ticket:**
   Saytda mushaklar (confetti) otiladi va ishtirokchi shaxsiy holografik **Cyber Ticket** guvohnomasini saqlab olish / chop etish imkoniyatiga ega bo'ladi.
