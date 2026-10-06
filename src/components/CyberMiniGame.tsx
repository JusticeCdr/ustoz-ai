"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Gamepad2,
  Trophy,
  Shield,
  Heart,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Share2,
  CheckCircle2,
  AlertTriangle,
  X,
  Zap,
  Flame,
  Clock,
  ArrowRight,
  Send,
} from "lucide-react";
import { AuthParticipant } from "@/types";

// ==========================================
// Types & Interfaces
// ==========================================
export type NodeType = "CYAN_CORE" | "GOLD_SUPER" | "RED_GLITCH";

interface FallingNode {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: NodeType;
  rotation: number;
  rotSpeed: number;
  glitchOffset?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  vy: number;
}

interface CyberMiniGameProps {
  currentUser?: AuthParticipant | null;
  onAddXp?: (xp: number) => void;
  onClose?: () => void;
  isModal?: boolean;
}

// ==========================================
// Sound Synthesis Engine (Web Audio API)
// No external files required!
// ==========================================
class SoundSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Catch Cyan Node (+10 XP) - Digital crystal chime
  playCatchCyan() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  // Catch Gold Super Node (+50 XP) - Triumphant harmonic arpeggio
  playCatchGold() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
      });
    } catch (e) {}
  }

  // Hit Red Glitch (-1 Life) - Harsh low error buzz
  playGlitchHit() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Game Over Sound
  playGameOver() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [440, 392, 349.23, 293.66]; // A4 -> D4
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
      });
    } catch (e) {}
  }
}

// Global synth instance
const synth = new SoundSynth();

