"use client";

import React from "react";
import { motion } from "framer-motion";
import { TIMELINE_STAGES } from "@/lib/constants";
import { Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function TimelineSection() {
  return (
    <section id="bosqichlar" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-purple-400/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Yo&apos;l Xaritasi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Tanlovning{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Asosiy Bosqichlari
          </span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">
          Ro&apos;yxatdan o&apos;tishdan boshlab g&apos;oliblarni tantanali taqdirlashgacha bo&apos;lgan barcha qadamlar.
        </p>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Connecting Line for desktop */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 -translate-y-1/2 opacity-30 z-0" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {TIMELINE_STAGES.map((stage, idx) => {
            const isActive = stage.status === "active";
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative rounded-3xl p-7 glass-panel border transition-all duration-300 ${
                  isActive
                    ? "border-cyan-400 shadow-neonCyan ring-1 ring-cyan-400/50"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Step pill */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-lg ${
                      isActive
                        ? "bg-cyan-500 text-black shadow-neonCyan"
                        : "bg-white/10 text-gray-300 border border-white/15"
                    }`}
                  >
                    0{stage.step}
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {stage.period}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{stage.title}</h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">{stage.desc}</p>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">{stage.badge}</span>
                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      Qabul qilinmoqda
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">Kutilmoqda</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
