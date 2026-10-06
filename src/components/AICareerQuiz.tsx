"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Zap,
  Target,
  Shield,
  ShieldCheck,
  Code2,
  Bot,
  Palette,
  BarChart3,
  Cpu,
  Terminal,
  Volume2,
  VolumeX,
  Share2,
  Flame,
  Trophy,
  Activity,
  Layers,
  ChevronRight,
  Mic,
} from "lucide-react";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrackId } from "@/types";

export interface AICareerQuizProps {
  onSelectTrackAndRegister: (trackId: CareerTrackId) => void;
  onOpenVoiceAdvisor?: () => void;
}

interface QuizOption {
  label: string;
  description: string;
  trackId: CareerTrackId;
  icon: React.ComponentType<{ className?: string }>;
  trait: string;
  points: {
    ai: number;
    engineering: number;
    security: number;
    design: number;
    data: number;
  };
}

interface QuizQuestion {
  id: number;
  phaseCode: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    phaseCode: "FAZA 01 // KOGNITIV AFFINITET",
    title: "Qaysi texnologik super-kuch sizni ko'proq hayratga soladi va o'zingizda rivojlantirmoqchisiz?",
    subtitle: "Kognitiv qobiliyatlaringizning asosiy yo'nalishini aniqlash",
    categoryBadge: "Kognitiv Asos",
    options: [
      {
        label: "Avtonom AI agentlar va katta neyrotarmoqlarni (LLM) boshqarish",
        description: "ChatGPT, Claude kabi sun'iy idrok tizimlariga buyruq berish va avtomatlashtirish",
        trackId: "ai-prompt",
        icon: Bot,
        trait: "Neural Orchestrator",
        points: { ai: 40, engineering: 10, security: 10, design: 5, data: 25 },
      },
      {
        label: "Noldan millionlab foydalanuvchiga ega mustahkam veb-tizimlar qurish",
        description: "Next.js, TypeScript va zamonaviy server infratuzilmalari arxitekturasini loyihalash",
        trackId: "fullstack-web3",
        icon: Code2,
        trait: "System Architect",
        points: { ai: 10, engineering: 45, security: 15, design: 15, data: 10 },
      },
      {
        label: "Murakkab kiber-hujumlarni qaytarish va xavfsizlik zaifliklarini topish",
        description: "Etik xakerlik (Pentesting), serverlarni himoyalash va shifrlash protokollari",
        trackId: "cybersecurity",
        icon: ShieldCheck,
        trait: "Cyber Sentinel",
        points: { ai: 10, engineering: 20, security: 45, design: 5, data: 15 },
      },
      {
        label: "Insonni sehrlab qo'yuvchi 3D interaktiv olamlar va dizayn interfeyslari",
        description: "Three.js, Spline va ultra-zamonaviy Spatial UI/UX estetikasi yaratish",
        trackId: "uiux-3d",
        icon: Palette,
        trait: "Spatial Innovator",
        points: { ai: 15, engineering: 15, security: 5, design: 45, data: 10 },
      },
    ],
  },
  {
    id: 2,
    phaseCode: "FAZA 02 // MUAMMO YECHISH USLUBI",
    title: "Katta va jumboqli loyihaga duch kelsangiz, sizning eng birinchi instinktingiz qanday bo'ladi?",
    subtitle: "Muammolarni yechishdagi individual mantiqiy yondashuvingiz",
    categoryBadge: "Mantiq & Yondashuv",
    options: [
      {
        label: "Katta ma'lumotlar to'plami (Big Data) va matematik qonuniyatlarni qazish",
        description: "Raqamlar ortidagi yashirin trendlarni topib, natijalarni oldindan prognoz qilish",
        trackId: "datascience",
        icon: BarChart3,
        trait: "Pattern Miner",
        points: { ai: 25, engineering: 15, security: 10, design: 5, data: 45 },
      },
      {
        label: "Tizim arxitekturasini chizish: Frontend, Backend va API'larni rejalashtirish",
        description: "Barcha qismlarni bir-biriga uzluksiz bog'lovchi to'liq ekotizim yaratish",
        trackId: "fullstack-web3",
        icon: Code2,
        trait: "Fullstack Builder",
        points: { ai: 10, engineering: 40, security: 15, design: 15, data: 15 },
      },
      {
        label: "Sun'iy intellektga aniq promptlar berib, ishni 10x tezlashtirish usullarini sinash",
        description: "LLM agentlari va AI ko-pilotlari orqali yechimni lahzada yaratish",
        trackId: "ai-prompt",
        icon: Bot,
        trait: "Prompt Alchemist",
        points: { ai: 45, engineering: 15, security: 10, design: 15, data: 15 },
      },
      {
        label: "Tizimning zaif nuqtalarini qidirish va barcha himoya qatlamlarini tekshirish",
        description: "Xatoliklar va kutilmagan buzilishlarning oldini oluvchi mustahkam qalqon o'rnatish",
        trackId: "cybersecurity",
        icon: Shield,
        trait: "Threat Hunter",
        points: { ai: 10, engineering: 20, security: 45, design: 5, data: 15 },
      },
    ],
  },
  {
    id: 3,
    phaseCode: "FAZA 03 // IJODIY VA ANALITIK ENERGIYA",
    title: "Bo'sh vaqtingizda qaysi texnologik tajriba bilan tong ottirish siz uchun eng zavqli?",
    subtitle: "Sizga haqiqiy ilhom beruvchi amaliy faoliyat sohasi",
    categoryBadge: "Ichki Motivatsiya",
    options: [
      {
        label: "Figma, Blender yoki Three.js'da interaktiv 3D tajribalar jonlantirish",
        description: "Piksellarga jon kiritish, nur va soya fizikasi bilan yangi dunyo chizish",
        trackId: "uiux-3d",
        icon: Palette,
        trait: "3D Creator",
        points: { ai: 10, engineering: 15, security: 5, design: 50, data: 10 },
      },
      {
        label: "Bashorat qiluvchi Machine Learning modellari va PyTorch neyrotarmoqlari",
        description: "Algoritmlarni mashq qildirish va kelajak trendlarini ehtimolliklar bilan hisoblash",
        trackId: "datascience",
        icon: BarChart3,
        trait: "Deep Learner",
        points: { ai: 30, engineering: 10, security: 10, design: 5, data: 45 },
      },
      {
        label: "LLM'lar bazasida aqlli Telegram botlar va AI yordamchilar kodlash",
        description: "Inson kabi muloqot qiluvchi avtonom yordamchi tizimlar ekotizimi",
        trackId: "ai-prompt",
        icon: Bot,
        trait: "Agent Developer",
        points: { ai: 40, engineering: 25, security: 10, design: 10, data: 15 },
      },
      {
        label: "Etik xakerlik (CTF) musobaqalari va kriptografik sirlarni yechish",
        description: "Tarmoq trafigini tahlil qilish, shifrlarni ochish va tizimni xavfsiz qilish",
        trackId: "cybersecurity",
        icon: ShieldCheck,
        trait: "Code Cryptor",
        points: { ai: 10, engineering: 20, security: 45, design: 5, data: 15 },
      },
    ],
  },
  {
    id: 4,
    phaseCode: "FAZA 04 // JAMOA ICHI ARXETIPI",
    title: "Xalqaro IT jamoasida qaysi rolni egallash sizga eng ko'p kuch va motivatsiya beradi?",
    subtitle: "Jamoaviy dinamikada eng kuchli bo'lgan o'rningiz",
    categoryBadge: "Karyera Archetipi",
    options: [
      {
        label: "Bosh Dasturchi (Tech Lead) — g'oyani to'liq ishlaydigan tayyor mahsulotga aylantiruvchi",
        description: "Serverdan to brauzergacha bo'lgan to'liq mas'uliyatni o'z zimmasiga oluvchi",
        trackId: "fullstack-web3",
        icon: Code2,
        trait: "Tech Commander",
        points: { ai: 10, engineering: 45, security: 15, design: 15, data: 10 },
      },
      {
        label: "AI Strateg — kompaniyani eng so'nggi sun'iy idrok vositalari bilan qurollantiruvchi",
        description: "Kompaniya ish samaradorligini AI vositalari orqali bir necha karra oshiruvchi",
        trackId: "ai-prompt",
        icon: Cpu,
        trait: "AI Pioneer",
        points: { ai: 45, engineering: 15, security: 10, design: 15, data: 15 },
      },
      {
        label: "Xavfsizlik Qo'riqchisi (Security Chief) — milliardlik aktivlar daxlsizligining kafolati",
        description: "Kiberhujumchilarga qarshi mustahkam devor quruvchi ishonchli posbon",
        trackId: "cybersecurity",
        icon: Shield,
        trait: "Security Guardian",
        points: { ai: 10, engineering: 20, security: 45, design: 5, data: 15 },
      },
      {
        label: "Bosh Dizayner (Head of Design) — foydalanuvchilar mehrini qozonuvchi mahsulot yaratuvchi",
        description: "Har bir harakat, rang va tugmaning intuitiv va mukammal bo'lishini ta'minlovchi",
        trackId: "uiux-3d",
        icon: Palette,
        trait: "Experience Lead",
        points: { ai: 10, engineering: 10, security: 5, design: 50, data: 10 },
      },
    ],
  },
  {
    id: 5,
    phaseCode: "FAZA 05 // STRATEGIK VISION",
    title: "Kelgusi 3-5 yilda dunyoga qanday texnologik ta'sir o'tkazishni maqsad qilgansiz?",
    subtitle: "Sizning global ambitsiyangiz va kelajakdagi orzuingiz",
    categoryBadge: "Global Vision",
    options: [
      {
        label: "Dunyoning yetakchi AI laboratoriyalarida yuqori darajali Prompt & AI Engineer",
        description: "Sun'iy aqlning yangi davrini shakllantiruvchi global yetakchilardan biriga aylanish",
        trackId: "ai-prompt",
        icon: Bot,
        trait: "Cognitive Engineer",
        points: { ai: 45, engineering: 15, security: 10, design: 10, data: 15 },
      },
      {
        label: "Katta korporatsiyalarning strategik AI va Big Data bashorat tizimlari yetakchisi",
        description: "Tarixdagi eng katta ma'lumotlar oqimini tahlil qilib, to'g'ri qarorlar qabul qilish",
        trackId: "datascience",
        icon: BarChart3,
        trait: "Data Strategist",
        points: { ai: 25, engineering: 15, security: 10, design: 5, data: 45 },
      },
      {
        label: "Global miqyosdagi millionlab odamlar ishlatadigan Fullstack & Web3 platformalar muallifi",
        description: "Dunyo bo'ylab tez, xavfsiz va qulay ishlaydigan yirik veb-mahsulotlarni boshqarish",
        trackId: "fullstack-web3",
        icon: Code2,
        trait: "Ecosystem Builder",
        points: { ai: 10, engineering: 45, security: 15, design: 15, data: 10 },
      },
      {
        label: "Xalqaro darajada e'tirof etilgan Kiberxavfsizlik va Kriptografiya eksperti",
        description: "Dunyo darajasidagi tizimlarni kiberhujumlar va axborot o'g'irlanishidan asrash",
        trackId: "cybersecurity",
        icon: ShieldCheck,
        trait: "Cyber Defender",
        points: { ai: 10, engineering: 20, security: 45, design: 5, data: 15 },
      },
    ],
  },
];

