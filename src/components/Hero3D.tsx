"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  Flame,
  Clock,
  BrainCircuit,
  TrendingUp,
  Mic,
  Scan,
} from "lucide-react";

interface Hero3DProps {
  onOpenRegister: () => void;
  onOpenQuiz: () => void;
  onOpenVoiceAdvisor?: () => void;
}

export default function Hero3D({ onOpenRegister, onOpenQuiz, onOpenVoiceAdvisor }: Hero3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // FOMO Countdown Timer (e.g. 5 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);

    // Dynamically adjust camera distance so geometry never touches canvas boundaries
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      const baseDistance = 7.6;
      if (aspect < 1) {
        camera.position.z = (baseDistance / aspect) * 0.95;
      } else {
        camera.position.z = baseDistance;
      }
    };
    updateCameraDistance(width, height);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Group for all planetary elements so lights stay fixed while model rotates smoothly
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Holographic Crystal / Core
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x0d284f,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Inner Glowing Energy Node
    const innerGeo = new THREE.SphereGeometry(0.75, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x9d4edd,
      emissive: 0x7b2cbf,
      emissiveIntensity: 1.4,
      roughness: 0.3,
      metalness: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 3. Orbital Rings (scaled comfortably within safe camera frustum)
    const ringGeo1 = new THREE.TorusGeometry(1.8, 0.024, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    mainGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(2.1, 0.02, 16, 120);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf72585, transparent: true, opacity: 0.65 });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = Math.PI / 6;
    mainGroup.add(ringMesh2);

    const ringGeo3 = new THREE.TorusGeometry(2.35, 0.018, 16, 120);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xffbe0b, transparent: true, opacity: 0.55 });
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.z = Math.PI / 3;
    mainGroup.add(ringMesh3);

    // 4. Soft Circular Glowing Particle Texture (prevents harsh square particles)
    const createParticleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.25, "rgba(0, 240, 255, 0.85)");
      gradient.addColorStop(0.5, "rgba(0, 180, 255, 0.35)");
      gradient.addColorStop(0.8, "rgba(157, 78, 221, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      return new THREE.CanvasTexture(canvas);
    };
    const particleTexture = createParticleTexture();

    // 5. Floating Cyber Particles Field (Organic Spherical Nebula within safe bounds)
    const particlesCount = 280;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const r = 1.2 + Math.pow(Math.random(), 0.7) * 1.5; // bounded in safe radius [1.2, 2.7]
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particlesMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xf72585, 2.5, 20);
    pointLight2.position.set(-4, -3, 2);
    scene.add(pointLight2);

    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      const clampedX = Math.max(-1.5, Math.min(1.5, mouseX));
      const clampedY = Math.max(-1.5, Math.min(1.5, mouseY));
      targetRotationY = clampedX * 0.35;
      targetRotationX = clampedY * 0.25;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = currentMount.getBoundingClientRect();
        const mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        const clampedX = Math.max(-1.5, Math.min(1.5, mouseX));
        const clampedY = Math.max(-1.5, Math.min(1.5, mouseY));
        targetRotationY = clampedX * 0.3;
        targetRotationX = clampedY * 0.2;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      updateCameraDistance(newW, newH);
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      coreMesh.rotation.y += 0.008;
      coreMesh.rotation.x += 0.004;

      innerMesh.rotation.y -= 0.012;
      const scalePulse = 0.85 + Math.sin(elapsed * 2.5) * 0.05;
      innerMesh.scale.set(scalePulse, scalePulse, scalePulse);

      ringMesh1.rotation.z += 0.006;
      ringMesh2.rotation.x += 0.008;
      ringMesh3.rotation.y += 0.005;

      particlesMesh.rotation.y = elapsed * 0.025;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      particleTexture?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Hero Copy & CTA */}
        <div className="lg:col-span-7 text-left space-y-6 z-10">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg shadow-cyan-500/10"
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden border border-cyan-400/50 shrink-0">
              <Image
                src="/logo.jpg"
                alt="Ustoz AI"
                fill
                sizes="20px"
                className="object-cover"
              />
            </div>
            <span>Ustoz AI Maxsus Loyihasi • 2026 Tanlovi</span>
            <span className="bg-cyan-500/20 text-cyan-200 text-[10px] px-2 py-0.5 rounded-full border border-cyan-400/30">
              Qabul Ochiq
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12]"
          >
            Kelajak Kasblari Tanlovi —{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent text-glow-cyan">
              G&apos;oliblik Sari Ilk Qadam!
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal"
          >
            Ustoz AI bilan o&apos;z iqtidoringni namoyon et, zamonaviy kasblarni egalla va noutbuk, planshet hamda xalqaro grantlarni qo&apos;lga kirit!
          </motion.p>

          {/* FOMO Countdown Banner & Dynamic Capacity Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-400/30 bg-[#070d24]/90 max-w-xl space-y-3.5 shadow-xl"
          >
            {/* Timer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Qabul tugashiga qoldi:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-white">
                <span className="px-2 py-1 rounded bg-white/10 text-cyan-300">{timeLeft.days}k</span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-white/10 text-cyan-300">{timeLeft.hours}s</span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-white/10 text-cyan-300">{timeLeft.minutes}d</span>
                <span>:</span>
                <span className="px-2 py-1 rounded bg-white/10 text-amber-400">{timeLeft.seconds}s</span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>O&apos;rinlar sig&apos;imi:</span>
                <span className="text-amber-400 font-bold">1,000 tadan 842 tasi band qilindi (84.2%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 w-[84.2%] transition-all duration-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons: Primary Register + Secondary AI Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <button
              onClick={onOpenRegister}
              className="relative group overflow-hidden px-8 py-4 rounded-xl font-bold text-white shadow-neonCyan bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center flex items-center justify-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                <Flame className="w-5 h-5 text-amber-300 animate-pulse" />
                Ro&apos;yxatdan O&apos;tish
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-6 py-4 rounded-xl font-semibold text-gray-200 glass-panel border border-purple-400/40 hover:border-purple-400 hover:text-purple-300 transition-all duration-300 text-center flex items-center justify-center gap-2 hover:bg-white/10"
            >
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>AI Kviz Test</span>
            </button>

            <a
              href="#yuz-skaner"
              className="px-6 py-4 rounded-xl font-semibold text-cyan-300 glass-panel border border-cyan-400/40 hover:border-cyan-300 hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-2 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Scan className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Yuz Skaneri (AI)</span>
            </a>

            {onOpenVoiceAdvisor && (
              <button
                onClick={onOpenVoiceAdvisor}
                className="px-6 py-4 rounded-xl font-bold text-cyan-300 glass-panel border border-cyan-400/50 hover:border-cyan-300 hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-2.5 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.25)] group"
              >
                <Mic className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-125 transition-transform" />
                <span>Ovoz orqali Tanlash (AI)</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Right Column: Three.js Interactive 3D Canvas */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[530px] lg:min-h-[580px]">
          {/* Subtle Ambient Backlight specifically behind the 3D planetary core */}
          <div className="absolute w-[360px] h-[360px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-0" />
          <div className="absolute w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none -z-0" />

          {/* Floating Cyber HUD Badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-2 sm:top-4 right-2 sm:right-6 glass-panel px-3.5 py-2 rounded-xl border border-cyan-400/40 z-20 shadow-lg text-xs flex items-center gap-2.5 backdrop-blur-md pointer-events-none select-none"
          >
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.5)] shrink-0">
              <Image
                src="/logo.jpg"
                alt="Ustoz AI Logo"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">NEURAL CORE</div>
              <div className="font-bold text-cyan-300">Ustoz AI 3.0</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-4 sm:bottom-6 left-2 sm:left-4 glass-panel px-3.5 py-2.5 rounded-xl border border-purple-400/40 z-20 shadow-lg text-xs flex items-center gap-2.5 backdrop-blur-md pointer-events-none select-none"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">STATUS</div>
              <div className="font-bold text-gray-200">AI Tizim: Online</div>
            </div>
          </motion.div>

          <div
            ref={mountRef}
            className="w-full h-[460px] sm:h-[530px] lg:h-[580px] cursor-grab active:cursor-grabbing relative flex items-center justify-center select-none"
            style={{
              maskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 96%)",
              WebkitMaskImage: "radial-gradient(circle at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 96%)",
            }}
            title="Kursorni harakatlantiring!"
          />
        </div>
      </div>
    </section>
  );
}
