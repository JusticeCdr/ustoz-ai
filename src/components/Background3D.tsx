"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050713, 0.016);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 30);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);

    // 2. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x1a2b56, 1.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 70);
    pointLight1.position.set(15, 20, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9d4edd, 2.5, 70);
    pointLight2.position.set(-15, -10, 10);
    scene.add(pointLight2);

    // 3. Cyber Matrix Undulating Wave Plane (Terrain)
    const gridWidth = 90;
    const gridDepth = 90;
    const gridSegmentsX = 48;
    const gridSegmentsY = 48;

    const planeGeo = new THREE.PlaneGeometry(
      gridWidth,
      gridDepth,
      gridSegmentsX,
      gridSegmentsY
    );
    // Rotate to lie horizontally
    planeGeo.rotateX(-Math.PI / 2.3);

    // Base positions copy for wave calculations
    const posAttribute = planeGeo.attributes.position;
    const originalPositions = posAttribute.array.slice();

    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      roughness: 0.2,
      metalness: 0.8,
    });
    const waveMesh = new THREE.Mesh(planeGeo, planeMat);
    waveMesh.position.set(0, -9, 0);
    scene.add(waveMesh);

    // Glowing Nodes on the vertices of the wave plane
    const nodePointsMat = new THREE.PointsMaterial({
      color: 0x8054ff,
      size: 0.15,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wavePoints = new THREE.Points(planeGeo, nodePointsMat);
    wavePoints.position.set(0, -9, 0);
    scene.add(wavePoints);

    // 4. Deep Cyber Space Starfield (Ambient Dust)
    const starsCount = 500;
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 90;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Floating Magenta/Purple Energy Orbs
    const energyCount = 120;
    const energyPositions = new Float32Array(energyCount * 3);
    const energyVelocities: { x: number; y: number; z: number }[] = [];
    for (let i = 0; i < energyCount * 3; i += 3) {
      energyPositions[i] = (Math.random() - 0.5) * 70;
      energyPositions[i + 1] = (Math.random() - 0.5) * 50;
      energyPositions[i + 2] = (Math.random() - 0.5) * 60;
      energyVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: Math.random() * 0.02 + 0.005,
        z: (Math.random() - 0.5) * 0.015,
      });
    }
    const energyGeo = new THREE.BufferGeometry();
    energyGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(energyPositions, 3)
    );
    const energyMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0xf72585,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const energyField = new THREE.Points(energyGeo, energyMat);
    scene.add(energyField);

    // 6. Floating Holographic Cyber Crystals (Polyhedra)
    const crystalsGroup = new THREE.Group();
    const crystalGeometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.TetrahedronGeometry(1.5, 0),
      new THREE.IcosahedronGeometry(0.9, 0),
    ];
    const crystalColors = [0x00f0ff, 0x9d4edd, 0xffbe0b, 0x06d6a0, 0xf72585];

    interface FloatingCrystal {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speedY: number;
      rotSpeedX: number;
      rotSpeedY: number;
      phase: number;
    }

    const crystals: FloatingCrystal[] = [];
    const numCrystals = 10;

    for (let i = 0; i < numCrystals; i++) {
      const geo = crystalGeometries[i % crystalGeometries.length];
      const color = crystalColors[i % crystalColors.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // Distribute in a cylinder around the camera
      const angle = (i / numCrystals) * Math.PI * 2;
      const radius = 22 + Math.random() * 12;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 30;
      const z = Math.sin(angle) * (radius * 0.7) - 10;

      mesh.position.set(x, y, z);
      mesh.scale.setScalar(0.7 + Math.random() * 0.7);
      crystalsGroup.add(mesh);

      crystals.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speedY: 0.005 + Math.random() * 0.008,
        rotSpeedX: 0.005 + Math.random() * 0.01,
        rotSpeedY: 0.006 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2,
      });
    }
    scene.add(crystalsGroup);

    // 7. Interactive Mouse & Scroll Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      targetScrollY = window.scrollY / maxScroll;
    };

    const handleResize = () => {
      if (!container) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial scroll setup
    handleScroll();

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Skip heavy calculations if motion is reduced
      if (!prefersReducedMotion) {
        // --- Animate Cyber Waves ---
        const pos = planeGeo.attributes.position;
        const count = pos.count;

        for (let i = 0; i < count; i++) {
          const origX = originalPositions[i * 3];
          const origY = originalPositions[i * 3 + 1];

          // Complex layered holographic wave simulation
          const waveZ =
            Math.sin(origX * 0.12 + elapsed * 1.1) * 1.8 +
            Math.cos(origY * 0.14 + elapsed * 0.9) * 1.6 +
            Math.sin((origX + origY) * 0.08 + elapsed * 0.6) * 1.2;

          pos.setZ(i, waveZ);
        }
        pos.needsUpdate = true;

        // --- Animate Energy Orbs (Drifting upward) ---
        const energyPos = energyGeo.attributes.position;
        for (let i = 0; i < energyCount; i++) {
          let y = energyPos.getY(i) + energyVelocities[i].y;
          if (y > 35) {
            y = -35;
          }
          energyPos.setY(i, y);
        }
        energyPos.needsUpdate = true;

        // --- Animate Floating Crystals ---
        for (let i = 0; i < crystals.length; i++) {
          const c = crystals[i];
          c.mesh.rotation.x += c.rotSpeedX;
          c.mesh.rotation.y += c.rotSpeedY;
          c.mesh.position.y =
            c.baseY + Math.sin(elapsed * 0.8 + c.phase) * 3.5;
        }

        // --- Slow ambient rotation of starfield ---
        starField.rotation.y = elapsed * 0.015;
        starField.rotation.x = Math.sin(elapsed * 0.01) * 0.05;
      }

      // --- Smooth Camera Motion with Parallax & Scroll ---
      currentScrollY += (targetScrollY - currentScrollY) * 0.06;

      const targetCamX = targetMouseX * 4;
      const targetCamY = 4 + targetMouseY * 3 - currentScrollY * 12;
      const targetCamZ = 30 - currentScrollY * 8;

      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;

      camera.lookAt(0, -2 - currentScrollY * 8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      planeGeo.dispose();
      planeMat.dispose();
      nodePointsMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      energyGeo.dispose();
      energyMat.dispose();
      crystals.forEach((c) => {
        c.mesh.geometry.dispose();
        if (Array.isArray(c.mesh.material)) {
          c.mesh.material.forEach((m) => m.dispose());
        } else {
          c.mesh.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
