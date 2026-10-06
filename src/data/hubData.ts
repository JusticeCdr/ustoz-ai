import { CareerTrackId } from "@/types";

export interface DailyQuest {
  title: string;
  description: string;
  xpReward: number;
  tags: string[];
  difficulty: "Oson" | "O'rta" | "Murakkab";
  hints: string;
}

export const DAILY_QUESTS: Record<CareerTrackId, DailyQuest> = {
  "ai-prompt": {
    title: "Murakkab RAG & Multi-turn System Prompt Yaratish",
    description:
      "GPT-4o uchun kontekstni to'liq saqlovchi va xavfsizlik cheklovlariga (Jailbreak-proof) ega bo'lgan 1 ta professional System Prompt yozing hamda natijani JSON schema formatida qaytarilishini tekshiring.",
    xpReward: 40,
    tags: ["LLM", "Prompt Engineering", "JSON Mode", "Security"],
    difficulty: "O'rta",
    hints: "Promptingizda aniq rollar, cheklovlar ('Negative constraints') va 'Few-shot' misollaridan foydalaning.",
  },
  "fullstack-web3": {
    title: "Next.js Server Actions & Xavfsiz Validatsiya",
    description:
      "Zod kutubxonasi yordamida kiritilgan ma'lumotlarni server darajasida tekshiruvchi va CSRF himoyasiga ega Next.js Server Action funksiyasini yozing.",
    xpReward: 40,
    tags: ["Next.js 15", "Server Actions", "Zod", "TypeScript"],
    difficulty: "O'rta",
    hints: "Form action larini optimistik yangilanish (useOptimistic) bilan boyiting.",
  },
  "cybersecurity": {
    title: "SQL Injection va XSS Zaifliklarini Aniqlash",
    description:
      "Foydalanuvchi ma'lumotlarini qabul qiluvchi API endpointida kiritilgan shubhali belgilarni aniqlovchi va xavfsiz parametrli so'rovga (Prepared Statements) o'tkazuvchi sanitizatsiya kodini yozing.",
    xpReward: 40,
    tags: ["OWASP", "Penetration Testing", "Sanitization", "Prepared Statements"],
    difficulty: "O'rta",
    hints: "Input sanitization dan tashqari CSP (Content Security Policy) sarlavhalarini hisobga oling.",
  },
  "uiux-3d": {
    title: "3D Glassmorphic Kartaning Spatial Mikromotsiyasi",
    description:
      "Figma yoki Three.js da kursor yaqinlashganda 3D egiluvchi (spatial tilt), neon soya taratuvchi va blur orqa fonga ega futuristik interfeys komponentini yarating.",
    xpReward: 40,
    tags: ["Three.js", "Figma", "Micro-interactions", "Glassmorphism"],
    difficulty: "Oson",
    hints: "Yorug'lik manbasi (PointLight) va shisha materialining pishiqlik (roughness 0.1) qiymatlarini to'g'ri sozlang.",
  },
  datascience: {
    title: "Datasetdagi Anomalilarni Z-score Bilan Filtrlash",
    description:
      "Python Pandas va NumPy yordamida 10,000+ qatorli ma'lumotlar to'plamidagi me'yordan og'gan anomal qiymatlarni (Outliers) aniqlash va vizual grafikda ko'rsatish skriptini yozing.",
    xpReward: 40,
    tags: ["Python", "Pandas", "Outlier Detection", "Matplotlib"],
    difficulty: "O'rta",
    hints: "Standart og'ish 3 sigma dan katta bo'lgan nuqtalarni izlang.",
  },
};