const TERMINAL_LOGS = [
  "● [NEURAL_INIT] Shaxsiy neyron profil va kognitiv qobiliyatlar skanerlanmoqda...",
  "● [SYNAPSE_SCAN] Mantiqiy, analitik va ijodiy parametrlar balansi tahlil qilinmoqda...",
  "● [CORRELATION] 5 ta zamonaviy kasb klasteri bo'yicha neyron moslik hisoblanmoqda...",
  "● [MATRIX_OPTIMIZE] Algoritmik sinxronizatsiya 98.4% aniqlik bilan tasdiqlandi!",
  "● [RESULT_READY] Sizning ideal kasbiy traektoriyangiz muvaffaqiyatli shakllantirildi!",
];

export default function AICareerQuiz({
  onSelectTrackAndRegister,
  onOpenVoiceAdvisor,
}: AICareerQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<"quiz" | "analyzing" | "result">("quiz");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  // Trait scores accumulator
  const [traitPoints, setTraitPoints] = useState({
    ai: 0,
    engineering: 0,
    security: 0,
    design: 0,
    data: 0,
  });

  const [trackScores, setTrackScores] = useState<Record<CareerTrackId, number>>({
    "ai-prompt": 0,
    "fullstack-web3": 0,
    cybersecurity: 0,
    "uiux-3d": 0,
    datascience: 0,
  });

  // Analyzing screen states
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);

  // Result animation states
  const [displayedPercent, setDisplayedPercent] = useState(0);

  // 3D Card Physics Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], ["-11deg", "11deg"]);
  const specularX = useTransform(smoothMouseX, [-0.5, 0.5], ["15%", "85%"]);
  const specularY = useTransform(smoothMouseY, [-0.5, 0.5], ["15%", "85%"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Cybernetic Sound Synthesizer (Procedural Web Audio API)
  const playCyberSound = (type: "hover" | "click" | "analyzing" | "reveal" | "step") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "step") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "reveal") {
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.setValueAtTime(freq, now + idx * 0.07);
          g.gain.setValueAtTime(0.05, now + idx * 0.07);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
          o.start(now + idx * 0.07);
          o.stop(now + idx * 0.07 + 0.35);
        });
      }
    } catch {
      // Audio permission or browser policy catch
    }
  };

  // Option select handler
  const handleSelectOption = (opt: QuizOption, index: number) => {
    setSelectedOptionIndex(index);
    playCyberSound("click");

    setTraitPoints((prev) => ({
      ai: prev.ai + opt.points.ai,
      engineering: prev.engineering + opt.points.engineering,
      security: prev.security + opt.points.security,
      design: prev.design + opt.points.design,
      data: prev.data + opt.points.data,
    }));

    setTrackScores((prev) => ({
      ...prev,
      [opt.trackId]: (prev[opt.trackId] || 0) + 1,
    }));

    setTimeout(() => {
      setSelectedOptionIndex(null);
      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
        playCyberSound("step");
      } else {
        // Start dramatic 3-second analyzing state
        setMode("analyzing");
      }
    }, 280);
  };

  // Analyzing sequence
  useEffect(() => {
    if (mode !== "analyzing") return;

    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += 2;
      setAnalysisProgress(Math.min(100, progress));

      const logIdx = Math.min(
        TERMINAL_LOGS.length - 1,
        Math.floor((progress / 100) * TERMINAL_LOGS.length)
      );
      setActiveLogIndex(logIdx);

      if (progress >= 100) {
        clearInterval(progressTimer);
        setTimeout(async () => {
          setMode("result");
          playCyberSound("reveal");
          try {
            const confetti = (await import("canvas-confetti")).default;
            confetti({
              particleCount: 80,
              spread: 75,
              origin: { y: 0.62 },
              colors: ["#00f0ff", "#9d4edd", "#f72585", "#ffbe0b", "#06d6a0"],
            });
          } catch {
            // confetti fallback
          }
        }, 500);
      }
    }, 55);

    return () => clearInterval(progressTimer);
  }, [mode]);

  // Determine best matching career
  let bestTrackId: CareerTrackId = "ai-prompt";
  let maxScore = -1;
  (Object.keys(trackScores) as CareerTrackId[]).forEach((t) => {
    if (trackScores[t] > maxScore) {
      maxScore = trackScores[t];
      bestTrackId = t;
    }
  });

  const matchedTrack = CAREER_TRACKS.find((t) => t.id === bestTrackId) || CAREER_TRACKS[0];
  const targetMatchPercent = Math.min(98, 88 + maxScore * 2.5);

  // Animate counter up when entering result mode
  useEffect(() => {
    if (mode !== "result") return;
    let current = 0;
    const step = Math.ceil(targetMatchPercent / 35);
    const counterTimer = setInterval(() => {
      current += step;
      if (current >= targetMatchPercent) {
        setDisplayedPercent(Math.round(targetMatchPercent));
        clearInterval(counterTimer);
      } else {
        setDisplayedPercent(current);
      }
    }, 28);

    return () => clearInterval(counterTimer);
  }, [mode, targetMatchPercent]);

  // Restart quiz
  const handleRestart = () => {
    playCyberSound("click");
    setDirection(-1);
    setCurrentStep(0);
    setAnalysisProgress(0);
    setActiveLogIndex(0);
    setDisplayedPercent(0);
    setSelectedOptionIndex(null);
    setTraitPoints({ ai: 0, engineering: 0, security: 0, design: 0, data: 0 });
    setTrackScores({
      "ai-prompt": 0,
      "fullstack-web3": 0,
      cybersecurity: 0,
      "uiux-3d": 0,
      datascience: 0,
    });
    setMode("quiz");
  };

  const question = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  // Normalized trait percentages for the Cognitive Matrix radar
  const totalPoints =
    traitPoints.ai +
    traitPoints.engineering +
    traitPoints.security +
    traitPoints.design +
    traitPoints.data || 1;

  const traitMatrix = [
    { name: "Sun'iy Idrok & Prompting", pct: Math.min(99, Math.round((traitPoints.ai / totalPoints) * 100 * 2.5) + 35), color: "from-cyan-400 to-blue-500", text: "text-cyan-300" },
    { name: "Tizimli Muhandislik (Fullstack)", pct: Math.min(99, Math.round((traitPoints.engineering / totalPoints) * 100 * 2.5) + 30), color: "from-purple-400 to-indigo-500", text: "text-purple-300" },
    { name: "Kiber-Xavfsizlik & Himoya", pct: Math.min(99, Math.round((traitPoints.security / totalPoints) * 100 * 2.5) + 25), color: "from-emerald-400 to-teal-500", text: "text-emerald-300" },
    { name: "Spatial 3D & UX Estetika", pct: Math.min(99, Math.round((traitPoints.design / totalPoints) * 100 * 2.5) + 28), color: "from-pink-400 to-rose-500", text: "text-pink-300" },
  ];

  // Telegram share link
  const shareText = `🚀 Men "Ustoz AI — Zamonaviy Kasblar Tanlovi" Diagnostikasidan o'tdim!\n\n🎯 Menga 100% mos kelgan zamonaviy yo'nalish: ${matchedTrack.title} (${displayedPercent}% moslik)!\n\nSiz ham o'z iqtidoringizni aniqlang va bepul tanlovda ishtirok eting:`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://zamonaviy-kasblar.uz";
  const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <section id="ai-kviz" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      {/* Dynamic Background Ambient Nebulas */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-purple-600/15 to-pink-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Badge & Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D AI Karyera Matritsa Simulyatori</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]"
        >
          Qaysi Zamonaviy Kasb Sizga{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(157,78,221,0.4)]">
            100% Mos Keladi?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Ustoz AI neyron diagnostikasi orqali kognitiv kuchli tomonlaringizni sinab ko&apos;ring va kelajagingiz uchun eng daromadli yo&apos;nalishni aniqlang.
        </motion.p>

        {onOpenVoiceAdvisor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="pt-2 flex justify-center"
          >
            <button
              onClick={onOpenVoiceAdvisor}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-105 active:scale-95 transition-all group"
            >
              <Mic className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-125 transition-transform" />
              <span>Yoki Ovozli AI orqali aniqlang (Mikrofon bilan gapiring)</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Main 3D Interactive Card Viewport */}
      <div style={{ perspective: "1200px" }} className="w-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            rotateX: mode === "quiz" ? rotateX : 0,
            rotateY: mode === "quiz" ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          className="relative rounded-3xl p-6 sm:p-10 glass-panel border border-cyan-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-[#070c26]/90 transition-shadow duration-500 overflow-hidden"
        >
          {/* Dynamic Specular Glare Layer that follows mouse cursor */}
          <motion.div
            style={{
              background: `radial-gradient(circle 380px at ${specularX} ${specularY}, rgba(0, 240, 255, 0.08), transparent 80%)`,
            }}
            className="absolute inset-0 pointer-events-none -z-0"
          />

          {/* Sound Toggle Button & Live Status Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 z-10 relative">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="uppercase tracking-wider">
                {mode === "quiz" && `Neyron Faza: ${currentStep + 1} / ${QUIZ_QUESTIONS.length}`}
                {mode === "analyzing" && "AI Matritsa: Tahlil Rejimi"}
                {mode === "result" && "AI Diagnostika Yakuni"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-all border ${
                  soundEnabled
                    ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
                title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline font-mono text-[10px] uppercase">
                  {soundEnabled ? "Ovoz: ON" : "Ovoz: OFF"}
                </span>
              </button>
            </div>
          </div>

          {/* PHASE 1: ACTIVE QUIZ VIEW */}
          {mode === "quiz" && (
            <div className="space-y-6 relative z-10">
              {/* Futuristic Progress Capsule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    {question.phaseCode}
                  </span>
                  <span className="text-gray-300 font-extrabold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                    AI Synapse Sync: <span className="text-cyan-400">{progressPercent}%</span>
                  </span>
                </div>

                {/* Progress bar with glowing neon spark */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 relative"
                    initial={{ width: `${(currentStep / QUIZ_QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_12px_#00f0ff] animate-pulse" />
                  </motion.div>
                </div>
              </div>

              {/* 3D Cube / Warp Question Transition */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, rotateY: direction > 0 ? 30 : -30, scale: 0.94, z: -80 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1, z: 0 }}
                  exit={{ opacity: 0, rotateY: direction > 0 ? -30 : 30, scale: 0.94, z: -80 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Category Pill + Question Title */}
                  <div className="space-y-2 pt-1">
                    <span className="inline-block px-3 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {question.categoryBadge}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
                      {question.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-normal">
                      {question.subtitle}
                    </p>
                  </div>

                  {/* 3D Floating Micro-Cards (Options Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {question.options.map((opt, i) => {
                      const Icon = opt.icon;
                      const isSelected = selectedOptionIndex === i;

                      return (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onMouseEnter={() => playCyberSound("hover")}
                          onClick={() => handleSelectOption(opt, i)}
                          className={`relative text-left p-5 rounded-2xl glass-panel border transition-all duration-300 flex items-start gap-4 group overflow-hidden ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
                              : "border-white/10 hover:border-cyan-400/60 hover:bg-[#0c1438]/80 hover:shadow-[0_10px_30px_rgba(0,240,255,0.15)]"
                          }`}
                        >
                          {/* Option glowing icon badge */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
                            <Icon className="w-6 h-6" />
                          </div>

                          {/* Content */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                {opt.trait}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                            </div>

                            <div className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors leading-snug">
                              {opt.label}
                            </div>
                            <div className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300">
                              {opt.description}
                            </div>
                          </div>

                          {/* Ripple pulse on click */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0.8 }}
                              animate={{ scale: 2.5, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className="absolute inset-0 bg-cyan-400/30 rounded-2xl pointer-events-none"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* PHASE 2: DRAMATIC 3-SECOND AI NEURAL ANALYSIS STATE */}
          {mode === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-8 z-10 relative"
            >
              {/* 3D Holographic Gyroscope Orb */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                  animate={{ rotateZ: 360, rotateX: [60, 45, 60] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/70 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                />

                {/* Middle Ring */}
                <motion.div
                  animate={{ rotateZ: -360, rotateY: [60, 45, 60] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full border-2 border-dotted border-pink-400/70 shadow-[0_0_20px_rgba(247,37,133,0.4)]"
                />

                {/* Inner Ring */}
                <motion.div
                  animate={{ rotateZ: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-7 rounded-full border border-purple-400/80"
                />

                {/* Glowing Core */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_35px_rgba(0,240,255,0.8)] animate-pulse">
                  <BrainCircuit className="w-8 h-8 text-white animate-spin" style={{ animationDuration: "10s" }} />
                </div>

                {/* Scanning Laser Line */}
                <motion.div
                  animate={{ y: [-80, 80, -80] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-40 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00f0ff]"
                />
              </div>

              {/* Status & Real-time Progress Bar */}
              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 font-bold tracking-wider">NEURAL CORE SYNCHRONIZATION</span>
                  <span className="text-2xl font-black text-white">{analysisProgress}%</span>
                </div>

                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-cyan-400/30">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Diagnostics Feed */}
              <div className="w-full max-w-lg bg-[#04081c] border border-cyan-500/30 rounded-xl p-4 text-left font-mono text-xs space-y-1.5 shadow-inner">
                <div className="flex items-center gap-2 text-gray-500 pb-1 border-b border-white/5 text-[10px]">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>USTOZ_AI_DIAGNOSTICS_V3.0 // LOG CONSOLE</span>
                </div>
                {TERMINAL_LOGS.slice(0, activeLogIndex + 1).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`leading-relaxed ${
                      index === activeLogIndex ? "text-cyan-300 font-bold" : "text-gray-400"
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PHASE 3: MIND-BLOWING 3D RESULT SHOWCASE */}
          {mode === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="py-4 space-y-8 z-10 relative"
            >
              {/* Top Verified Ribbon */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(6,214,160,0.25)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Diagnostika Muvaffaqiyatli Yakunlandi</span>
                </div>
              </div>

              {/* Main Holographic Trophy Banner */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c163d] to-[#080d28] border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col md:flex-row items-center gap-8">
                {/* 3D Percentage Radial Gauge */}
                <div className="relative flex flex-col items-center justify-center shrink-0">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-white/10"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-cyan-400 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                        strokeWidth="8"
                        strokeDasharray={264}
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (264 * displayedPercent) / 100 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-black font-mono text-cyan-300 tracking-tight">
                        {displayedPercent}%
                      </span>
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                        Moslik
                      </span>
                    </div>
                  </div>
                </div>

                {/* Career Title & Summary */}
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-mono font-bold uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tavsiya etilgan kasb</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {matchedTrack.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {matchedTrack.shortDesc}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                    <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-bold">
                      Karyera daromadi: {matchedTrack.careerProspects}
                    </span>
                    <span className="text-xs font-mono px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                      Murakkablik: {matchedTrack.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cognitive Matrix 4-Axis Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Kognitiv Ko&apos;nikmalar Matritsasi
                  </span>
                  <span>Ustoz AI Tahlili</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {traitMatrix.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl glass-panel border border-white/10 space-y-2 bg-[#090f2b]/80"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-300">{item.name}</span>
                        <span className={`font-bold ${item.text}`}>{item.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + idx * 0.1 }}
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Register + Telegram Share + Retake */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => onSelectTrackAndRegister(matchedTrack.id)}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Ushbu Yo&apos;nalishga Ro&apos;yxatdan O&apos;tish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={telegramShareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 px-5 rounded-xl font-semibold text-xs text-cyan-300 glass-panel border border-cyan-400/40 hover:bg-cyan-500/15 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Telegram&apos;da Ulashish</span>
                </a>

                <button
                  onClick={handleRestart}
                  className="py-4 px-4 rounded-xl font-semibold text-xs text-gray-300 hover:text-white glass-panel border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
                  title="Testni qaytadan boshlash"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Qaytadan</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