// ==========================================
// Main Component
// ==========================================
export default function CyberMiniGame({
  currentUser,
  onAddXp,
  onClose,
  isModal = false,
}: CyberMiniGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game States
  const [gameState, setGameState] = useState<"IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER">("IDLE");
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [combo, setCombo] = useState<number>(0);
  const [caughtCount, setCaughtCount] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dailyAttemptsLeft, setDailyAttemptsLeft] = useState<number>(3);
  const [isXpClaimed, setIsXpClaimed] = useState<boolean>(false);
  const [isClaimingXp, setIsClaimingXp] = useState<boolean>(false);

  // References for Animation & Game Loop
  const animFrameIdRef = useRef<number | null>(null);
  const paddleRef = useRef<{ x: number; targetX: number; width: number; height: number; y: number }>({
    x: 200,
    targetX: 200,
    width: 90,
    height: 14,
    y: 380,
  });
  const nodesRef = useRef<FallingNode[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const screenShakeRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const nextNodeIdRef = useRef<number>(1);
  const nextTextIdRef = useRef<number>(1);

  // Current ref values to prevent stale closures inside requestAnimationFrame
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const comboRef = useRef(combo);
  comboRef.current = combo;

  // Load High Score & Daily Attempts
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem("cyber_catcher_highscore");
      if (savedHigh) {
        setHighScore(parseInt(savedHigh, 10) || 0);
      }

      const soundPref = localStorage.getItem("cyber_catcher_sound");
      if (soundPref !== null) {
        const val = soundPref === "true";
        setSoundEnabled(val);
        synth.enabled = val;
      }

      // Daily attempts check
      const todayKey = `cyber_attempts_${new Date().toISOString().slice(0, 10)}`;
      const savedAttempts = localStorage.getItem(todayKey);
      if (savedAttempts !== null) {
        setDailyAttemptsLeft(Math.max(0, parseInt(savedAttempts, 10)));
      } else {
        localStorage.setItem(todayKey, "3");
        setDailyAttemptsLeft(3);
      }
    } catch (e) {}
  }, []);

  // Handle Tab Switch / Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameStateRef.current === "PLAYING") {
        setGameState("PAUSED");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Toggle Sound
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    synth.enabled = next;
    try {
      localStorage.setItem("cyber_catcher_sound", String(next));
    } catch (e) {}
  };

  // ==========================================
  // Game Spawn & Particle Helpers
  // ==========================================
  const spawnNode = (canvasWidth: number) => {
    const margin = 35;
    const x = margin + Math.random() * (canvasWidth - margin * 2);
    const rand = Math.random();

    let type: NodeType = "CYAN_CORE";
    if (rand < 0.2) {
      type = "RED_GLITCH"; // 20% red malware
    } else if (rand < 0.35) {
      type = "GOLD_SUPER"; // 15% gold super node
    } else {
      type = "CYAN_CORE"; // 65% cyan AI core
    }

    // Dynamic speed progression as time decreases
    const speedBonus = ((45 - timeLeftRef.current) / 45) * 1.6;
    const baseSpeed = 2.4 + Math.random() * 1.2 + speedBonus;

    nodesRef.current.push({
      id: nextNodeIdRef.current++,
      x,
      y: -25,
      radius: type === "GOLD_SUPER" ? 17 : type === "RED_GLITCH" ? 15 : 14,
      speed: baseSpeed,
      type,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      glitchOffset: 0,
    });
  };

  const createSparks = (x: number, y: number, color: string, count = 18) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        radius: 1.5 + Math.random() * 2.5,
        color,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.03,
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    floatingTextsRef.current.push({
      id: nextTextIdRef.current++,
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -1.8,
    });
  };

  // ==========================================
  // Start / Reset Game
  // ==========================================
  const startGame = () => {
    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setCombo(0);
    setCaughtCount(0);
    setIsXpClaimed(false);
    nodesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    screenShakeRef.current = 0;
    lastTimeRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 500;

    // Deduct daily attempt
    const todayKey = `cyber_attempts_${new Date().toISOString().slice(0, 10)}`;
    const updatedAttempts = Math.max(0, dailyAttemptsLeft - 1);
    setDailyAttemptsLeft(updatedAttempts);
    try {
      localStorage.setItem(todayKey, String(updatedAttempts));
    } catch (e) {}

    setGameState("PLAYING");
  };

  // ==========================================
  // End Game Handler
  // ==========================================
  const handleGameOver = useCallback((finalScore: number) => {
    setGameState("GAME_OVER");
    synth.playGameOver();

    // Check high score
    try {
      const currentHigh = parseInt(localStorage.getItem("cyber_catcher_highscore") || "0", 10);
      if (finalScore > currentHigh) {
        setHighScore(finalScore);
        localStorage.setItem("cyber_catcher_highscore", String(finalScore));
      }
    } catch (e) {}

    // Confetti celebration if score > 150
    if (finalScore >= 150) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
  }, []);

  // ==========================================
  // Submit XP to Profile / Backend API
  // ==========================================
  const handleClaimXp = async () => {
    if (isXpClaimed || score <= 0) return;
    setIsClaimingXp(true);

    try {
      if (currentUser?.participantId || currentUser?.phone) {
        const id = currentUser.participantId || currentUser.phone;
        const res = await fetch("/api/user/add-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: id,
            xp: score,
            reason: `Mini-Game: AI Core Defender (${caughtCount} ta nod)`,
          }),
        });
        const data = await res.json();
        if (data.ok && data.participant) {
          if (onAddXp) {
            onAddXp(score);
          }
        }
      } else {
        // Fallback for demo or guest mode
        if (onAddXp) {
          onAddXp(score);
        }
      }

      setIsXpClaimed(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    } catch (err) {
      console.error("Failed to claim XP:", err);
      // Still credit locally
      if (onAddXp) onAddXp(score);
      setIsXpClaimed(true);
    } finally {
      setIsClaimingXp(false);
    }
  };

  // Share score to Telegram
  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `🎮 Men "Ustoz AI" Kiber O'yinida ${score} XP to'pladim va reytingda yuqoriladim!\n\nSen ham qatnash va sovrinlarni yutib ol:\n${window.location.origin}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${text}`, "_blank");
  };

  // ==========================================
  // Mouse & Touch Movement Handlers
  // ==========================================
  const handlePointerMove = (clientX: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    paddleRef.current.targetX = relativeX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePointerMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
    }
  };

  // ==========================================
  // Countdown Timer Interval (1 second ticks)
  // ==========================================
  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleGameOver(scoreRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, handleGameOver]);

  // ==========================================
  // Main Canvas Render & Animation Loop (60 FPS)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI display
    const updateCanvasDimensions = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const w = Math.floor(rect.width);
      const h = Math.min(520, Math.max(380, Math.floor(window.innerHeight * 0.58)));

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
      paddleRef.current.y = h - 38;
      paddleRef.current.width = w < 480 ? 76 : 94;
    };

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);

    // ================= MAIN RENDER LOOP =================
    const render = (timestamp: number) => {
      if (gameStateRef.current !== "PLAYING") {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Smooth paddle movement (Lerp)
      paddleRef.current.x += (paddleRef.current.targetX - paddleRef.current.x) * 0.22;
      // Clamp paddle inside bounds
      const halfW = paddleRef.current.width / 2;
      if (paddleRef.current.x < halfW) paddleRef.current.x = halfW;
      if (paddleRef.current.x > width - halfW) paddleRef.current.x = width - halfW;

      // Screen Shake offset
      let shakeX = 0;
      let shakeY = 0;
      if (screenShakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeRef.current * 7;
        shakeY = (Math.random() - 0.5) * screenShakeRef.current * 7;
        screenShakeRef.current -= 0.08;
        if (screenShakeRef.current < 0) screenShakeRef.current = 0;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Clear & Cyber Background
      ctx.fillStyle = "#050714";
      ctx.fillRect(0, 0, width, height);

      // Cyber Grid Horizon
      ctx.strokeStyle = "rgba(0, 240, 255, 0.07)";
      ctx.lineWidth = 1;
      const gridSpacing = 32;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Neon Top Vignette / Ambient glow
      const topGlow = ctx.createLinearGradient(0, 0, 0, 100);
      topGlow.addColorStop(0, "rgba(168, 85, 247, 0.12)");
      topGlow.addColorStop(1, "transparent");
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, width, 100);

      // 2. Node Spawning
      if (timestamp >= nextSpawnTimeRef.current) {
        spawnNode(width);
        // Interval decreases as time runs out
        const minDelay = 420;
        const maxDelay = 850 - ((45 - timeLeftRef.current) / 45) * 320;
        nextSpawnTimeRef.current = timestamp + minDelay + Math.random() * (maxDelay - minDelay);
      }

      // 3. Update & Draw Falling Nodes
      const paddle = paddleRef.current;
      const paddleTop = paddle.y - paddle.height / 2;
      const paddleBottom = paddle.y + paddle.height / 2;
      const paddleLeft = paddle.x - paddle.width / 2;
      const paddleRight = paddle.x + paddle.width / 2;

      for (let i = nodesRef.current.length - 1; i >= 0; i--) {
        const node = nodesRef.current[i];
        node.y += node.speed;
        node.rotation += node.rotSpeed;

        // Collision Check with Paddle
        const nodeBottom = node.y + node.radius;
        const nodeTop = node.y - node.radius;

        if (
          nodeBottom >= paddleTop &&
          nodeTop <= paddleBottom &&
          node.x >= paddleLeft - 10 &&
          node.x <= paddleRight + 10
        ) {
          // HIT!
          if (node.type === "CYAN_CORE") {
            const nextCombo = comboRef.current + 1;
            setCombo(nextCombo);
            const multiplier = nextCombo >= 10 ? 4 : nextCombo >= 6 ? 3 : nextCombo >= 3 ? 2 : 1;
            const earned = 10 * multiplier;
            setScore((prev) => prev + earned);
            setCaughtCount((prev) => prev + 1);

            synth.playCatchCyan();
            createSparks(node.x, node.y, "#06b6d4", 16);
            addFloatingText(`+${earned} XP`, node.x, node.y - 10, "#22d3ee");

            if (nextCombo === 3) addFloatingText("2x COMBO!", paddle.x, paddle.y - 30, "#a855f7");
            if (nextCombo === 6) addFloatingText("3x OVERDRIVE!", paddle.x, paddle.y - 30, "#3b82f6");
            if (nextCombo === 10) addFloatingText("4x MATRIX SURGE!", paddle.x, paddle.y - 30, "#f59e0b");
          } else if (node.type === "GOLD_SUPER") {
            const nextCombo = comboRef.current + 2;
            setCombo(nextCombo);
            const earned = 50 * 2;
            setScore((prev) => prev + earned);
            setCaughtCount((prev) => prev + 1);

            synth.playCatchGold();
            createSparks(node.x, node.y, "#f59e0b", 28);
            addFloatingText(`+${earned} XP!`, node.x, node.y - 12, "#fbbf24");
            addFloatingText("SUPER CORE!", paddle.x, paddle.y - 30, "#f59e0b");
          } else if (node.type === "RED_GLITCH") {
            // Malware penalty
            setCombo(0);
            screenShakeRef.current = 1.2;
            synth.playGlitchHit();
            createSparks(node.x, node.y, "#f43f5e", 22);
            addFloatingText("MALWARE! -1 QALQON", node.x, node.y - 15, "#fb7185");

            setLives((prev) => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                handleGameOver(scoreRef.current);
              }
              return Math.max(0, newLives);
            });
          }

          nodesRef.current.splice(i, 1);
          continue;
        }

        // Out of screen bottom
        if (node.y - node.radius > height) {
          nodesRef.current.splice(i, 1);
          continue;
        }

        // Draw Node
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.rotation);

        if (node.type === "CYAN_CORE") {
          // Glowing Cyan AI Orb
          ctx.shadowColor = "#06b6d4";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#0891b2";
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Hexagonal Cyber Ring
          ctx.strokeStyle = "#a5f3fc";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const angle = (s * Math.PI) / 3;
            const rx = Math.cos(angle) * (node.radius + 3);
            const ry = Math.sin(angle) * (node.radius + 3);
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();

          // Inner white neon pulse
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (node.type === "GOLD_SUPER") {
          // Radiant Gold Star / Core
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 24;
          ctx.fillStyle = "#d97706";
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // 8-Pointed Golden Star
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 3;
          ctx.beginPath();
          const spikes = 8;
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? node.radius + 6 : node.radius - 2;
            const angle = (s * Math.PI) / spikes;
            const rx = Math.cos(angle) * r;
            const ry = Math.sin(angle) * r;
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();

          // Bright center
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, node.radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (node.type === "RED_GLITCH") {
          // Spiky Red Malware Node
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#e11d48";
          ctx.beginPath();
          ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Glitch spikes
          ctx.strokeStyle = "#fda4af";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const spikes = 6;
          for (let s = 0; s < spikes * 2; s++) {
            const r = s % 2 === 0 ? node.radius + 7 : node.radius - 4;
            const angle = (s * Math.PI) / spikes;
            const rx = Math.cos(angle) * r;
            const ry = Math.sin(angle) * r;
            if (s === 0) ctx.moveTo(rx, ry);
            else ctx.lineTo(rx, ry);
          }
          ctx.closePath();
          ctx.stroke();

          // Glitch skull/warning core
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(-3, -3, 6, 6);
        }

        ctx.restore();
      }

      // 4. Update & Draw Sparks / Particles
      for (let p = particlesRef.current.length - 1; p >= 0; p--) {
        const part = particlesRef.current[p];
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= part.decay;

        if (part.alpha <= 0) {
          particlesRef.current.splice(p, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, part.alpha);
        ctx.fillStyle = part.color;
        ctx.shadowColor = part.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Update & Draw Floating Texts
      for (let t = floatingTextsRef.current.length - 1; t >= 0; t--) {
        const txt = floatingTextsRef.current[t];
        txt.y += txt.vy;
        txt.alpha -= 0.024;

        if (txt.alpha <= 0) {
          floatingTextsRef.current.splice(t, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, txt.alpha);
        ctx.font = "bold 13px monospace";
        ctx.fillStyle = txt.color;
        ctx.shadowColor = txt.color;
        ctx.shadowBlur = 10;
        ctx.textAlign = "center";
        ctx.fillText(txt.text, txt.x, txt.y);
        ctx.restore();
      }

      // 6. Draw Player Paddle (Cyber Energy Shield)
      ctx.save();
      const pX = paddle.x - paddle.width / 2;
      const pY = paddle.y - paddle.height / 2;

      // Outer Neon Glow
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 24;

      // Rounded Paddle Base
      ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
      ctx.beginPath();
      ctx.roundRect(pX, pY, paddle.width, paddle.height, [8, 8, 4, 4]);
      ctx.fill();

      // Top White/Cyan Laser Line
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pX + 6, pY);
      ctx.lineTo(pX + paddle.width - 6, pY);
      ctx.stroke();

      // Paddle Energy Core (Center Gem)
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(paddle.x, paddle.y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Side Stabilizer Wings
      ctx.fillStyle = "rgba(168, 85, 247, 0.85)";
      ctx.fillRect(pX - 4, pY + 2, 4, paddle.height - 4);
      ctx.fillRect(pX + paddle.width, pY + 2, 4, paddle.height - 4);

      ctx.restore();

      ctx.restore(); // restore translate shake

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Format Time (00:45)
  const formatTime = (secs: number) => {
    const s = Math.max(0, secs);
    return `00:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden glass-panel border border-cyan-400/40 bg-[#060818]/95 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col select-none ${
        isModal ? "w-full max-w-4xl" : "w-full"
      }`}
    >
      {/* Top Header / Cyber HUD Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0a0f2b]/70 flex items-center justify-between gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-neonCyan">
            <Gamepad2 className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                AI CORE DEFENDER
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                CYBER CATCHER
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono hidden sm:block">
              Nodlarni tuting &bull; Malware&apos;dan qoching &bull; Jonli XP to&apos;plang
            </p>
          </div>
        </div>

        {/* Right: Sound & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all ${
              soundEnabled
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                : "border-white/10 bg-white/5 text-gray-500 hover:text-gray-300"
            }`}
            title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub HUD during game: Score, Lives, Timer, Combo */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#070b20] border-b border-white/10 grid grid-cols-4 gap-2 items-center text-center">
        {/* Lives */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:gap-1.5">
          <span className="text-[10px] uppercase font-mono text-gray-400 hidden sm:inline">
            Qalqon:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((heartIndex) => (
              <Shield
                key={heartIndex}
                className={`w-4 h-4 transition-all ${
                  heartIndex <= lives
                    ? "text-cyan-400 fill-cyan-400/60 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    : "text-gray-600/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono text-gray-400">Vaqt</span>
          <span
            className={`text-sm sm:text-base font-black font-mono flex items-center gap-1 ${
              timeLeft <= 10 ? "text-rose-400 animate-pulse" : "text-amber-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </span>
        </div>

        {/* Combo */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono text-gray-400">Kombo</span>
          <span
            className={`text-sm sm:text-base font-black font-mono transition-transform ${
              combo >= 3 ? "text-purple-300 scale-110" : "text-gray-300"
            }`}
          >
            {combo > 0 ? `${combo}x` : "-"}
          </span>
        </div>

        {/* Live Score */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono text-gray-400">Yig&apos;ilgan XP</span>
          <span className="text-sm sm:text-base font-black font-mono text-cyan-300 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {score}
          </span>
        </div>
      </div>

      {/* Canvas Area Container */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-[#050714] overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Overlay 1: Start Screen (IDLE) */}
        {gameState === "IDLE" && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 text-center z-20">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-neonCyan">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-wide">
                  KIBER NOD HAKER &bull; XP OVCHISI
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  Kursor yoki barmoq bilan qalqonni boshqaring. Tushayotgan AI nodlarni ushlang va reyting uchun qo&apos;shimcha XP to&apos;plang!
                </p>
              </div>

              {/* Game Rules / Elements Legend */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] shrink-0" />
                  <div>
                    <div className="font-bold text-cyan-300">AI Core</div>
                    <div className="text-[10px] text-gray-400">+10 XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] shrink-0" />
                  <div>
                    <div className="font-bold text-amber-300">Super Core</div>
                    <div className="text-[10px] text-gray-400">+50 XP (2x)</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] shrink-0" />
                  <div>
                    <div className="font-bold text-rose-400">Malware</div>
                    <div className="text-[10px] text-gray-400">-1 Qalqon</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
                <span>Eng yuqori rekord: <b className="text-amber-400">{highScore} XP</b></span>
                <span>Kunlik urinishlar: <b className="text-cyan-400">{dailyAttemptsLeft}/3</b></span>
              </div>

              <button
                onClick={startGame}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 shadow-neonCyan transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>O&apos;yinni Boshlash (45s)</span>
              </button>
            </motion.div>
          </div>
        )}

        {/* Overlay 2: Paused Screen */}
        {gameState === "PAUSED" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 text-center z-20">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white font-mono">O&apos;YIN TO&apos;XTATILDI</h3>
              <p className="text-xs text-gray-300">Tayyor bo&apos;lsangiz, davom ettiring</p>
              <button
                onClick={() => setGameState("PLAYING")}
                className="px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-cyan-500 shadow-neonCyan hover:bg-cyan-400 transition-all"
              >
                Davom ettirish
              </button>
            </div>
          </div>
        )}

        {/* Overlay 3: Game Over Modal */}
        {gameState === "GAME_OVER" && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 text-center z-30">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-md p-6 rounded-3xl glass-panel border border-cyan-400/50 bg-[#080d26]/95 text-white shadow-2xl space-y-5"
            >
              <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center shadow-neonGold">
                <Trophy className="w-7 h-7 text-white" />
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                  {score >= 200 ? "Ajoyib Natija!" : "Raund Yakunlandi"}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  YAKUNIY BALL: <span className="text-cyan-300 font-mono">+{score} XP</span>
                </h3>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
                <div>
                  <div className="text-gray-400 text-[10px]">Ushlangan Nodlar</div>
                  <div className="text-lg font-bold text-white mt-0.5">{caughtCount} ta</div>
                </div>
                <div>
                  <div className="text-gray-400 text-[10px]">Eng Yuqori Rekord</div>
                  <div className="text-lg font-bold text-amber-300 mt-0.5">{highScore} XP</div>
                </div>
              </div>

              {/* Action 1: Claim XP to Profile */}
              <div className="space-y-2.5">
                <button
                  onClick={handleClaimXp}
                  disabled={isXpClaimed || isClaimingXp || score <= 0}
                  className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isXpClaimed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 cursor-default"
                      : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-neonGold hover:opacity-95 active:scale-95"
                  }`}
                >
                  {isXpClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>XP Profilga Qo&apos;shildi (+{score} XP)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                      <span>{isClaimingXp ? "Qo'shilmoqda..." : `+${score} XP ni Profilga Qo'shish`}</span>
                    </>
                  )}
                </button>

                {/* Action 2: Share to Telegram */}
                <button
                  onClick={handleShareTelegram}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white glass-panel border border-cyan-400/40 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-cyan-300" />
                  <span>Telegramda Natijani Ulashish</span>
                </button>

                {/* Action 3: Play Again */}
                <button
                  onClick={startGame}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qayta O&apos;ynash</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Touch / Control Guide Footer */}
      <div className="p-3 bg-[#0a0f2b]/80 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-mono px-4">
        <span>🎮 PC: Sichqoncha harakati &bull; Mobil: Ekranni siljitish</span>
        <span className="hidden sm:inline text-cyan-300">Ustoz AI 2026 Arcade</span>
      </div>
    </div>
  );
}
