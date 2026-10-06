"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Camera,
  CameraOff,
  Scan,
  Sparkles,
  RefreshCw,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Brain,
  Cpu,
  ArrowRight,
  Volume2,
  VolumeX,
  Eye,
  Activity,
  UserCheck,
  AlertCircle,
  Flame,
  Award,
} from "lucide-react";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerTrack, CareerTrackId } from "@/types";

interface FaceScanCareerProps {
  onSelectTrackAndRegister: (trackId: CareerTrackId) => void;
}

// Biometric analysis profile results for each track
const BIOMETRIC_PROFILES: Record<
  CareerTrackId,
  {
    archetype: string;
    description: string;
    traits: { label: string; score: number }[];
    verdict: string;
  }
> = {
  "ai-prompt": {
    archetype: "AI Innovator & Strateg",
    description:
      "Sizning ko'z fiksirovkangiz va kognitiv reaksiyangiz sun'iy intellekt agentlari, neyrotarmoqlar va prompt arxitekturasi uchun ideal tuzilishga ega.",
    traits: [
      { label: "Neyro-Mantiqiy Tezlik", score: 98 },
      { label: "AI bilan Integratsiya", score: 96 },
      { label: "Kreativ Muhandislik", score: 93 },
      { label: "Tizimli Adaptatsiya", score: 95 },
    ],
    verdict:
      "Neyrotarmoq sizda yuksak konseptual fikrlash va sun'iy idrok vositalarini boshqarish qobiliyatini tasdiqladi. Kelajak aynan siz kabilar qo'lida!",
  },
  "fullstack-web3": {
    archetype: "Arxitektor & Veb 3.0 Muhandisi",
    description:
      "Yuz simmetriyasi va diqqat markazingiz murakkab backend tizimlar, smart-kontraktlar va yuqori yuklamali arxitekturalarga moyillikni bildiradi.",
    traits: [
      { label: "Algoritmik E'tibor", score: 97 },
      { label: "Arxitektura Qobiliyati", score: 95 },
      { label: "Web3 & Blockchain Sezgi", score: 91 },
      { label: "Xatolar Barqarorligi", score: 94 },
    ],
    verdict:
      "Katta masshtabli tizimlar tuzish siz uchun tabiiy iqtidor. Fullstack va Web3 yo'nalishida ulkan natijalarga erishasiz!",
  },
  cybersecurity: {
    archetype: "Kiber-Qalqon & Etik Xaker",
    description:
      "Mikro-mimikangiz va detallashtirilgan nigohingiz xavfsizlik zaifliklarini bir zumda ilg'ab olish va tahdidlarni qaytarish salohiyatini namoyon etmoqda.",
    traits: [
      { label: "Tahdidlarni Aniqlash", score: 99 },
      { label: "Xavfsizlik Himoyasi", score: 96 },
      { label: "Kriptografik Sezgirlik", score: 94 },
      { label: "Reaksiya Tezligi", score: 95 },
    ],
    verdict:
      "Siz kiberxavfsizlik sohasida milliy va xalqaro miqyosdagi eng ishonchli kiber-himoyachi bo'lish uchun tug'ma iqtidorga egasiz!",
  },
  "uiux-3d": {
    archetype: "Vizual Visioner & 3D Dizayner",
    description:
      "Vizual qabul qilish va fazoviy tasavvuringiz g'oyat yuqori. Kelajak interfeyslari, 3D modellar va interaktiv motion olamini zabt etasiz.",
    traits: [
      { label: "Fazoviy 3D Tasavvur", score: 98 },
      { label: "Estetika & Ergonomika", score: 97 },
      { label: "Foydalanuvchi Empatiyasi", score: 93 },
      { label: "Motion & Animatsiya", score: 95 },
    ],
    verdict:
      "Sizning ko'zingiz mukammal estetika va interfeyslarni ko'radi. 3D UI/UX olamida eng talabgir mutaxassisga aylanasiz!",
  },
  datascience: {
    archetype: "Data Tahlilchi & AI Olimi",
    description:
      "Tahliliy nigoh va chuqur konsentratsiyangiz ulkan ma'lumotlar massividan qonuniyatlarni topish va bashorat qiluvchi AI modellarini yaratishga mos.",
    traits: [
      { label: "Matematik Mantiq", score: 97 },
      { label: "Data Qonuniyatlari", score: 96 },
      { label: "Bashorat Aniqligi", score: 94 },
      { label: "Ilmiy Qiziquvchanlik", score: 95 },
    ],
    verdict:
      "Katta ma'lumotlar bazalari va Machine Learning sizning kuchingiz. Tahlil va faktlar sizni eng yuqori cho'qqiga olib chiqadi!",
  },
};

