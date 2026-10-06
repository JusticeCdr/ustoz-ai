"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import AICareerQuiz from "@/components/AICareerQuiz";
import TracksSection from "@/components/TracksSection";
import PrizesSection from "@/components/PrizesSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import TimelineSection from "@/components/TimelineSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import { CareerTrackId } from "@/types";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<CareerTrackId | undefined>();

  const handleOpenRegister = (trackId?: CareerTrackId) => {
    if (trackId) {
      setSelectedTrackId(trackId);
    }
    setIsModalOpen(true);
  };

  const handleCloseRegister = () => {
    setIsModalOpen(false);
  };

  const handleOpenQuiz = () => {
    const el = document.getElementById("ai-kviz");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Navbar */}
      <Navbar onOpenRegister={() => handleOpenRegister()} />

      {/* Hero with interactive 3D Scene + FOMO Countdown */}
      <Hero3D
        onOpenRegister={() => handleOpenRegister()}
        onOpenQuiz={handleOpenQuiz}
      />

      {/* Interactive AI Career Diagnosis Quiz */}
      <AICareerQuiz
        onSelectTrackAndRegister={(trackId) => handleOpenRegister(trackId)}
      />

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

      {/* Futuristic Multi-step Registration Modal with Telegram Integration & 3D Cyber Pass */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={handleCloseRegister}
        preselectedTrackId={selectedTrackId}
      />
    </main>
  );
}
