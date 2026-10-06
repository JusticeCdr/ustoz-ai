"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  QrCode,
  Send,
  Camera,
  Flame,
  ArrowRight,
} from "lucide-react";

interface CyberPassCardProps {
  participant: {
    participantId: string;
    fullName: string;
    trackTitle: string;
    xp: number;
    referralLink: string;
    verifiedAt: number;
    avatarUrl?: string;
  };
  onAvatarChange?: (newAvatarUrl: string) => void;
  onOpenDashboard?: () => void;
}

export default function CyberPassCard({ participant, onAvatarChange, onOpenDashboard }: CyberPassCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt interactive values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(participant.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      if (onAvatarChange) {
        onAvatarChange(base64);
      }
      try {
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: participant.participantId,
            avatarUrl: base64,
          }),
        });
      } catch (err) {}
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(
      `🚀 Men "Ustoz AI — Zamonaviy Kasblar Tanlovi"da ro'yxatdan o'tdim va Cyber Pass oldim!\n\nSen ham qatnash va MacBook, iPad hamda 100% grantlarni yutib ol:\n${participant.referralLink}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(participant.referralLink)}&text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* 3D Tilt Card Container */}
      <div
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full flex justify-center py-2 select-none"
      >
        <motion.div
          ref={cardRef}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0c153b] via-[#090f2b] to-[#150e38] border-2 border-cyan-400/60 shadow-neonCyan overflow-hidden text-left cursor-grab active:cursor-grabbing"
        >
          {/* Hologram Shimmer Accent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />

          {/* Card Top Brand & Badge */}
          <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5 relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-neonCyan shrink-0">
                <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#070b1a] relative">
                  <Image
                    src="/logo.jpg"
                    alt="Ustoz AI Logo"
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                  USTOZ AI • CYBER PASS
                </div>
                <div className="text-xs text-gray-400">2026 Tanlov Guvohnomasi</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED PASS</span>
            </div>
          </div>

          {/* Participant Details */}
          <div className="space-y-4 mb-5 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="relative group/avatar">
                <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] overflow-hidden shrink-0 relative">
                  {participant.avatarUrl ? (
                    <img
                      src={participant.avatarUrl}
                      alt={participant.fullName}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-[#0c1435] flex items-center justify-center text-cyan-300 font-black text-xl font-mono">
                      {participant.fullName ? participant.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  {/* Hover upload button overlay */}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer rounded-[14px]">
                    <Camera className="w-4 h-4 text-cyan-300" />
                    <span className="text-[8px] font-mono text-cyan-300 mt-0.5 font-bold">Yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-[10px] font-mono uppercase text-gray-400">Ishtirokchi</div>
                  <label className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
                    <Camera className="w-3 h-3" />
                    <span>Rasm yuklash</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-xl font-black text-white tracking-wide truncate">
                  {participant.fullName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Ishtirokchi ID</div>
                <div className="text-base font-black font-mono text-cyan-300 tracking-wider">
                  {participant.participantId}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase text-gray-400">Boshlang&apos;ich Tajriba</div>
                <div className="text-base font-black font-mono text-amber-400 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>+{participant.xp || 100} XP</span>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase text-gray-400">Tanlangan Yo&apos;nalish</div>
              <div className="text-sm font-bold text-purple-300">
                {participant.trackTitle}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] font-mono text-gray-400 relative z-10">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>RASMIY ISHTIROKCHI</span>
            </div>
            <div>
              SANA: {new Date(participant.verifiedAt || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Boost Box (+50 XP per friend) */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-400/30 bg-amber-950/20 text-left space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Referral Boost: +50 XP har bir do&apos;st uchun</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded bg-white/5">
            Liderlik sari
          </span>
        </div>
        <p className="text-xs text-gray-300">
          Shaxsiy taklif havolangizni do&apos;stlaringizga yuboring. Har bir ro&apos;yxatdan o&apos;tgan do&apos;stingiz sizga <b>+50 XP</b> beradi va reytingda yuqorilatadi!
        </p>
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            readOnly
            value={participant.referralLink}
            className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 font-mono outline-none"
          />
          <button
            onClick={copyReferral}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono transition-all flex items-center gap-1 shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nusxalandi</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Nusxalash</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Student Hub Direct Access */}
      {onOpenDashboard && (
        <button
          onClick={onOpenDashboard}
          className="w-full py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider text-amber-300 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2.5 group"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Student Hubga O&apos;tish (Streak, Sinov Testi & Sertifikat)</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Action Buttons: Download & Telegram Share */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          onClick={handlePrint}
          className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Cyber Passni Saqlash / Chop Etish</span>
        </button>

        <button
          onClick={shareToTelegram}
          className="py-3.5 px-5 rounded-xl font-bold text-xs tracking-wider text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4 text-cyan-300" />
          <span>Telegramda Ulashish</span>
        </button>
      </div>
    </div>
  );
}
