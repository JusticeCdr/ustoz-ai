"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_LIST } from "@/lib/constants";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ko&apos;p So&apos;raladigan Savollar</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Savollaringiz Bormi?{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bizda Javoblar Bor!
          </span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Tanlov qoidalari, Telegram bot tasdiqlash va imtiyozlar bo&apos;yicha tez-tez beriladigan savollar.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {FAQ_LIST.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl glass-panel border transition-all duration-300 overflow-hidden ${
                isOpen ? "border-cyan-400/60 bg-white/5" : "border-white/10 hover:border-white/20"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 select-none"
              >
                <span className="font-semibold text-base sm:text-lg text-white">
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
