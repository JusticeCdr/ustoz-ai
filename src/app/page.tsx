"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import AICareerQuiz from "@/components/AICareerQuiz";
import CyberMatrix3D from "@/components/CyberMatrix3D";
import TracksSection from "@/components/TracksSection";
import PrizesSection from "@/components/PrizesSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import TimelineSection from "@/components/TimelineSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import AIVoiceModal from "@/components/AIVoiceModal";
import CyberAcademyModal from "@/components/CyberAcademyModal";
import StudentHubDashboard from "@/components/StudentHubDashboard";
import CyberCodeSandboxModal from "@/components/CyberCodeSandboxModal";
import CyberMiniGame from "@/components/CyberMiniGame";
import Background3D from "@/components/Background3D";
import FaceScanCareer from "@/components/FaceScanCareer";
import { CareerTrackId, AuthParticipant } from "@/types";
import { Mic, Sparkles, Gamepad2 } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isCodeSandboxOpen, setIsCodeSandboxOpen] = useState(false);
  const [academyTrackId, setAcademyTrackId] = useState<CareerTrackId>("ai-prompt");
  const [selectedTrackId, setSelectedTrackId] = useState<CareerTrackId | undefined>();
  const [currentUser, setCurrentUser] = useState<AuthParticipant | null>(null);
  const [modalMode, setModalMode] = useState<"register" | "login" | "profile">("register");

  // Load persistent user session from localStorage & query params
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ustoz_auth_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.participantId) {
          setCurrentUser(parsed);
        }
      }

      // Check if user came from bot link with preselected track: ?track=uiux-3d
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const trackParam = params.get("track") as CareerTrackId | null;
        if (trackParam) {
          setSelectedTrackId(trackParam);
          setIsModalOpen(true);
        }
      }
    } catch (e) {}
  }, []);

  const handleOpenRegister = (trackId?: CareerTrackId) => {
    if (currentUser) {
      setModalMode("profile");
    } else {
      if (trackId) {
        setSelectedTrackId(trackId);
      }
      setModalMode("register");
    }
    setIsModalOpen(true);
  };

  const handleOpenVoiceModal = () => {
    setIsVoiceModalOpen(true);
  };

  const handleOpenLogin = () => {
    if (currentUser) {
      setModalMode("profile");
    } else {
      setModalMode("login");
    }
    setIsModalOpen(true);
  };

  const handleOpenProfile = () => {
    setModalMode("profile");
    setIsModalOpen(true);
  };

  const handleCloseRegister = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("ustoz_auth_user");
    } catch (e) {}
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user: AuthParticipant) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("ustoz_auth_user", JSON.stringify(user));
    } catch (e) {}
  };

  const handleOpenAcademy = (trackId?: CareerTrackId) => {
    if (trackId) {
      setAcademyTrackId(trackId);
    } else if (currentUser && currentUser.trackId) {
      setAcademyTrackId(currentUser.trackId);
    }
    setIsAcademyOpen(true);
  };

  const handleOpenHub = () => {
    setIsHubOpen(true);
  };

  const handleOpenGame = () => {
    setIsGameModalOpen(true);
  };

  const handleOpenCodeSandbox = () => {
    setIsCodeSandboxOpen(true);
  };

  const handleOpenQuiz = () => {
    const el = document.getElementById("ai-kviz");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 3D Global Interactive Cyber Background Animation */}
      <Background3D />

      {/* Navbar with persistent profile state & Voice Advisor button */}
      <Navbar
        onOpenRegister={() => handleOpenRegister()}
        onOpenLogin={handleOpenLogin}
        onOpenProfile={handleOpenProfile}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenVoiceAdvisor={handleOpenVoiceModal}
        onOpenAcademy={handleOpenAcademy}
        onOpenHub={handleOpenHub}
        onOpenGame={handleOpenGame}
        onOpenCodeSandbox={handleOpenCodeSandbox}
      />

      <div className="relative z-10">
        {/* Hero with interactive 3D Scene + FOMO Countdown + Voice AI */}
        <Hero3D
          onOpenRegister={() => handleOpenRegister()}
          onOpenQuiz={handleOpenQuiz}
          onOpenVoiceAdvisor={handleOpenVoiceModal}
        />

        {/* Biometric AI Face Scanner Section */}
        <FaceScanCareer
          onSelectTrackAndRegister={(trackId) => handleOpenRegister(trackId)}
        />

        {/* Interactive AI Career Diagnosis Quiz (with Voice shortcut) */}
        <AICareerQuiz
          onSelectTrackAndRegister={(trackId) => handleOpenRegister(trackId)}
          onOpenVoiceAdvisor={handleOpenVoiceModal}
        />

        {/* Middle Interactive 3D Cyber Eye Matrix */}
        <CyberMatrix3D />

        {/* Tracks / Disciplines */}
        <TracksSection onSelectTrack={(trackId) => handleOpenRegister(trackId)} />

        {/* Prizes Pool Showcase */}
        <PrizesSection onOpenRegister={() => handleOpenRegister()} />

        {/* In-App Cyber Mini-Game Section Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-pink-500/40 bg-gradient-to-r from-pink-950/30 via-[#0d1238]/70 to-purple-950/30 shadow-[0_0_50px_rgba(236,72,153,0.15)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-mono font-bold">
                <Gamepad2 className="w-3.5 h-3.5 animate-bounce" />
                <span>KIBER ARCADE ARENASI &bull; KUNLIK 3 TA BEPUL URINISH</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                AI Core Defender: Kiber Nod Haker
              </h3>
              <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                Bosqichlar boshlanguncha kutib o&apos;tirmang! Mini-o&apos;yinda tushayotgan AI nodlarni tutib har 45 soniyada <b>+100 ~ 500 XP</b> to&apos;plang va Jonli Reytingda yetakchilik qiling.
              </p>
            </div>

            <button
              onClick={handleOpenGame}
              className="px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:opacity-95 shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shrink-0"
            >
              <Gamepad2 className="w-5 h-5 text-white" />
              <span>O&apos;yinni Boshlash (+XP)</span>
            </button>
          </div>
        </section>

        {/* Live Cyberpunk Leaderboard */}
        <LeaderboardSection onOpenRegister={() => handleOpenRegister()} />

        {/* Timeline Stages */}
        <TimelineSection />

        {/* FAQ Accordion */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>

      {/* Floating Cyber Voice AI Consultation Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenVoiceModal}
          className="relative group p-3.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-[0_0_30px_rgba(0,240,255,0.4)] border border-cyan-400/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 text-white font-bold text-xs sm:text-sm"
          title="Ovoz orqali kurs tanlash (AI Voice)"
        >
          <div className="relative">
            <Mic className="w-5 h-5 text-white animate-pulse" />
            <span className="animate-ping absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-300 opacity-75" />
          </div>
          <span className="hidden sm:inline tracking-wide font-mono">
            AI Ovozli Konsultant
          </span>
          <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Multimodal AI Voice Career Advisor Modal */}
      <AIVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectTrackAndRegister={(trackId) => handleOpenRegister(trackId)}
      />

      {/* Futuristic Multi-step Registration & Profile Modal with Telegram Integration & 3D Cyber Pass */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseRegister}
        preselectedTrackId={selectedTrackId}
        currentUser={currentUser}
        initialMode={modalMode}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onOpenAcademy={handleOpenAcademy}
        onOpenHub={handleOpenHub}
        onOpenCodeSandbox={handleOpenCodeSandbox}
      />

      {/* Ustoz AI Cyber Academy: Video Darslar & Interaktiv Kiber-Platforma */}
      <CyberAcademyModal
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        currentUser={currentUser}
        onOpenRegister={handleOpenRegister}
        initialTrackId={academyTrackId}
        onOpenCodeSandbox={handleOpenCodeSandbox}
      />

      {/* Cyber Code Sandbox: HTML, CSS & Python Darsliklar va Jonli Kod Yozish */}
      <CyberCodeSandboxModal
        isOpen={isCodeSandboxOpen}
        onClose={() => setIsCodeSandboxOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleAuthSuccess}
      />

      {/* Post-Registration Student Hub / Dashboard (Streak, Mini-Quest, Mock Test, Project Submission & Verified Certificate) */}
      <StudentHubDashboard
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        currentUser={
          currentUser || {
            participantId: "USTOZ-DEMO",
            fullName: "Ishtirokchi (Ustoz AI)",
            phone: "+998 90 123 45 67",
            trackId: selectedTrackId || "ai-prompt",
            trackTitle: "Sun'iy Intellekt va Prompt Engineering",
            xp: 150,
            referralLink: "https://t.me/ustoz_ai_bot?start=ref_demo",
            verifiedAt: Date.now(),
            badge: "Kiber Ishtirokchi",
            streakDays: 5,
          }
        }
        onUpdateUser={handleAuthSuccess}
      />

      {/* In-App Cyberpunk Mini-Game Modal */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setIsGameModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-4xl my-auto">
            <CyberMiniGame
              isModal
              currentUser={currentUser}
              onClose={() => setIsGameModalOpen(false)}
              onAddXp={(earnedXp) => {
                const current = currentUser || {
                  participantId: "USTOZ-DEMO",
                  fullName: "Ishtirokchi (Ustoz AI)",
                  phone: "+998 90 123 45 67",
                  trackId: selectedTrackId || "ai-prompt",
                  trackTitle: "Sun'iy Intellekt va Prompt Engineering",
                  xp: 150,
                  referralLink: "https://t.me/ustoz_ai_bot?start=ref_demo",
                  verifiedAt: Date.now(),
                  badge: "Kiber Ishtirokchi",
                  streakDays: 5,
                };
                handleAuthSuccess({
                  ...current,
                  xp: (current.xp || 100) + earnedXp,
                });
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
