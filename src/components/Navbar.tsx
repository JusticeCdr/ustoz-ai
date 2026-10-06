"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Menu, X, ArrowRight, Flame, Users, LogIn, LogOut, User, Zap, Mic, Scan } from "lucide-react";
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
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#050713]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.45)] group-hover:shadow-[0_0_28px_rgba(6,182,212,0.7)] group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#070b1a] relative">
              <Image
                src="/logo.jpg"
                alt="Ustoz AI Logo"
                fill
                sizes="44px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
            {/* Glowing inner sheen */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                USTOZ AI
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                2026
              </span>
            </div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">
              Zamonaviy Kasblar
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          <a
            href="#yonalishlar"
            className="text-xs xl:text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors"
          >
            Yo&apos;nalishlar
          </a>
          <a
            href="#sovrinlar"
            className="text-xs xl:text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors"
          >
            Sovrinlar
          </a>
          <a
            href="#yuz-skaner"
            className="text-xs xl:text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20"
          >
            <Scan className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Face Scan</span>
          </a>
          <a
            href="#ai-kviz"
            className="text-xs xl:text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>AI Kviz</span>
          </a>
          {onOpenAcademy && (
            <button
              onClick={onOpenAcademy}
              className="text-xs xl:text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Video Darslar</span>
            </button>
          )}
          {onOpenHub && (
            <button
              onClick={onOpenHub}
              className="text-xs xl:text-sm font-semibold text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Student Hub</span>
              <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.2 rounded text-amber-300 font-mono">Streak 🔥</span>
            </button>
          )}
          <a
            href="#reyting"
            className="text-xs xl:text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1"
          >
            <span>Reyting</span>
          </a>
          <a
            href="#bosqichlar"
            className="text-xs xl:text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors"
          >
            Bosqichlar
          </a>
          <a
            href="#faq"
            className="text-xs xl:text-sm font-medium text-gray-300 hover:text-cyan-300 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Auth / Profile Button */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 p-1.5 pr-4 rounded-2xl bg-white/5 border border-cyan-400/30 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:scale-105 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-500 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[10px] bg-[#0c1435] flex items-center justify-center text-cyan-300 font-black text-sm font-mono">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate max-w-[120px]">
                    {currentUser.fullName}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{currentUser.xp || 100} XP</span>
                  </span>
                </div>
              </button>

              {onOpenHub && (
                <button
                  onClick={onOpenHub}
                  title="Talaba Kabineti va Kvestlar"
                  className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden xl:inline">Hub</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Chiqish"
                  className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {onOpenVoiceAdvisor && (
                <button
                  onClick={onOpenVoiceAdvisor}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-500/20 hover:border-cyan-300 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  title="Ovoz orqali kurs tanlash"
                >
                  <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="hidden sm:inline">AI Ovozli Maslahat</span>
                </button>
              )}

              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white glass-panel border border-white/10 hover:border-cyan-400/40 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kirish</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="relative group px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Ro&apos;yxatdan O&apos;tish</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl glass-panel text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070b1a]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
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
            href="#yuz-skaner"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-cyan-300 hover:text-cyan-200 py-1 flex items-center gap-2"
          >
            <Scan className="w-4 h-4 text-cyan-400" />
            <span>Yuz Skaneri (Face Scan)</span>
          </a>
          {onOpenVoiceAdvisor && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoiceAdvisor();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] my-1"
            >
              <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>🎙 AI Ovozli Konsultant (Golos)</span>
            </button>
          )}

          <a
            href="#ai-kviz"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-purple-300 hover:text-purple-200 py-1"
          >
            🧠 AI Diagnostika (Kviz)
          </a>
          {onOpenAcademy && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAcademy();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)] my-1"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>🎬 Video Darslar Platformasi</span>
            </button>
          )}
          {onOpenHub && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHub();
              }}
              className="w-full text-left py-2.5 px-3 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)] my-1"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>🔥 Student Hub (Streak, Kvest & Test)</span>
            </button>
          )}
          <a
            href="#reyting"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-amber-300 hover:text-amber-200 py-1"
          >
            🏆 Jonli Reyting (Leaderboard)
          </a>
          <a
            href="#bosqichlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            Bosqichlar
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-gray-200 hover:text-cyan-300 py-1"
          >
            FAQ
          </a>

          <div className="pt-2 space-y-2">
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
