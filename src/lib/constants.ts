import { CareerTrack, PrizeItem, TimelineStage } from "@/types";

export const TELEGRAM_BOT_USERNAME =
  process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "zamonaviy_kasblarr_bot";

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: "ai-prompt",
    title: "Sun'iy Intellekt va Prompt Engineering",
    shortDesc:
      "Zamonaviy LLM modellar, AI agentlar, avtomatlashtirish tizimlari va neyrotarmoqlar bilan ishlash bo'yicha amaliy ko'nikmalar.",
    icon: "Bot",
    color: "#00f0ff",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    neonBorder: "border-cyan-400/40 hover:border-cyan-400",
    glowColor: "rgba(0, 240, 255, 0.4)",
    tags: ["LLM & GPT-4o", "AI Agents", "Prompt Design", "LangChain", "RAG"],
    skills: ["AI workflow integration", "Autonomous Agents", "Prompt Optimization", "Fine-tuning"],
    careerProspects: "$1,500 - $4,500/oy",
    difficulty: "Yuqori",
    popular: true,
  },
  {
    id: "fullstack-web3",
    title: "Fullstack Dasturlash va Veb 3.0",
    shortDesc:
      "Next.js, TypeScript, yuqori yuklamali arxitekturalar va aqlli shartnomalar (Smart Contracts) integratsiyasi.",
    icon: "Code2",
    color: "#9d4edd",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    neonBorder: "border-purple-400/40 hover:border-purple-400",
    glowColor: "rgba(157, 78, 221, 0.4)",
    tags: ["Next.js 15", "TypeScript", "Node.js", "Web3.js", "Tailwind CSS"],
    skills: ["Fullstack System Design", "Reactive UI", "WebSockets & Microservices", "Decentralized Apps"],
    careerProspects: "$1,800 - $5,000/oy",
    difficulty: "Yuqori",
  },
  {
    id: "cybersecurity",
    title: "Kiberxavfsizlik va Axborot Himoyasi",
    shortDesc:
      "Tizimlar zaifliklarini aniqlash, etik xakerlik (Penetration Testing), shifrlash va kiberhujumlarni qaytarish.",
    icon: "ShieldCheck",
    color: "#06d6a0",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    neonBorder: "border-emerald-400/40 hover:border-emerald-400",
    glowColor: "rgba(6, 214, 160, 0.4)",
    tags: ["Ethical Hacking", "Penetration Testing", "Network Security", "Cryptography", "SOC"],
    skills: ["Vulnerability Assessment", "Zero-day Defense", "Incident Response", "OWASP Top 10"],
    careerProspects: "$2,000 - $6,000/oy",
    difficulty: "Ekspert",
  },
  {
    id: "uiux-3d",
    title: "3D Motion & UI/UX Dizayn",
    shortDesc:
      "Kelajak veb va mobil ilovalari uchun 3D vizuallar, Spline/Three.js interaktiv tajribalari va zamonaviy interfeyslar yaratish.",
    icon: "Palette",
    color: "#f72585",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    neonBorder: "border-pink-400/40 hover:border-pink-400",
    glowColor: "rgba(247, 37, 133, 0.4)",
    tags: ["Figma 3D", "Spline", "Three.js", "Micro-interactions", "Design Systems"],
    skills: ["3D Spatial UI", "Design Systems", "Prototyping", "User Research & Heuristics"],
    careerProspects: "$1,200 - $3,800/oy",
    difficulty: "O'rta",
  },
  {
    id: "datascience",
    title: "Data Science va Sun'iy Idrok Tahlili",
    shortDesc:
      "Katta hajmdagi ma'lumotlarni tahlil qilish, mashinali o'rganish (Machine Learning) va bashorat qiluvchi AI modellar.",
    icon: "BarChart3",
    color: "#ffbe0b",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    neonBorder: "border-amber-400/40 hover:border-amber-400",
    glowColor: "rgba(255, 190, 11, 0.4)",
    tags: ["Python", "Pandas", "PyTorch", "Predictive Analytics", "Data Viz"],
    skills: ["Machine Learning", "Neural Network Architecture", "ETL Pipelines", "Business Intelligence"],
    careerProspects: "$1,600 - $4,800/oy",
    difficulty: "Yuqori",
  },
];

