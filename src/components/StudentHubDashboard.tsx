"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Flame,
  Zap,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  FileCheck,
  Send,
  Lock,
  Unlock,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Award,
  Crown,
  BookOpen,
  Github,
  X,
  Gamepad2,
} from "lucide-react";
import { AuthParticipant, CareerTrackId } from "@/types";
import { DAILY_QUESTS, MOCK_TESTS, MockTestQuestion } from "@/data/hubData";
import CyberMiniGame from "./CyberMiniGame";

interface StudentHubDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthParticipant;
  onUpdateUser: (updatedUser: AuthParticipant) => void;
}

export default function StudentHubDashboard({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}: StudentHubDashboardProps) {
  // Navigation tabs in hub
  const [activeTab, setActiveTab] = useState<"overview" | "quest" | "test" | "project" | "certificate" | "arcade">("overview");

  // Streak & Daily check-in
  const [streakDays, setStreakDays] = useState(currentUser.streakDays || 5);
  const [hasClaimedStreakToday, setHasClaimedStreakToday] = useState(false);

  // Quest state
  const [questCompleted, setQuestCompleted] = useState(Boolean(currentUser.dailyQuestCompleted));

  // Mock Test Arena state
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [testTimeSeconds, setTestTimeSeconds] = useState(300); // 5 minutes
  const [testFinished, setTestFinished] = useState(Boolean(currentUser.mockTestCompleted));
  const [testScore, setTestScore] = useState(currentUser.mockTestScore || 0);

  // Project Submission state
  const [projectLink, setProjectLink] = useState(currentUser.projectSubmission?.link || "");
  const [projectNotes, setProjectNotes] = useState(currentUser.projectSubmission?.notes || "");
  const [submissionStatus, setSubmissionStatus] = useState<"tayyorgarlik" | "topshirildi" | "tekshiruvda" | "tasdiqlandi">(
    currentUser.projectSubmission?.status || "tayyorgarlik"
  );
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Certificate state
  const isCertificateUnlocked = Boolean(currentUser.certificateUnlocked || testFinished || submissionStatus !== "tayyorgarlik");

  // Track specific daily quest & test questions
  const currentTrackId: CareerTrackId = currentUser.trackId || "ai-prompt";
  const dailyQuest = DAILY_QUESTS[currentTrackId] || DAILY_QUESTS["ai-prompt"];
  const mockQuestions = MOCK_TESTS[currentTrackId] || MOCK_TESTS["ai-prompt"];

  // Countdown timer for ongoing test
  useEffect(() => {
    if (!isTestStarted || testFinished) return;
    const timer = setInterval(() => {
      setTestTimeSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTestStarted, testFinished]);

  // Daily Streak Claim
  const handleClaimDailyStreak = () => {
    if (hasClaimedStreakToday) return;
    const newStreak = streakDays + 1;
    const newXp = (currentUser.xp || 100) + 15;
    setStreakDays(newStreak);
    setHasClaimedStreakToday(true);

    const updated = {
      ...currentUser,
      xp: newXp,
      streakDays: newStreak,
    };
    onUpdateUser(updated);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Complete Daily Quest
  const handleCompleteQuest = () => {
    if (questCompleted) return;
    const newXp = (currentUser.xp || 100) + dailyQuest.xpReward;
    setQuestCompleted(true);

    const updated = {
      ...currentUser,
      xp: newXp,
      dailyQuestCompleted: true,
    };
    onUpdateUser(updated);

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    } catch (e) {}
  };

  // Mock Test handler
  const handleAnswerQuestion = (optionIdx: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIdx] = optionIdx;
    setSelectedAnswers(updatedAnswers);

    if (currentQuestionIdx < mockQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      finishTest(updatedAnswers);
    }
  };

  const finishTest = (finalAnswers?: number[]) => {
    const answers = finalAnswers || selectedAnswers;
    let correctCount = 0;
    mockQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / mockQuestions.length) * 100);
    setTestScore(calculatedScore);
    setTestFinished(true);
    setIsTestStarted(false);

    const earnedXp = calculatedScore >= 60 ? 100 : 40;
    const updated = {
      ...currentUser,
      xp: (currentUser.xp || 100) + earnedXp,
      mockTestCompleted: true,
      mockTestScore: calculatedScore,
      certificateUnlocked: true,
    };
    onUpdateUser(updated);

    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  // Project Submission handler
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectLink.trim()) return;

    setIsSubmittingProject(true);
    setTimeout(() => {
      setSubmissionStatus("tekshiruvda");
      setIsSubmittingProject(false);

      const updated = {
        ...currentUser,
        xp: (currentUser.xp || 100) + 150,
        projectSubmission: {
          link: projectLink.trim(),
          notes: projectNotes.trim(),
          status: "tekshiruvda" as const,
          submittedAt: Date.now(),
        },
        certificateUnlocked: true,
      };
      onUpdateUser(updated);

      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }, 900);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(testTimeSeconds / 60);
  const seconds = testTimeSeconds % 60;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl rounded-3xl glass-panel border border-cyan-400/50 bg-[#070b1a]/95 text-white shadow-2xl overflow-hidden z-10 my-6 max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-6 pb-4 border-b border-white/10 bg-[#0a102b]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-neonCyan">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                    STUDENT HUB &bull; TALABA KABINETI
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    2026 EDITION
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Ishtirokchi: <span className="text-white font-semibold">{currentUser.fullName}</span> ({currentUser.participantId})
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module 1: Status & Daily Streak Bar */}
          <div className="px-6 py-4 bg-[#0a0f26] border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {/* Daily Streak Counter */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-neonGold">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-gray-400">Kunlik Streak</div>
                <div className="text-base sm:text-lg font-black text-amber-300 font-mono flex items-center gap-1">
                  <span>{streakDays} kun</span>
                  {!hasClaimedStreakToday && (
                    <button
                      onClick={handleClaimDailyStreak}
                      className="text-[10px] bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded ml-1 animate-bounce"
                    >
                      +15 XP Olish
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Total XP Score */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-neonCyan">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-gray-400">Umumiy Tajriba</div>
                <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                  {currentUser.xp || 100} XP
                </div>
              </div>
            </div>

            {/* Leaderboard Rank */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-neonPurple">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-gray-400">Reyting O&apos;rni</div>
                <div className="text-base sm:text-lg font-black text-purple-300 font-mono">
                  #4 O&apos;rinda
                </div>
              </div>
            </div>

            {/* Chosen Discipline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-gray-400">Yo&apos;nalish</div>
                <div className="text-xs font-bold text-gray-200 truncate max-w-[140px]">
                  {currentUser.trackTitle}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-6 pt-3 border-b border-white/10 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-cyan-400 text-cyan-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Umumiy Ko&apos;rinish</span>
            </button>

            <button
              onClick={() => setActiveTab("quest")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "quest"
                  ? "border-amber-400 text-amber-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Kunlik Quest</span>
              {questCompleted && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab("test")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "test"
                  ? "border-purple-400 text-purple-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Sandbox Test</span>
              {testFinished && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab("project")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "project"
                  ? "border-blue-400 text-blue-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Loyiha Topshirish</span>
              {submissionStatus !== "tayyorgarlik" && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>

            <button
              onClick={() => setActiveTab("certificate")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "certificate"
                  ? "border-emerald-400 text-emerald-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {isCertificateUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
              <span>Rasmiy Diplom</span>
            </button>

            <button
              onClick={() => setActiveTab("arcade")}
              className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "arcade"
                  ? "border-pink-500 text-pink-300 bg-white/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Mini-O&apos;yin (Arcade)</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-mono border border-pink-400/30">
                +XP
              </span>
            </button>
          </div>

          {/* Scrollable Hub Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* ================= TAB 1: OVERVIEW ================= */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* 4 Interactive Feature Modules Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Daily Mini-Quest Card */}
                  <div
                    onClick={() => setActiveTab("quest")}
                    className="p-5 rounded-2xl glass-panel border border-amber-400/40 hover:border-amber-300 bg-gradient-to-br from-amber-950/20 to-black/40 cursor-pointer transition-all hover:scale-[1.01] group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                        <Flame className="w-4 h-4" />
                        <span>Kunlik Amaliy Vazifa</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        +{dailyQuest.xpReward} XP
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {dailyQuest.title}
                    </h4>

                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {dailyQuest.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                      <span className="text-gray-400 font-mono">Status:</span>
                      {questCompleted ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bajarildi
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Bajarishga o&apos;tish <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sandbox Mock Test Card */}
                  <div
                    onClick={() => setActiveTab("test")}
                    className="p-5 rounded-2xl glass-panel border border-purple-400/40 hover:border-purple-300 bg-gradient-to-br from-purple-950/20 to-black/40 cursor-pointer transition-all hover:scale-[1.01] group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold uppercase">
                        <Clock className="w-4 h-4" />
                        <span>Sandbox Test Arenasi</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-400/20 text-purple-300 border border-purple-400/30">
                        +100 XP
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      Saralash Sinov Testi ({currentUser.trackTitle})
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      5 ta mantiqiy savoldan iborat tayyorgarlik sinovi. O&apos;z bilimingizni sinab ko&apos;ring va diplom qulfini oching!
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                      <span className="text-gray-400 font-mono">Status:</span>
                      {testFinished ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Natija: {testScore}%
                        </span>
                      ) : (
                        <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Testni boshlash <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Submission Card */}
                  <div
                    onClick={() => setActiveTab("project")}
                    className="p-5 rounded-2xl glass-panel border border-blue-400/40 hover:border-blue-300 bg-gradient-to-br from-blue-950/20 to-black/40 cursor-pointer transition-all hover:scale-[1.01] group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-bold uppercase">
                        <FileCheck className="w-4 h-4" />
                        <span>Loyiha Topshirish Zonasi</span>
                      </div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-400/20 text-blue-300 border border-blue-400/30">
                        +150 XP
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      Amaliy Keys Loyihangizni Yuboring
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      GitHub, Figma yoki Google Drive havolasini taqdim eting va hakamlar hay&apos;ati ko&apos;rigiga jo&apos;nating.
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                      <span className="text-gray-400 font-mono">Holat:</span>
                      <span className="text-cyan-400 font-bold capitalize">
                        {submissionStatus === "tayyorgarlik" ? "Tayyorgarlikda" : submissionStatus}
                      </span>
                    </div>
                  </div>

                  {/* Official Certificate Card */}
                  <div
                    onClick={() => setActiveTab("certificate")}
                    className="p-5 rounded-2xl glass-panel border border-emerald-400/40 hover:border-emerald-300 bg-gradient-to-br from-emerald-950/20 to-black/40 cursor-pointer transition-all hover:scale-[1.01] group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                        <Award className="w-4 h-4" />
                        <span>Rasmiy Elektron Sertifikat</span>
                      </div>
                      {isCertificateUnlocked ? (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                          <Unlock className="w-3 h-3" /> Qulfi Ochildi
                        </span>
                      ) : (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400 border border-white/15 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Qulflangan
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Tasdiqlangan QR-Kodli Diplom
                    </h4>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isCertificateUnlocked
                        ? "Tabriklaymiz! Siz rasmiy guvohnoma va diplomni yuklab olishingiz mumkin."
                        : "Sandbox test yoki loyihani topshirgach diplom qulfi avtomatik ochiladi."}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                      <span className="text-gray-400 font-mono">Format:</span>
                      <span className="text-emerald-400 font-bold">PDF / PNG Diplom</span>
                    </div>
                  </div>
                </div>

                {/* 5. In-App Cyber Mini-Game: AI Core Defender Banner */}
                <div
                  onClick={() => setActiveTab("arcade")}
                  className="p-5 rounded-2xl glass-panel border border-pink-500/40 hover:border-pink-400 bg-gradient-to-r from-pink-950/30 via-purple-950/25 to-black/50 cursor-pointer transition-all hover:scale-[1.01] group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_rgba(236,72,153,0.15)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider">
                          Kiber O&apos;yin &bull; Qo&apos;shimcha XP
                        </span>
                        <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-mono border border-pink-400/30">
                          YANGI ⚡
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white group-hover:text-pink-300 transition-colors">
                        AI Core Defender: Kiber Nod Haker
                      </h4>
                      <p className="text-xs text-gray-300 mt-0.5">
                        Bosqichlar boshlanguncha vaqtni unumli o&apos;tkazing: nodlarni tutib har raundda +100~500 XP to&apos;plang va reytingda ko&apos;tariling!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("arcade")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center gap-2 shrink-0 group-hover:opacity-95"
                  >
                    <span>O&apos;ynash</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= TAB 2: DAILY MINI-QUEST ================= */}
            {activeTab === "quest" && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="p-6 rounded-3xl glass-panel border border-amber-400/40 bg-gradient-to-b from-[#141a38] to-[#0a0f26] space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
                      <Flame className="w-4 h-4" />
                      <span>Bugungi Maxsus Vazifa</span>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Mukofot: +{dailyQuest.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {dailyQuest.title}
                  </h3>

                  <p className="text-sm text-gray-300 leading-relaxed">
                    {dailyQuest.description}
                  </p>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                    <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Yo&apos;naltiruvchi maslahat (Hint):</span>
                    </div>
                    <div className="text-gray-400 leading-relaxed">{dailyQuest.hints}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {dailyQuest.tags.map((tag) => (
                      <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-gray-400 border border-white/10">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">
                      Qiyinlik darajasi: <b className="text-amber-400">{dailyQuest.difficulty}</b>
                    </span>

                    <button
                      onClick={handleCompleteQuest}
                      disabled={questCompleted}
                      className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-neonGold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {questCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Bajarildi (+{dailyQuest.xpReward} XP berildi)</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Bajardim / Tekshirish (+40 XP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: MOCK TEST ARENA ================= */}
            {activeTab === "test" && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {!isTestStarted && !testFinished ? (
                  /* Start Screen */
                  <div className="p-8 rounded-3xl glass-panel border border-purple-400/40 bg-gradient-to-b from-[#141238] to-[#0a0f26] text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 mx-auto flex items-center justify-center shadow-neonPurple">
                      <Clock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        Sandbox Mock Test: {currentUser.trackTitle}
                      </h3>
                      <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                        Ushbu sinov sizga haqiqiy 2-bosqich onlayn saralash testi muhitini taqdim etadi. 5 ta mantiqiy savol, 5 daqiqa vaqt!
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto text-center font-mono">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-gray-400">Savollar</div>
                        <div className="text-base font-bold text-cyan-300">5 ta</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-gray-400">Vaqt</div>
                        <div className="text-base font-bold text-amber-300">05:00</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-[10px] text-gray-400">Mukofot</div>
                        <div className="text-base font-bold text-purple-300">+100 XP</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsTestStarted(true);
                        setCurrentQuestionIdx(0);
                        setSelectedAnswers([]);
                        setTestTimeSeconds(300);
                      }}
                      className="px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-95 shadow-neonPurple transition-all inline-flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Sinov Testini Boshlash</span>
                    </button>
                  </div>
                ) : isTestStarted && !testFinished ? (
                  /* Live Test Question */
                  <div className="p-6 rounded-3xl glass-panel border border-purple-400/40 bg-[#090f2b] space-y-6">
                    {/* Test Header: Question Counter & Timer */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                        Savol {currentQuestionIdx + 1} / {mockQuestions.length}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <h4 className="text-lg font-bold text-white leading-relaxed">
                      {mockQuestions[currentQuestionIdx].question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-3 pt-2">
                      {mockQuestions[currentQuestionIdx].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerQuestion(idx)}
                          className="w-full text-left p-4 rounded-xl glass-panel border border-white/10 hover:border-purple-400/60 hover:bg-purple-950/30 transition-all text-sm text-gray-200 flex items-start gap-3 group"
                        >
                          <span className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-mono font-bold text-xs text-purple-300 shrink-0 group-hover:bg-purple-500 group-hover:text-black">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="pt-0.5">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Test Finished Results */
                  <div className="p-8 rounded-3xl glass-panel border border-emerald-400/40 bg-[#09152b] text-center space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mx-auto flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-5xl font-black font-mono text-emerald-300">{testScore}%</div>
                      <h3 className="text-2xl font-bold text-white">Sinov Testi Yakunlandi!</h3>
                      <p className="text-sm text-gray-300 max-w-md mx-auto">
                        Siz testni muvaffaqiyatli topshirdingiz va <b>+100 XP</b> qo&apos;lga kiritdingiz. Rasmiy diplom qulfi ochildi!
                      </p>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setActiveTab("certificate")}
                        className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg flex items-center gap-2 hover:scale-105"
                      >
                        <Award className="w-4 h-4" />
                        <span>Diplomni Ko&apos;rish</span>
                      </button>

                      <button
                        onClick={() => {
                          setTestFinished(false);
                          setIsTestStarted(true);
                          setCurrentQuestionIdx(0);
                          setSelectedAnswers([]);
                          setTestTimeSeconds(300);
                        }}
                        className="px-4 py-3.5 rounded-xl font-semibold text-xs text-gray-300 hover:text-white glass-panel border border-white/15 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Qaytadan topshirish</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 4: PROJECT SUBMISSION ZONE ================= */}
            {activeTab === "project" && (
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Status Tracker: 4 Steps */}
                <div className="p-5 rounded-2xl glass-panel border border-white/15 bg-white/5 space-y-4">
                  <div className="text-xs font-mono text-gray-400 uppercase">Loyiha Holati (Status Tracker):</div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { key: "tayyorgarlik", label: "Tayyorgarlik", step: 1 },
                      { key: "topshirildi", label: "Topshirildi", step: 2 },
                      { key: "tekshiruvda", label: "Tekshiruvda", step: 3 },
                      { key: "tasdiqlandi", label: "Natija", step: 4 },
                    ].map((st, i) => {
                      const isCurrent = submissionStatus === st.key;
                      const isPast =
                        (submissionStatus === "topshirildi" && i <= 1) ||
                        (submissionStatus === "tekshiruvda" && i <= 2) ||
                        (submissionStatus === "tasdiqlandi" && i <= 3);

                      return (
                        <div key={st.key} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isPast ? "bg-cyan-400 shadow-neonCyan" : "bg-white/10"
                            }`}
                          />
                          <div
                            className={`text-[11px] font-mono font-bold ${
                              isPast ? "text-cyan-300" : "text-gray-500"
                            }`}
                          >
                            {st.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submission Form */}
                <form onSubmit={handleSubmitProject} className="p-6 rounded-3xl glass-panel border border-blue-400/40 bg-[#09102b] space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-blue-400" />
                      <span>Loyiha Havolasi va Izohlar</span>
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-400/20 text-blue-300 border border-blue-400/30">
                      +150 XP
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-2">
                      Loyiha havolasi (GitHub / Figma / Google Drive) *
                    </label>
                    <div className="relative">
                      <Github className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/username/project yoki https://figma.com/..."
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 text-white text-xs sm:text-sm font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-2">
                      Qisqacha izoh va foydalanilgan texnologiyalar
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Loyihada qanday vazifalar bajarildi, qaysi texnologiyalar qo'llanildi..."
                      value={projectNotes}
                      onChange={(e) => setProjectNotes(e.target.value)}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 text-white text-xs sm:text-sm outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 shadow-neonCyan transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmittingProject ? (
                      <span>Yuklanmoqda...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Loyihani Hakamlarga Topshirish (+150 XP)</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ================= TAB 5: OFFICIAL CERTIFICATE GENERATOR ================= */}
            {activeTab === "certificate" && (
              <div className="space-y-6 max-w-2xl mx-auto text-center">
                {!isCertificateUnlocked ? (
                  <div className="p-10 rounded-3xl glass-panel border border-white/15 bg-black/40 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 text-gray-400 mx-auto flex items-center justify-center">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Rasmiy Diplom Hali Qulflangan</h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Sertifikatni ochish uchun <b>Sandbox Mock Test</b>dan o&apos;ting yoki <b>Loyiha Topshirish Zonasi</b>da loyihangizni yuboring.
                    </p>
                    <button
                      onClick={() => setActiveTab("test")}
                      className="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-neonPurple"
                    >
                      Sinov Testiga O&apos;tish
                    </button>
                  </div>
                ) : (
                  /* Verified Diploma View */
                  <div className="space-y-6">
                    <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#121c45] via-[#0b102b] to-[#1a1238] border-2 border-amber-400/70 shadow-neonGold text-left overflow-hidden">
                      {/* Ambient corner highlights */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl" />

                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-amber-400/30 pb-5 mb-6">
                        <div className="flex items-center gap-3">
                          <Crown className="w-8 h-8 text-amber-400" />
                          <div>
                            <div className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
                              USTOZ AI RASMIY DIPLOMI
                            </div>
                            <div className="text-[11px] text-gray-400">Zamonaviy Kasblar Tanlovi 2026</div>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>TASDIQLANGAN DIPLOM</span>
                        </div>
                      </div>

                      {/* Certificate Body */}
                      <div className="space-y-4 text-center my-6">
                        <div className="text-xs font-mono uppercase text-gray-400">
                          Ushbu sertifikat tasdiqlaydi:
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                          {currentUser.fullName}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                          &quot;Ustoz AI — Zamonaviy Kasblar Tanlovi&quot;ning <b>{currentUser.trackTitle}</b> yo&apos;nalishi bo&apos;yicha rasmiy saralash bosqichi va amaliy vazifalarini muvaffaqiyatli tamomladi.
                        </div>
                      </div>

                      {/* Footer Stamp & ID */}
                      <div className="border-t border-white/10 pt-5 flex items-center justify-between text-[11px] font-mono text-gray-400">
                        <div>
                          SERIYA: <span className="text-amber-300 font-bold">{currentUser.participantId}</span>
                        </div>
                        <div>
                          SANA: {new Date(currentUser.verifiedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-90 shadow-neonGold transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Diplomni Saqlash / Chop Etish (PDF)</span>
                      </button>

                      <a
                        href={currentUser.referralLink || "https://t.me/zamonaviy_kasblarr_bot"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 px-6 rounded-xl font-bold text-xs text-white glass-panel border border-white/20 hover:border-cyan-400 transition-all flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4 text-cyan-300" />
                        <span>Telegramda Ulashish</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 6: ARCADE MINI-GAME ================= */}
            {activeTab === "arcade" && (
              <div className="space-y-4 max-w-4xl mx-auto">
                <CyberMiniGame
                  currentUser={currentUser}
                  onAddXp={(earnedXp) => {
                    const newXp = (currentUser.xp || 100) + earnedXp;
                    const updated = {
                      ...currentUser,
                      xp: newXp,
                    };
                    onUpdateUser(updated);
                  }}
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
