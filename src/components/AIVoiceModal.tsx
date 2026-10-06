"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Sparkles,
  Bot,
  BrainCircuit,
  Volume2,
  X,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
  Activity,
  Layers,
  Send,
  Loader2,
} from "lucide-react";
import { CareerTrackId } from "@/types";
import { CAREER_TRACKS } from "@/lib/constants";
import { CareerRecommendationResult } from "@/lib/ai-advisor";

export interface AIVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrackAndRegister: (trackId: CareerTrackId) => void;
}

export default function AIVoiceModal({
  isOpen,
  onClose,
  onSelectTrackAndRegister,
}: AIVoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<CareerRecommendationResult | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "uz-UZ"; // Uzbek speech recognition

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscript(currentTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition notice:", event.error);
          if (event.error === "not-allowed") {
            setErrorMsg("Mikrofonga ruxsat berilmadi. Matn orqali yozishingiz mumkin.");
            setInputMode("text");
          }
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopRecordingCleanup();
    };
  }, []);

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen) {
      stopRecordingCleanup();
      setTranscript("");
      setResult(null);
      setErrorMsg("");
      setIsLoading(false);
      setTextInput("");
    }
  }, [isOpen]);

  const stopRecordingCleanup = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }

    setIsRecording(false);
    setVolumeLevel(0);
  };

  // Start Voice Recording
  const startRecording = async () => {
    setErrorMsg("");
    setResult(null);
    setTranscript("");
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Set up Audio Visualizer
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setVolumeLevel(avg);
          animFrameRef.current = requestAnimationFrame(updateVolume);
        };
        updateVolume();
      } catch (audioErr) {
        console.warn("Visualizer audio context note:", audioErr);
      }

      // 3. Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);

      // 4. Start Speech Recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn("Recognition already running or re-attaching");
        }
      }

      setIsRecording(true);

      // Timer
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecordingAndAnalyze();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMsg("Mikrofonga ulanib bo'lmadi. Iltimos matn orqali qiziqishingizni yozing.");
      setInputMode("text");
    }
  };

  // Stop Recording and trigger AI analysis
  const stopRecordingAndAnalyze = async () => {
    stopRecordingCleanup();
    setIsLoading(true);

    // Wait slightly for recognition buffer
    await new Promise((r) => setTimeout(r, 600));

    const finalTranscript = transcript.trim();

    try {
      // If we have an audio blob, we can also send audio data
      let audioBlob: Blob | null = null;
      if (audioChunksRef.current.length > 0) {
        audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      }

      let resData: any = null;

      if (audioBlob && audioBlob.size > 2000) {
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");
        if (finalTranscript) {
          formData.append("text", finalTranscript);
        }

        const res = await fetch("/api/ai/voice-recommend", {
          method: "POST",
          body: formData,
        });
        resData = await res.json();
      } else if (finalTranscript) {
        const res = await fetch("/api/ai/text-recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: finalTranscript }),
        });
        resData = await res.json();
      } else {
        throw new Error(
          "Ovoz eshitilmadi yoki juda qisqa bo'ldi. Iltimos, qaytadan gapiring yoki yozing."
        );
      }

      if (resData?.ok && resData.recommendation) {
        setResult(resData.recommendation);
      } else {
        throw new Error(resData?.error || "AI tahlilida xatolik yuz berdi");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Tahlil qilib bo'lmadi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Text Input
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/text-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput.trim() }),
      });
      const data = await res.json();

      if (data?.ok && data.recommendation) {
        setResult(data.recommendation);
      } else {
        throw new Error(data?.error || "AI javob bermadi");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#030614]/85 backdrop-blur-xl"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-[#070d28]/95 border border-cyan-400/40 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 sm:p-8 overflow-hidden z-10"
      >
        {/* Cyber Neon Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Bot className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                Ustoz AI Multimodal
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              AI Ovozli Karyera Maslahatchisi
            </h3>
          </div>
        </div>

        {/* Tabs: Voice vs Text */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 max-w-xs">
          <button
            onClick={() => setInputMode("voice")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === "voice"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Ovoz orqali (Golos)</span>
          </button>
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === "text"
                ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-[0_0_10px_rgba(157,78,221,0.2)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Matn orqali</span>
          </button>
        </div>

        {/* RESULT VIEW */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-purple-950/20 to-blue-950/30 border border-cyan-400/50 shadow-[0_0_35px_rgba(0,240,255,0.2)] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-400/30">
                    Neyron Moslik: {result.matchScore}%
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white mt-2 leading-snug">
                    {result.trackTitle}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-gray-400 block">Kutilayotgan daromad:</span>
                  <span className="text-sm font-extrabold text-amber-300 font-mono">
                    {result.salaryRange}
                  </span>
                </div>
              </div>

              {/* User transcript / summary */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 italic">
                &ldquo;{result.transcription || transcript || textInput}&rdquo;
              </div>

              {/* AI Reason */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Nega aynan shu kasb?
                </span>
                <p className="text-sm text-gray-200 leading-relaxed font-normal">
                  {result.reason}
                </p>
              </div>

              {/* Skills tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-mono text-gray-400">O&apos;rganiladigan texnologiyalar:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.keySkills.map((sk, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-400/30"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectTrackAndRegister(result.trackId);
                  onClose();
                }}
                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-neonCyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Ushbu Yo&apos;nalishda Ro&apos;yxatdan O&apos;tish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setResult(null);
                  setTranscript("");
                  setTextInput("");
                }}
                className="py-3.5 px-5 rounded-xl font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qaytadan Ovoz Yozish</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              />
              <BrainCircuit className="w-9 h-9 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Neyron Yadro Tahlil Qilmoqda...</h4>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Ovozingiz va qiziqishlaringiz 5 ta zamonaviy kasb klasteri bilan solishtirilmoqda
              </p>
            </div>
          </div>
        )}

        {/* INPUT MODE: VOICE */}
        {!result && !isLoading && inputMode === "voice" && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <p className="text-sm text-gray-300">
                Mikrofon tugmasini bosing va o&apos;zingiz qiziqqan sohalar, orzularingiz yoki nimalar qilish sizga yoqishi haqida erkin gapiring.
              </p>
              <p className="text-xs text-cyan-400 font-mono">
                Masalan: &ldquo;Men dizayn, 3D animatsiyalar va chiroyli veb-saytlar yaratishga qiziqaman...&rdquo;
              </p>
            </div>

            {/* Glowing Microphone Central Orb */}
            <div className="py-6 flex flex-col items-center justify-center relative">
              {/* Outer pulsing rings when recording */}
              {isRecording && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-36 h-36 rounded-full bg-cyan-400/20 blur-md pointer-events-none"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-44 h-44 rounded-full bg-purple-500/20 blur-lg pointer-events-none"
                  />
                </>
              )}

              {/* Main Button */}
              <button
                onClick={isRecording ? stopRecordingAndAnalyze : startRecording}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isRecording
                    ? "bg-gradient-to-tr from-red-500 to-pink-600 shadow-[0_0_35px_rgba(244,63,94,0.6)] scale-105"
                    : "bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-[0_0_35px_rgba(0,240,255,0.4)] hover:scale-105 active:scale-95"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-10 h-10 text-white animate-pulse" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>

              {/* Status & Recording Timer */}
              <div className="mt-4 text-center">
                {isRecording ? (
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>Yozilmoqda: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 block">Tugagach, tugmani qayta bosing</p>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 font-mono">
                    Gapirish uchun mikrofonni bosing
                  </span>
                )}
              </div>

              {/* Sound wave bars (Simulated volume reactive) */}
              {isRecording && (
                <div className="flex items-center gap-1.5 mt-5 h-8">
                  {[...Array(16)].map((_, idx) => {
                    const heightFactor = Math.sin((idx + recordingSeconds * 4) * 0.5) * 0.5 + 0.5;
                    const computedHeight = Math.max(6, Math.min(32, (volumeLevel / 4) * heightFactor + 8));
                    return (
                      <motion.div
                        key={idx}
                        className="w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-purple-500"
                        animate={{ height: computedHeight }}
                        transition={{ duration: 0.1 }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Live Streaming Transcript Card */}
            {transcript && (
              <div className="p-4 rounded-2xl bg-white/5 border border-cyan-400/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Jonli eshitilayotgan matn:
                </span>
                <p className="text-sm text-white font-medium">{transcript}</p>
              </div>
            )}

            {/* Error notice */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* INPUT MODE: TEXT */}
        {!result && !isLoading && inputMode === "text" && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-gray-300 block">
                Qiziqishingiz, qobiliyatlaringiz yoki o&apos;rganmoqchi bo&apos;lgan sohangizni yozing:
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Masalan: Men kompyuter grafikasi, 3D animatsiyalar va zamonaviy dizayn yaratishni xohlayman. Qaysi yo'nalish menga to'g'ri keladi?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-neonCyan hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI orqali Kursni Aniqlash</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
