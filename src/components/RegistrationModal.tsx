"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  X,
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  QrCode,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Phone,
  User,
  Layers,
  HelpCircle,
} from "lucide-react";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrackId } from "@/types";
import CyberPassCard from "./CyberPassCard";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrackId?: CareerTrackId;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  preselectedTrackId,
}: RegistrationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [trackId, setTrackId] = useState<CareerTrackId>(
    preselectedTrackId || CAREER_TRACKS[0].id
  );

  // API State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionCode, setSessionCode] = useState("");
  const [deepLink, setDeepLink] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Verified Participant Data
  const [participant, setParticipant] = useState<any>(null);

  useEffect(() => {
    if (preselectedTrackId) {
      setTrackId(preselectedTrackId);
    }
  }, [preselectedTrackId]);

  // Polling for Telegram interaction in Step 2
  useEffect(() => {
    if (step !== 2 || !sessionCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/register/status?sessionCode=${sessionCode}`);
        const data = await res.json();
        if (data.ok && data.hasOtpGenerated) {
          // Telegram bot generated OTP! Auto-advance to Step 3
          setStep(3);
        }
      } catch (e) {
        console.error("Status polling error:", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [step, sessionCode]);

  // Confetti trigger for Step 4
  useEffect(() => {
    if (step === 4) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f0ff", "#9d4edd", "#ffbe0b", "#06d6a0"],
        });
      } catch (e) {}
    }
  }, [step]);

  // Step 1: Initiate
  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage("Iltimos, ism va familiyangizni to'liq kiriting.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 9) {
      setErrorMessage("Iltimos, to'liq telefon raqamingizni kiriting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, trackId }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        setLoading(false);
        return;
      }

      setSessionCode(data.sessionCode);
      setDeepLink(data.deepLink);

      // Generate QR Code data URL
      const qr = await QRCode.toDataURL(data.deepLink, {
        margin: 2,
        width: 320,
        color: {
          dark: "#00f0ff",
          light: "#0d132b",
        },
      });
      setQrDataUrl(qr);

      setStep(2);
    } catch (err: any) {
      setErrorMessage("Tarmoq xatosi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle OTP input typing
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const clean = value.replace(/\D/g, "").slice(0, 6);
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = clean[i] || "";
      }
      setOtpDigits(newDigits);
      if (clean.length === 6) {
        otpInputsRef.current[5]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 3: Verify OTP
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpDigits.join("").trim();
    if (fullOtp.length < 6) {
      setErrorMessage("Iltimos, Telegram botdan kelgan 6 xonali parolni to'liq kiriting.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode,
          otp: fullOtp,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Kod noto'g'ri. Qayta tekshirib ko'ring.");
        setLoading(false);
        return;
      }

      setParticipant(data.participant);
      setStep(4);
    } catch (err: any) {
      setErrorMessage("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const copySessionCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-400/40 bg-[#070b1a]/95 text-white shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top glowing bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header & Progress */}
          <div className="p-6 sm:p-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="relative w-6 h-6 rounded-lg p-[1.5px] bg-gradient-to-tr from-cyan-400 to-purple-500 shrink-0">
                <div className="w-full h-full rounded-[6px] overflow-hidden bg-[#070b1a] relative">
                  <Image
                    src="/logo.jpg"
                    alt="Ustoz AI Logo"
                    fill
                    sizes="24px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-cyan-400 text-xs font-mono font-bold tracking-widest uppercase">
                USTOZ AI • TANLOVGA RO&apos;YXATDAN O&apos;TISH
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {step === 1 && "Shaxsiy Ma'lumotlarni Kiriting"}
              {step === 2 && "Telegram Bot Orqali Tasdiqlash"}
              {step === 3 && "Bir Martalik Parolni Kiriting"}
              {step === 4 && "Cyber Pass Rasmiylashtirildi!"}
            </h3>

            {/* Stepper Dots */}
            <div className="flex items-center justify-between gap-2 mt-5">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      step >= s
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                        : "bg-white/10"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 pt-6">
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                {errorMessage}
              </div>
            )}

            {/* ================= STEP 1: FORM ================= */}
            {step === 1 && (
              <form onSubmit={handleInitiate} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Ism va Familiya
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Sardor Rustamov"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-500 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Telefon Raqam (Telegram ulangan raqam)
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-gray-500 text-sm outline-none font-mono transition-all"
                    />
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 font-mono">
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span>Telegramdagi raqamingiz bo&apos;yicha bot sizni avtomatik aniqlaydi</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-2">
                    Tanlov Yo&apos;nalishi
                  </label>
                  <div className="relative">
                    <Layers className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value as CareerTrackId)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#0e1635] border border-white/15 focus:border-cyan-400 text-white text-sm outline-none cursor-pointer transition-all"
                    >
                      {CAREER_TRACKS.map((t) => (
                        <option key={t.id} value={t.id} className="bg-[#0b1026] text-white py-2">
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Keyingi Bosqich (Telegram Tasdiqlash)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ================= STEP 2: TELEGRAM BOT VERIFY ================= */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 text-left">
                  <div className="text-xs text-gray-400 font-mono mb-1">Maxsus seans kodi:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono tracking-widest text-cyan-300">
                      {sessionCode}
                    </span>
                    <button
                      onClick={copySessionCode}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-all"
                    >
                      {hasCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Nusxalandi</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Kodni nusxalash</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code and Instructions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  {qrDataUrl && (
                    <div className="p-3 bg-[#0d132b] rounded-2xl border border-cyan-400/40 shadow-neonCyan">
                      <img
                        src={qrDataUrl}
                        alt="Telegram QR Code"
                        className="w-36 h-36 rounded-xl"
                      />
                      <div className="text-[10px] font-mono text-cyan-400 text-center mt-2 flex items-center justify-center gap-1">
                        <QrCode className="w-3 h-3" />
                        <span>Kamera bilan skanerlang</span>
                      </div>
                    </div>
                  )}

                  <div className="text-left space-y-2.5 max-w-xs">
                    <h4 className="font-bold text-white text-base">Botda parolni olish usullari:</h4>
                    <ul className="text-xs text-gray-300 space-y-2">
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">1.</span>
                        <span>Quyidagi tugmani bosing va botda <b>«START»</b> tugmasini bosing</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">2.</span>
                        <span>Yoki botga telefon raqamingizni (<b>{phone}</b>) yozib yuboring</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">3.</span>
                        <span>Bot sizga <b>6 xonali tasdiqlash paroli</b>ni beradi!</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Open in Telegram Button */}
                <div className="space-y-3">
                  <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl font-bold text-sm tracking-wider text-white bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-400 hover:to-cyan-400 shadow-neonCyan transition-all flex items-center justify-center gap-2 group"
                  >
                    <Bot className="w-5 h-5" />
                    <span>Telegram Botda Ochish</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Manual move to step 3 */}
                  <button
                    onClick={() => setStep(3)}
                    className="w-full py-3 rounded-xl font-semibold text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Parolni allaqachon oldim, kiritishga o&apos;tish</span>
                  </button>
                </div>

                {/* Live listening pulse */}
                <div className="flex items-center justify-center gap-2 text-xs text-cyan-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Telegram bot xabari avtomatik kutilmoqda...</span>
                </div>
              </div>
            )}

            {/* ================= STEP 3: OTP INPUT ================= */}
            {step === 3 && (
              <form onSubmit={handleVerify} className="space-y-6 text-center">
                <div className="space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 mx-auto flex items-center justify-center mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Telegram Botdan Kelgan Parol
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    Telegram botimiz sizga 6 xonali tasdiqlash parolini yubordi.
                  </p>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-center gap-2 sm:gap-3 py-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-white/5 border border-white/20 focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/30 text-white outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="hover:text-cyan-300 flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Bot havolasiga qaytish</span>
                  </button>
                  <a
                    href={deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Kodni qayta yuborish</span>
                    <RefreshCw className="w-3 h-3" />
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpDigits.join("").length < 6}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-neonCyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Tasdiqlash va Cyber Passni Olish</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ================= STEP 4: CYBER PASS SUCCESS ================= */}
            {step === 4 && participant && (
              <CyberPassCard participant={participant} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
