"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Code2,
  BrainCircuit,
  MessageSquare,
  Copy,
  Check,
  Flame,
  Zap,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Bot,
  Lock,
  Unlock,
  Radio,
  Layers,
  Terminal,
} from "lucide-react";
import confetti from "canvas-confetti";
import { COURSES_DATA, LessonItem, CourseTrackData } from "@/lib/coursesData";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrackId, AuthParticipant } from "@/types";

interface CyberAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthParticipant | null;
  onOpenRegister?: (trackId?: CareerTrackId) => void;
  initialTrackId?: CareerTrackId;
}

export default function CyberAcademyModal({
  isOpen,
  onClose,
  currentUser,
  onOpenRegister,
  initialTrackId = "ai-prompt",
}: CyberAcademyModalProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<CareerTrackId>(initialTrackId);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"summary" | "code" | "ai-mentor" | "faq">("summary");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Completed lessons storage
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [earnedXP, setEarnedXP] = useState<number>(0);

  // AI Mentor simulated chat
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: "Assalomu alaykum! Men Ustoz AI neyron assistentiman. Ushbu dars bo'yicha qanday savolingiz bor?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Update track when initialTrackId changes
  useEffect(() => {
    if (initialTrackId) {
      setSelectedTrackId(initialTrackId);
      setActiveLessonIndex(0);
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  }, [initialTrackId, isOpen]);

  // Load completed lessons from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ustoz_completed_lessons");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedLessons(parsed);
        const count = Object.keys(parsed).length;
        setEarnedXP(count * 60);
      }
    } catch {}
  }, []);

  const currentCourse: CourseTrackData = COURSES_DATA[selectedTrackId] || COURSES_DATA["ai-prompt"];
  const currentLesson: LessonItem = currentCourse.lessons[activeLessonIndex] || currentCourse.lessons[0];

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= currentLesson.durationSeconds) {
            setIsPlaying(false);
            return currentLesson.durationSeconds;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, currentLesson.durationSeconds]);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectLesson = (index: number) => {
    // If not registered and lesson > 0, prompt to register
    if (!currentUser && index > 0) {
      if (onOpenRegister) {
        onClose();
        onOpenRegister(selectedTrackId);
      }
      return;
    }

    setActiveLessonIndex(index);
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  const handleCompleteLesson = () => {
    const lessonKey = `${selectedTrackId}-${currentLesson.id}`;
    if (!completedLessons[lessonKey]) {
      const updated = { ...completedLessons, [lessonKey]: true };
      setCompletedLessons(updated);
      setEarnedXP((prev) => prev + currentLesson.xpReward);
      try {
        localStorage.setItem("ustoz_completed_lessons", JSON.stringify(updated));
      } catch {}

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f0ff", "#9d4edd", "#f72585", "#ffbe0b", "#06d6a0"],
        });
      } catch {}
    }
  };

  const handleCopyCode = () => {
    if (currentLesson.codeSnippet) {
      navigator.clipboard.writeText(currentLesson.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;

    const newMessages = [...chatMessages, { sender: "user" as const, text: msg }];
    setChatMessages(newMessages);
    setChatInput("");

    // Simulated AI response
    setTimeout(() => {
      let aiReply = "Ajoyib savol! Ushbu darsda o'rganilgan tushuncha sizga real loyihalarda eng optimal va xavfsiz arxitekturani qurish imkonini beradi. Amaliy kod namunasini ko'rib chiqishingizni tavsiya qilaman.";
      if (msg.toLowerCase().includes("kod") || msg.toLowerCase().includes("misol")) {
        aiReply = "Kod namunasini 'Amaliy Kodlar' bo'limida to'liq ko'rishingiz va nusxalab o'z loyihangizda ishlatishingiz mumkin!";
      } else if (msg.toLowerCase().includes("qiyin") || msg.toLowerCase().includes("tushunmadim")) {
        aiReply = "Xavotir olmang! Har bir bosqich qadamma-qadam tushuntirilgan. Videoni 0.75x tezlikda qayta ko'rib chiqishingiz mumkin.";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    }, 700);
  };

  if (!isOpen) return null;

  const currentLessonCompleted = !!completedLessons[`${selectedTrackId}-${currentLesson.id}`];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#030614]/85 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-7xl max-h-[94vh] rounded-3xl glass-panel border border-cyan-400/40 shadow-[0_0_80px_rgba(0,240,255,0.25)] bg-[#070d24]/95 flex flex-col overflow-hidden z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 bg-[#05091b]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 p-[2px] shadow-neonCyan shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#070b1a] flex items-center justify-center text-cyan-300">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                    USTOZ AI • CYBER ACADEMY
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    Interaktiv Video Darsliklar
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                  <span>Darslar & Masterclasslar Platformasi</span>
                  <span>•</span>
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    +{earnedXP} XP To&apos;plandi
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-cyan-400/30 text-xs font-mono text-cyan-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Ishtirokchi: <b>{currentUser.fullName}</b></span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (onOpenRegister) {
                      onClose();
                      onOpenRegister(selectedTrackId);
                    }
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 shadow-neonCyan transition-all hover:scale-105"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>Barcha Darslarni Ochish</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                title="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Track Selector Tabs */}
          <div className="px-5 sm:px-8 py-2.5 bg-[#080f2b]/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            {CAREER_TRACKS.map((track) => {
              const isSelected = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setActiveLessonIndex(0);
                    setPlaybackTime(0);
                    setIsPlaying(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500/25 to-purple-600/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      : "bg-white/5 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <span>{track.title}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Body (Grid Layout) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
            {/* Left Area: Animated Video Player & Lesson Details (8 Cols) */}
            <div className="lg:col-span-8 p-4 sm:p-6 lg:border-r border-white/10 flex flex-col space-y-5 overflow-y-auto">
              {/* Animated Cyber Video Player Screen */}
              <div
                ref={playerContainerRef}
                className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#030614] border border-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.2)] flex flex-col justify-between group select-none"
              >
                {/* Simulated Animated Video Content */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  {/* Holographic grid and scanlines */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12)_0%,transparent_75%)]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/[0.03] to-transparent animate-pulse" />

                  {/* 3D Core Visualizer when playing */}
                  {isPlaying ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Audio Spectrum Waves */}
                      <div className="absolute bottom-16 inset-x-8 flex items-end justify-center gap-1.5 h-24 opacity-60">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              height: [
                                `${15 + (i % 7) * 8}px`,
                                `${35 + ((i * 3) % 11) * 6}px`,
                                `${10 + (i % 5) * 12}px`,
                              ],
                            }}
                            transition={{
                              duration: 0.6 + (i % 5) * 0.1,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 via-blue-400 to-purple-400"
                          />
                        ))}
                      </div>

                      {/* Rotating Hologram Gyroscope in Center */}
                      <div className="relative w-40 h-40 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 rounded-full border border-dashed border-cyan-400/60"
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-4 rounded-full border border-dotted border-purple-400/60"
                        />
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(0,240,255,0.7)] animate-pulse">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Live Code Feed in top-right corner of video */}
                      <div className="absolute top-10 right-4 hidden sm:block w-64 bg-black/70 backdrop-blur-md rounded-xl p-3 border border-cyan-500/30 text-left font-mono text-[10px] text-cyan-300 opacity-80 overflow-hidden shadow-lg">
                        <div className="text-gray-400 flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1.5 text-[9px]">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          <span>NEURAL_STREAM_CONSOLE</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-emerald-400">» Model: GPT-4o Multimodal</div>
                          <div>» Status: Streaming active (4K)</div>
                          <div className="text-amber-300 truncate">» Lesson: {currentLesson.title}</div>
                          <div className="text-gray-400">» Buffer: 100% Synced</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Paused State Screen */
                    <div className="flex flex-col items-center justify-center space-y-3 z-10 pointer-events-auto">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTogglePlay}
                        className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(0,240,255,0.8)] cursor-pointer"
                      >
                        <Play className="w-9 h-9 fill-white translate-x-0.5" />
                      </motion.button>
                      <div className="text-center space-y-1">
                        <div className="text-base font-bold text-white tracking-wide">
                          {currentLesson.title}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Darslikni ko&apos;rish uchun pleerni ishga tushiring
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Overlay HUD */}
                <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white tracking-wider uppercase">
                      LIVE // USTOZ AI NEURAL FEED
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                      4K UHD 60FPS
                    </span>
                  </div>

                  <div className="text-xs font-mono text-gray-300">
                    Dars #{currentLesson.number} / {currentCourse.lessons.length}
                  </div>
                </div>

                {/* Bottom Video Controls Bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-2">
                  {/* Progress Slider */}
                  <div className="w-full flex items-center gap-2">
                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        setPlaybackTime(percentage * currentLesson.durationSeconds);
                      }}
                      className="w-full h-2 rounded-full bg-white/20 cursor-pointer overflow-hidden relative"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 relative"
                        style={{
                          width: `${(playbackTime / currentLesson.durationSeconds) * 100}%`,
                        }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#00f0ff]" />
                      </div>
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleTogglePlay}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                        title={isPlaying ? "Pauza" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                      </button>

                      <button
                        onClick={() => setPlaybackTime(0)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Boshiga qaytarish"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {/* Time display */}
                      <div className="font-mono text-xs text-gray-300">
                        <span className="text-cyan-300 font-bold">{formatTime(playbackTime)}</span> / {currentLesson.duration}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Playback speed toggle */}
                      <button
                        onClick={() => {
                          const speeds = [1, 1.25, 1.5, 2];
                          const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                          setPlaybackSpeed(speeds[nextIdx]);
                        }}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 font-mono text-[11px] font-bold text-cyan-300"
                        title="Tezlik"
                      >
                        {playbackSpeed}x
                      </button>

                      {/* Volume */}
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Title & Action Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      {currentCourse.title}
                    </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +{currentLesson.xpReward} XP Mukofot
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {currentLesson.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Mentor: <b className="text-gray-200">{currentLesson.mentor}</b> • Davomiyligi: {currentLesson.duration} • Murakkablik: {currentLesson.level}
                  </p>
                </div>

                {/* Mark as Completed Button */}
                <button
                  onClick={handleCompleteLesson}
                  className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                    currentLessonCompleted
                      ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow-[0_0_15px_rgba(6,214,160,0.3)]"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-neonCyan hover:scale-105 active:scale-95"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{currentLessonCompleted ? "Dars Bajarildi (+50 XP)" : "Darsni Yakunlash"}</span>
                </button>
              </div>

              {/* Lesson Details Tabs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === "summary"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Dars Konspekti</span>
                  </button>

                  {currentLesson.codeSnippet && (
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activeTab === "code"
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Amaliy Kodlar</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("ai-mentor")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === "ai-mentor"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Mentor Chat</span>
                  </button>
                </div>

                {/* Tab: Summary */}
                {activeTab === "summary" && (
                  <div className="space-y-4 text-left">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {currentLesson.summary}
                    </p>

                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                        Asosiy Xulosalar & Qoidalar:
                      </div>
                      <div className="space-y-2">
                        {currentLesson.keyTakeaways.map((takeaway, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                            <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                              ✓
                            </div>
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Code Snippets */}
                {activeTab === "code" && currentLesson.codeSnippet && (
                  <div className="relative rounded-2xl bg-[#030614] border border-cyan-500/30 p-4 font-mono text-xs overflow-x-auto text-left">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-[11px] text-gray-400">
                      <span>Til: <b className="text-cyan-300">{currentLesson.codeLanguage || "code"}</b></span>
                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? "Nusxalandi!" : "Kodni Nusxalash"}</span>
                      </button>
                    </div>

                    <pre className="text-cyan-200 leading-relaxed whitespace-pre-wrap">
                      {currentLesson.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* Tab: AI Mentor Chat */}
                {activeTab === "ai-mentor" && (
                  <div className="rounded-2xl bg-[#030614] border border-purple-500/30 p-4 space-y-4 text-left">
                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 ${
                            msg.sender === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {msg.sender === "ai" && (
                            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}

                          <div
                            className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-cyan-500/20 text-cyan-100 border border-cyan-400/30 rounded-tr-none"
                                : "bg-white/5 text-gray-300 border border-white/10 rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pre-made Quick Questions */}
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-white/10">
                      {currentLesson.aiFaq.map((faq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(faq.q)}
                          className="text-[11px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-950/40 border border-white/10 hover:border-purple-400/40 text-gray-300 hover:text-purple-300 transition-colors"
                        >
                          ❓ {faq.q}
                        </button>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Dars bo'yicha savolingizni yozing..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-xs outline-none focus:border-purple-400 transition-colors"
                      />
                      <button
                        onClick={() => handleSendMessage()}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold hover:opacity-95"
                      >
                        Yuborish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Area: Course Playlist & Curriculum (4 Cols) */}
            <div className="lg:col-span-4 p-4 sm:p-6 bg-[#04081c]/70 flex flex-col space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Darslar Mundarijasi</span>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {currentCourse.lessons.length} ta dars
                </span>
              </div>

              {/* Lessons List */}
              <div className="space-y-3">
                {currentCourse.lessons.map((lesson, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isCompleted = !!completedLessons[`${selectedTrackId}-${lesson.id}`];
                  const isLocked = !currentUser && idx > 0;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(idx)}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex items-start gap-3 group ${
                        isActive
                          ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                          : "bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/10"
                      }`}
                    >
                      {/* Lesson Number / Status Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-transform group-hover:scale-105 ${
                          isCompleted
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/50"
                            : isActive
                            ? "bg-cyan-500 text-black font-black shadow-neonCyan"
                            : isLocked
                            ? "bg-white/5 text-gray-500 border border-white/10"
                            : "bg-white/10 text-gray-300 border border-white/10"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4 text-gray-500" />
                        ) : (
                          <span>0{lesson.number}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-200 transition-colors truncate">
                          {lesson.title}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            {lesson.duration}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400">+{lesson.xpReward} XP</span>
                          {isLocked && (
                            <>
                              <span>•</span>
                              <span className="text-rose-400 font-bold">Ro&apos;yxatdan o&apos;tish kerak</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Locked Notice if Not Registered */}
              {!currentUser && (
                <div className="mt-4 p-4 rounded-2xl glass-panel border border-amber-400/40 bg-amber-950/20 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center mx-auto text-amber-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs sm:text-sm">
                      Barcha Video Darslarni Ochish
                    </h5>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      1-dars hamma uchun bepul! Qolgan darslarni ko&apos;rish va tanlovda noutbuk yutib olish uchun bepul ro&apos;yxatdan o&apos;ting.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenRegister) {
                        onClose();
                        onOpenRegister(selectedTrackId);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 shadow-lg transition-all"
                  >
                    1 Daqiqada Ro&apos;yxatdan O&apos;tish
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