export const PRIZES: PrizeItem[] = [
  {
    place: "1-O'RIN",
    title: "MacBook Pro M-Series / Top Gaming Laptop",
    badge: "Oltin Mukofot",
    icon: "Crown",
    description:
      "Eng so'nggi avlod yuqori unumdorlikdagi noutbuk, Ustoz AI ning 1 yillik shaxsiy granti va rasmiy Oltin Diplom.",
    highlights: [
      "MacBook Pro M-Series (yoki RTX 4080 Gaming Laptop)",
      "Ustoz AI yillik maxsus to'liq granti",
      "Rasmiy g'oliblik kubogi va oltin medali",
      "Xalqaro IT-kompaniyalarda kafolatlangan amaliyot",
    ],
    glowClass: "shadow-neonGold",
    borderClass: "border-amber-400/70 hover:border-amber-300",
    gradient: "from-amber-500/30 via-yellow-500/10 to-transparent",
    featured: true,
  },
  {
    place: "2-O'RIN",
    title: "Zamonaviy Planshet (iPad / Galaxy Tab)",
    badge: "Kumush Mukofot",
    icon: "Award",
    description:
      "Ijod va dasturlash uchun qulay planshet, xalqaro mentorlar bilan 6 oylik yakkama-yakka yo'l-yo'riq va qimmatbaho sovg'alar.",
    highlights: [
      "Apple iPad Air / Samsung Galaxy Tab S9",
      "Ustoz AI 6 oylik maxsus vaucheri",
      "Xalqaro ekspertlardan bepul yakkama-yakka mentorlik",
      "Rasmiy kumush diplom va statuetka",
    ],
    glowClass: "shadow-neonCyan",
    borderClass: "border-cyan-400/60 hover:border-cyan-300",
    gradient: "from-cyan-500/25 via-blue-500/10 to-transparent",
  },
  {
    place: "3-O'RIN",
    title: "Aqlli Gadjetlar & Ustoz AI 100% Grant",
    badge: "Bronza Mukofot",
    icon: "Sparkles",
    description:
      "Yuqori texnologiyali aqlli gadjetlar (Smartwatch, ANC Naushniklar) va Ustoz AI platformasining barcha kurslariga 100% bepul grant.",
    highlights: [
      "Smartwatch (Galaxy Watch / Apple Watch) & ANC naushniklar",
      "Ustoz AI istalgan yo'nalishiga 100% to'liq grant",
      "Maxsus texnologik merchendayz to'plami",
      "Bronza diplom va esdalik nishoni",
    ],
    glowClass: "shadow-neonPurple",
    borderClass: "border-purple-400/60 hover:border-purple-300",
    gradient: "from-purple-500/25 via-pink-500/10 to-transparent",
  },
  {
    place: "BARCHA ISHTIROKCHILAR",
    title: "Rasmiy Sertifikat & Yopiq Hamjamiyat",
    badge: "Universal Bonus",
    icon: "Users",
    description:
      "Har bir faol qatnashchi uchun tasdiqlangan QR-kodli elektron sertifikat va 10,000+ dasturchilar yopiq hamjamiyatiga umrbod a'zolik.",
    highlights: [
      "Tekshirish mumkin bo'lgan raqamli QR-sertifikat",
      "Ustoz AI VIP yopiq IT-klubiga a'zolik",
      "Hamkor kompaniyalarning ish o'rinlari ma'lumotlar bazasi",
      "Eksklyuziv vebinarlar va ochiq darslar",
    ],
    glowClass: "shadow-lg",
    borderClass: "border-blue-400/40 hover:border-blue-400",
    gradient: "from-blue-500/20 via-cyan-500/5 to-transparent",
  },
];

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    step: 1,
    period: "Ayni damda faol",
    title: "Onlayn Ro'yxatdan O'tish va Telegram Tasdiqlash",
    desc: "Veb-sayt orqali ma'lumotlarni to'ldirish, rasmiy Telegram bot orqali 6 xonali kod bilan tasdiqlash va shaxsiy Cyber Ticketni yuklab olish.",
    status: "active",
    badge: "1-Bosqich",
  },
  {
    step: 2,
    period: "Saralash bosqichi",
    title: "Onlayn Sinov Testi & Amaliy Keys Topshiriqlari",
    desc: "Tanlangan yo'nalish bo'yicha interaktiv test sinovlari, mantiqiy vazifalar hamda amaliy keys loyihalarini topshirish.",
    status: "upcoming",
    badge: "2-Bosqich",
  },
  {
    step: 3,
    period: "Grand Final & Taqdirlash",
    title: "Jonli Hackathon & Toshkentdagi Grand Final",
    desc: "Eng yaxshi natija ko'rsatgan 50 nafar iqtidor egasi Toshkentdagi innovatsion markazda bellashadi va tantanali ravishda taqdirlanadi.",
    status: "upcoming",
    badge: "3-Bosqich",
  },
];

export const FAQ_LIST = [
  {
    q: "Tanlovda ishtirok etish mutlaqo bepulmi?",
    a: "Ha, 'Ustoz AI — Zamonaviy Kasblar Tanlovi' barcha ishtirokchilar uchun mutlaqo BEPUL o'tkaziladi. Hech qanday to'lov talab etilmaydi.",
  },
  {
    q: "Telegram bot orqali tasdiqlash nima uchun kerak?",
    a: "Telegram bot orqali tasdiqlash har bir ishtirokchining haqiqiyligini ta'minlash, botlar va spam ro'yxatdan o'tishlarning oldini olish hamda tanlov yangiliklari va test topshiriqlarini xavfsiz yetkazish uchun zarur.",
  },
  {
    q: "Ishtirokchilar yoshi bo'yicha cheklov bormi?",
    a: "Tanlov 14 yoshdan 35 yoshgacha bo'lgan barcha maktab, litsey, kollej o'quvchilari, talabalar va mustaqil o'rganuvchilar uchun ochiq.",
  },
  {
    q: "Bir vaqtning o'zida ikkita yo'nalishda qatnasha olamanmi?",
    a: "Har bir ishtirokchi o'zining eng kuchli salohiyatini ko'rsatishi uchun bitta asosiy yo'nalishni tanlashi tavsiya etiladi.",
  },
  {
    q: "Cyber Ticket nima va undan qanday foydalaniladi?",
    a: "Cyber Ticket — bu sizning raqamli ishtirokchi guvohnomangiz. Unda shaxsiy QR kod va ID raqamingiz mavjud bo'lib, barcha bosqichlarda identifikatsiya vositasi sifatida xizmat qiladi.",
  },
];
