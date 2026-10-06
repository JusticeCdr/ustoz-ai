"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  Zap,
  Target,
  Shield,
  Code2,
  Bot,
  Palette,
  BarChart3,
} from "lucide-react";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrackId } from "@/types";

interface AICareerQuizProps {
  onSelectTrackAndRegister: (trackId: CareerTrackId) => void;
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    recommendedTrack: CareerTrackId;
    icon: any;
    trait: string;
  }[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "Qaysi turdagi muammolarni yechish sizga ko'proq zavq bag'ishlaydi?",
    subtitle: "1 / 4 • Qobiliyat yo'nalishi",
    options: [
      {
        label: "Neyrotarmoqlar va AI modellarini yangi vazifalarga o'rgatish",
        description: "ChatGPT, Claude kabi LLMlar bilan muloqot va AI agentlar yaratish",
        recommendedTrack: "ai-prompt",
        icon: Bot,
        trait: "AI Mindset",
      },
      {
        label: "Murakkab tizimlar, veb-saytlar va platformalar arxitekturasini qurish",
        description: "Foydalanuvchi interfeysi va server logikasini bog'lash",
        recommendedTrack: "fullstack-web3",
        icon: Code2,
        trait: "Engineering",
      },
      {
        label: "Zaifliklarni izlash, xavfsizlik teshiklarini yopish va himoya qilish",
        description: "Hakerlar hujumini bartaraf etish va shifrlash usullari",
        recommendedTrack: "cybersecurity",
        icon: Shield,
        trait: "Security Guardian",
      },
      {
        label: "Ko'zga yoqadigan zamonaviy 3D vizuallar va foydalanuvchi interfeyslari chizish",
        description: "Vizual estetika, 3D modellar va interaktiv animatsiyalar",
        recommendedTrack: "uiux-3d",
        icon: Palette,
        trait: "Creative Vision",
      },
    ],
  },
  {
    id: 2,
    title: "Bo'sh vaqtingizda qanday texnologiyalarni o'rganishni afzal ko'rasiz?",
    subtitle: "2 / 4 • Qiziqishlar sferasi",
    options: [
      {
        label: "Katta ma'lumotlar to'plami, statistik trendlar va prognozlash modellari",
        description: "Ma'lumotlar orqali biznes natijalarini oldindan aytib berish",
        recommendedTrack: "datascience",
        icon: BarChart3,
        trait: "Analytical",
      },
      {
        label: "Sun'iy intellekt agentlari, Prompt Engineering va avtomatlashtirish",
        description: "Insoniy vazifalarni AI orqali 10 barobar tezlashtirish",
        recommendedTrack: "ai-prompt",
        icon: Bot,
        trait: "AI Autonomy",
      },
      {
        label: "Blokcheyn, Veb 3.0 va yuqori yuklamali veb-infrastrukturalar",
        description: "Markazlashmagan xizmatlar va Fullstack ilovalar",
        recommendedTrack: "fullstack-web3",
        icon: Code2,
        trait: "Fullstack Architect",
      },
      {
        label: "Etik xakerlik (Penetration Testing) va kiber-mudofaa sirlari",
        description: "Tizimlarni tekshirish va serverlarni xavfsiz saqlash",
        recommendedTrack: "cybersecurity",
        icon: Shield,
        trait: "Cyber Defense",
      },
    ],
  },
  {
    id: 3,
    title: "Jamoada qanday rol sizning eng kuchli tomoningiz hisoblanadi?",
    subtitle: "3 / 4 • Jamoaviy rol",
    options: [
      {
        label: "Ijodkor dizayner — mahsulotning har bir pikselli jozibasini ta'minlovchi",
        description: "Foydalanuvchi tajribasi (UX) va 3D spatial vizualizatsiya",
        recommendedTrack: "uiux-3d",
        icon: Palette,
        trait: "Product Designer",
      },
      {
        label: "Mantiqiy tahlilchi — ma'lumotlar ichidagi yashirin qonuniyatlarni ochuvchi",
        description: "Matematik modellar va mashinali o'rganish algoritmlari",
        recommendedTrack: "datascience",
        icon: BarChart3,
        trait: "Data Scientist",
      },
      {
        label: "Bosh muhandis — g'oyani to'liq ishlaydigan tayyor mahsulotga aylantiruvchi",
        description: "Frontend + Backend + Ma'lumotlar bazasi integratori",
        recommendedTrack: "fullstack-web3",
        icon: Code2,
        trait: "Builder",
      },
      {
        label: "Xavfsizlik inspektori — har qanday xavf-xatarni oldindan ko'ra oluvchi",
        description: "Xavfsizlik protokollari va kriptografik himoya",
        recommendedTrack: "cybersecurity",
        icon: Shield,
        trait: "Risk Controller",
      },
    ],
  },
  {
    id: 4,
    title: "Kelgusi 3 yilda o'zingizni qaysi kasb cho'qqisida tasavvur qilasiz?",
    subtitle: "4 / 4 • Karyera maqsadi",
    options: [
      {
        label: "Dunyoning yetakchi AI laboratoriyalarida Prompt / AI Engineer",
        description: "Generativ sun'iy idrok tizimlarini boshqaruvchi mutaxassis",
        recommendedTrack: "ai-prompt",
        icon: Bot,
        trait: "AI Pioneer",
      },
      {
        label: "Xalqaro darajadagi Senior Fullstack yoki Web3 Developer",
        description: "Global foydalanuvchilarga ega gigant tizimlar yaratuvchisi",
        recommendedTrack: "fullstack-web3",
        icon: Code2,
        trait: "Tech Lead",
      },
      {
        label: "Nufuzli kompaniyalarda Bosh Kiberxavfsizlik Ofitseri (CISO)",
        description: "Millionlab dollarlik ma'lumotlar xavfsizligining kafolati",
        recommendedTrack: "cybersecurity",
        icon: Shield,
        trait: "Security Chief",
      },
      {
        label: "Katta hajmdagi ma'lumotlar bo'yicha Bosh Data Analyst / Scientist",
        description: "Katta korporatsiyalarning strategik AI tahlilchisi",
        recommendedTrack: "datascience",
        icon: BarChart3,
        trait: "Chief Data Strategist",
      },
    ],
  },
];

