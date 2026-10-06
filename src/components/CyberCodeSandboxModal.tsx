"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ChevronRight,
  Terminal,
  FileCode,
  Palette,
  Lightbulb,
  ExternalLink,
  Laptop,
  CheckCircle,
  AlertCircle,
  Code2,
  Flame,
  Layers,
  BookOpen,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  INTERACTIVE_COURSES,
  LanguageId,
  InteractiveExercise,
} from "@/lib/interactiveLessonsData";
import { runPythonCode, buildLivePreviewDoc, CodeExecutionResult } from "@/lib/code-runner";
import { AuthParticipant } from "@/types";

interface CyberCodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: AuthParticipant | null;
  onUpdateUser?: (updated: AuthParticipant) => void;
  initialLanguage?: LanguageId;
}

export default function CyberCodeSandboxModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  initialLanguage = "html",
}: CyberCodeSandboxModalProps) {
  const [selectedLang, setSelectedLang] = useState<LanguageId>(initialLanguage);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [userCode, setUserCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Execution & Validation States
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [terminalError, setTerminalError] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [validationResult, setValidationResult] = useState<{
    passed: boolean;
    message: string;
  } | null>(null);

  // Completed exercises map in localStorage
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [earnedXP, setEarnedXP] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load completed exercises
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ustoz_completed_code_exercises");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedExercises(parsed);
        const count = Object.keys(parsed).length;
        setEarnedXP(count * 60);
      }
    } catch (e) {}
  }, []);

  const currentCourse = INTERACTIVE_COURSES[selectedLang];
  const currentExercise = currentCourse.exercises[exerciseIndex] || currentCourse.exercises[0];

  // When language or exercise changes, reset editor with starter code
  useEffect(() => {
    if (currentExercise) {
      setUserCode(currentExercise.starterCode);
      setTerminalOutput("");
      setTerminalError("");
      setValidationResult(null);
      setShowHint(false);
      setExecutionTime(null);
    }
  }, [selectedLang, exerciseIndex]);

  // Support Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const val = target.value;
      const newVal = val.substring(0, start) + "  " + val.substring(end);
      setUserCode(newVal);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Run Code
  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalError("");
    setValidationResult(null);

    if (selectedLang === "python") {
      const res: CodeExecutionResult = await runPythonCode(userCode);
      setTerminalOutput(res.output);
      if (res.error) {
        setTerminalError(res.error);
      }
      if (res.executionTimeMs !== undefined) {
        setExecutionTime(res.executionTimeMs);
      }
    } else {
      // HTML or CSS: updates preview
      setTerminalOutput("Jonli Veb Preview yangilandi.");
      setExecutionTime(12);
    }

    setIsRunning(false);
  };

  // Verify Exercise
  const handleCheckExercise = async () => {
    setIsRunning(true);

    let outputToTest = terminalOutput;
    if (selectedLang === "python" && !terminalOutput) {
      const res = await runPythonCode(userCode);
      outputToTest = res.output;
      setTerminalOutput(res.output);
      if (res.error) setTerminalError(res.error);
    }

    const test = currentExercise.testValidator(userCode, outputToTest);
    setValidationResult(test);
    setIsRunning(false);

    if (test.passed) {
      // Award XP & Celebrate!
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#ffbe0b", "#06d6a0", "#f72585", "#9d4edd"],
      });

      const updatedMap = { ...completedExercises, [currentExercise.id]: true };
      setCompletedExercises(updatedMap);
      try {
        localStorage.setItem("ustoz_completed_code_exercises", JSON.stringify(updatedMap));
      } catch (e) {}

      const newXP = earnedXP + currentExercise.xpReward;
      setEarnedXP(newXP);

      if (currentUser && onUpdateUser) {
        const updatedUser: AuthParticipant = {
          ...currentUser,
          xp: (currentUser.xp || 100) + currentExercise.xpReward,
        };
        onUpdateUser(updatedUser);
        try {
          localStorage.setItem("ustoz_auth_user", JSON.stringify(updatedUser));
        } catch (e) {}
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetCode = () => {
    setUserCode(currentExercise.starterCode);
    setValidationResult(null);
    setTerminalOutput("");
    setTerminalError("");
  };

  const handleNextExercise = () => {
    if (exerciseIndex < currentCourse.exercises.length - 1) {
      setExerciseIndex((prev) => prev + 1);
    } else {
      // Switch to next language
      if (selectedLang === "html") {
        setSelectedLang("css");
        setExerciseIndex(0);
      } else if (selectedLang === "css") {
        setSelectedLang("python");
        setExerciseIndex(0);
      }
    }
  };

  if (!isOpen) return null;

  const totalExercises =
    INTERACTIVE_COURSES.html.exercises.length +
    INTERACTIVE_COURSES.css.exercises.length +
    INTERACTIVE_COURSES.python.exercises.length;
  const totalCompletedCount = Object.keys(completedExercises).length;
  const progressPercent = Math.round((totalCompletedCount / totalExercises) * 100);

  // HTML / CSS live preview document
  const previewDoc =
    selectedLang === "html"
      ? buildLivePreviewDoc(userCode, "")
      : selectedLang === "css"
      ? buildLivePreviewDoc(
          `<div class="demo-box"><button class="cyber-btn neon-btn">Ustoz AI</button><div class="cyber-card glass-panel flex-container"><p>Cyber Sandbox Preview</p></div></div>`,
          userCode
        )
      : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#030614]/90 backdrop-blur-2xl"
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-7xl h-[92vh] max-h-[950px] bg-[#060a1f]/95 border border-cyan-400/40 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden z-10"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 bg-[#040716] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-400/30">
                  Interaktiv Darsliklar
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>+{earnedXP} XP To&apos;plandi</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Cyber Code Sandbox & Mashqlar
              </h2>
            </div>
          </div>

          {/* Language Tabs: HTML, CSS, Python */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
            {(["html", "css", "python"] as LanguageId[]).map((lang) => {
              const info = INTERACTIVE_COURSES[lang];
              const isSel = selectedLang === lang;
              return (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLang(lang);
                    setExerciseIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                    isSel
                      ? "bg-white/10 text-white border shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={{
                    borderColor: isSel ? info.color : "transparent",
                    color: isSel ? info.color : undefined,
                  }}
                >
                  {lang === "html" && <FileCode className="w-3.5 h-3.5 text-[#ff5722]" />}
                  {lang === "css" && <Palette className="w-3.5 h-3.5 text-[#00f0ff]" />}
                  {lang === "python" && <Terminal className="w-3.5 h-3.5 text-[#ffbe0b]" />}
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>

          {/* Overall Progress Badge & Close Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-xs font-mono">
              <span className="text-gray-400 text-[11px]">
                Umumiy Jarayon: <b className="text-cyan-300">{totalCompletedCount}/{totalExercises}</b>
              </span>
              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Exercises Selector Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#05091a] border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs font-mono text-gray-400 mr-2 shrink-0">
            {currentCourse.name} Darslari:
          </span>
          {currentCourse.exercises.map((ex, idx) => {
            const isCompleted = !!completedExercises[ex.id];
            const isCurrent = exerciseIndex === idx;

            return (
              <button
                key={ex.id}
                onClick={() => setExerciseIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all border ${
                  isCurrent
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-500 text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
                <span>{ex.lessonNumber}-Dars</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Body: Split Panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT COLUMN: Lesson Theory & Task (Col 4) */}
          <div className="lg:col-span-4 p-5 sm:p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/10 space-y-5 bg-[#040718]/60">
            {/* Lesson Title & Badge */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400 uppercase font-bold tracking-wider">
                  {currentCourse.name} // {currentExercise.lessonNumber}-DARS
                </span>
                <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30">
                  +{currentExercise.xpReward} XP
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-snug">
                {currentExercise.title}
              </h3>
            </div>

            {/* Theory Points */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Qisqa Nazariya:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-gray-300 leading-relaxed list-disc list-inside">
                {currentExercise.theory.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            {/* Task Instruction Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/20 border border-cyan-400/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Kichik Mashq Vazifasi:</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-medium">
                {currentExercise.taskInstruction}
              </p>
            </div>

            {/* Hint Accordion */}
            <div className="space-y-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-mono"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? "Yordamni yashirish" : "💡 Yordam / Maslahatni ko'rish"}</span>
              </button>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-xl bg-amber-950/30 border border-amber-400/30 text-xs text-amber-200"
                >
                  {currentExercise.hint}
                </motion.div>
              )}
            </div>

            {/* Validation Feedback Message */}
            {validationResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  validationResult.passed
                    ? "bg-emerald-950/40 border-emerald-400/50 text-emerald-200"
                    : "bg-rose-950/40 border-rose-400/50 text-rose-200"
                }`}
              >
                {validationResult.passed ? (
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <div className="font-bold">
                    {validationResult.passed ? "Tabriklaymiz!" : "Diqqat!"}
                  </div>
                  <p className="leading-relaxed">{validationResult.message}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT COLUMN: Code Editor + Live Terminal / Preview (Col 8) */}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-[#05081b]">
            {/* Editor Toolbar */}
            <div className="p-3 px-5 bg-[#030614] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-gray-400">
                  {selectedLang === "html" && "index.html"}
                  {selectedLang === "css" && "style.css"}
                  {selectedLang === "python" && "main.py"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono transition-all flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Nusxalandi" : "Nusxa"}</span>
                </button>

                <button
                  onClick={handleResetCode}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Qaytarish</span>
                </button>
              </div>
            </div>

            {/* Code Input Textarea with Line Numbers */}
            <div className="flex-1 flex overflow-hidden relative">
              {/* Line Numbers */}
              <div className="py-4 px-3 bg-[#020512] text-gray-600 font-mono text-xs select-none border-r border-white/5 text-right w-12 shrink-0">
                {userCode.split("\n").map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                placeholder="Kodingizni shu yerga yozing..."
                className="flex-1 p-4 bg-[#030718] text-cyan-100 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30 overflow-auto"
              />
            </div>

            {/* Bottom Output / Preview Section */}
            <div className="h-48 sm:h-56 border-t border-white/10 bg-[#020511] flex flex-col shrink-0">
              {/* Output Header */}
              <div className="p-2 px-4 bg-[#01030d] border-b border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-gray-400">
                  {selectedLang === "python" ? (
                    <>
                      <Terminal className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Python Konsol Natijasi:</span>
                    </>
                  ) : (
                    <>
                      <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Jonli Veb Preview (Browser):</span>
                    </>
                  )}
                </div>

                {executionTime !== null && (
                  <span className="text-[10px] text-gray-500">
                    Bajarildi: {executionTime}ms
                  </span>
                )}
              </div>

              {/* Output Content */}
              <div className="flex-1 p-3 overflow-auto">
                {selectedLang === "python" ? (
                  <div className="font-mono text-xs space-y-1">
                    {terminalError ? (
                      <div className="text-rose-400 whitespace-pre-wrap">{terminalError}</div>
                    ) : terminalOutput ? (
                      <div className="text-emerald-300 whitespace-pre-wrap">{terminalOutput}</div>
                    ) : (
                      <div className="text-gray-500 italic">
                        Kodni ishga tushirish uchun quyidagi &ldquo;Kodni Ishga Tushirish&rdquo; tugmasini bosing...
                      </div>
                    )}
                  </div>
                ) : (
                  /* HTML & CSS Live Preview iframe */
                  <iframe
                    title="Live Preview"
                    srcDoc={previewDoc}
                    sandbox="allow-scripts"
                    className="w-full h-full rounded-xl bg-[#080d24] border border-white/10"
                  />
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-3 px-5 bg-[#030614] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-400/40 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  <span>{isRunning ? "Bajarilmoqda..." : "Ishga Tushirish (Run)"}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCheckExercise}
                  disabled={isRunning}
                  className="px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 shadow-[0_0_20px_rgba(6,214,160,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Mashqni Tekshirish</span>
                </button>

                {validationResult?.passed && (
                  <button
                    onClick={handleNextExercise}
                    className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-neonCyan hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                  >
                    <span>Keyingi Dars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
