"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Trophy, Rotate3d, Zap } from "lucide-react";

export default function PrizeTrophy3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeGlow, setActiveGlow] = useState<"gold" | "cyan" | "purple">("gold");

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for whole Trophy assembly
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);

    // 1. Trophy Base / Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.7, 0.85, 0.35, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a1026,
      metalness: 0.9,
      roughness: 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    trophyGroup.add(baseMesh);

    // Base glowing ring
    const baseRingGeo = new THREE.TorusGeometry(0.78, 0.03, 16, 64);
    const baseRingMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -1.05;
    trophyGroup.add(baseRing);

    // 2. Trophy Stem
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.28, 0.6, 32);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: 0xffc72c,
      emissive: 0x3d2b00,
      metalness: 0.95,
      roughness: 0.18,
      clearcoat: 0.8,
    });
    const stemMesh = new THREE.Mesh(stemGeo, goldMat);
    stemMesh.position.y = -0.7;
    trophyGroup.add(stemMesh);

    // 3. Trophy Cup Bowl (Lathe Geometry for elegant cup curves)
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.15, 0));
    points.push(new THREE.Vector2(0.3, 0.2));
    points.push(new THREE.Vector2(0.55, 0.6));
    points.push(new THREE.Vector2(0.72, 1.1));
    points.push(new THREE.Vector2(0.78, 1.4));
    points.push(new THREE.Vector2(0.74, 1.42));
    points.push(new THREE.Vector2(0.68, 1.3));
    points.push(new THREE.Vector2(0.48, 0.6));
    points.push(new THREE.Vector2(0.2, 0.15));
    points.push(new THREE.Vector2(0, 0.1));

    const cupGeo = new THREE.LatheGeometry(points, 36);
    const cupMesh = new THREE.Mesh(cupGeo, goldMat);
    cupMesh.position.y = -0.4;
    trophyGroup.add(cupMesh);

    // 4. Handles (Two Torus segments on left and right)
    const handleGeo = new THREE.TorusGeometry(0.42, 0.05, 16, 32, Math.PI * 0.95);
    const handleLeft = new THREE.Mesh(handleGeo, goldMat);
    handleLeft.position.set(-0.75, 0.35, 0);
    handleLeft.rotation.z = Math.PI * 0.55;
    trophyGroup.add(handleLeft);

    const handleRight = new THREE.Mesh(handleGeo, goldMat);
    handleRight.position.set(0.75, 0.35, 0);
    handleRight.rotation.z = -Math.PI * 0.55;
    trophyGroup.add(handleRight);

    // 5. Floating Holographic Diamond inside the cup!
    const diamondGeo = new THREE.OctahedronGeometry(0.35, 0);
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x005577,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.95,
      wireframe: false,
    });
    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    diamondMesh.position.y = 0.55;
    trophyGroup.add(diamondMesh);

    // 6. Holographic Orbiting Rings
    const orbit1Geo = new THREE.TorusGeometry(1.35, 0.015, 16, 80);
    const orbit1Mat = new THREE.MeshBasicMaterial({ color: 0xffbe0b, transparent: true, opacity: 0.8 });
    const orbit1 = new THREE.Mesh(orbit1Geo, orbit1Mat);
    orbit1.position.y = 0.2;
    orbit1.rotation.x = Math.PI / 3;
    trophyGroup.add(orbit1);

    const orbit2Geo = new THREE.TorusGeometry(1.5, 0.012, 16, 80);
    const orbit2Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 });
    const orbit2 = new THREE.Mesh(orbit2Geo, orbit2Mat);
    orbit2.position.y = 0.2;
    orbit2.rotation.x = -Math.PI / 4;
    orbit2.rotation.y = Math.PI / 6;
    trophyGroup.add(orbit2);

    // 7. Floating Gold & Cyan Sparks/Spangles
    const sparksCount = 180;
    const sparksPositions = new Float32Array(sparksCount * 3);
    for (let i = 0; i < sparksCount * 3; i += 3) {
      sparksPositions[i] = (Math.random() - 0.5) * 3.5;
      sparksPositions[i + 1] = (Math.random() - 0.5) * 3.5;
      sparksPositions[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    const sparksGeo = new THREE.BufferGeometry();
    sparksGeo.setAttribute("position", new THREE.BufferAttribute(sparksPositions, 3));
    const sparksMat = new THREE.PointsMaterial({
      size: 0.045,
      color: 0xffd700,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const sparksPoints = new THREE.Points(sparksGeo, sparksMat);
    trophyGroup.add(sparksPoints);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLightGold = new THREE.PointLight(0xffbe0b, 4, 15);
    pointLightGold.position.set(3, 3, 4);
    scene.add(pointLightGold);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 3, 15);
    pointLightCyan.position.set(-3, -2, 3);
    scene.add(pointLightCyan);

    // Interactive Drag / Rotation
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      rotationVelocityY = deltaX * 0.006;
      rotationVelocityX = deltaY * 0.004;
      trophyGroup.rotation.y += rotationVelocityY;
      trophyGroup.rotation.x += rotationVelocityX;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
        previousMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;
      rotationVelocityY = deltaX * 0.008;
      rotationVelocityX = deltaY * 0.005;
      trophyGroup.rotation.y += rotationVelocityY;
      trophyGroup.rotation.x += rotationVelocityX;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    currentMount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    currentMount.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous gentle auto rotation
      if (!isDragging) {
        trophyGroup.rotation.y += 0.009;
        // Damping return to neutral pitch
        trophyGroup.rotation.x *= 0.96;
      }

      // Diamond float & spin
      diamondMesh.rotation.y = elapsed * 1.5;
      diamondMesh.rotation.x = elapsed * 0.8;
      diamondMesh.position.y = 0.55 + Math.sin(elapsed * 2) * 0.08;

      // Orbits rotation
      orbit1.rotation.z += 0.008;
      orbit2.rotation.z -= 0.007;

      // Sparks floating upwards
      const positions = sparksGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += 0.007;
        if (positions[i] > 1.8) {
          positions[i] = -1.6;
        }
      }
      sparksGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      currentMount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto my-8 p-6 rounded-3xl glass-panel border border-amber-400/40 bg-gradient-to-b from-[#101736]/80 to-[#070b1a]/95 shadow-2xl overflow-hidden text-center">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating HUD Tag */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>3D INTERAKTIV OLTIN KUBOK</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          <Rotate3d className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Aylantirish uchun torting</span>
        </div>
      </div>

      {/* Three.js Container */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] cursor-grab active:cursor-grabbing select-none relative"
        title="Oltin kubokni sichqoncha yoki barmoq bilan 360° aylantirib ko'ring!"
      />

      {/* Bottom info banner */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-left font-mono">
          <div className="text-gray-400 text-[10px] uppercase">Bosh Mukofot Belgisi:</div>
          <div className="font-extrabold text-amber-300 text-sm">MacBook Pro &amp; Oltin Kubok</div>
        </div>

        <div className="flex items-center gap-2 text-cyan-300 text-[11px] font-mono bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-400/30">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-vaqt 3D renderlash</span>
        </div>
      </div>
    </div>
  );
}