export interface MockTestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const MOCK_TESTS: Record<CareerTrackId, MockTestQuestion[]> = {
  "ai-prompt": [
    {
      id: 1,
      question: "Prompt Engineering da 'Chain-of-Thought' (CoT) usulining asosiy afzalligi nimada?",
      options: [
        "Javob berish vaqtini 10 barobarga qisqartiradi",
        "Modelga bosqichma-bosqich mantiqiy fikrlashga imkon berib, murakkab masalalarda xatolikni kamaytiradi",
        "Tokenlar sarfini kamaytiradi",
        "Faqat ingliz tilida ishlashni majburlaydi",
      ],
      correctIndex: 1,
      explanation: "Chain-of-Thought modelga fikrlash zanjirini bosqichma-bosqich tuzishga imkon beradi.",
    },
    {
      id: 2,
      question: "RAG (Retrieval-Augmented Generation) tizimi LLM modellariga qanday yordam beradi?",
      options: [
        "Modelni noldan qayta o'qitishni talab qiladi",
        "Tashqi ma'lumotlar bazasidan kerakli bilimlarni qidirib topib, LLM ga kontekst sifatida uzatadi",
        "Faqat rasmlarni tahlil qilish uchun ishlatiladi",
        "Model parametrlarini avtomatik kichraytiradi",
      ],
      correctIndex: 1,
      explanation: "RAG modeli dolzarb va xususiy ma'lumotlar bilan boyitish uchun vektor qidiruvdan foydalanadi.",
    },
    {
      id: 3,
      question: "LLM modellarida 'Temperature' parametri 0.1 qilib belgilansa, javob qanday bo'ladi?",
      options: [
        "Juda ijodiy, kutilmagan va turli xil",
        "Qat'iy, aniq, deterministik va mantiqiy bashorat qilinadigan",
        "Model xatolik berib to'xtab qoladi",
        "Javob faqat bitta so'zdan iborat bo'ladi",
      ],
      correctIndex: 1,
      explanation: "Harorat qanchalik past bo'lsa, model eng yuqori ehtimolli tokenlarni tanlaydi.",
    },
    {
      id: 4,
      question: "AI Agentlarda 'Tool Calling' (Asboblarni chaqirish) nima maqsadda qo'llaniladi?",
      options: [
        "Modelga kalkulyator, ob-havo API yoki ma'lumotlar bazasidan jonli ma'lumot olish imkonini beradi",
        "Faqat kod sintaksisini bo'yash uchun",
        "Modelni o'chirish uchun",
        "Foydalanuvchi parolini saqlash uchun",
      ],
      correctIndex: 0,
      explanation: "Asboblar AI agentga tashqi dunyo APIlari bilan amaliy muloqot qilish imkoniyatini taqdim etadi.",
    },
    {
      id: 5,
      question: "Prompt Injektsiyasi (Prompt Injection) xuruji nima?",
      options: [
        "Modelning tezligini oshirish usuli",
        "Foydalanuvchi kiritgan matn orqali modelning dastlabki System Prompt cheklovlarini buzib o'tish",
        "Modelni tarmoqqa ulash kabeli",
        "Tokenlar limitini oshirish dasturi",
      ],
      correctIndex: 1,
      explanation: "Prompt Injection — foydalanuvchi kiritmasi orqali tizim qoidalarini aldash xurujidir.",
    },
  ],
  "fullstack-web3": [
    {
      id: 1,
      question: "Next.js App Router da Server Component larning asosiy ustunligi nima?",
      options: [
        "Ularda 'useState' va 'useEffect' ishlaydi",
        "Mijoz brauzeriga ortiqcha JavaScript yuklamaydi va to'g'ridan-to'g'ri serverda xavfsiz render bo'ladi",
        "Faqat CSS uslublarini o'z ichiga oladi",
        "Brauzer oynasi hajmini boshqaradi",
      ],
      correctIndex: 1,
      explanation: "Server komponentlar nol mijoz JS hajmi bilan serverda bajariladi.",
    },
    {
      id: 2,
      question: "WebSocket protokoli HTTP dan qaysi jihati bilan tubdan farq qiladi?",
      options: [
        "WebSocket faqat matnli fayllarni yuklaydi",
        "WebSocket ikki tomonlama (full-duplex), doimiy ochiq ulanish orqali real-vaqt ma'lumot almashadi",
        "WebSocket da so'rov yuborish mumkin emas",
        "WebSocket har doim sahifani yangilaydi",
      ],
      correctIndex: 1,
      explanation: "WebSocket mijoz va server o'rtasida uzluksiz ikki tomonlama kanal o'rnatadi.",
    },
    {
      id: 3,
      question: "TypeScript da 'interface' va 'type' qanday farqlanadi?",
      options: [
        "Ular mutlaqo bir xil va farqi yo'q",
        "Interface deklaratsiyalarni kengaytirish (declaration merging) imkonini beradi, type esa union va murakkab tiplarni ifodalaydi",
        "Type faqat sonlar uchun ishlatiladi",
        "Interface faqat runtime da ishlaydi",
      ],
      correctIndex: 1,
      explanation: "Interface kengaytirish uchun ochiq, type esa ko'proq ifodali va union tiplar uchun qulay.",
    },
    {
      id: 4,
      question: "Web3 ilovalarida foydalanuvchi hamyonini (Wallet) tekshirish qaysi kutubxona orqali qulay?",
      options: [
        "jQuery",
        "Wagmi / Viem / Ethers.js",
        "Express.js",
        "Lodash",
      ],
      correctIndex: 1,
      explanation: "Wagmi va Viem zamonaviy React ilovalari uchun eng yaxshi Web3 hooklar to'plamidir.",
    },
    {
      id: 5,
      question: "React 18 da 'useTransition' hooki nima uchun kerak?",
      options: [
        "Sahifani to'xtatish uchun",
        "Og'ir davlat yangilanishlarini ikkinchi darajali qilib, foydalanuvchi interfeysini qotib qolishdan saqlash uchun",
        "Faqat CSS transitionlarini boshqarish uchun",
        "API so'rovlarini bekor qilish uchun",
      ],
      correctIndex: 1,
      explanation: "useTransition sekin yangilanishlarni fonda bajarib, UI javob berish tezligini saqlaydi.",
    },
  ],
  cybersecurity: [
    {
      id: 1,
      question: "SQL Injection zaifligiga qarshi eng samarali va xavfsiz himoya chorasi qaysi?",
      options: [
        "Parollarni oddiy matn ko'rinishida saqlash",
        "Parametrlangan so'rovlar (Prepared Statements) va ORM dan foydalanish",
        "Saytni faqat kunduzi ishlatish",
        "Barcha foydalanuvchilarni admin qilish",
      ],
      correctIndex: 1,
      explanation: "Prepared Statements kiritilgan ma'lumotni buyruq sifatida emas, faqat qiymat sifatida qabul qiladi.",
    },
    {
      id: 2,
      question: "Zero-Day (0-day) zaiflik nima?",
      options: [
        "Dastur yozilgan birinchi kuni paydo bo'ladigan xato",
        "Dasturchilarga hali noma'lum yoki rasmiy tuzatishi (patch) chiqarilmagan xavfli zaiflik",
        "0 raqamini kiritganda chiqadigan xatolik",
        "Faqat bepul dasturlardagi zaiflik",
      ],
      correctIndex: 1,
      explanation: "Zero-day — ishlab chiquvchi tuzatishga ulgurmagan va kiberhujumchilar foydalanishi mumkin bo'lgan zaiflik.",
    },
    {
      id: 3,
      question: "XSS (Cross-Site Scripting) hujumining asosiy xavfi nimada?",
      options: [
        "Foydalanuvchi brauzerida begona zararli JavaScript kodini bajarib, sessiya kuki va tokenlarni o'g'irlash",
        "Server kompyuterini fizik yoqib yuborish",
        "Faqat internet tezligini sekinlashtirish",
        "Foydalanuvchi monitorini o'chirib qo'yish",
      ],
      correctIndex: 0,
      explanation: "XSS hujumlari jabrlanuvchining brauzer sessiyasini qo'lga kiritishga qaratilgan.",
    },
    {
      id: 4,
      question: "HTTPS protokolida ma'lumotlar xavfsizligini ta'minlovchi mexanizm nima?",
      options: [
        "TLS / SSL shifrlash protokoli",
        "Faqat oddiy Base64 kodlash",
        "FTP server",
        "DNS qidiruv tizimi",
      ],
      correctIndex: 0,
      explanation: "TLS shifrlash mijoz va server o'rtasidagi ma'lumotlarni yo'lda o'qishdan to'liq himoya qiladi.",
    },
    {
      id: 5,
      question: "DDoS hujumi paytida server nima sababdan ishlamay qoladi?",
      options: [
        "Server elektr ta'minoti uzilgani uchun",
        "Millionlab soxta so'rovlar oqimi bilan server resurslari (CPU, RAM, tarmoq o'tkazuvchanligi) to'lib ketishi oqibatida",
        "Parol noto'g'ri terilgani uchun",
        "Serverdagi fayllar o'chib ketgani uchun",
      ],
      correctIndex: 1,
      explanation: "DDoS serverni haddan ortiq so'rovlar bilan yuklab, haqiqiy foydalanuvchilarga xizmat ko'rsata olmaydigan qiladi.",
    },
  ],
  "uiux-3d": [
    {
      id: 1,
      question: "Figma da Auto Layout ning 'Fill Container' qiymati komponentga qanday ta'sir qiladi?",
      options: [
        "Element faqat o'z matnining hajmiga qisqaradi",
        "Element o'zining ota (parent) ramkasi kengligi yoki balandligini to'liq egallaydi",
        "Elementni ko'rinmas qilib qo'yadi",
        "Elementni 3D holatga o'tkazadi",
      ],
      correctIndex: 1,
      explanation: "Fill container elementi moslashuvchan (responsive) qilib, ota blok bo'ylab cho'zadi.",
    },
    {
      id: 2,
      question: "Webda silliq 60/120 FPS mikromotsiya yaratish uchun CSS da qaysi xususiyatlarni animatsiya qilish maqsadga muvofiq?",
      options: [
        "width va height",
        "transform va opacity (GPU tezlanishiga ega)",
        "margin va padding",
        "top va left",
      ],
      correctIndex: 1,
      explanation: "Transform va Opacity brauzerning 'Composite' qatlamida GPU orqali tezkor qayta chiziladi.",
    },
    {
      id: 3,
      question: "Three.js da jismoniy real yorug'lik va aks etish xususiyatiga ega material qaysi?",
      options: [
        "MeshBasicMaterial",
        "MeshPhysicalMaterial / MeshStandardMaterial",
        "MeshNormalMaterial",
        "LineBasicMaterial",
      ],
      correctIndex: 1,
      explanation: "MeshPhysicalMaterial PBR (Physically Based Rendering) qonuniyatlariga tayanadi.",
    },
    {
      id: 4,
      question: "UX da 'Jakob qonuni' (Jakob's Law) nimani uqtiradi?",
      options: [
        "Foydalanuvchilar ko'p vaqtini boshqa saytlarda o'tkazishadi, shuning uchun sizning saytingiz ham ular bilgan qoidalar asosida ishlashini kutishadi",
        "Har bir sahifada faqat 1 ta tugma bo'lishi kerak",
        "Ranglar faqat qora va oq bo'lishi shart",
        "Mobil qurilmalarga dizayn kerak emas",
      ],
      correctIndex: 0,
      explanation: "Foydalanuvchilar o'rganib qolgan tanish dizayn patternlarini tezroq o'zlashtirishadi.",
    },
    {
      id: 5,
      question: "Glassmorphism dizayn uslubining asosiy vizual belgilari qaysilar?",
      options: [
        "Qalin qora hoshiyalar va sarg'ish rang",
        "Yarim shaffof orqa fon, backdrop-filter blur va nozik yorug'lik hoshiyasi",
        "Faqat 8-bitli pikselli tasvirlar",
        "Oq-qora gazeta uslubi",
      ],
      correctIndex: 1,
      explanation: "Muzlagan oyna (frosted glass) effekti yarim shaffoflik va blur orqali yuzaga keladi.",
    },
  ],
  datascience: [
    {
      id: 1,
      question: "Pandas kutubxonasida yetishmayotgan (NaN) qiymatlarni aniqlash uchun qaysi metod ishlatiladi?",
      options: [
        "df.drop()",
        "df.isna() yoki df.isnull()",
        "df.sum()",
        "df.head()",
      ],
      correctIndex: 1,
      explanation: "isna() va isnull() barcha yetishmayotgan qiymatlarni boolean maska ko'rinishida beradi.",
    },
    {
      id: 2,
      question: "Supervised Learning (Nazorat ostidagi o'rganish) nima?",
      options: [
        "O'qituvchi modelni kuzatib turishi",
        "Modelga belgilanmagan (labelsiz) ma'lumotlar berilishi",
        "Model kiruvchi ma'lumotlar va ularning to'g'ri javoblari (Labels) juftligi asosida o'rganishi",
        "Modelning internetga ulanishi",
      ],
      correctIndex: 2,
      explanation: "Supervised Learning har bir kiruvchi xususiyat uchun ma'lum maqsadli natija asosida o'rganadi.",
    },
    {
      id: 3,
      question: "Machine Learning da 'Overfitting' (Qayta moslashuv) nimani anglatadi?",
      options: [
        "Model mashq ma'lumotlarini deyarli yodlab olgan, lekin yangi test ma'lumotlarida past aniqlik ko'rsatishi",
        "Model umuman hech narsani o'rgana olmaganligi",
        "Model juda tez ishlayotgani",
        "Dataset hajmi yetarli emasligi",
      ],
      correctIndex: 0,
      explanation: "Overfitting umumlashtirish qobiliyatining yo'qolishi va shovqinni o'rganib olishidir.",
    },
    {
      id: 4,
      question: "Klassifikatsiya modelining aniqligini baholashda 'Confusion Matrix' nimalarni ko'rsatadi?",
      options: [
        "Faqat ma'lumotlar bazasi hajmini",
        "True Positive, True Negative, False Positive, False Negative qiymatlarini",
        "Model qancha elektr toki sarflaganini",
        "Foydalanuvchilarning ism-familiyalarini",
      ],
      correctIndex: 1,
      explanation: "Confusion Matrix to'g'ri va noto'g'ri bashoratlarning to'liq matritsasini taqdim etadi.",
    },
    {
      id: 5,
      question: "Data Engineering da 'ETL' qisqartmasi nimani bildiradi?",
      options: [
        "Error Test Log",
        "Extract, Transform, Load (Ajratib olish, O'zgartirish, Yuklash)",
        "Easy To Learn",
        "Execute Task Later",
      ],
      correctIndex: 1,
      explanation: "ETL ma'lumotlar quvurining (pipeline) asosiy 3 ta bosqichidir.",
    },
  ],
};
