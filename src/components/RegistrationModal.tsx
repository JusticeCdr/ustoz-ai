"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  X,
  Bot,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Phone,
  User,
  Layers,
  HelpCircle,
  LogIn,
  UserPlus,
  LogOut,
  Camera,
  Zap,
  Flame,
  Code2,
} from "lucide-react";
import { CAREER_TRACKS, TELEGRAM_BOT_USERNAME } from "@/lib/constants";
import { CareerTrackId, AuthParticipant } from "@/types";
import CyberPassCard from "./CyberPassCard";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrackId?: CareerTrackId;
  currentUser?: AuthParticipant | null;
  onAuthSuccess?: (user: AuthParticipant) => void;
  onLogout?: () => void;
  initialMode?: "register" | "login" | "profile";
  onOpenAcademy?: (trackId?: CareerTrackId) => void;
  onOpenHub?: () => void;
  onOpenCodeSandbox?: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  preselectedTrackId,
  currentUser,
  onAuthSuccess,
  onLogout,
  initialMode = "register",
  onOpenAcademy,
  onOpenHub,
  onOpenCodeSandbox,
}: RegistrationModalProps) {
  // Mode: register | login | profile
  const [mode, setMode] = useState<"register" | "login" | "profile">(
    currentUser ? "profile" : initialMode
  );

  // Steps: 1 (Form) | 2 (Waiting Bot Start) | 3 (Enter OTP) | 4 (Success / CyberPass)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(currentUser ? 4 : 1);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [trackId, setTrackId] = useState<CareerTrackId>(
    preselectedTrackId || CAREER_TRACKS[0].id
  );

  // OTP & Timer (1 minute = 60s)
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Session & UI state
  const [sessionCode, setSessionCode] = useState("");
  const [botUrl, setBotUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Verified Participant
  const [participant, setParticipant] = useState<AuthParticipant | null>(currentUser || null);

  useEffect(() => {
    if (currentUser) {
      setParticipant(currentUser);
      setMode("profile");
      setStep(4);
    } else {
      setMode(initialMode || "register");
      setStep(1);
    }
  }, [currentUser, initialMode, isOpen]);

  useEffect(() => {
    if (preselectedTrackId) {
      setTrackId(preselectedTrackId);
    }
  }, [preselectedTrackId]);

  // 60-second countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 3 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Polling for bot start in Step 2 (if user had not started the bot yet)
  useEffect(() => {
    if (step !== 2 || !sessionCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/register/status?sessionCode=${sessionCode}`);
        const data = await res.json();
        if (data.ok && data.hasOtpGenerated) {
          // Telegram bot generated OTP! Auto-advance to Step 3
          setStep(3);
          setTimerSeconds(60);
          setCanResend(false);
          setErrorMessage("");
        }
      } catch (e) {
        console.error("Status polling error:", e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [step, sessionCode]);

  // Confetti trigger for Step 4
  useEffect(() => {
    if (step === 4 && !currentUser) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f0ff", "#9d4edd", "#ffbe0b", "#06d6a0"],
        });
      } catch (e) {}
    }
  }, [step, currentUser]);

  // Send OTP (Register or Login)
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanPhoneDigits = phone.replace(/\D/g, "");
    if (cleanPhoneDigits.length < 9) {
      setErrorMessage("Iltimos, telefon raqamingizni to'liq kiriting.");
      return;
    }

    if (mode === "register" && (!fullName.trim() || fullName.trim().length < 2)) {
      setErrorMessage("Iltimos, ism va familiyangizni to'liq kiriting (kamida 2 harf).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          fullName: mode === "register" ? fullName : undefined,
          trackId: mode === "register" ? trackId : undefined,
          isLogin: mode === "login",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring.");
        setLoading(false);
        return;
      }

      setSessionCode(data.sessionCode);

      if (data.sent) {
        // Code sent directly to Telegram!
        setStep(3);
        setTimerSeconds(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setSuccessMessage("Tasdiqlash kodi Telegram botingizga yuborildi!");
        setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
      } else if (data.requiresBotStart) {
        // User needs to open bot and press Start
        setBotUrl(data.botUrl || `https://t.me/${TELEGRAM_BOT_USERNAME}`);
        setStep(2);
      }
    } catch (err: any) {
      setErrorMessage("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input typing
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
        handleVerifyOtp(clean);
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

    // Auto verify if all 6 digits entered
    if (digit && index === 5) {
      const full = newDigits.join("");
      if (full.length === 6) {
        handleVerifyOtp(full);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (codeOverride?: string) => {
    const fullOtp = codeOverride || otpDigits.join("").trim();
    if (fullOtp.length < 6) {
      setErrorMessage("Iltimos, Telegram botdan kelgan 6 xonali parolni to'liq kiriting.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionCode,
          phone,
          otp: fullOtp,
          fullName: mode === "register" ? fullName : undefined,
          trackId: mode === "register" ? trackId : undefined,
          isLogin: mode === "login",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Kod noto'g'ri yoki muddati tugagan.");
        setLoading(false);
        return;
      }

      const p: AuthParticipant = data.participant;
      setParticipant(p);
      setStep(4);
      setMode("profile");

      // Save persistent session in localStorage
      try {
        localStorage.setItem("ustoz_auth_user", JSON.stringify(p));
      } catch (e) {}

      if (onAuthSuccess) {
        onAuthSuccess(p);
      }
    } catch (err: any) {
      setErrorMessage("Tarmoq xatosi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    if (!canResend) return;
    setOtpDigits(["", "", "", "", "", ""]);
    setErrorMessage("");
    await handleSendCode();
  };

  // Avatar update
  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (participant) {
      const updated = { ...participant, avatarUrl: newAvatarUrl };
      setParticipant(updated);
      try {
        localStorage.setItem("ustoz_auth_user", JSON.stringify(updated));
      } catch (e) {}
      if (onAuthSuccess) {
        onAuthSuccess(updated);
      }
    }
  };

  // Avatar file input change in profile
  const handleProfileAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !participant) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      handleAvatarUpdate(base64);
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

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#090d22] border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="p-6 sm:p-7 pb-4 border-b border-white/10">
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
                USTOZ AI • PLATFORMA
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {step === 4 && participant && "Shaxsiy Kabinet & Cyber Pass"}
              {step === 1 && mode === "register" && "Tanlovga Ro'yxatdan O'tish"}
              {step === 1 && mode === "login" && "Akkauntga Kirish"}
              {step === 2 && "Telegram Botni Tasdiqlash"}
              {step === 3 && "Bir Martalik Parol (OTP)"}
            </h3>

            {/* Mode Switch Tabs (Only if not already authenticated or in step 1) */}
            {step === 1 && !currentUser && (
              <div className="flex items-center gap-2 mt-4 p-1 rounded-xl bg-white/5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "register"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Ro&apos;yxatdan O&apos;tish</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "login"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Akkauntga Kirish</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 pt-5">
            {/* Error & Success Alerts */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= STEP 1: PHONE & NAME FORM ================= */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                      F.I.SH (Ism va Familiya)
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
                )}

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Telefon Raqam (Telegram raqamingiz)
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
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tasdiqlash kodi to&apos;g&apos;ridan-to&apos;g&apos;ri Telegram botingizga yuboriladi</span>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-300 uppercase tracking-wider mb-1.5">
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
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Telegramga Kodni Yuborish</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Subtext toggle */}
                <div className="text-center pt-2">
                  {mode === "register" ? (
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                    >
                      Allaqachon ro&apos;yxatdan o&apos;tganmisiz? <span className="text-cyan-400 font-bold">Akkauntga kirish</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-xs text-gray-400 hover:text-cyan-300 transition-colors"
                    >
                      Hali ro&apos;yxatdan o&apos;tmaganmisiz? <span className="text-cyan-400 font-bold">Ro&apos;yxatdan o&apos;tish</span>
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* ================= STEP 2: BOT START REQUIRED ================= */}
            {step === 2 && (
              <div className="space-y-6 text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mx-auto shadow-neonCyan text-cyan-300">
                  <Bot className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">
                    Telegram Botda Tasdiqlash
                  </h4>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                    Kodni qabul qilish uchun quyidagi tugmani bosing va rasmiy botimizda <b className="text-cyan-300">«START»</b> (yoki «Kontaktni yuborish») tugmasini bosing:
                  </p>
                </div>

                <a
                  href={botUrl || `https://t.me/${TELEGRAM_BOT_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all flex items-center justify-center gap-2 group"
                >
                  <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Telegram Botni Ochish va Start Bosish</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>

                <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400 pt-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Bot orqali tasdiqlash kutilmoqda (avtomatik o&apos;tadi)...</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage("");
                    }}
                    className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Raqamni qayta kiritish</span>
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 3: OTP VERIFY WITH 1-MIN TIMER ================= */}
            {step === 3 && (
              <div className="space-y-6 text-center py-2">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Tasdiqlash Kodi</span>
                  </div>
                  <h4 className="text-xl font-extrabold text-white">
                    Telegram Botdan Kelgan Kodni Kiriting
                  </h4>
                  <p className="text-xs text-gray-400">
                    <b className="text-gray-200">{phone}</b> raqamingizga bog&apos;langan botga 6 xonali tasdiqlash paroli yuborildi.
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black font-mono rounded-xl bg-white/5 border-2 border-white/20 focus:border-cyan-400 focus:bg-cyan-500/10 text-white outline-none transition-all"
                    />
                  ))}
                </div>

                {/* 1 Minute Countdown Timer */}
                <div className="flex items-center justify-center gap-2 text-xs font-mono">
                  {timerSeconds > 0 ? (
                    <span className="text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-400/30">
                      <span>⏱ Kod amal qilish muddati:</span>
                      <b className="text-amber-300">{formatTimer(timerSeconds)}</b>
                    </span>
                  ) : (
                    <span className="text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-400/30">
                      ⚠️ Kod muddati tugadi! Yangi kod so&apos;rang.
                    </span>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={loading || otpDigits.join("").length < 6}
                  className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-neonCyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Kodni Tasdiqlash</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend and Back buttons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setErrorMessage("");
                    }}
                    className="text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ortga</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:hover:text-cyan-400 font-bold"
                  >
                    Kodni qayta yuborish
                  </button>
                </div>
              </div>
            )}

            {/* ================= STEP 4: VERIFIED CYBER PASS & PROFILE ================= */}
            {step === 4 && participant && (
              <div className="space-y-6 text-center">
                {/* 3D Interactive Cyber Pass Card */}
                <CyberPassCard
                  participant={participant}
                  onAvatarChange={handleAvatarUpdate}
                  onOpenDashboard={() => {
                    onClose();
                    if (onOpenHub) onOpenHub();
                  }}
                  onOpenCodeSandbox={() => {
                    onClose();
                    if (onOpenCodeSandbox) onOpenCodeSandbox();
                  }}
                />

                {/* Hub, Academy and Code Sandbox Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenCodeSandbox) onOpenCodeSandbox();
                    }}
                    className="py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:opacity-95 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group border border-cyan-400/40"
                  >
                    <Code2 className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>💻 Kod Yozish (HTML, CSS, Py)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenHub) onOpenHub();
                    }}
                    className="py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:opacity-95 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span>🔥 Student Hub (Streak)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAcademy) {
                        onOpenAcademy(participant.trackId);
                      }
                    }}
                    className="py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-gradient-to-r from-purple-500 via-pink-600 to-purple-700 hover:opacity-95 shadow-[0_0_25px_rgba(157,78,221,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>🎓 Video Darslar</span>
                  </button>
                </div>

                {/* Quick actions: Logout or Close */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onLogout) {
                        onLogout();
                      }
                      setParticipant(null);
                      setMode("register");
                      setStep(1);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-bold font-mono transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Akkauntdan Chiqish</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-neonCyan hover:opacity-95 transition-all"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
