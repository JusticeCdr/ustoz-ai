"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Code2, ShieldCheck, Palette, BarChart3, ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrack, CareerTrackId } from "@/types";

interface TracksSectionProps {
  onSelectTrack: (trackId: CareerTrackId) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot className="w-7 h-7" />,
  Code2: <Code2 className="w-7 h-7" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7" />,
  Palette: <Palette className="w-7 h-7" />,
  BarChart3: <BarChart3 className="w-7 h-7" />,
};

export default function TracksSection({ onSelectTrack }: TracksSectionProps) {
  return (
    <section id="yonalishlar" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Zamonaviy Yo&apos;nalishlar</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Kelajak Kasbini Tanla va{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Chempionga Aylangan!
          </span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg">
          Tanlovda eng talabgir 5 ta yo&apos;nalish bo&apos;yicha bellashuvlar o&apos;tkaziladi. O&apos;zingizga mos sohani tanlang va bilimingizni sinovdan o&apos;tkazing.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CAREER_TRACKS.map((track, idx) => (
          <TrackCard key={track.id} track={track} index={idx} onSelect={() => onSelectTrack(track.id)} />
        ))}
      </div>
    </section>
  );
}

function TrackCard({
  track,
  index,
  onSelect,
}: {
  track: CareerTrack;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`relative group rounded-2xl p-6 glass-panel border ${track.neonBorder} transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg`}
      style={{
        boxShadow: `0 10px 30px -10px ${track.glowColor}`,
      }}
    >
      {/* Top ambient highlight gradient */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity bg-gradient-to-br ${track.gradient}`}
      />

      <div>
        {/* Card Header: Icon & Popular Badge */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: `${track.color}15`,
              color: track.color,
              boxShadow: `0 0 15px ${track.color}40`,
            }}
          >
            {iconMap[track.icon]}
          </div>

          <div className="flex flex-col items-end gap-1">
            {track.popular && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyan-300" /> TOP TANLOV
              </span>
            )}
            <span className="text-[11px] font-mono text-gray-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
              Qiyinlik: {track.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
          {track.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          {track.shortDesc}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {track.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-300 border border-white/10 group-hover:border-white/20 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Career Prospects & Select Button */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Maosh istiqboli:
          </div>
          <div className="text-xs font-bold text-emerald-400 font-mono">
            {track.careerProspects}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 group-hover:border-cyan-400 group-hover:text-cyan-300 transition-all duration-200 active:scale-95 shadow-sm"
        >
          <span>Tanlash</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
