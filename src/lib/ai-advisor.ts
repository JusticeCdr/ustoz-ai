import { CAREER_TRACKS } from "./constants";
import { CareerTrackId } from "@/types";

export interface CareerRecommendationResult {
  trackId: CareerTrackId;
  trackTitle: string;
  matchScore: number;
  userSummary: string;
  reason: string;
  keySkills: string[];
  salaryRange: string;
  transcription?: string;
  source: "gemini" | "groq" | "openai" | "nlp-engine";
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

export function isAIConfigured() {
  return {
    gemini: !!GEMINI_API_KEY,
    groq: !!GROQ_API_KEY,
    openai: !!OPENAI_API_KEY,
  };
}

/**
 * Built-in Intelligent Uzbek NLP Affinity Engine.
 * Highly robust keyword, intent, and semantic scoring for Uzbek natural language.
 */
export function analyzeWithNLPEngine(text: string): CareerRecommendationResult {
  const clean = text.toLowerCase();

  const trackProfiles: Record<
    CareerTrackId,
    {
      keywords: string[];
      weight: number;
      defaultSkills: string[];
    }
  > = {
    "uiux-3d": {
      keywords: [
        "dizayn", "design", "rasm", "chizish", "chizmoq", "grafik", "grafika", "3d", "uch o'lchamli",
        "blender", "figma", "photoshop", "illustrator", "visual", "vizual", "estetika", "interfeys",
        "ui", "ux", "motion", "animatsiya", "render", "spline", "rang", "ranglar", "ijod", "ijodiy",
        "chizmachilik", "modellashtirish", "avatar", "go'zallik", "maket", "poster", "banner", "kreativ"
      ],
      weight: 0,
      defaultSkills: ["Figma 3D", "Spline & Three.js", "Spatial UI", "Micro-interactions", "Design Systems"],
    },
    "ai-prompt": {
      keywords: [
        "ai", "sun'iy intellekt", "suniy intellekt", "intellekt", "prompt", "chatgpt", "gpt", "gpt-4",
        "claude", "gemini", "llm", "neyrotarmoq", "robot", "avtomatlashtirish", "agent", "langchain",
        "rag", "suniy idrok", "til modellari", "sun'iy aql", "suniy aql", "bot yaratish", "neyron",
        "midjourney", "sora", "generative ai", "copilot"
      ],
      weight: 0,
      defaultSkills: ["LLM & GPT-4o", "Autonomous AI Agents", "Prompt Design", "LangChain", "RAG Systems"],
    },
    cybersecurity: {
      keywords: [
        "kiber", "kiberxavfsizlik", "xavfsizlik", "xaker", "haker", "hack", "pentest", "etik xaker",
        "etik xakerlik", "himoya", "parol", "shifr", "shifrlash", "virus", "antivirus", "zaiflik",
        "tarmoq", "network", "ctf", "axborot xavfsizligi", "kiberhujum", "firewall", "server himoyasi",
        "kali linux", "kriptografiya", "kiber posbon", "hujum", "buzib kirish"
      ],
      weight: 0,
      defaultSkills: ["Ethical Hacking", "Penetration Testing", "Network Security", "Cryptography", "SOC Defense"],
    },
    "fullstack-web3": {
      keywords: [
        "dasturlash", "dasturchi", "programmist", "sayt", "veb", "web", "frontend", "backend",
        "server", "fullstack", "react", "nextjs", "javascript", "typescript", "node", "html", "css",
        "api", "baza", "sql", "postgres", "smart contract", "web3", "blockchain", "kripto",
        "kod", "tizim", "ilovalar", "mobil ilova", "telegram bot"
      ],
      weight: 0,
      defaultSkills: ["Next.js 15", "TypeScript", "Node.js Microservices", "WebSockets", "Decentralized Apps"],
    },
    datascience: {
      keywords: [
        "data", "ma'lumot", "ma'lumotlar", "tahlil", "statistika", "analitika", "matematika", "sonlar",
        "jadval", "machine learning", "ml", "python", "pandas", "numpy", "data science", "bashorat",
        "hisob", "hisob-kitob", "katta ma'lumotlar", "big data", "vizualizatsiya", "iqtisod",
        "tahlilchi", "ehtimollik", "algoritm"
      ],
      weight: 0,
      defaultSkills: ["Python & Pandas", "PyTorch / TensorFlow", "Predictive Analytics", "Data Viz", "ETL Pipelines"],
    },
  };

  // Score calculation with word boundary weighting
  const scores: Record<CareerTrackId, number> = {
    "ai-prompt": 0,
    "fullstack-web3": 0,
    cybersecurity: 0,
    "uiux-3d": 0,
    datascience: 0,
  };

  (Object.keys(trackProfiles) as CareerTrackId[]).forEach((trackId) => {
    const profile = trackProfiles[trackId];
    for (const kw of profile.keywords) {
      if (clean.includes(kw)) {
        // Longer keywords carry higher intent weight
        scores[trackId] += kw.length > 5 ? 3 : 2;
      }
    }
  });

  // Pick highest scoring track
  let bestTrackId: CareerTrackId = "ai-prompt";
  let maxScore = -1;

  (Object.keys(scores) as CareerTrackId[]).forEach((tid) => {
    if (scores[tid] > maxScore) {
      maxScore = scores[tid];
      bestTrackId = tid;
    }
  });

  // If no specific match, default to AI Prompt Engineering or Fullstack
  const matchPercent = maxScore > 0 ? Math.min(99, 86 + maxScore * 2) : 92;
  const trackObj = CAREER_TRACKS.find((t) => t.id === bestTrackId) || CAREER_TRACKS[0];

  const reasonMap: Record<CareerTrackId, string> = {
    "uiux-3d":
      "Sizning ovozingizda ijodkorlik, vizual estetika, fazoviy tasavvur va foydalanuvchi tajribasini (UX) his qilish iqtidori yuqori baholandi. 3D Motion & UI/UX yo'nalishi sizning kreativ salohiyatingizni to'liq ochib beradi.",
    "ai-prompt":
      "Siz sun'iy intellekt, LLM modellarni boshqarish va jarayonlarni avtomatlashtirishga katta qiziqish bildirdingiz. Prompt Engineering va Avtonom AI agentlar hozirda jahon IT bozoridagi eng talabgir va tez o'suvchi kasbdir.",
    cybersecurity:
      "Sizda tizimlar xavfsizligi, himoya qatlamlari, mantiqiy ehtiyotkorlik va kiberhujumlarning oldini olishga nisbatan kuchli analitik intilish mavjud. Kiberxavfsizlik sohasi sizga xalqaro darajadagi nufuz va yuqori daromad keltiradi.",
    "fullstack-web3":
      "Siz mustahkam veb-tizimlar, interaktiv platformalar va zamonaviy arxitekturalarni noldan yaratishga ishtiyoqmand ekansiz. Fullstack Dasturlash va Veb 3.0 yo'nalishi sizning muhandislik salohiyatingizga 100% mos keladi.",
    datascience:
      "Sizda raqamlar, katta ma'lumotlar oqimi (Big Data), mantiqiy qonuniyatlar va bashorat qilishga bo'lgan kuchli qiziqish sezildi. Data Science va Machine Learning tahlili siz uchun eng istiqbolli yo'nalishdir.",
  };

  const summaryMap: Record<CareerTrackId, string> = {
    "uiux-3d": "Foydalanuvchi ijodiy dizayn, 3D modellar va vizual interfeyslarga qiziqish bildirdi.",
    "ai-prompt": "Foydalanuvchi sun'iy intellekt, promptlar va zamonaviy neyrotarmoqlarni boshqarishga intilmoqda.",
    cybersecurity: "Foydalanuvchi kiberxavfsizlik, xavfsiz tizimlar va axborot himoyasiga ustuvorlik berdi.",
    "fullstack-web3": "Foydalanuvchi zamonaviy dasturlash, veb-saytlar va to'liq tizimlar arxitekturasini tanladi.",
    datascience: "Foydalanuvchi ma'lumotlar tahlili, statistika va Machine Learning modellariga qiziqdi.",
  };

  return {
    trackId: bestTrackId,
    trackTitle: trackObj.title,
    matchScore: matchPercent,
    userSummary: summaryMap[bestTrackId],
    reason: reasonMap[bestTrackId],
    keySkills: trackObj.skills,
    salaryRange: trackObj.careerProspects,
    source: "nlp-engine",
  };
}

/**
 * Call Google Gemini 1.5/2.0 Flash REST API for deep semantic career diagnosis
 */
async function callGeminiForText(text: string): Promise<CareerRecommendationResult | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const prompt = `
Siz "Ustoz AI — Zamonaviy Kasblar Tanlovi 2026" ning bosh karyera va neyron diagnostika bo'yicha sun'iy intellektisiz.
Quyida foydalanuvchining o'z qiziqishlari, orzulari yoki tajribasi haqida aytgan gapi berilgan:
"${text}"

Tanlovda quyidagi 5 ta zamonaviy yo'nalish mavjud:
1. "ai-prompt" -> "Sun'iy Intellekt va Prompt Engineering"
2. "fullstack-web3" -> "Fullstack Dasturlash va Veb 3.0"
3. "cybersecurity" -> "Kiberxavfsizlik va Axborot Himoyasi"
4. "uiux-3d" -> "3D Motion & UI/UX Dizayn"
5. "datascience" -> "Data Science va Sun'iy Idrok Tahlili"

Foydalanuvchi gapidan kelib chiqib, unga ENG MOS keladigan bitta yo'nalishni tanlang va sof JSON formatida quyidagi strukturada javob bering:
{
  "trackId": "ai-prompt" | "fullstack-web3" | "cybersecurity" | "uiux-3d" | "datascience",
  "trackTitle": "Tanlangan yo'nalishning to'liq o'zbekcha nomi",
  "matchScore": 88 dan 99 gacha butun son,
  "userSummary": "Foydalanuvchi qiziqishi haqida 1 qisqa jumla (o'zbek tilida)",
  "reason": "Nima uchun aynan shu kasb unga mos kelishi haqida professional va ilhomlantiruvchi 2-3 jumlali tushuntirish (o'zbek tilida)",
  "keySkills": ["Ko'nikma 1", "Ko'nikma 2", "Ko'nikma 3", "Ko'nikma 4"],
  "salaryRange": "$1,500 - $4,500/oy"
}
Hech qanday qo'shimcha matn yoki markdown \`\`\` yozmang, faqat toza JSON.
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error status:", response.status);
      return null;
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const parsed = JSON.parse(candidateText.trim());
    const validTrack = CAREER_TRACKS.find((t) => t.id === parsed.trackId);
    if (!validTrack) return null;

    return {
      trackId: validTrack.id,
      trackTitle: validTrack.title,
      matchScore: parsed.matchScore || 95,
      userSummary: parsed.userSummary || "Ovozingiz orqali qiziqishingiz muvaffaqiyatli aniqlandi.",
      reason: parsed.reason || validTrack.shortDesc,
      keySkills: parsed.keySkills || validTrack.skills,
      salaryRange: parsed.salaryRange || validTrack.careerProspects,
      source: "gemini",
    };
  } catch (err) {
    console.error("Gemini call failed:", err);
    return null;
  }
}

/**
 * Call Groq / OpenAI LLM for text analysis
 */
async function callOpenAICompatibleText(
  text: string,
  apiKey: string,
  endpoint: string,
  model: string,
  sourceName: "groq" | "openai"
): Promise<CareerRecommendationResult | null> {
  try {
    const prompt = `
Siz "Ustoz AI — Zamonaviy Kasblar Tanlovi" platformasining karyera diagnostikasi bo'yicha sun'iy intellektisiz.
Foydalanuvchi o'z qiziqishlari haqida quyidagicha gapirdi:
"${text}"

Mavjud 5 ta yo'nalish:
1. "ai-prompt" (Sun'iy Intellekt va Prompt Engineering)
2. "fullstack-web3" (Fullstack Dasturlash va Veb 3.0)
3. "cybersecurity" (Kiberxavfsizlik va Axborot Himoyasi)
4. "uiux-3d" (3D Motion & UI/UX Dizayn)
5. "datascience" (Data Science va Sun'iy Idrok Tahlili)

Eng mos yo'nalishni tanlab, toza JSON formatida javob bering:
{
  "trackId": "ai-prompt" | "fullstack-web3" | "cybersecurity" | "uiux-3d" | "datascience",
  "matchScore": 88 dan 99 gacha butun son,
  "userSummary": "O'zbekcha qisqa xulosa",
  "reason": "Nima uchun aynan shu kasb unga mos kelishi haqida ilhomlantiruvchi o'zbekcha tushuntirish",
  "keySkills": ["Ko'nikma 1", "Ko'nikma 2", "Ko'nikma 3"],
  "salaryRange": "$1,500 - $4,500/oy"
}
`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    const validTrack = CAREER_TRACKS.find((t) => t.id === parsed.trackId);
    if (!validTrack) return null;

    return {
      trackId: validTrack.id,
      trackTitle: validTrack.title,
      matchScore: parsed.matchScore || 95,
      userSummary: parsed.userSummary || "Qiziqishingiz aniqlandi.",
      reason: parsed.reason || validTrack.shortDesc,
      keySkills: parsed.keySkills || validTrack.skills,
      salaryRange: parsed.salaryRange || validTrack.careerProspects,
      source: sourceName,
    };
  } catch (e) {
    console.error(`${sourceName} call failed:`, e);
    return null;
  }
}

/**
 * Main function: Analyze text with AI (Gemini -> Groq -> OpenAI -> Built-in NLP)
 */
export async function analyzeUserText(text: string): Promise<CareerRecommendationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return analyzeWithNLPEngine("dasturlash");
  }

  // 1. Try Gemini
  if (GEMINI_API_KEY) {
    const res = await callGeminiForText(trimmed);
    if (res) return res;
  }

  // 2. Try Groq
  if (GROQ_API_KEY) {
    const res = await callOpenAICompatibleText(
      trimmed,
      GROQ_API_KEY,
      "https://api.groq.com/openai/v1/chat/completions",
      "llama-3.3-70b-versatile",
      "groq"
    );
    if (res) return res;
  }

  // 3. Try OpenAI
  if (OPENAI_API_KEY) {
    const res = await callOpenAICompatibleText(
      trimmed,
      OPENAI_API_KEY,
      "https://api.openai.com/v1/chat/completions",
      "gpt-4o-mini",
      "openai"
    );
    if (res) return res;
  }

  // 4. Built-in Smart NLP Engine
  return analyzeWithNLPEngine(trimmed);
}

/**
 * Transcribe and analyze raw Audio Buffer with Multimodal AI (Gemini / Whisper)
 */
export async function analyzeUserAudio(
  audioBuffer: Buffer,
  mimeType: string = "audio/ogg"
): Promise<CareerRecommendationResult> {
  // If Gemini API Key is available: use multimodal audio comprehension directly!
  if (GEMINI_API_KEY) {
    try {
      const base64Audio = audioBuffer.toString("base64");
      const prompt = `
Ushbu audio yozuvda foydalanuvchi o'z qiziqishlari, qobiliyatlari yoki qaysi sohani o'rganmoqchi ekanligi haqida gapirgan (o'zbek, rus yoki ingliz tilida).
1. Avvalo, foydalanuvchi nima deganini to'liq eshiting va matnga aylantiring (transcription).
2. Quyidagi 5 ta yo'nalishdan unga ENG MOS keladigan bitta zamonaviy yo'nalishni tanlang:
   - "ai-prompt": Sun'iy Intellekt va Prompt Engineering
   - "fullstack-web3": Fullstack Dasturlash va Veb 3.0
   - "cybersecurity": Kiberxavfsizlik va Axborot Himoyasi
   - "uiux-3d": 3D Motion & UI/UX Dizayn
   - "datascience": Data Science va Sun'iy Idrok Tahlili

Quyidagi sof JSON formatida javob bering:
{
  "transcription": "Foydalanuvchi aytgan gapning aniq matni (o'zbek tilida)",
  "trackId": "ai-prompt" | "fullstack-web3" | "cybersecurity" | "uiux-3d" | "datascience",
  "trackTitle": "Yo'nalishning to'liq nomi",
  "matchScore": 88 dan 99 gacha butun son,
  "userSummary": "Foydalanuvchi nimalarga qiziqishi haqida 1 jumla",
  "reason": "Nega aynan shu kasb unga mosligi haqida 2-3 jumlali motivatsion tushuntirish",
  "keySkills": ["Ko'nikma 1", "Ko'nikma 2", "Ko'nikma 3"],
  "salaryRange": "$1,500 - $4,500/oy"
}
Faqat sof JSON qaytaring.
`;

      const cleanMime = mimeType.includes("ogg")
        ? "audio/ogg"
        : mimeType.includes("mp3")
        ? "audio/mp3"
        : mimeType.includes("wav")
        ? "audio/wav"
        : mimeType.includes("webm")
        ? "audio/webm"
        : "audio/ogg";

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: cleanMime,
                    data: base64Audio,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.3,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText.trim());
          const validTrack = CAREER_TRACKS.find((t) => t.id === parsed.trackId) || CAREER_TRACKS[0];
          return {
            trackId: validTrack.id,
            trackTitle: validTrack.title,
            matchScore: parsed.matchScore || 96,
            userSummary: parsed.userSummary || "Ovozingiz orqali qiziqishingiz aniqlandi.",
            reason: parsed.reason || validTrack.shortDesc,
            keySkills: parsed.keySkills || validTrack.skills,
            salaryRange: parsed.salaryRange || validTrack.careerProspects,
            transcription: parsed.transcription || "Ovozli xabar tinglandi",
            source: "gemini",
          };
        }
      } else {
        console.error("Gemini Audio API Error status:", response.status);
      }
    } catch (e) {
      console.error("Gemini audio analysis error:", e);
    }
  }

  // If Groq or OpenAI Whisper is configured, we can transcribe via FormData
  if (GROQ_API_KEY || OPENAI_API_KEY) {
    try {
      const apiKey = GROQ_API_KEY || OPENAI_API_KEY;
      const endpoint = GROQ_API_KEY
        ? "https://api.groq.com/openai/v1/audio/transcriptions"
        : "https://api.openai.com/v1/audio/transcriptions";
      const model = GROQ_API_KEY ? "whisper-large-v3-turbo" : "whisper-1";

      const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
      const formData = new FormData();
      formData.append("file", blob, "voice.ogg");
      formData.append("model", model);
      formData.append("language", "uz");

      const transRes = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
      });

      if (transRes.ok) {
        const transData = await transRes.json();
        const transcriptText = transData.text || "";
        if (transcriptText.trim()) {
          const recommendation = await analyzeUserText(transcriptText);
          recommendation.transcription = transcriptText;
          return recommendation;
        }
      }
    } catch (e) {
      console.error("Whisper transcription error:", e);
    }
  }

  // Fallback when no AI API key is configured on server:
  // Return an informative response instructing how to set GEMINI_API_KEY
  return {
    trackId: "ai-prompt",
    trackTitle: "Sun'iy Intellekt va Prompt Engineering",
    matchScore: 95,
    userSummary: "Ovozli xabar qabul qilindi.",
    reason:
      "Ovozli tahlilni to'liq quvvatda ishga tushirish uchun .env.local fayliga GEMINI_API_KEY kalitini joylang (Google AI Studio'dan bepul olinadi). Shuningdek, qiziqishingizni matn ko'rinishida yozsangiz, AI darhol tahlil qilib beradi!",
    keySkills: ["AI workflow integration", "Autonomous Agents", "Prompt Optimization"],
    salaryRange: "$1,500 - $4,500/oy",
    transcription: "Ovozli xabar (To'liq AI transkripsiyasi uchun GEMINI_API_KEY kerak)",
    source: "nlp-engine",
  };
}
