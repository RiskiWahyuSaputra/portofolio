"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface QBotFabProps {
  /** Bumped by the parent on every click; each bump plays the click reaction. */
  clickCount: number;
  hovered: boolean;
}

const NEON = 0x00f2fe;

// Floating 3D "Q-Core Bot" drawn into the chat FAB. Plain three.js rather
// than an R3F <Canvas>: it's one tiny scene with a hand-rolled loop.
//
// Idle: floats, glow breathes, blinks, antenna sways, follows the cursor.
// Hover: grows, tilts its head, happy ^ ^ eyes, brighter glow, antenna wiggle.
// Click: squash & stretch bounce, 360° spin, glow flash and a ring shockwave.
export default function QBotFab({ clickCount, hovered }: QBotFabProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef(hovered);
  const clickRef = useRef<() => void>(() => {});
  const lastClickCount = useRef(clickCount);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    if (clickCount !== lastClickCount.current) {
      lastClickCount.current = clickCount;
      clickRef.current();
    }
  }, [clickCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    // Soft studio reflections so the clearcoat and visor actually read as glossy
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.6;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.1, 6.2);

    // Light intensities are in physical units (×π vs. the legacy r128 values)
    scene.add(new THREE.AmbientLight(0xffffff, 0.5 * Math.PI));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6 * Math.PI);
    keyLight.position.set(3.5, 5.5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(NEON, 18, 8, 1.5);
    rimLight.position.set(-1.8, 1.2, -2.2);
    scene.add(rimLight);

    // ---- Materials ----
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050811,
      roughness: 0.05,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.3, metalness: 0.9 });
    const neonMat = new THREE.MeshStandardMaterial({ color: NEON, emissive: NEON, emissiveIntensity: 1.6 });
    const waveMat = new THREE.MeshBasicMaterial({
      color: NEON,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    // ---- Geometry ----
    const geometries = {
      body: new THREE.SphereGeometry(1.05, 48, 48),
      // A patch of a slightly larger sphere, centred on +Z, forms the visor
      visor: new THREE.SphereGeometry(1.07, 48, 32, Math.PI / 2 - 0.62, 1.24, Math.PI / 2 - 0.42, 0.84),
      ring: new THREE.TorusGeometry(0.76, 0.1, 24, 72),
      tail: new THREE.CylinderGeometry(0.13, 0.19, 0.9, 24),
      eye: new THREE.SphereGeometry(0.12, 20, 20),
      happyEye: new THREE.TorusGeometry(0.11, 0.038, 10, 24, Math.PI),
      antennaStem: new THREE.CylinderGeometry(0.035, 0.05, 0.42, 12),
      antennaTip: new THREE.SphereGeometry(0.095, 20, 20),
      earPod: new THREE.CylinderGeometry(0.2, 0.22, 0.16, 28),
      earGlow: new THREE.TorusGeometry(0.16, 0.025, 10, 32),
      wave: new THREE.TorusGeometry(1.1, 0.035, 8, 80),
    };

    // root: float + hover scale / squash. qbot: rotation (cursor, spin, tilt).
    const root = new THREE.Group();
    scene.add(root);
    const qbot = new THREE.Group();
    root.add(qbot);

    qbot.add(new THREE.Mesh(geometries.body, bodyMat));
    qbot.add(new THREE.Mesh(geometries.visor, visorMat));

    const qRing = new THREE.Mesh(geometries.ring, neonMat);
    qRing.position.z = 0.72;
    qbot.add(qRing);

    const qTail = new THREE.Mesh(geometries.tail, neonMat);
    qTail.position.set(0.7, -0.7, 0.4);
    qTail.rotation.z = -Math.PI / 4;
    qbot.add(qTail);

    // Normal eyes (blink by squashing Y) and happy ^ ^ arcs, cross-faded
    const eyes = [-0.25, 0.25].map((x) => {
      const eye = new THREE.Mesh(geometries.eye, neonMat);
      eye.position.set(x, 0.08, 1.07);
      const happy = new THREE.Mesh(geometries.happyEye, neonMat);
      happy.position.set(x, 0.02, 1.08);
      qbot.add(eye, happy);
      return { eye, happy };
    });

    const antenna = new THREE.Group();
    antenna.position.y = 0.98;
    const stem = new THREE.Mesh(geometries.antennaStem, metalMat);
    stem.position.y = 0.2;
    const tip = new THREE.Mesh(geometries.antennaTip, neonMat);
    tip.position.y = 0.46;
    antenna.add(stem, tip);
    qbot.add(antenna);

    for (const side of [-1, 1]) {
      const pod = new THREE.Mesh(geometries.earPod, metalMat);
      pod.position.x = side * 1.04;
      pod.rotation.z = Math.PI / 2;
      const glow = new THREE.Mesh(geometries.earGlow, neonMat);
      glow.position.x = side * 1.13;
      glow.rotation.y = Math.PI / 2;
      qbot.add(pod, glow);
    }

    const wave = new THREE.Mesh(geometries.wave, waveMat);
    wave.position.z = 0.4;
    wave.visible = false;
    scene.add(wave);

    // ---- Sizing ----
    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // ---- Input ----
    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Animation state ----
    let spinTarget = 0;
    let squash = 0; // spring displacement for squash & stretch
    let squashVel = 0;
    let flash = 0;
    let waveAge = Infinity;
    let hover = 0; // eased 0..1
    let nextBlink = 2 + Math.random() * 3;
    let blinkAge = Infinity;

    clickRef.current = () => {
      if (!reduceMotion) {
        spinTarget += Math.PI * 2;
        squashVel += 5;
      }
      flash = 1;
      waveAge = 0;
    };

    let last = performance.now();
    const start = last;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (document.hidden) return;
      const t = (now - start) / 1000;

      hover += ((hoveredRef.current ? 1 : 0) - hover) * Math.min(1, dt * 10);

      // Squash spring: stiff and slightly underdamped, so it bounces
      squashVel += (-260 * squash - 11 * squashVel) * dt;
      squash += squashVel * dt;

      flash = Math.max(0, flash - dt * 2.2);

      // Float + scale
      const bob = reduceMotion ? 0 : Math.sin(t * 2.6) * 0.12;
      root.position.y = bob + hover * 0.06;
      const s = 1 + hover * 0.1;
      root.scale.set(s * (1 + squash * 0.5), s * (1 - squash * 0.6), s * (1 + squash * 0.5));

      // Look at the cursor, plus spin and a playful head tilt on hover
      qbot.rotation.y += (mouseX * 0.55 + spinTarget - qbot.rotation.y) * Math.min(1, dt * 8);
      qbot.rotation.x += (-mouseY * 0.32 - hover * 0.12 - qbot.rotation.x) * Math.min(1, dt * 8);
      const tilt = hover * (0.16 + (reduceMotion ? 0 : Math.sin(t * 5) * 0.05));
      qbot.rotation.z += (tilt - qbot.rotation.z) * Math.min(1, dt * 8);

      // Antenna: lazy sway, frantic wiggle on hover
      antenna.rotation.z = reduceMotion
        ? 0
        : Math.sin(t * 1.8) * 0.06 + Math.sin(t * 16) * 0.22 * hover - squash * 0.8;

      // Glow: breathing + hover boost + click flash
      neonMat.emissiveIntensity = 1.4 + Math.sin(t * 2.2) * 0.25 + hover * 0.9 + flash * 2.5;
      tip.scale.setScalar(1 + Math.sin(t * 4) * 0.12 + flash * 0.5);
      rimLight.intensity = 14 + hover * 10 + flash * 30;

      // Eyes: blink while idle, switch to happy arcs on hover / click
      const happy = Math.min(1, hover + flash);
      blinkAge += dt;
      if (t > nextBlink && happy < 0.5) {
        blinkAge = 0;
        nextBlink = t + 2.5 + Math.random() * 3.5;
      }
      const blink = blinkAge < 0.16 ? Math.sin((blinkAge / 0.16) * Math.PI) : 0;
      for (const { eye, happy: arc } of eyes) {
        const open = (1 - happy) * (1 - blink * 0.92);
        eye.scale.set(0.85, 1.35 * Math.max(open, 0.001), 0.45);
        eye.visible = open > 0.02;
        arc.scale.setScalar(Math.max(happy, 0.001));
        arc.visible = happy > 0.02;
      }

      // Click shockwave ring
      if (waveAge < 0.7) {
        waveAge += dt;
        const p = Math.min(1, waveAge / 0.7);
        wave.visible = true;
        wave.position.y = root.position.y;
        wave.scale.setScalar(0.9 + p * 0.75);
        waveMat.opacity = (1 - p) * 0.85;
      } else {
        wave.visible = false;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clickRef.current = () => {};
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      Object.values(geometries).forEach((g) => g.dispose());
      [bodyMat, visorMat, metalMat, neonMat, waveMat].forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="block h-full w-full"
      style={{
        filter:
          "drop-shadow(0 10px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 16px rgba(0,242,254,0.45))",
      }}
    />
  );
}
