"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Zap,
  Users,
  Flame,
  Filter,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { CareerTrackId, LeaderboardUser } from "@/types";

interface LeaderboardSectionProps {
  onOpenRegister: () => void;
}

const TRACK_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "Barcha Yo'nalishlar" },
  { id: "ai-prompt", label: "Sun'iy Intellekt" },
  { id: "fullstack-web3", label: "Fullstack / Web3" },
  { id: "cybersecurity", label: "Kiberxavfsizlik" },
  { id: "uiux-3d", label: "3D & UI/UX" },
  { id: "datascience", label: "Data Science" },
];

export default function LeaderboardSection({ onOpenRegister }: LeaderboardSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (data.ok && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.error("Leaderboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // 10s auto refresh
    return () => clearInterval(interval);
  }, []);

  const filtered = leaderboard.filter((item) => {
    if (selectedFilter === "all") return true;
    return item.trackId === selectedFilter;
  });

  return (
    <section id="reyting" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[550px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Jonli Reyting &amp; Liderlar Kengashi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Kiber Liderlar{" "}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Reytingi (Live XP)
          </span>
        </h2>
        <p className="text-gray-300 text-sm sm:text-base">
          Do&apos;stlaringizni taklif qiling, vazifalarni bajaring va yetakchilar safidan joy oling! Har bir taklif uchun <b>+50 XP</b>.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {TRACK_FILTERS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === tab.id
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neonCyan scale-105"
                : "glass-panel text-gray-300 hover:text-white hover:border-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-3xl glass-panel border border-white/15 bg-[#080d24]/90 p-4 sm:p-6 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm font-mono">Reyting yuklanmoqda...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            Ushbu yo&apos;nalishda hali ishtirokchilar mavjud emas. Birinchi bo&apos;lib ro&apos;yxatdan o&apos;ting!
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;

              return (
                <motion.div
                  key={user.participantId}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isFirst
                      ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400/60 shadow-neonGold"
                      : isSecond
                      ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/5 to-transparent border-cyan-400/50 shadow-neonCyan"
                      : isThird
                      ? "bg-gradient-to-r from-purple-500/15 via-pink-500/5 to-transparent border-purple-400/50"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Left: Rank & User Details */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-black font-mono text-base shrink-0 ${
                        isFirst
                          ? "bg-amber-400 text-black shadow-lg"
                          : isSecond
                          ? "bg-cyan-400 text-black shadow-lg"
                          : isThird
                          ? "bg-purple-400 text-black shadow-lg"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {isFirst ? (
                        <Crown className="w-6 h-6" />
                      ) : isSecond ? (
                        <Medal className="w-5 h-5" />
                      ) : isThird ? (
                        <Award className="w-5 h-5" />
                      ) : (
                        `#${user.rank}`
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base sm:text-lg">
                          {user.fullName}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/15">
                          {user.participantId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 pt-0.5">
                        Yo&apos;nalish: <span className="text-gray-300">{user.trackTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: XP Score & Referral count */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase font-mono text-gray-400">Takliflar</div>
                      <div className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1 sm:justify-end">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{user.referralCount} ta</span>
                      </div>
                    </div>

                    <div className="text-right pl-3 sm:border-l border-white/15">
                      <div className="text-[10px] uppercase font-mono text-gray-400">Umumiy Tajriba</div>
                      <div className="text-base sm:text-lg font-black font-mono text-amber-400 flex items-center gap-1.5 justify-end">
                        <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>{user.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer CTA in leaderboard */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Har bir muvaffaqiyatli ro&apos;yxatdan o&apos;tgan do&apos;stingiz uchun +50 XP beriladi</span>
          </div>
          <button
            onClick={onOpenRegister}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 shadow-neonCyan transition-all shrink-0"
          >
            Ro&apos;yxatdan o&apos;tib reytingga qo&apos;shilish
          </button>
        </div>
      </div>
    </section>
  );
}