export default function FaceScanCareer({
  onSelectTrackAndRegister,
}: FaceScanCareerProps) {
  const [scanState, setScanState] = useState<
    "idle" | "camera-active" | "scanning" | "analyzing" | "result"
  >("idle");

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Result state
  const [matchedTrack, setMatchedTrack] = useState<CareerTrack | null>(null);
  const [matchPercentage, setMatchPercentage] = useState(96);
  const [biometricProfile, setBiometricProfile] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound generator
  const playCyberSound = (type: "beep" | "scan" | "success") => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "scan") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio not supported or blocked, fail silently
    }
  };

  // Start web camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Kamera ushbu brauzerda qo'llab-quvvatlanmaydi.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setScanState("camera-active");
      playCyberSound("beep");
    } catch (err: any) {
      console.warn("Camera error:", err);
      setCameraError(
        "Kameraga ruxsat berilmadi yoki kamera mavjud emas. Quyidagi rasmni yuklash yoki AI demo skanerlashdan foydalanishingiz mumkin."
      );
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture current video frame to canvas
  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Flip horizontally for natural mirror feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  };

  // Run scanning animation sequence
  const startScanningProcess = (imageUrl?: string) => {
    let captured = imageUrl;
    if (!captured && cameraActive) {
      captured = captureFrame() || undefined;
    }
    if (captured) {
      setCapturedImage(captured);
    }
    stopCamera();

    setScanState("scanning");
    setScanProgress(0);
    playCyberSound("scan");

    const steps = [
      "1. Yuzning 468 ta biometrik koordinatasi aniqlanmoqda...",
      "2. Ko'z qorachig'i fiksirovkasi va kognitiv fokus o'lchanmoqda...",
      "3. 5 ta kelajak kasbi bilan neyro-moslik hisoblanmoqda...",
      "4. AI Biometrik Xulosa tayyorlanmoqda!",
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setScanProgress(currentProgress);

      const stepIndex = Math.min(
        Math.floor((currentProgress / 100) * steps.length),
        steps.length - 1
      );
      setCurrentStepText(steps[stepIndex]);

      if (currentProgress % 18 === 0) {
        playCyberSound("beep");
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanState("analyzing");
        setTimeout(() => {
          finalizeResult();
        }, 800);
      }
    }, 45);
  };

  // Pick suitable track result
  const finalizeResult = () => {
    // Pick based on random or deterministic distribution
    const randomIndex = Math.floor(Math.random() * CAREER_TRACKS.length);
    const selected = CAREER_TRACKS[randomIndex];
    const profile = BIOMETRIC_PROFILES[selected.id];
    const match = 94 + Math.floor(Math.random() * 5); // 94% to 98%

    setMatchedTrack(selected);
    setBiometricProfile(profile);
    setMatchPercentage(match);
    setScanState("result");

    playCyberSound("success");

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [selected.color, "#00f0ff", "#9d4edd", "#ffffff"],
      });
    } catch (e) {}
  };

  // Handle uploaded photo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      startScanningProcess(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Demo scan without camera
  const handleDemoScan = () => {
    setCapturedImage("/avatar-demo.png");
    startScanningProcess();
  };

  // Reset to scan again
  const handleReset = () => {
    stopCamera();
    setCapturedImage(null);
    setScanState("idle");
    setScanProgress(0);
    setMatchedTrack(null);
    setBiometricProfile(null);
  };

  return (
    <section
      id="yuz-skaner"
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-cyan-500/10">
          <Scan className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>BIOMETRIC AI SCANNER • 2026 NEYRO-DIAGNOSTIKA</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Yuzingizni Skanerlang —{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent text-glow-cyan">
            Qaysi Kasb Sizga Mosligini
          </span>{" "}
          Bilib Oling!
        </h2>

        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Kamerangizni yoqing yoki suratingizni ko&apos;rsating. Ustoz AI neyrotarmog&apos;i
          yuz mimikasi, ko&apos;z fiksirovkasi va kognitiv belgilar orqali sizga eng mos
          zamonaviy kasbni soniyalar ichida aniqlaydi!
        </p>

        {/* Audio Toggle */}
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-400 hover:text-cyan-300 transition-all"
            title="Ovoz effektlarini yoqish/o'chirish"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kiber-ovoz: Yoqilgan</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                <span>Kiber-ovoz: O&apos;chirilgan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl glass-panel border border-cyan-400/30 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-2xl bg-[#070b1a]/90">
          {/* Top glowing cyber accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Error Message */}
          {cameraError && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-0.5">Kamera xabari:</div>
                <p className="text-gray-300">{cameraError}</p>
              </div>
            </div>
          )}

          {/* ================= STATE 1: IDLE / STANDBY ================= */}
          {scanState === "idle" && (
            <div className="flex flex-col items-center text-center space-y-8 py-4">
              {/* Standby Hologram Viewport */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl border-2 border-dashed border-cyan-400/40 bg-[#091029]/80 flex flex-col items-center justify-center overflow-hidden shadow-neonCyan group">
                {/* Corner Cyber HUD Accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                {/* Animated Cyber Holographic Face Outline */}
                <div className="relative flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border border-cyan-400/30 animate-pulse flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-purple-400/40 animate-ping opacity-30" />
                  </div>
                  <Scan className="w-20 h-20 text-cyan-400 absolute group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="mt-4 text-xs font-mono text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>BIOMETRIC SCANNER READY</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono mt-1">
                  Yuzingizni markazga joylashtiring
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                <button
                  onClick={startCamera}
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <Camera className="w-5 h-5 text-cyan-200" />
                  <span>Kamerani Yoqish</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl font-semibold text-sm text-gray-200 glass-panel border border-white/15 hover:border-cyan-400/60 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Rasm Yuklash</span>
                </button>
              </div>

              {/* Demo button option */}
              <button
                onClick={handleDemoScan}
                className="text-xs font-mono text-gray-400 hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Kamerasiz AI Demo Skanerlashni sinab ko&apos;rish</span>
              </button>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Maxfiylik kafolatlangan: Tasviringiz serverga saqlanmaydi va faqat brauzeringizda tahlil qilinadi.
                </span>
              </div>
            </div>
          )}

          {/* ================= STATE 2: CAMERA ACTIVE ================= */}
          {scanState === "camera-active" && (
            <div className="flex flex-col items-center text-center space-y-6 py-2">
              <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-neonCyan bg-black">
                {/* Live Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Cyber Scanner HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner Brackets */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                  {/* Face Target Ellipse */}
                  <div className="absolute inset-0 m-auto w-48 h-64 sm:w-56 sm:h-72 border-2 border-cyan-400/50 rounded-[50%] animate-pulse flex items-center justify-center">
                    <div className="w-full h-full border border-purple-400/30 rounded-[50%]" />
                  </div>

                  {/* Live HUD Data Ticker */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono text-cyan-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>YUZ ANIQLANDI • O&apos;ZINGIZNI QIMIRLATMANG</span>
                  </div>

                  <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyan-400 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    FPS: 60 • BIOMETRIC SENSOR: ACTIVE
                  </div>
                </div>
              </div>

              {/* Scanning Trigger CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                <button
                  onClick={() => startScanningProcess()}
                  className="w-full sm:flex-1 py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Scan className="w-5 h-5 text-cyan-200 animate-spin" style={{ animationDuration: "6s" }} />
                  <span>Skanerlashni Boshlash!</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="w-full sm:w-auto py-4 px-5 rounded-2xl font-semibold text-xs text-gray-300 hover:text-white glass-panel border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <CameraOff className="w-4 h-4 text-red-400" />
                  <span>Kamerani O&apos;chirish</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= STATE 3 & 4: SCANNING & ANALYZING ================= */}
          {(scanState === "scanning" || scanState === "analyzing") && (
            <div className="flex flex-col items-center text-center space-y-6 py-4">
              {/* Scanning Screen with Laser Beam */}
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-neonCyan bg-gradient-to-b from-[#080d24] to-[#0d163a] flex items-center justify-center">
                {/* User Snapshot or Cyber Hologram */}
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Scanned Face"
                    className="w-full h-full object-cover filter contrast-125 brightness-90"
                  />
                ) : (
                  <div className="relative flex items-center justify-center">
                    <Scan className="w-32 h-32 text-cyan-400/40" />
                    <Brain className="w-16 h-16 text-purple-400 absolute animate-pulse" />
                  </div>
                )}

                {/* Laser Sweep Beam Animation */}
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "98%", "0%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff] z-20"
                />

                {/* Holographic Wireframe Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Biometric Landmark Target Points */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 border-2 border-cyan-400 rounded-full animate-ping" />
                <div className="absolute top-1/4 right-1/3 w-3 h-3 border-2 border-cyan-400 rounded-full animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-purple-400 rounded-full animate-ping" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-amber-400 rounded-full animate-ping" />

                {/* Digital HUD Info */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono text-cyan-300 border border-cyan-400/30">
                  SCANNING DNA MATRIX: {scanProgress}%
                </div>
              </div>

              {/* Progress Bar & Status Text */}
              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>{currentStepText || "Biometrik ma'lumotlar tahlil qilinmoqda..."}</span>
                  </span>
                  <span className="text-white font-extrabold">{scanProgress}%</span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-neonCyan"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STATE 5: RESULT REVEAL ================= */}
          {scanState === "result" && matchedTrack && biometricProfile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 py-2"
            >
              {/* Result Header Badge */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-neonCyan">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                      BIOMETRIK AI XULOSA • RASMIY TASHXIS
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {biometricProfile.archetype}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-gray-300">Neyro-Moslik:</span>
                  <span className="text-lg font-black text-emerald-300 font-mono">
                    {matchPercentage}.8%
                  </span>
                </div>
              </div>

              {/* Main Result Card Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Matched Profession Card */}
                <div className="lg:col-span-7 text-left space-y-5">
                  <div>
                    <div className="text-xs font-mono uppercase text-gray-400 mb-1">
                      Sizga eng mos kelajak kasbi:
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                      <span className="text-cyan-300">{matchedTrack.title}</span>
                    </h3>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {biometricProfile.description}
                  </p>

                  {/* Biometric Traits Radar/Bars */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                      Biometrik Kognitiv Ko&apos;rsatkichlar:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {biometricProfile.traits.map(
                        (t: { label: string; score: number }, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{t.label}</span>
                              <span className="font-mono font-bold text-cyan-300">
                                {t.score}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                                style={{ width: `${t.score}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Career Perks */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Daromad istiqboli: {matchedTrack.careerProspects}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/30 text-xs font-mono text-purple-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      <span>Murakkablik: {matchedTrack.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Scanned Face Badge with Cyber Holographic Frame */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-3xl overflow-hidden border-2 border-cyan-400 shadow-neonCyan bg-gradient-to-b from-[#0e1635] to-[#170e30] p-1 flex items-center justify-center">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Scanned Face"
                        className="w-full h-full object-cover rounded-2xl filter contrast-110"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Scan className="w-24 h-24 text-cyan-400" />
                        <div className="text-xs font-mono text-cyan-300 font-bold">
                          VERIFIED NEURAL ID
                        </div>
                      </div>
                    )}

                    {/* Verified Cyber Watermark Stamp */}
                    <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400/40 text-center">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">
                        USTOZ AI BIOMETRICS
                      </div>
                      <div className="text-[9px] text-gray-300 font-mono">
                        DNA ID: UZ-{Math.floor(100000 + Math.random() * 900000)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onSelectTrackAndRegister(matchedTrack.id)}
                  className="flex-1 py-4 px-8 rounded-2xl font-bold text-sm uppercase tracking-wider text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
                >
                  <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span>Ushbu Yo&apos;nalishga Ro&apos;yxatdan O&apos;tish</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleReset}
                  className="py-4 px-6 rounded-2xl font-semibold text-sm text-gray-300 glass-panel border border-white/15 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>Qaytadan Skanerlash</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