export default function AICareerQuiz({ onSelectTrackAndRegister }: AICareerQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<CareerTrackId, number>>({
    "ai-prompt": 0,
    "fullstack-web3": 0,
    cybersecurity: 0,
    "uiux-3d": 0,
    datascience: 0,
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (recommendedTrack: CareerTrackId) => {
    const newScores = {
      ...scores,
      [recommendedTrack]: (scores[recommendedTrack] || 0) + 1,
    };
    setScores(newScores);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setScores({
      "ai-prompt": 0,
      "fullstack-web3": 0,
      cybersecurity: 0,
      "uiux-3d": 0,
      datascience: 0,
    });
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Find best matched track
  let bestTrackId: CareerTrackId = "ai-prompt";
  let maxScore = -1;
  (Object.keys(scores) as CareerTrackId[]).forEach((t) => {
    if (scores[t] > maxScore) {
      maxScore = scores[t];
      bestTrackId = t;
    }
  });

  const matchedTrack = CAREER_TRACKS.find((t) => t.id === bestTrackId) || CAREER_TRACKS[0];
  const matchPercentage = Math.min(98, 86 + maxScore * 3);

  const question = QUIZ_QUESTIONS[currentStep];

  return (
    <section id="ai-kviz" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Interaktiv AI Diagnostika</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Qaysi Kasb Sizga 100% Mos?{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            AI Tahlil Bilan Aniqlang!
          </span>
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          4 ta mantiqiy savolga javob bering va sun&apos;iy intellekt iqtidoringizga eng mos keluvchi yo&apos;nalishni aniqlab beradi.
        </p>
      </div>

      <div className="relative rounded-3xl p-6 sm:p-10 glass-panel border border-purple-400/30 shadow-2xl overflow-hidden bg-[#0a0f28]/90">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-purple-300 font-semibold">{question.subtitle}</span>
                  <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400"
                    initial={{ width: `${(currentStep / QUIZ_QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug pt-2">
                {question.title}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {question.options.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(opt.recommendedTrack)}
                      className="text-left p-5 rounded-2xl glass-panel border border-white/10 hover:border-purple-400/60 hover:bg-purple-950/30 transition-all flex items-start gap-4 group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                          {opt.label}
                        </div>
                        <div className="text-xs text-gray-400 leading-relaxed">
                          {opt.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Results Screen */
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6 py-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                <span>AI Diagnostika Muvaffaqiyatli Yakunlandi</span>
              </div>

              <div className="max-w-xl mx-auto space-y-3">
                <div className="text-5xl sm:text-6xl font-black font-mono text-cyan-300 tracking-tight">
                  {matchPercentage}%
                </div>
                <div className="text-xs font-mono uppercase text-gray-400 tracking-widest">
                  ALGORITMIK MOSLIK KO&apos;RSATKICHI
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Sizning ideal yo&apos;nalishingiz:{" "}
                  <span className="text-purple-400">{matchedTrack.title}</span>
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed pt-1">
                  {matchedTrack.shortDesc}
                </p>
              </div>

              {/* Prospects & Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto pt-2">
                {matchedTrack.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-cyan-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
                <button
                  onClick={() => onSelectTrackAndRegister(matchedTrack.id)}
                  className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 shadow-neonCyan transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Ushbu Yo&apos;nalishda Ro&apos;yxatdan O&apos;tish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRestart}
                  className="py-4 px-5 rounded-xl font-semibold text-xs text-gray-300 hover:text-white glass-panel border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qaytadan o&apos;tish</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
