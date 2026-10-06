"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, Award, Sparkles, Users, Laptop, Tablet, Gift, CheckCircle2, Trophy, ShieldAlert } from "lucide-react";
import { PRIZES } from "@/lib/constants";
import { PrizeItem } from "@/types";

interface PrizesSectionProps {
  onOpenRegister: () => void;
}

const prizeIcons: Record<string, React.ReactNode> = {
  Crown: <Crown className="w-8 h-8 text-amber-300" />,
  Award: <Award className="w-8 h-8 text-cyan-300" />,
  Sparkles: <Sparkles className="w-8 h-8 text-purple-300" />,
  Users: <Users className="w-8 h-8 text-blue-300" />,
};

export default function PrizesSection({ onOpenRegister }: PrizesSectionProps) {
  return (
    <section id="sovrinlar" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-amber-400/40 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Sovrinlar Jamg&apos;armasi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          G&apos;oliblarni{" "}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent text-glow-gold">
            Qimmatbaho Mukofotlar
          </span>{" "}
          Kutmoqda!
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">
          Ustoz AI iqtidorli yoshlarni qo&apos;llab-quvvatlaydi. O&apos;z bilimlaringiz bilan grand sovrinlar va nufuzli grantlarni qo&apos;lga kiriting.
        </p>
      </div>

      {/* Featured 1st Place Card + 2nd & 3rd Place Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
        {PRIZES.slice(0, 3).map((prize, idx) => (
          <PrizeCard key={prize.place} prize={prize} index={idx} />
        ))}
      </div>

      {/* Universal prize for all participants banner */}
      {PRIZES[3] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-6 sm:p-8 glass-panel border border-blue-400/40 bg-gradient-to-r from-blue-900/20 via-cyan-900/20 to-purple-900/20 shadow-xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-neonCyan shrink-0">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase">
                    Barcha Ishtirokchilar Uchun
                  </span>
                  <span className="text-xs text-gray-400 font-mono">100% Kafolatlangan</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Rasmiy QR-Sertifikat & Ustoz AI VIP IT-Hamjamiyati
                </h3>
                <p className="text-sm text-gray-300 max-w-2xl">
                  Har bir qatnashchi ro&apos;yxatdan o&apos;tishi bilanoq tasdiqlangan raqamli guvohnomaga va doimiy IT hamjamiyatiga kirish huquqiga ega bo&apos;ladi.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              Hoziroq Ishtirok Etish
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}

function PrizeCard({ prize, index }: { prize: PrizeItem; index: number }) {
  const isFirst = prize.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`relative rounded-3xl p-8 glass-panel border ${prize.borderClass} flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-2xl ${
        isFirst ? "lg:-translate-y-4 ring-2 ring-amber-400/40" : ""
      }`}
      style={{
        boxShadow: isFirst
          ? "0 20px 40px -10px rgba(255, 190, 11, 0.3)"
          : undefined,
      }}
    >
      {/* Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40 bg-gradient-to-br ${prize.gradient}`}
      />

      <div>
        {/* Top Header Badge & Place */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner">
              {prizeIcons[prize.icon]}
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-white font-mono">
                {prize.place}
              </span>
              <div className="text-xs font-semibold text-gray-400 font-mono">
                {prize.badge}
              </div>
            </div>
          </div>

          {isFirst && (
            <span className="bg-amber-400 text-black text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
              GRAND PRIZE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-white mb-3 leading-snug">
          {prize.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {prize.description}
        </p>

        {/* Highlights List */}
        <div className="space-y-3 pt-2 border-t border-white/10 mb-6">
          {prize.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card bottom footer */}
      <div className="pt-4 border-t border-white/10 text-center">
        <div className="text-xs text-gray-400 font-mono">
          {isFirst ? "🏆 Maxsus Grand Mukofot" : "✨ Rasmiy Kafolatlangan Mukofot"}
        </div>
      </div>
    </motion.div>
  );
}
