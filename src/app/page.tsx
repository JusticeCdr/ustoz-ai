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
import Background3D from "@/components/Background3D";
import FaceScanCareer from "@/components/FaceScanCareer";
import { CareerTrackId, AuthParticipant } from "@/types";
import { Mic, Sparkles } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
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
      />

      {/* Ustoz AI Cyber Academy: Video Darslar & Interaktiv Kiber-Platforma */}
      <CyberAcademyModal
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        currentUser={currentUser}
        onOpenRegister={handleOpenRegister}
        initialTrackId={academyTrackId}
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
    </main>
  );
}
