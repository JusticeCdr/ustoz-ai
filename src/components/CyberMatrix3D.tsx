"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Bot, Sparkles, Eye, Shield, Cpu, Activity } from "lucide-react";

export default function CyberMatrix3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"ai" | "security" | "web3">("ai");

  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const eyeLightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const droneGroup = new THREE.Group();
    scene.add(droneGroup);

    // 1. Robotic Eye Core (Sphere)
    const eyeGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x050819,
      metalness: 0.95,
      roughness: 0.15,
    });
    const eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    droneGroup.add(eyeMesh);

    // 2. Glowing Iris / Pupil (Lens)
    const pupilGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.25, 32);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.rotation.x = Math.PI / 2;
    pupilMesh.position.z = 0.6;
    droneGroup.add(pupilMesh);

    // 3. Inner Pupil Point Light
    const eyeLight = new THREE.PointLight(0x00f0ff, 3, 8);
    eyeLight.position.set(0, 0, 1);
    droneGroup.add(eyeLight);
    eyeLightRef.current = eyeLight;

    // 4. Outer Cybernetic Cage / Geometric Armor (Dodecahedron Wireframe)
    const cageGeo = new THREE.DodecahedronGeometry(1.3, 1);
    const cageMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x072242,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      metalness: 0.8,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    droneGroup.add(cageMesh);
    coreMeshRef.current = cageMesh;

    // 5. Orbiting Data Cubes (4 satellites)
    const satellitesGroup = new THREE.Group();
    droneGroup.add(satellitesGroup);

    const cubeGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x9d4edd, metalness: 0.8, roughness: 0.2 });

    const sat1 = new THREE.Mesh(cubeGeo, cubeMat);
    sat1.position.set(1.7, 0, 0);
    satellitesGroup.add(sat1);

    const sat2 = new THREE.Mesh(cubeGeo, cubeMat);
    sat2.position.set(-1.7, 0, 0);
    satellitesGroup.add(sat2);

    const sat3 = new THREE.Mesh(cubeGeo, cubeMat);
    sat3.position.set(0, 1.7, 0);
    satellitesGroup.add(sat3);

    const sat4 = new THREE.Mesh(cubeGeo, cubeMat);
    sat4.position.set(0, -1.7, 0);
    satellitesGroup.add(sat4);

    // 6. Cyber Ring Horizon
    const ringGeo = new THREE.TorusGeometry(2.1, 0.015, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd, transparent: true, opacity: 0.5 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    droneGroup.add(ringMesh);

    // Ambient & Main Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Cursor tracking
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = nx * 0.9;
      targetY = ny * 0.6;
    };

    window.addEventListener("mousemove", onMouseMove);

    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Eye follows cursor smoothly with damping
      droneGroup.rotation.y += (targetX - droneGroup.rotation.y) * 0.08;
      droneGroup.rotation.x += (-targetY - droneGroup.rotation.x) * 0.08;

      // Floating breathing bob
      droneGroup.position.y = Math.sin(elapsed * 2) * 0.12;

      // Outer cage spins opposite
      cageMesh.rotation.y = elapsed * 0.4;
      cageMesh.rotation.z = elapsed * 0.2;

      // Satellites rotate
      satellitesGroup.rotation.z = elapsed * 0.7;
      satellitesGroup.rotation.y = elapsed * 0.5;

      ringMesh.rotation.z = -elapsed * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Mode Switcher color change
  const handleModeChange = (newMode: "ai" | "security" | "web3") => {
    setMode(newMode);
    if (!coreMeshRef.current || !eyeLightRef.current) return;

    if (newMode === "ai") {
      (coreMeshRef.current.material as THREE.MeshPhysicalMaterial).color.setHex(0x00f0ff);
      eyeLightRef.current.color.setHex(0x00f0ff);
    } else if (newMode === "security") {
      (coreMeshRef.current.material as THREE.MeshPhysicalMaterial).color.setHex(0x06d6a0);
      eyeLightRef.current.color.setHex(0x06d6a0);
    } else {
      (coreMeshRef.current.material as THREE.MeshPhysicalMaterial).color.setHex(0x9d4edd);
      eyeLightRef.current.color.setHex(0x9d4edd);
    }
  };

  return (
    <div className="relative my-12 p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-400/30 bg-[#060a1e]/85 shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Copy & Interactive Controls */}
        <div className="md:col-span-6 text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI INTELLEKTUAL KUZATUVCHI (3D)</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Interaktiv{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cyber Eye Matrix
            </span>
          </h3>

          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
            O&apos;ng tarafdagi 3D neyron ko&apos;z kursoringiz harakatini real-vaqt rejimida kuzatadi. Quyidagi rejimlarni almashtirib, energetik matritsani o&apos;zgartirib ko&apos;ring:
          </p>

          {/* Mode Switchers */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleModeChange("ai")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                mode === "ai"
                  ? "bg-cyan-500 text-black shadow-neonCyan font-bold"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Mode (Cyan)</span>
            </button>

            <button
              onClick={() => handleModeChange("security")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                mode === "security"
                  ? "bg-emerald-400 text-black shadow-lg font-bold"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Cyber Defense (Green)</span>
            </button>

            <button
              onClick={() => handleModeChange("web3")}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                mode === "web3"
                  ? "bg-purple-500 text-white shadow-neonPurple font-bold"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Quantum Web3 (Purple)</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] font-mono text-gray-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>KURSOR KUZATUVI: FAOL • 60 FPS DILUTION</span>
          </div>
        </div>

        {/* Right 3D Viewport */}
        <div className="md:col-span-6 relative flex items-center justify-center">
          <div
            ref={mountRef}
            className="w-full h-[280px] sm:h-[320px] cursor-crosshair select-none relative"
            title="Kursorni harakatlantiring — AI ko'z sizni kuzatadi!"
          />
        </div>
      </div>
    </div>
  );
}
