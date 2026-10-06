export type LanguageId = "html" | "css" | "python";

export interface InteractiveExercise {
  id: string;
  lang: LanguageId;
  lessonNumber: number;
  title: string;
  shortDesc: string;
  theory: string[];
  taskInstruction: string;
  starterCode: string;
  solutionCode: string;
  hint: string;
  xpReward: number;
  testValidator: (code: string, outputText: string) => { passed: boolean; message: string };
}

export interface LanguageCourse {
  id: LanguageId;
  name: string;
  iconName: string;
  badge: string;
  color: string;
  glowColor: string;
  desc: string;
  exercises: InteractiveExercise[];
}

export const INTERACTIVE_COURSES: Record<LanguageId, LanguageCourse> = {
  html: {
    id: "html",
    name: "HTML5",
    iconName: "FileCode",
    badge: "Veb Skeleti",
    color: "#ff5722",
    glowColor: "rgba(255, 87, 34, 0.4)",
    desc: "Veb-sahifalar poydevori: sarlavhalar, matnlar, tugmalar, formalar va zamonaviy teglarni noldan o'rganing.",
    exercises: [
      {
        id: "html-1",
        lang: "html",
        lessonNumber: 1,
        title: "HTML Asoslari: Sarlavha va Matn",
        shortDesc: "<h1> va <p> teglari bilan ishlash",
        theory: [
          "HTML (HyperText Markup Language) — veb-sahifaning asosiy strukturasini quruvchi til hisoblanadi.",
          "<h1> dan <h6> gacha bo'lgan teglar sarlavhalar (Heading) uchun xizmat qiladi. <h1> eng asosiy va eng katta sarlavhadir.",
          "<p> tegi oddiy matnli xatboshini (Paragraph) ifodalaydi.",
          "Har bir ochilgan teg yopilishi kerak: masalan: <h1>Matn</h1>.",
        ],
        taskInstruction:
          "Quyidagi kod oynasida <h1> tegi orqali 'Kelajak Dasturchisi' sarlavhasini va <p> tegi orqali o'zingiz haqingizda matn yozing.",
        starterCode: `<!-- 1-Mashq: Sarlavha va matn yozing -->
<h1>Kelajak Dasturchisi</h1>
<p>Men Ustoz AI platformasida zamonaviy kasblarni o'rganmoqdaman.</p>`,
        solutionCode: `<h1>Kelajak Dasturchisi</h1>
<p>Men Ustoz AI platformasida zamonaviy kasblarni o'rganmoqdaman.</p>`,
        hint: "<h1> tegi ichida 'Kelajak Dasturchisi' so'zi bo'lishi va <p> tegi yopilgan bo'lishi kerak.",
        xpReward: 50,
        testValidator: (code) => {
          const lower = code.toLowerCase();
          if (!lower.includes("<h1") || !lower.includes("</h1>")) {
            return { passed: false, message: "<h1> tegi topilmadi yoki yopilmagan!" };
          }
          if (!code.includes("Kelajak Dasturchisi") && !lower.includes("kelajak")) {
            return { passed: false, message: "<h1> tegi ichiga 'Kelajak Dasturchisi' matnini yozing!" };
          }
          if (!lower.includes("<p") || !lower.includes("</p>")) {
            return { passed: false, message: "<p> tegi topilmadi yoki yopilmagan!" };
          }
          return { passed: true, message: "Ajoyib! Sarlavha va matn mukammal yaratildi." };
        },
      },
      {
        id: "html-2",
        lang: "html",
        lessonNumber: 2,
        title: "Interaktiv Tugmalar va Havolalar",
        shortDesc: "<button> va <a> teglari",
        theory: [
          "<button> tegi foydalanuvchi bosishi mumkin bo'lgan interaktiv tugma hisoblanadi.",
          "<a> tegi havolalar (link) uchun xizmat qiladi va href attributi orqali boshqa manzilga olib o'tadi.",
          "Tugmaga class attributini berib, keyinchalik CSS orqali chiroyli dizayn berish mumkin.",
        ],
        taskInstruction:
          "Klassi 'cyber-btn' bo'lgan <button>Tanlovda Qatnashish</button> tugmasini yarating.",
        starterCode: `<div class="card">
  <h2>Zamonaviy Tanlov 2026</h2>
  <!-- Quyiga tugma yozing: -->
  <button class="cyber-btn">Tanlovda Qatnashish</button>
</div>`,
        solutionCode: `<div class="card">
  <h2>Zamonaviy Tanlov 2026</h2>
  <button class="cyber-btn">Tanlovda Qatnashish</button>
</div>`,
        hint: "<button class=\"cyber-btn\">Tanlovda Qatnashish</button> ko'rinishida yozing.",
        xpReward: 60,
        testValidator: (code) => {
          const lower = code.toLowerCase();
          if (!lower.includes("<button") || !lower.includes("</button>")) {
            return { passed: false, message: "<button> tegi topilmadi yoki to'g'ri yopilmagan!" };
          }
          if (!lower.includes("cyber-btn")) {
            return { passed: false, message: "Tugmaga class=\"cyber-btn\" atributini bering!" };
          }
          if (!code.includes("Tanlovda Qatnashish") && !lower.includes("qatnash")) {
            return { passed: false, message: "Tugma ichiga 'Tanlovda Qatnashish' matnini yozing!" };
          }
          return { passed: true, message: "Ofarin! Interaktiv tugma to'g'ri yaratildi." };
        },
      },
      {
        id: "html-3",
        lang: "html",
        lessonNumber: 3,
        title: "Formalar va Ma'lumot Kiritish Maydoni",
        shortDesc: "<input> va <form> teglari",
        theory: [
          "<form> tegi ro'yxatdan o'tish yoki kirish ma'lumotlarini qabul qiluvchi forma qobig'idir.",
          "<input> foydalanuvchidan matn, telefon raqami yoki parol qabul qiladi. U yopiluvchi teg talab qilmaydi.",
          "placeholder atributi maydon bo'sh bo'lganda ko'rinib turadigan yordamchi maslahat matnidir.",
        ],
        taskInstruction:
          "type='text' va placeholder='Ismingizni kiriting' atributlariga ega bo'lgan <input> maydonini formaga qo'shing.",
        starterCode: `<form class="cyber-form">
  <h3>Ro'yxatdan o'tish</h3>
  <!-- Input maydonini shu yerga yozing: -->
  <input type="text" placeholder="Ismingizni kiriting" />
  <button type="submit">Davom etish</button>
</form>`,
        solutionCode: `<form class="cyber-form">
  <h3>Ro'yxatdan o'tish</h3>
  <input type="text" placeholder="Ismingizni kiriting" />
  <button type="submit">Davom etish</button>
</form>`,
        hint: "<input type=\"text\" placeholder=\"Ismingizni kiriting\" /> ko'rinishida yozing.",
        xpReward: 70,
        testValidator: (code) => {
          const lower = code.toLowerCase();
          if (!lower.includes("<input")) {
            return { passed: false, message: "<input> tegi kiritilmadi!" };
          }
          if (!lower.includes("placeholder")) {
            return { passed: false, message: "Inputga placeholder atributini qo'shing!" };
          }
          return { passed: true, message: "Juda yaxshi! Forma input maydoni muvaffaqiyatli ulandi." };
        },
      },
      {
        id: "html-4",
        lang: "html",
        lessonNumber: 4,
        title: "Konteynerlar va Ro'yxatlar: <div> va <ul>",
        shortDesc: "<div>, <ul> va <li> teglari",
        theory: [
          "<div> (division) — boshqa elementlarni guruhlash uchun ishlatiladigan eng asosiy blok element.",
          "<ul> (unordered list) — tartiblanmagan nuqtali ro'yxat yaratadi.",
          "<li> (list item) — ro'yxatning har bir bandi (elementi) hisoblanadi.",
        ],
        taskInstruction:
          "Kamida 3 ta zamonaviy kasb yozilgan <ul> ro'yxatini tuzing (masalan: Sun'iy Intellekt, Fullstack, Kiberxavfsizlik).",
        starterCode: `<div class="tracks-wrapper">
  <h2>Zamonaviy Yo'nalishlar:</h2>
  <ul>
    <li>Sun'iy Intellekt</li>
    <li>Fullstack Veb 3.0</li>
    <li>Kiberxavfsizlik</li>
  </ul>
</div>`,
        solutionCode: `<div class="tracks-wrapper">
  <h2>Zamonaviy Yo'nalishlar:</h2>
  <ul>
    <li>Sun'iy Intellekt</li>
    <li>Fullstack Veb 3.0</li>
    <li>Kiberxavfsizlik</li>
  </ul>
</div>`,
        hint: "<ul> ichida kamida 3 ta <li> elementi bo'lishi kerak.",
        xpReward: 80,
        testValidator: (code) => {
          const lower = code.toLowerCase();
          if (!lower.includes("<ul") || !lower.includes("</ul>")) {
            return { passed: false, message: "<ul> tegi topilmadi yoki yopilmagan!" };
          }
          const liMatches = code.match(/<li[\s>]/gi);
          if (!liMatches || liMatches.length < 3) {
            return { passed: false, message: "Ro'yxatda kamida 3 ta <li> elementi bo'lishi shart!" };
          }
          return { passed: true, message: "Qoyilmaqom! Ro'yxat elementlari to'liq shakllantirildi." };
        },
      },
    ],
  },
  css: {
    id: "css",
    name: "CSS3",
    iconName: "Palette",
    badge: "Vizual Stil",
    color: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.4)",
    desc: "Cyberpunk neon ranglar, Flexbox tartibi, Glassmorphism va silliq mikromotsiyalar berishni mashq qiling.",
    exercises: [
      {
        id: "css-1",
        lang: "css",
        lessonNumber: 1,
        title: "Ranglar va Neon Nurlanish (Glow)",
        shortDesc: "color, background va box-shadow",
        theory: [
          "CSS (Cascading Style Sheets) — HTML elementlarining rangi, o'lchami va ko'rinishini boshqaradi.",
          "color: matn rangini belgilaydi (masalan: #00f0ff).",
          "background: orqa fon rangini beradi.",
          "box-shadow: element atrofida neon nurlanish effektini hosil qiladi.",
        ],
        taskInstruction:
          ".cyber-card klassiga color: #00f0ff; va background: #0a1128; stillarini bering.",
        starterCode: `/* 1-Mashq: Neon kartani bezang */
.cyber-card {
  color: #00f0ff;
  background: #0a1128;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}`,
        solutionCode: `.cyber-card {
  color: #00f0ff;
  background: #0a1128;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
}`,
        hint: "color va background xususiyatlarini to'g'ri yozganingizga ishonch hosil qiling.",
        xpReward: 50,
        testValidator: (code) => {
          const clean = code.replace(/\s+/g, " ").toLowerCase();
          if (!clean.includes("color:") || !clean.includes("#00f0ff")) {
            return { passed: false, message: "color: #00f0ff xususiyati kiritilmadi!" };
          }
          if (!clean.includes("background:") && !clean.includes("background-color:")) {
            return { passed: false, message: "background xususiyati kiritilmadi!" };
          }
          return { passed: true, message: "Ajoyib! Neon uslub muvaffaqiyatli qo'llandi." };
        },
      },
      {
        id: "css-2",
        lang: "css",
        lessonNumber: 2,
        title: "Flexbox: Elementlarni Markazlashtirish",
        shortDesc: "display: flex va justify-content",
        theory: [
          "Flexbox — elementlarni gorizontal va vertikal yo'nalishda tartiblash uchun eng zo'r vosita.",
          "display: flex; konteynerni moslashuvchan qiladi.",
          "justify-content: center; elementlarni o'rtaga (markazga) joylashtiradi.",
          "align-items: center; vertikal bo'yicha markazlashtiradi.",
        ],
        taskInstruction:
          ".flex-container klassiga display: flex; va justify-content: center; stillarini qo'shing.",
        starterCode: `/* 2-Mashq: Flexbox bilan markazlashtiring */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-height: 120px;
  background: #070d24;
}`,
        solutionCode: `.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-height: 120px;
  background: #070d24;
}`,
        hint: "display: flex; va justify-content: center; yozilganini tekshiring.",
        xpReward: 60,
        testValidator: (code) => {
          const clean = code.replace(/\s+/g, " ").toLowerCase();
          if (!clean.includes("display: flex") && !clean.includes("display:flex")) {
            return { passed: false, message: "display: flex; kiritilmadi!" };
          }
          if (!clean.includes("justify-content: center") && !clean.includes("justify-content:center")) {
            return { passed: false, message: "justify-content: center; kiritilmadi!" };
          }
          return { passed: true, message: "Super! Flexbox markazlashtirish to'g'ri bajarildi." };
        },
      },
      {
        id: "css-3",
        lang: "css",
        lessonNumber: 3,
        title: "Glassmorphism: Shaffof Oyna Effekti",
        shortDesc: "backdrop-filter va rgba() shaffoflik",
        theory: [
          "Glassmorphism — Apple va Cyberpunk dizaynlaridagi ultra-zamonaviy shaffof oyna effekti.",
          "backdrop-filter: blur(16px); element orqasidagi fonni xiralashtirib (blur), chuqurlik yaratadi.",
          "border-radius: element burchaklarini yumaloqlaydi.",
        ],
        taskInstruction:
          ".glass-panel klassiga backdrop-filter: blur(16px); va border-radius: 16px; bering.",
        starterCode: `/* 3-Mashq: Glassmorphism oyna effekti */
.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
}`,
        solutionCode: `.glass-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
}`,
        hint: "backdrop-filter: blur(16px); xususiyatini to'g'ri yozing.",
        xpReward: 75,
        testValidator: (code) => {
          const clean = code.replace(/\s+/g, " ").toLowerCase();
          if (!clean.includes("backdrop-filter")) {
            return { passed: false, message: "backdrop-filter xususiyati topilmadi!" };
          }
          if (!clean.includes("border-radius")) {
            return { passed: false, message: "border-radius xususiyati kiritilmadi!" };
          }
          return { passed: true, message: "Mukammal! Glassmorphism shaffof oyna effekti hosil bo'ldi." };
        },
      },
      {
        id: "css-4",
        lang: "css",
        lessonNumber: 4,
        title: "Hover Animatsiyasi va Kattalashish",
        shortDesc: ":hover va transform: scale()",
        theory: [
          ":hover pseudo-klassi sichqoncha element ustiga kelgan holatni bildiradi.",
          "transform: scale(1.08); elementni bir oz kattalashtiradi.",
          "transition: all 0.3s ease; harakatni qotmasdan, silliq qiladi.",
        ],
        taskInstruction:
          ".neon-btn:hover klassi ichida transform: scale(1.08); qiymatini bering.",
        starterCode: `.neon-btn {
  background: linear-gradient(135deg, #00f0ff, #9d4edd);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.neon-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
}`,
        solutionCode: `.neon-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
}`,
        hint: "transform: scale(1.08); qatorini yozing.",
        xpReward: 85,
        testValidator: (code) => {
          const clean = code.replace(/\s+/g, " ").toLowerCase();
          if (!clean.includes(":hover")) {
            return { passed: false, message: ":hover selektori topilmadi!" };
          }
          if (!clean.includes("scale(")) {
            return { passed: false, message: "transform: scale(...) xususiyati kiritilmadi!" };
          }
          return { passed: true, message: "A'lo darajada! Hover mikromotsiyasi mukammal ishlamoqda." };
        },
      },
    ],
  },
  python: {
    id: "python",
    name: "Python",
    iconName: "Terminal",
    badge: "Backend & AI",
    color: "#ffbe0b",
    glowColor: "rgba(255, 190, 11, 0.4)",
    desc: "Sun'iy intellekt, ma'lumotlar tahlili va backend uchun dunyodagi eng qulay dasturlash tili.",
    exercises: [
      {
        id: "py-1",
        lang: "python",
        lessonNumber: 1,
        title: "print() va O'zgaruvchilar (Variables)",
        shortDesc: "print() funksiyasi va o'zgaruvchilar",
        theory: [
          "Python — dunyodagi eng sodda va o'qilishi qulay sintaksisga ega dasturlash tili.",
          "print() funksiyasi berilgan matn yoki natijani terminal oynasiga chiqaradi.",
          "O'zgaruvchi yaratish uchun unga nom berib, tenglik belgisi qo'yiladi: ism = 'Rustam'.",
          "f-string: print(f'Salom, {ism}') orqali o'zgaruvchini matn ichiga qulay joylashtirish mumkin.",
        ],
        taskInstruction:
          "ism nomli o'zgaruvchi yarating va print() orqali 'Salom' so'zi bilan ekranga chiqaring.",
        starterCode: `# 1-Mashq: O'zgaruvchi va print
ism = "Ustoz AI Dasturchisi"
xp = 100

print(f"Salom, {ism}!")
print(f"Sizning joriy balingiz: {xp} XP")`,
        solutionCode: `ism = "Ustoz AI Dasturchisi"
xp = 100
print(f"Salom, {ism}!")
print(f"Sizning joriy balingiz: {xp} XP")`,
        hint: "ism o'zgaruvchisini yarating va print(f'Salom, {ism}!') deb yozing.",
        xpReward: 50,
        testValidator: (code, output) => {
          if (!code.includes("ism") || !code.includes("print(")) {
            return { passed: false, message: "Kodda 'ism' o'zgaruvchisi va print() funksiyasi bo'lishi kerak!" };
          }
          if (!output.toLowerCase().includes("salom")) {
            return { passed: false, message: "Chiqish konsolida 'Salom' so'zi chiqmadi!" };
          }
          return { passed: true, message: "Qoyil! Python print() va o'zgaruvchi mukammal ishladi." };
        },
      },
      {
        id: "py-2",
        lang: "python",
        lessonNumber: 2,
        title: "Mantiqiy Shartlar: if / elif / else",
        shortDesc: "Qarorlar qabul qilish mantiqi",
        theory: [
          "Dastur vaziyatga qarab turli qarorlar qabul qilishi uchun if / else ishlatiladi.",
          "Python'da qavslar o'rniga surilish (indentation - 4 ta bo'shliq probel) ishlatiladi.",
          "Taqqoslash belgilari: >= (katta yoki teng), == (teng), != (teng emas).",
        ],
        taskInstruction:
          "ball = 85 o'zgaruvchisini tekshiring. Agar ball >= 70 bo'lsa 'G'olib' deb konsolga chiqaring.",
        starterCode: `# 2-Mashq: Shart operatorlari
ball = 85

if ball >= 70:
    print("G'olib! Siz grantni qo'lga kiritdingiz!")
else:
    print("Keyingi bosqichda sinab ko'ring.")`,
        solutionCode: `ball = 85
if ball >= 70:
    print("G'olib! Siz grantni qo'lga kiritdingiz!")
else:
    print("Keyingi bosqichda sinab ko'ring.")`,
        hint: "if ball >= 70: shartini to'g'ri yozing.",
        xpReward: 65,
        testValidator: (code, output) => {
          if (!code.includes("if ") || !code.includes("else:")) {
            return { passed: false, message: "if va else shart operatorlari ishlatilmadi!" };
          }
          if (!output.toLowerCase().includes("g'olib") && !output.toLowerCase().includes("g'olib!")) {
            return { passed: false, message: "Konsolda 'G'olib' xabari chiqmadi!" };
          }
          return { passed: true, message: "Ajoyib! Shart operatori to'g'ri tekshirildi." };
        },
      },
      {
        id: "py-3",
        lang: "python",
        lessonNumber: 3,
        title: "Tsikllar (for loop) va Ro'yxatlar (List)",
        shortDesc: "for tsikli va ro'yxat elementlari",
        theory: [
          "Ro'yxat (list) — bir nechta qiymatni bitta o'zgaruvchida saqlaydi: [1, 2, 3].",
          "for tsikli ro'yxat ichidagi har bir elementni navbati bilan aylanib chiqadi.",
          "Bu usul minglab ma'lumotlarni soniyalar ichida qayta ishlash imkonini beradi.",
        ],
        taskInstruction:
          "3 ta zamonaviy yo'nalish ro'yxatini tuzing va for tsikli orqali har birini print() qiling.",
        starterCode: `# 3-Mashq: Ro'yxat va for tsikli
kasblar = ["Sun'iy Intellekt", "Fullstack", "Kiberxavfsizlik"]

for kasb in kasblar:
    print(f"Yo'nalish: {kasb}")`,
        solutionCode: `kasblar = ["Sun'iy Intellekt", "Fullstack", "Kiberxavfsizlik"]
for kasb in kasblar:
    print(f"Yo'nalish: {kasb}")`,
        hint: "for kasb in kasblar: tsiklini ishlating.",
        xpReward: 75,
        testValidator: (code, output) => {
          if (!code.includes("for ") || !code.includes(" in ")) {
            return { passed: false, message: "for ... in tsikli ishlatilmadi!" };
          }
          if (!code.includes("[") || !code.includes("]")) {
            return { passed: false, message: "Ro'yxat kvadrat qavslari [...] topilmadi!" };
          }
          const lines = output.trim().split("\n");
          if (lines.length < 3) {
            return { passed: false, message: "Konsolda kamida 3 ta yo'nalish chiqishi kerak!" };
          }
          return { passed: true, message: "Super! Python ro'yxati va for tsikli muvaffaqiyatli ishladi." };
        },
      },
      {
        id: "py-4",
        lang: "python",
        lessonNumber: 4,
        title: "Funksiyalar (def) va AI Skripti",
        shortDesc: "def kalit so'zi va return qiymati",
        theory: [
          "Funksiya — muayyan vazifani bajaruvchi mustaqil kod bo'lagi. Bir marta yozib, xohlagancha chaqirish mumkin.",
          "def funksiya_nomi(argumentlar): orqali e'lon qilinadi.",
          "return orqali hisoblangan natija qaytariladi.",
        ],
        taskInstruction:
          "darslar_soni va xp_har_dars ni qabul qilib, umumiy XP ni hisoblab beruvchi hisobla_xp() funksiyasini yozing.",
        starterCode: `# 4-Mashq: Funksiya tuzish
def hisobla_xp(dars_soni, xp_stavka):
    jami = dars_soni * xp_stavka
    return jami

natija = hisobla_xp(4, 50)
print(f"Jami to'plangan XP: {natija}")`,
        solutionCode: `def hisobla_xp(dars_soni, xp_stavka):
    jami = dars_soni * xp_stavka
    return jami

natija = hisobla_xp(4, 50)
print(f"Jami to'plangan XP: {natija}")`,
        hint: "def hisobla_xp(...): deb yozing va return jami qilib qaytaring.",
        xpReward: 90,
        testValidator: (code, output) => {
          if (!code.includes("def ") || !code.includes("return")) {
            return { passed: false, message: "def va return kalit so'zlari ishlatilmadi!" };
          }
          if (!output.includes("200") && !output.includes("XP")) {
            return { passed: false, message: "Funksiya natijasi konsolga to'g'ri chiqmadi!" };
          }
          return { passed: true, message: "G'alaba! Python funksiyasi mukammal hisobladi va natija berdi." };
        },
      },
    ],
  },
};
