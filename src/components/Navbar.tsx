"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Menu, X, ArrowRight, Flame, Users } from "lucide-react";

interface NavbarProps {
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenRegister }: NavbarProps) {
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
            href="#ai-kviz"
            className="text-xs xl:text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>AI Kviz</span>
          </a>
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

        {/* Right CTA Button & Live Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>842+ Ishtirokchi</span>
          </div>

          <button
            onClick={onOpenRegister}
            className="relative group px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ro&apos;yxatdan O&apos;tish</span>
          </button>
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

          <div className="pt-2">
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
        </div>
      )}
    </header>
  );
}
