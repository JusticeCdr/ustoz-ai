import React from "react";
import Image from "next/image";
import { Sparkles, Bot, Shield, Send, Heart } from "lucide-react";
import { TELEGRAM_BOT_USERNAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#04060f] pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] shrink-0">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#070b1a] relative">
                <Image
                  src="/logo.jpg"
                  alt="Ustoz AI Logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20 pointer-events-none" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                USTOZ AI
              </span>
              <span className="text-[11px] font-mono text-cyan-400 tracking-wider">
                Zamonaviy Kasblar Tanlovi
              </span>
            </div>
          </div>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            Zamonaviy kasblar tanlovi — O&apos;zbekistonning eng iqtidorli yosh dasturchilari, AI muhandislari va dizaynerlari uchun eng yirik intellektual maydon.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ALL SYSTEMS OPERATIONAL • 2026 EDITION</span>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
            Bo&apos;limlar
          </h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>
              <a href="#yonalishlar" className="hover:text-cyan-300 transition-colors">
                Yo&apos;nalishlar
              </a>
            </li>
            <li>
              <a href="#sovrinlar" className="hover:text-cyan-300 transition-colors">
                Sovrinlar Jamg&apos;armasi
              </a>
            </li>
            <li>
              <a href="#bosqichlar" className="hover:text-cyan-300 transition-colors">
                Tanlov Bosqichlari
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-cyan-300 transition-colors">
                Savol-Javoblar (FAQ)
              </a>
            </li>
          </ul>
        </div>

        {/* Telegram Bot */}
        <div>
          <h4 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest mb-4">
            Telegram Integratsiya
          </h4>
          <div className="p-4 rounded-2xl glass-panel border border-cyan-400/30 space-y-3">
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Rasmiy Bot</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Rasmiy bot orqali ro&apos;yxatdan o&apos;ting, 6 xonali parolni oling va natijalardan birinchi bo&apos;lib xabardor bo&apos;ling.
            </p>
            <a
              href={`https://t.me/${TELEGRAM_BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-200"
            >
              <span>Botni ochish</span>
              <Send className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
        <div>
          © 2026 Ustoz AI. Barcha huquqlar himoyalangan.
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <span>Ustoz AI jamoasi tomonidan ishlab chiqilgan</span>
        </div>
      </div>
    </footer>
  );
}
