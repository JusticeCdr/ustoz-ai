import { CareerTrackId } from "@/types";

export interface LessonItem {
  id: string;
  number: number;
  title: string;
  duration: string;
  durationSeconds: number;
  level: "Boshlang'ich" | "O'rta" | "Yuqori";
  xpReward: number;
  mentor: string;
  summary: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyTakeaways: string[];
  aiFaq: { q: string; a: string }[];
}

export interface CourseTrackData {
  trackId: CareerTrackId;
  title: string;
  shortDesc: string;
  accentColor: string;
  glowColor: string;
  gradient: string;
  totalDuration: string;
  lessonsCount: number;
  lessons: LessonItem[];
}

export const COURSES_DATA: Record<CareerTrackId, CourseTrackData> = {
  "ai-prompt": {
    trackId: "ai-prompt",
    title: "Sun'iy Intellekt va Prompt Engineering",
    shortDesc: "Zamonaviy LLM modellar, AI agentlar, avtomatlashtirish tizimlari va neyrotarmoqlar bilan ishlash bo'yicha amaliy video-kurslar.",
    accentColor: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.5)",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    totalDuration: "2 soat 20 daqiqa",
    lessonsCount: 5,
    lessons: [
      {
        id: "ai-1",
        number: 1,
        title: "Katta Til Modellari (LLM) Qanday Ishlaydi?",
        duration: "16:40",
        durationSeconds: 1000,
        level: "Boshlang'ich",
        xpReward: 50,
        mentor: "Ustoz AI Neyron Yadrosi",
        summary: "Transformer arxitekturasi, tokenizatsiya mexanizmi va sun'iy idrok qanday qilib inson tilini tushunishi hamda generatsiya qilishi haqida fundamental tushunchalar.",
        codeLanguage: "python",
        codeSnippet: `# LLM Tokenizatsiya va Embedding misoli
import tiktoken

encoder = tiktoken.get_encoding("cl100k_base")
matn = "Ustoz AI — Zamonaviy Kasblar Tanlovi 2026"
tokenlar = encoder.encode(matn)

print(f"Tokenlar soni: {len(tokenlar)}")
print(f"Vektor IDlari: {tokenlar}")`,
        keyTakeaways: [
          "LLMlar so'zlarni emas, balki raqamli tokenlarni (vektorlar) tahlil qiladi",
          "Attention (Diqqat) mexanizmi kontekstdagi har bir so'zning ahamiyatini belgilaydi",
          "Harorat (Temperature) parametri javobning ijodiyligi va aniqligini nazorat qiladi",
        ],
        aiFaq: [
          {
            q: "Token nima va u qanday hisoblanadi?",
            a: "Token — bu so'z yoki so'zning bir bo'lagi. O'rtacha 1 ta inglizcha so'z 1-2 tokenni, o'zbek tilidagi so'zlar esa o'rtacha 2-3 tokenni tashkil etadi.",
          },
          {
            q: "Harorat (Temperature) 0 bo'lsa nima sodir bo'ladi?",
            a: "Harorat 0 bo'lganda, model har doim eng yuqori ehtimolli, qat'iy va mantiqiy javobni beradi. Ijodiylik nolga teng bo'ladi.",
          },
        ],
      },
      {
        id: "ai-2",
        number: 2,
        title: "Mukammal Prompt Arxitekturasi: Zero-Shot, Few-Shot va CoT",
        duration: "22:15",
        durationSeconds: 1335,
        level: "O'rta",
        xpReward: 60,
        mentor: "Senior Prompt Architect",
        summary: "Prompt Engineeringning oltin qoidalari: Tizim roli (System Role), cheklovlar, kontekst inyektsiyasi va Chain-of-Thought (Fikr zanjiri) orqali AI javoblar sifatini 10x oshirish.",
        codeLanguage: "markdown",
        codeSnippet: `### Mukammal Prompt Shaboni:
[ROLE]: Sen tajribali Kiberxavfsizlik Arxitektorisan.
[CONTEXT]: Yangi fintech startapi uchun autentifikatsiya tizimi qurilmoqda.
[TASK]: 2 bosqichli OTP himoyasi bo'yicha xavfsizlik arxitekturasini tuzib ber.
[CONSTRAINTS]: Faqat eng so'nggi OWASP standartlariga tayansin, tushuntirish o'zbek tilida bo'lsin.
[FORMAT]: 1) Xavflar, 2) Arxitektura diagrammasi, 3) Amaliy tavsiyalar.`,
        keyTakeaways: [
          "Kontekst qanchalik boy bo'lsa, AI shunchalik aniq natija beradi",
          "Few-Shot prompting orqali modelga 2-3 ta namunaviy misol ko'rsatish aniqlikni 85% ga oshiradi",
          "Chain-of-Thought murakkab mantiqiy masalalarda xatoliklarni bartaraf qiladi",
        ],
        aiFaq: [
          {
            q: "Nega oddiy promptdan ko'ra rolli prompt yaxshi ishlaydi?",
            a: "Modelga aniq rol berilganda, u o'zining milliardlab parametrlaridan aynan o'sha sohaga oid neyron assotsiatsiyalarni faollashtiradi.",
          },
        ],
      },
      {
        id: "ai-3",
        number: 3,
        title: "Avtonom AI Agentlar va LangChain Integratsiyasi",
        duration: "28:30",
        durationSeconds: 1710,
        level: "Yuqori",
        xpReward: 75,
        mentor: "Lead AI Engineer",
        summary: "Faqat savol-javob emas, balki mustaqil ravishda internetdan qidiruvchi, fayllarni tahlil qiluvchi va APIlarni chaqiruvchi avtonom AI agentlarni qurish amaliyoti.",
        codeLanguage: "python",
        codeSnippet: `from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(temperature=0, model="gpt-4o")
tools = [
    Tool(
        name="Veb Qidiruv",
        func=search_web,
        description="Internetdan so'nggi IT yangiliklarni qidirish uchun"
    )
]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description")
agent.run("2026 yilgi eng talabgir 3 ta zamonaviy kasbni aniqla va tahlil qil.")`,
        keyTakeaways: [
          "AI Agentlar faqat til modeli emas, ular tashqi asboblar (tools) bilan ishlay oladi",
          "ReAct (Reason + Act) sikli agentga rejalashtirish va xatolarni to'g'irlash imkonini beradi",
          "LangChain va LlamaIndex orqali korporativ AI tizimlar yaratiladi",
        ],
        aiFaq: [
          {
            q: "Agent bilan oddiy chatbotning farqi nimada?",
            a: "Chatbot faqat oldindan o'rgatilgan matnni generatsiya qiladi. Agent esa maqsad qo'yib, mustaqil ravishda qadamlar rejasini tuzadi va asboblardan foydalanadi.",
          },
        ],
      },
      {
        id: "ai-4",
        number: 4,
        title: "RAG Tizimlari: Shaxsiy Hujjatlar Bazasini AI ga Bog'lash",
        duration: "32:00",
        durationSeconds: 1920,
        level: "Yuqori",
        xpReward: 80,
        mentor: "AI Research Scientist",
        summary: "Kompaniya yoki shaxsiy PDF/hujjatlar to'plamini Pinecone/Chroma vektor bazasiga saqlab, LLM bilan qidirish va gallyutsinatsiyasiz xulosalar olish.",
        codeLanguage: "python",
        codeSnippet: `from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

# Hujjatlarni vektorlarga aylantirish va saqlash
embeddings = OpenAIEmbeddings()
db = Chroma.from_documents(documents, embeddings)

# Semantik qidiruv orqali kontekst topish
query = "Tanlov g'oliblari qanday taqdirlanadi?"
relevant_docs = db.similarity_search(query, k=3)`,
        keyTakeaways: [
          "RAG (Retrieval-Augmented Generation) modelni qayta o'qitmasdan (fine-tuning) yangi ma'lumot beradi",
          "Vektorli ma'lumotlar bazasi matnlarning ma'nosini ko'p o'lchamli fazoda saqlaydi",
          "Gallyutsinatsiya (yolg'on to'qish) xavfini 90% ga kamaytiradi",
        ],
        aiFaq: [
          {
            q: "Nega Fine-tuning emas, RAG tanlanadi?",
            a: "RAG ancha arzon, tezkor va hujjatlar o'zgarganda bir zumda yangilanishi mumkin. Fine-tuning esa faqat model uslubi va ohangini o'zgartirish uchun qulay.",
          },
        ],
      },
      {
        id: "ai-5",
        number: 5,
        title: "Final Masterclass: Telegram AI Assistentini Ishga Tushirish",
        duration: "35:10",
        durationSeconds: 2110,
        level: "Yuqori",
        xpReward: 100,
        mentor: "Ustoz AI Asoschisi",
        summary: "To'liq siklda ishlovchi real Telegram boti: ovozli xabarlarni Whisper orqali matnga o'girish, GPT-4o bilan javob tayyorlash va foydalanuvchilar bilan jonli muloqot.",
        codeLanguage: "typescript",
        codeSnippet: `import { Telegraf } from "telegraf";
import { OpenAI } from "openai";

const bot = new Telegraf(process.env.BOT_TOKEN!);
const openai = new OpenAI();

bot.on("text", async (ctx) => {
  const reply = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Sen Ustoz AI aqlli mentorisan." },
      { role: "user", content: ctx.message.text }
    ]
  });
  await ctx.reply(reply.choices[0].message.content || "");
});

bot.launch();`,
        keyTakeaways: [
          "Node.js va Python orqali yuqori yuklamali AI botlarni boshqarish usullari",
          "Ovozli va matnli xabarlar bilan ko'p modalli (multimodal) muloqot",
          "Vercel va Cloudflare serverless infratuzilmasida deploy qilish",
        ],
        aiFaq: [
          {
            q: "Telegram botda ovozli xabarlarni qanday tahlil qilish mumkin?",
            a: "OpenAI Whisper API orqali ovozli audio faylni tezkorlik bilan o'zbek yoki ingliz tilidagi matnga aylantirish va keyin LLMga yuborish mumkin.",
          },
        ],
      },
    ],
  },
  "fullstack-web3": {
    trackId: "fullstack-web3",
    title: "Fullstack Dasturlash va Veb 3.0",
    shortDesc: "Next.js 15, TypeScript, yuqori yuklamali backend va aqlli shartnomalar (Smart Contracts) integratsiyasi.",
    accentColor: "#9d4edd",
    glowColor: "rgba(157, 78, 221, 0.5)",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    totalDuration: "2 soat 40 daqiqa",
    lessonsCount: 5,
    lessons: [
      {
        id: "fs-1",
        number: 1,
        title: "Zamonaviy Fullstack Arxitekturasi: Next.js 15 va App Router",
        duration: "18:20",
        durationSeconds: 1100,
        level: "Boshlang'ich",
        xpReward: 50,
        mentor: "Senior Fullstack Engineer",
        summary: "Server Components (RSC), Client Components chegarasi, SEO optimizatsiyasi va yashin tezligidagi dastlabki sahifa yuklanishi sirlari.",
        codeLanguage: "typescript",
        codeSnippet: `// Next.js Server Component misoli
export default async function CyberDashboard() {
  const data = await fetch("https://api.ustoz.uz/stats", {
    next: { revalidate: 60 }
  }).then(r => r.json());

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.stats.map(item => (
        <Card key={item.id} title={item.label} value={item.count} />
      ))}
    </div>
  );
}`,
        keyTakeaways: [
          "Server Components brauzerga nol kilobayt JavaScript jo'natadi",
          "Streaming va Suspense orqali ma'lumotlar kelishi bilanoq UI chiziladi",
          "SEO va Core Web Vitals ko'rsatkichlari eng yuqori darajada ta'minlanadi",
        ],
        aiFaq: [
          {
            q: "Qachon 'use client' ishlatish kerak?",
            a: "Faqat useState, useEffect, onClick yoki brauzer APIlari kerak bo'lgandagina 'use client' qo'shiladi. Qolgan barcha holatda Server Component bo'lib qolgani ma'qul.",
          },
        ],
      },
      {
        id: "fs-2",
        number: 2,
        title: "TypeScript Professional Arxitekturasi va Clean Code",
        duration: "24:10",
        durationSeconds: 1450,
        level: "O'rta",
        xpReward: 60,
        mentor: "Tech Lead",
        summary: "Generics, Discriminated Unions, Zod validatsiyasi va xatoliklarni kompilyatsiya bosqichidayoq to'liq yo'q qilish san'ati.",
        codeLanguage: "typescript",
        codeSnippet: `import { z } from "zod";

export const ParticipantSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^\\+998\\d{9}$/),
  trackId: z.enum(["ai-prompt", "fullstack-web3", "cybersecurity"]),
});

export type Participant = z.infer<typeof ParticipantSchema>;`,
        keyTakeaways: [
          "Type-safety orqali dasturdagi 80% gacha bo'lgan 'undefined' xatoliklari oldi olinadi",
          "Zod orqali frontend va backend o'rtasidagi ma'lumotlar oqimi to'liq tekshiriladi",
        ],
        aiFaq: [
          {
            q: "Zod validatsiyasining asosiy afzalligi nima?",
            a: "Zod bir vaqtning o'zida ham TypeScript turini, ham ish vaqtidagi (runtime) ma'lumotlar to'g'riligini tekshirib beradi.",
          },
        ],
      },
      {
        id: "fs-3",
        number: 3,
        title: "Server Actions, PostgreSQL va Prisma ORM Integratsiyasi",
        duration: "26:45",
        durationSeconds: 1605,
        level: "Yuqori",
        xpReward: 75,
        mentor: "Database Architect",
        summary: "REST API yozmasdan to'g'ridan-to'g'ri forma va ma'lumotlar bazasi o'rtasida xavfsiz transaktsiyalar o'tkazish.",
        codeLanguage: "typescript",
        codeSnippet: `"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function registerCandidate(formData: FormData) {
  const phone = formData.get("phone") as string;
  await prisma.user.create({ data: { phone, verified: true } });
  revalidatePath("/leaderboard");
}`,
        keyTakeaways: [
          "Server Actions API endpointlar yozish zaruratini bekor qiladi",
          "Prisma ORM SQL inyektsiyalaridan avtomatik himoyalaydi",
        ],
        aiFaq: [
          {
            q: "Server Actions xavfsizmi?",
            a: "Ha, chunki bu kod faqat serverda ishlaydi va uning kodi hech qachon brauzerga jo'natilmaydi.",
          },
        ],
      },
      {
        id: "fs-4",
        number: 4,
        title: "Web3 va Smart Contracts: Blokcheynga Ulanish",
        duration: "30:20",
        durationSeconds: 1820,
        level: "Yuqori",
        xpReward: 85,
        mentor: "Web3 Core Developer",
        summary: "Ethers.js, Wagmi va RainbowKit orqali Ethereum/Polygon tarmog'idagi aqlli shartnomalar bilan muloqot qilish va NFT Cyber Pass yaratish.",
        codeLanguage: "javascript",
        codeSnippet: `import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

const blockNumber = await client.getBlockNumber();
console.log("Joriy blok raqami:", blockNumber);`,
        keyTakeaways: [
          "Markazlashmagan ilovalar (dApps) foydalanuvchi ma'lumotlarini serverda emas, blokcheynda saqlaydi",
          "Aqlli shartnomalar vositachilarsiz shaffof va o'zgarmas bitimlarni kafolatlaydi",
        ],
        aiFaq: [
          {
            q: "Web3 ilovalarida foydalanuvchi qanday autentifikatsiya qilinadi?",
            a: "Parol o'rniga kriptografik hamyon (masalan, MetaMask) orqali raqamli imzo qo'yish bilan shaxs tasdiqlanadi.",
          },
        ],
      },
      {
        id: "fs-5",
        number: 5,
        title: "Production Deploy: Docker, Redis va Vercel CI/CD",
        duration: "25:30",
        durationSeconds: 1530,
        level: "Yuqori",
        xpReward: 100,
        mentor: "DevOps Lead",
        summary: "Katta yuklamaga chidamli platformalarni xalqaro bulutli serverlarga chiqarish, keshlash va monitoring.",
        codeLanguage: "dockerfile",
        codeSnippet: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "server.js"]`,
        keyTakeaways: [
          "Redis orqali so'rovlar tezligini 100 barobargacha oshirish mumkin",
          "Avtomatlashtirilgan CI/CD quvurlari xatosiz relizlarni ta'minlaydi",
        ],
        aiFaq: [
          {
            q: "Nega Redis keshlash uchun kerak?",
            a: "Redis xotirada (RAM) ishlagani sababli ma'lumotlarni 1 millisekunddan kamroq vaqtda qaytaradi.",
          },
        ],
      },
    ],
  },
  "cybersecurity": {
    trackId: "cybersecurity",
    title: "Kiberxavfsizlik va Axborot Himoyasi",
    shortDesc: "Tizimlar zaifliklarini aniqlash, etik xakerlik (Penetration Testing), shifrlash va kiberhujumlarni qaytarish.",
    accentColor: "#06d6a0",
    glowColor: "rgba(6, 214, 160, 0.5)",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    totalDuration: "2 soat 35 daqiqa",
    lessonsCount: 5,
    lessons: [
      {
        id: "sec-1",
        number: 1,
        title: "Kiber-Xavfsizlik Asoslari va Hujumlar Anatomiyasi",
        duration: "19:10",
        durationSeconds: 1150,
        level: "Boshlang'ich",
        xpReward: 50,
        mentor: "Chief Information Security Officer",
        summary: "CIA Triad (Maxfiylik, Butunlik, Foydalana olishlik), tahdidlar xaritasi va zamonaviy ijtimoiy muhandislik (phishing) xatarlari.",
        codeLanguage: "bash",
        codeSnippet: `# Tarmoq portlarini skanerlash (Nmap xavfsizlik auditi)
nmap -sS -sV -T4 192.168.1.1/24 -p 22,80,443,3000,8080`,
        keyTakeaways: [
          "Eng katta xavfsizlik zaifligi ko'pincha inson omili (ijtimoiy muhandislik) hisoblanadi",
          "Zero Trust tamoyili: Hech kimga ishonma, har bir so'rovni tekshir",
        ],
        aiFaq: [
          {
            q: "CIA triadasi nima?",
            a: "Confidentiality (Maxfiylik), Integrity (Butunlik) va Availability (Foydalanish imkoniyati) — axborot xavfsizligining 3 asosiy ustuni.",
          },
        ],
      },
      {
        id: "sec-2",
        number: 2,
        title: "Etik Xakerlik: Zaifliklarni Aniqlash va Tarmoq Tahlili",
        duration: "26:00",
        durationSeconds: 1560,
        level: "O'rta",
        xpReward: 65,
        mentor: "Senior Penetration Tester",
        summary: "Kali Linux vositalari, Wireshark trafigi tahlili va serverdagi ochiq orqa eshiklarni (backdoors) yopish amaliyoti.",
        codeLanguage: "bash",
        codeSnippet: `# Wireshark / Tshark orqali HTTP paketlarni tahlil qilish
tshark -i eth0 -Y "http.request.method == POST" -T fields -e http.file_data`,
        keyTakeaways: [
          "Ochiq tarmoq trafigi shifrlanmagan bo'lsa, parollar o'g'irlanishi mumkin",
          "Xavfsizlik mutaxassisi har doim qonuniy va ruxsat berilgan doirada ishlaydi",
        ],
        aiFaq: [
          {
            q: "Penetration testing nima?",
            a: "Tizimning xavfsizlik darajasini baholash uchun ruxsat bilan uyushtirilgan simulyatsion kiberhujum jarayoni.",
          },
        ],
      },
      {
        id: "sec-3",
        number: 3,
        title: "OWASP Top 10: Veb Zaifliklarni Yopish (SQLi, XSS, CSRF)",
        duration: "30:40",
        durationSeconds: 1840,
        level: "Yuqori",
        xpReward: 80,
        mentor: "AppSec Engineer",
        summary: "Dunyodagi eng keng tarqalgan 10 ta veb zaiflikni amalda ko'rish va ularni kod darajasida bartaraf qilish.",
        codeLanguage: "typescript",
        codeSnippet: `// XATOLI (Zaif SQL):
const query = \`SELECT * FROM users WHERE user='\${input}'\`;

// TO'G'RI (Parametrlangan xavfsiz SQL):
const result = await db.query(
  "SELECT * FROM users WHERE user = $1", [input]
);`,
        keyTakeaways: [
          "Foydalanuvchi kiritgan har qanday ma'lumot xavfli hisoblanadi va tozalanadi",
          "Sanitization va CSP (Content Security Policy) XSS xavfini yo'q qiladi",
        ],
        aiFaq: [
          {
            q: "SQL Injection qanday yuz beradi?",
            a: "Foydalanuvchi ma'lumotlar maydoniga maxsus SQL kod yozganda va tizim uni tekshirmasdan bazaga yuborganda ma'lumotlar sizib chiqadi.",
          },
        ],
      },
      {
        id: "sec-4",
        number: 4,
        title: "Kriptografiya: Shifrlash, Hash va Raqamli Imzolar",
        duration: "24:50",
        durationSeconds: 1490,
        level: "Yuqori",
        xpReward: 85,
        mentor: "Cryptography Specialist",
        summary: "Simmetrik (AES-256) va asimmetrik (RSA, ECC) shifrlash, bcrypt parollar xavfsizligi va SSL/TLS sertifikatlari.",
        codeLanguage: "typescript",
        codeSnippet: `import bcrypt from "bcrypt";

// Parolni xavfsiz hash qilish (Hech qachon ochiq saqlanmaydi)
const saltRounds = 12;
const passwordHash = await bcrypt.hash("UserSecretPass@2026", saltRounds);

const isMatch = await bcrypt.compare("UserSecretPass@2026", passwordHash);`,
        keyTakeaways: [
          "Parollar hech qachon shifrlanmaydi — ular bir tomonlama hash qilinadi",
          "Asimmetrik kriptografiya ochiq va yopiq kalitlar juftligiga asoslangan",
        ],
        aiFaq: [
          {
            q: "Hash bilan Shifrlashning farqi nima?",
            a: "Shifrlangan ma'lumotni kalit orqali qaytarib o'qish mumkin. Hash esa bir tomonlama — uni orqaga qaytarib bo'lmaydi.",
          },
        ],
      },
      {
        id: "sec-5",
        number: 5,
        title: "SOC va Incident Response: Kiberhujumlarni Jonli Qaytarish",
        duration: "33:00",
        durationSeconds: 1980,
        level: "Yuqori",
        xpReward: 100,
        mentor: "Cyber Defense Director",
        summary: "SIEM tizimlari, loglarni kuzatish va DDoS yoki ransomware xavfi yuz berganda favqulodda harakatlar protokoli.",
        codeLanguage: "bash",
        codeSnippet: `# Shubhali IP-manzildan kiruvchi barcha trafigi bloklash
iptables -A INPUT -s 198.51.100.42 -j DROP
fail2ban-client set sshd banip 198.51.100.42`,
        keyTakeaways: [
          "Hujumni erta aniqlash uning keltiradigan zararini 95% ga kamaytiradi",
          "Zaxira nusxalar (backups) kiber-xavfsizlikning eng so'nggi najot qalqonidir",
        ],
        aiFaq: [
          {
            q: "SOC (Security Operations Center) nima vazifani bajaradi?",
            a: "Tashkilot tizimlarini 24/7 rejimida kuzatuvchi, kiber-hujumlarni aniqlovchi va ularni bartaraf etuvchi mutaxassislar guruhi.",
          },
        ],
      },
    ],
  },
  "uiux-3d": {
    trackId: "uiux-3d",
    title: "3D Motion & UI/UX Dizayn",
    shortDesc: "Kelajak veb va mobil ilovalari uchun 3D vizuallar, Spline/Three.js interaktiv tajribalari va zamonaviy interfeyslar yaratish.",
    accentColor: "#f72585",
    glowColor: "rgba(247, 37, 133, 0.5)",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    totalDuration: "2 soat 25 daqiqa",
    lessonsCount: 5,
    lessons: [
      {
        id: "ui-1",
        number: 1,
        title: "2026 Spatial Dizayn Trendlari va Foydalanuvchi Tajribasi",
        duration: "15:40",
        durationSeconds: 940,
        level: "Boshlang'ich",
        xpReward: 50,
        mentor: "Lead Spatial Product Designer",
        summary: "VisionOS estetikasi, Glassmorphism 2.0, chuqurlik qatlamlari (Z-index fazosi) va kiberpunk ranglar uyg'unligi.",
        codeLanguage: "css",
        codeSnippet: `.glass-spatial {
  background: rgba(13, 19, 43, 0.7);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 240, 255, 0.25);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}`,
        keyTakeaways: [
          "Dizayn nafaqat ko'rinish, balki foydalanuvchining hissiy tajribasidir",
          "Mikro-kontrast va vizual iyerarxiya konversiyani oshiruvchi asosiy omildir",
        ],
        aiFaq: [
          {
            q: "Glassmorphism dizaynida blur nega muhim?",
            a: "Kuchli blur orqa fondagi chalkashliklarni yo'qotib, matn va asosiy elementlarni o'qishni juda osonlashtiradi.",
          },
        ],
      },
      {
        id: "ui-2",
        number: 2,
        title: "Figma Pro: Global Dizayn Tizimlari va Tokenlar",
        duration: "22:15",
        durationSeconds: 1335,
        level: "O'rta",
        xpReward: 60,
        mentor: "Design System Architect",
        summary: "Komponentlar, variantlar, auto-layout 5.0 va dizayn tokenlarini to'g'ridan-to'g'ri kodga aylantirish sirlari.",
        codeLanguage: "json",
        codeSnippet: `{
  "color": {
    "neonCyan": { "value": "#00f0ff" },
    "cyberPurple": { "value": "#9d4edd" },
    "backgroundDark": { "value": "#050713" }
  },
  "spacing": { "cardPadding": { "value": "24px" } }
}`,
        keyTakeaways: [
          "Dizayn tizimi jamoaviy ishlash tezligini 3 barobarga oshiradi",
          "Dizayn tokenlari Figma va Tailwind CSS o'rtasida ko'prik vazifasini o'taydi",
        ],
        aiFaq: [
          {
            q: "Design System nima uchun kerak?",
            a: "Barcha sahifa va ilovalar bir xil professional uslubda bo'lishi va tugma, ranglar o'zgarganda bir joydan yangilanishi uchun.",
          },
        ],
      },
      {
        id: "ui-3",
        number: 3,
        title: "Spline 3D: Veb Uchun Interaktiv 3D Olamlar",
        duration: "28:00",
        durationSeconds: 1680,
        level: "O'rta",
        xpReward: 75,
        mentor: "3D Motion Artist",
        summary: "Brauzerda yengil ishlovchi 3D ob'yektlar yasash, materiallar fizikasi va sichqonchaga ergashuvchi interaktiv ssenariylar.",
        codeLanguage: "html",
        codeSnippet: `<!-- Spline 3D Interaktiv Web Scene -->
<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9/build/spline-viewer.js"></script>
<spline-viewer url="https://prod.spline.design/kiber-sayyora/scene.splinecode"></spline-viewer>`,
        keyTakeaways: [
          "3D poligoni qanchalik kam (low-poly) bo'lsa, yuklanish shunchalik chaqqon bo'ladi",
          "Yorug'lik va materiallar (Metallic, Roughness) vizual haqqoniylikni yaratadi",
        ],
        aiFaq: [
          {
            q: "3D veb-saytlar telefonlarda qotib qolmaydimi?",
            a: "Spline va Three.js model geometriyasini optimallashtirsa va WebGL quvvatidan to'g'ri foydalanilsa, 60 FPS silliq ishlaydi.",
          },
        ],
      },
      {
        id: "ui-4",
        number: 4,
        title: "Three.js va Framer Motion: Mikro-Animatsiyalar Fizikasi",
        duration: "32:30",
        durationSeconds: 1950,
        level: "Yuqori",
        xpReward: 85,
        mentor: "Creative Technologist",
        summary: "Spring fizikasi, 3D tilt kartalari, shaderlar va foydalanuvchini hayratga soluvchi mikrokontaktlar.",
        codeLanguage: "typescript",
        codeSnippet: `import { motion, useSpring, useTransform } from "framer-motion";

const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
  stiffness: 150,
  damping: 20
});`,
        keyTakeaways: [
          "Fizikaga asoslangan prujina (Spring) animatsiyalari chiziqli animatsiyalardan 10x tabiiyroq ko'rinadi",
          "Interaktiv reaksiya vaqti 100 millisekunddan oshmasligi kerak",
        ],
        aiFaq: [
          {
            q: "Nega Spring animatsiyasi qulay?",
            a: "Chunki u qat'iy vaqtga emas, massaga va elastiklikka asoslanadi. Harakat kutilmaganda to'xtamaydi, silliq sekinlashadi.",
          },
        ],
      },
      {
        id: "ui-5",
        number: 5,
        title: "UX Psixologiyasi va A/B Sinovlar orqali Konversiya",
        duration: "24:00",
        durationSeconds: 1440,
        level: "Yuqori",
        xpReward: 100,
        mentor: "VP of Product Experience",
        summary: "Fitts qonuni, Hick qonuni, foydalanuvchi diqqatini boshqarish va tugmalarni bosish ehtimolini 2x oshirish.",
        codeLanguage: "markdown",
        codeSnippet: `### UX Konversiya Qoidalari:
1. Bitta ekranda bitta asosiy maqsad (CTA) bo'lsin.
2. Formadagi maydonlar sonini 3 tadan oshirmang.
3. Foydalanuvchiga har bir harakatidan so'ng darhol javob (feedback) ko'rsating.`,
        keyTakeaways: [
          "Tanlovlar qancha kam bo'lsa, foydalanuvchi qarorni shunchalik tez qabul qiladi (Hick qonuni)",
          "A/B testlar shaxsiy fikr emas, real foydalanuvchilar xatti-harakati orqali g'olib dizaynni tanlaydi",
        ],
        aiFaq: [
          {
            q: "Fitts qonuni nimani anglatadi?",
            a: "Nishon (tugma) qanchalik katta va kursordan qanchalik yaqin bo'lsa, unga bosish shunchalik oson va tez bo'ladi.",
          },
        ],
      },
    ],
  },
  "datascience": {
    trackId: "datascience",
    title: "Data Science va Sun'iy Idrok Tahlili",
    shortDesc: "Katta hajmdagi ma'lumotlarni tahlil qilish, mashinali o'rganish (Machine Learning) va bashorat qiluvchi AI modellar.",
    accentColor: "#ffbe0b",
    glowColor: "rgba(255, 190, 11, 0.5)",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    totalDuration: "2 soat 45 daqiqa",
    lessonsCount: 5,
    lessons: [
      {
        id: "ds-1",
        number: 1,
        title: "Data Science Kirish: Python, NumPy va Pandas Asoslari",
        duration: "20:30",
        durationSeconds: 1230,
        level: "Boshlang'ich",
        xpReward: 50,
        mentor: "Chief Data Scientist",
        summary: "Jadvallar, CSV fayllar, ma'lumotlarni tozalash, qatlamli filtrlar va statistik o'lchovlar.",
        codeLanguage: "python",
        codeSnippet: `import pandas as pd
import numpy as np

df = pd.read_csv("tanlov_qatnashchilari.csv")
print("O'rtacha yosh:", df["age"].mean())
top_tracks = df["track"].value_counts()
print(top_tracks)`,
        keyTakeaways: [
          "Data Science loyihalarining 70% vaqti ma'lumotlarni tozalashga ketadi",
          "Pandas kabi vositalar millionlab qatorlarni soniyalar ichida qayta ishlaydi",
        ],
        aiFaq: [
          {
            q: "Nega Data Science uchun aynan Python tanlangan?",
            a: "Python sodda sintaksisga ega va dunyodagi eng boy matematik va AI kutubxonalarga (NumPy, SciPy, PyTorch) ega.",
          },
        ],
      },
      {
        id: "ds-2",
        number: 2,
        title: "Ma'lumotlar Vizualizatsiyasi: Yashirin Qonuniyatlarni Topish",
        duration: "25:10",
        durationSeconds: 1510,
        level: "O'rta",
        xpReward: 60,
        mentor: "Data Visualization Expert",
        summary: "Matplotlib, Seaborn va Plotly yordamida gissogrammalar, issiqlik xaritalari (heatmaps) va korrelyatsiyalar.",
        codeLanguage: "python",
        codeSnippet: `import seaborn as sns
import matplotlib.pyplot as plt

sns.heatmap(df.corr(), annot=True, cmap="mako")
plt.title("Ko'nikmalar va Natijalar Korrelyatsiyasi")
plt.show()`,
        keyTakeaways: [
          "To'g'ri tanlangan diagramma 100 sahifalik hisobotdan ko'ra ko'proq ma'lumot beradi",
          "Korrelyatsiya har doim ham sabab-oqibatni anglatmaydi",
        ],
        aiFaq: [
          {
            q: "Korrelyatsiya koeffitsienti 1 ga teng bo'lsa nima degani?",
            a: "Bu ikki o'zgaruvchi o'rtasida to'liq to'g'ri proportsional bog'liqlik borligini bildiradi.",
          },
        ],
      },
      {
        id: "ds-3",
        number: 3,
        title: "Mashinali O'rganish (Machine Learning): Scikit-Learn",
        duration: "30:00",
        durationSeconds: 1800,
        level: "Yuqori",
        xpReward: 75,
        mentor: "Machine Learning Specialist",
        summary: "Klassifikatsiya va Regressiya modellari: Random Forest, Gradient Boosting orqali kelajakni bashorat qilish.",
        codeLanguage: "python",
        codeSnippet: `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

aniqlik = model.score(X_test, y_test)
print(f"Model aniqligi: {aniqlik * 100:.2f}%")`,
        keyTakeaways: [
          "Ma'lumotlar o'qitish (Train) va sinov (Test) qismlariga ajratilishi shart",
          "Overfitting (qayta moslashuv) modelning umumiy xulosalar chiqarish qobiliyatini o'ldiradi",
        ],
        aiFaq: [
          {
            q: "Overfitting qanday oldi olinadi?",
            a: "Ko'proq ma'lumot yig'ish, model parametrlarini cheklash (regularization) va kross-validatsiya orqali.",
          },
        ],
      },
      {
        id: "ds-4",
        number: 4,
        title: "Chuqur O'rganish (Deep Learning): PyTorch Neyrotarmoqlari",
        duration: "35:40",
        durationSeconds: 2140,
        level: "Yuqori",
        xpReward: 90,
        mentor: "Deep Learning Researcher",
        summary: "Ko'p qatlamli neyrotarmoqlar (MLP, CNN), orqaga tarqalish (Backpropagation) va yo'qotish funksiyalari.",
        codeLanguage: "python",
        codeSnippet: `import torch
import torch.nn as nn

class NeuralNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(64, 128)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(128, 5)

    def forward(self, x):
        return self.fc2(self.relu(self.fc1(x)))`,
        keyTakeaways: [
          "Neyron tarmoqlar murakkab noli-chiziqli qonuniyatlarni ochish uchun eng kuchli vositadir",
          "GPU grafik kartalari matritsa ko'paytmalarini minglab marotaba tezlashtiradi",
        ],
        aiFaq: [
          {
            q: "ReLU faollashtirish funksiyasi nima?",
            a: "Musbat sonlarni o'z holicha o'tkazuvchi, manfiy sonlarni esa 0 ga tenglashtiruvchi juda tezkor faollashtirish funksiyasi.",
          },
        ],
      },
      {
        id: "ds-5",
        number: 5,
        title: "Biznes Tahlil: AI Bashoratlari Bilan Qaror Qabul Qilish",
        duration: "28:15",
        durationSeconds: 1695,
        level: "Yuqori",
        xpReward: 100,
        mentor: "VP of Enterprise AI",
        summary: "Modelni biznes jarayonlariga integratsiya qilish, KPI ko'rsatkichlari va daromadni 2 barobar oshirish amaliyoti.",
        codeLanguage: "markdown",
        codeSnippet: `### AI Biznes Qiymat Hisoboti:
- Mijozlar ketib qolishini (Churn) oldindan 88% aniqlik bilan aytish.
- Shaxsiy tavsiyalar orqali o'rtacha chekni 34% ga oshirish.
- Qaror qabul qilish vaqtini 10 kundan 5 daqiqagacha qisqartirish.`,
        keyTakeaways: [
          "Eng zo'r model ham agar biznesga foyda keltirmasa, qadrsiz hisoblanadi",
          "A/B testlar orqali modelning real pul olib kelishi isbotlanishi kerak",
        ],
        aiFaq: [
          {
            q: "Data Scientist qanday ko'nikmaga ega bo'lishi kerak?",
            a: "Dasturlash (Python), matematika/statistika va biznes muammolarini chuqur tushunish (Domain Knowledge).",
          },
        ],
      },
    ],
  },
};
