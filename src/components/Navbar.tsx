"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Menu,
  X,
  Flame,
  LogIn,
  LogOut,
  Zap,
  Mic,
  Scan,
  BookOpen,
  ChevronDown,
  Gamepad2,
  Code2,
} from "lucide-react";
import { AuthParticipant } from "@/types";

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  currentUser?: AuthParticipant | null;
  onLogout?: () => void;
  onOpenVoiceAdvisor?: () => void;
  onOpenAcademy?: () => void;
  onOpenHub?: () => void;
  onOpenGame?: () => void;
  onOpenCodeSandbox?: () => void;
}

export default function Navbar({
  onOpenRegister,
  onOpenLogin,
  onOpenProfile,
  currentUser,
  onLogout,
  onOpenVoiceAdvisor,
  onOpenAcademy,
  onOpenHub,
  onOpenGame,
  onOpenCodeSandbox,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close AI dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        setIsAiMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050713]/92 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 py-2.5 sm:py-3"
          : "bg-transparent py-3.5 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#070b1a] relative">
              <Image
                src="/logo.jpg"
                alt="Ustoz AI Logo"
                fill
                sizes="40px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                USTOZ AI
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                2026
              </span>
            </div>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono hidden sm:inline whitespace-nowrap">
              Zamonaviy Kasblar
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links - Clean, Spacious, Never Overcrowded */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          <a
            href="#yonalishlar"
            className="text-xs xl:text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Yo&apos;nalishlar
          </a>

          <a
            href="#sovrinlar"
            className="text-xs xl:text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Sovrinlar
          </a>

          <a
            href="#ai-kviz"
            className="text-xs xl:text-sm font-semibold text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>AI Kviz</span>
          </a>

          {/* All Special Tools & Games Inside a Single Elegant Dropdown */}
          <div className="relative" ref={aiMenuRef}>
            <button
              onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
              onMouseEnter={() => setIsAiMenuOpen(true)}
              className="text-xs xl:text-sm font-semibold text-cyan-300 hover:text-white transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(0,240,255,0.15)] whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Vositalar & O&apos;yinlar</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAiMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isAiMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  onMouseLeave={() => setIsAiMenuOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 rounded-2xl p-2.5 glass-panel border border-cyan-400/40 bg-[#070e28]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.75)] z-50 space-y-1.5"
                >
                  {/* Cyber Mini-Game */}
                  {onOpenGame && (
                    <button
                      onClick={() => {
                        setIsAiMenuOpen(false);
                        onOpenGame();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Gamepad2 className="w-4 h-4 text-pink-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-pink-300 transition-colors flex items-center gap-1.5">
                          <span>Kiber Mini-O&apos;yin</span>
                          <span className="text-[9px] font-mono bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded border border-pink-400/30">
                            +XP ⚡
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          AI Core Defender &bull; Ball yig&apos;ish
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Code Sandbox */}
                  {onOpenCodeSandbox && (
                    <button
                      onClick={() => {
                        setIsAiMenuOpen(false);
                        onOpenCodeSandbox();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Code2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                          <span>Kod Sandbox & Mashqlar</span>
                          <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1 py-0.2 rounded">
                            IDE
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          HTML, CSS, Python jonli muhiti
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Video Courses / Academy */}
                  {onOpenAcademy && (
                    <button
                      onClick={() => {
                        setIsAiMenuOpen(false);
                        onOpenAcademy();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors">
                          Video Darsliklar
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Kiber Akademiya darslari (+250 XP)
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Student Hub */}
                  {onOpenHub && (
                    <button
                      onClick={() => {
                        setIsAiMenuOpen(false);
                        onOpenHub();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Flame className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>Student Hub</span>
                          <span className="text-[9px] font-mono bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded">
                            Streak 🔥
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Kvestlar, testlar va diplom
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Face Scan */}
                  <a
                    href="#yuz-skaner"
                    onClick={() => setIsAiMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Scan className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white group-hover:text-purple-300 transition-colors">
                        Face Scan
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Biometrik neyro-diagnostika
                      </div>
                    </div>
                  </a>

                  {/* AI Voice Advisor */}
                  {onOpenVoiceAdvisor && (
                    <button
                      onClick={() => {
                        setIsAiMenuOpen(false);
                        onOpenVoiceAdvisor();
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                          AI Ovozli Maslahat
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Ovoz orqali yo&apos;nalish tanlash
                        </div>
                      </div>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#reyting"
            className="text-xs xl:text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            Reyting
          </a>

          <a
            href="#faq"
            className="text-xs xl:text-sm font-semibold text-gray-300 hover:text-cyan-300 transition-colors whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Right Auth / Profile Button */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-white/5 border border-cyan-400/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:scale-105 transition-all text-left group whitespace-nowrap"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-500 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[10px] bg-[#0c1435] flex items-center justify-center text-cyan-300 font-black text-xs font-mono">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate max-w-[110px] whitespace-nowrap">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[9px] font-mono text-amber-400 flex items-center gap-1 whitespace-nowrap">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span>{currentUser.xp || 100} XP</span>
                  </span>
                </div>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Chiqish"
                  className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white glass-panel border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kirish</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="relative group px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Ro&apos;yxatdan O&apos;tish</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl glass-panel text-gray-300 hover:text-white shrink-0"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b1a]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-3 max-h-[85vh] overflow-y-auto">
          {currentUser && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-cyan-400/30 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-500 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[10px] bg-[#0c1435] flex items-center justify-center text-cyan-300 font-bold">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{currentUser.fullName}</div>
                  <div className="text-xs font-mono text-amber-400">⚡ {currentUser.xp || 100} XP</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold font-mono border border-cyan-400/30"
              >
                Profil
              </button>
            </div>
          )}

          <a
            href="#yonalishlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            Yo&apos;nalishlar
          </a>

          <a
            href="#sovrinlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            Sovrinlar
          </a>

          <a
            href="#ai-kviz"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-purple-300 hover:text-purple-200 py-1"
          >
            🧠 AI Diagnostika (Kviz)
          </a>

          {onOpenGame && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGame();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-pink-500/15 border border-pink-400/40 text-pink-300 text-sm font-bold flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>🎮 Kiber Mini-O&apos;yin (AI Core Defender)</span>
            </button>
          )}

          {onOpenCodeSandbox && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCodeSandbox();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-sm font-bold flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>💻 Kod Sandbox & Mashqlar</span>
            </button>
          )}

          {onOpenAcademy && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAcademy();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-blue-500/15 border border-blue-400/40 text-blue-300 text-sm font-bold flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>🎬 Video Darslar Platformasi</span>
            </button>
          )}

          <a
            href="#yuz-skaner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-cyan-300 hover:text-cyan-200 py-1"
          >
            👁️ Face Scan (Biometrik Tahlil)
          </a>

          {onOpenHub && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHub();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-sm font-bold flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>🔥 Student Hub (Streak & Kvestlar)</span>
            </button>
          )}

          {onOpenVoiceAdvisor && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoiceAdvisor();
              }}
              className="w-full text-left py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-sm font-bold flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>🎙️ AI Ovozli Maslahat</span>
            </button>
          )}

          <a
            href="#reyting"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            🏆 Jonli Reyting (Leaderboard)
          </a>

          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            FAQ
          </a>

          <div className="pt-2 space-y-2 border-t border-white/10">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-3 rounded-xl font-bold text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Akkauntdan Chiqish</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-xs text-gray-200 glass-panel border border-white/10 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Akkauntga Kirish</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-neonCyan flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Ro&apos;yxatdan O&apos;tish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
