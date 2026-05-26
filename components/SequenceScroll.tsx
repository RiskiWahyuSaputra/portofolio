"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Preloader from "./Preloader";
import MagneticButton from "./MagneticButton";

const TOTAL_FRAMES = 240;
const MOBILE_BREAKPOINT = 768;
const MOBILE_IMAGE_SCALE = 0.58;
const MOBILE_IMAGE_MIN_WIDTH = 0.9;
const FRAME_PATH = (i: number) =>
  `/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

interface StoryText {
  progress: [number, number];
  position: "center" | "left" | "right";
  title: string;
  subtitle?: string;
  cta?: boolean;
}

const storyTexts: StoryText[] = [
  {
    progress: [0, 0.15],
    position: "center",
    title: "Hi, I'm Riski Wahyu Saputra",
    subtitle: "IT Developer",
  },
  {
    progress: [0.18, 0.32],
    position: "center",
    title: "Graduate of Politeknik Negeri Lampung",
    subtitle: "Management Informatics • Information Technology",
  },
  {
    progress: [0.35, 0.48],
    position: "left",
    title: "IT Developer Intern",
    subtitle: "BEST CORPORATION SYARIAH",
  },
  {
    progress: [0.52, 0.68],
    position: "right",
    title: "Building modern web apps",
    subtitle: "Laravel • React • Tailwind • PHP • MySQL",
  },
  {
    progress: [0.72, 0.85],
    position: "center",
    title: "Crafting scalable & user-friendly systems",
  },
  {
    progress: [0.9, 1],
    position: "center",
    title: "Let's build something great together",
    cta: true,
  },
];

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const canvasSizeRef = useRef({ width: 0, height: 0, isMobile: false });
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameRef = useRef({ current: 0, target: 0 });
  const rafRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Preload all images
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const checkComplete = () => {
      if (cancelled) return;
      loadedCount++;
      setProgress((loadedCount / TOTAL_FRAMES) * 100);
      if (loadedCount >= TOTAL_FRAMES) {
        imagesRef.current = images;
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = checkComplete;
      img.onerror = checkComplete;
      images.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      canvasSizeRef.current = {
        width,
        height,
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      };
    };

    const renderFrame = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || imagesRef.current.length === 0) return;

      const { current, target } = frameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        frameRef.current.current = current + diff * 0.15;
      } else {
        frameRef.current.current = target;
      }

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(frameRef.current.current)),
      );
      const img = imagesRef.current[frameIndex];
      const { width: canvasWidth, height: canvasHeight, isMobile } =
        canvasSizeRef.current;

      if (
        img &&
        img.complete &&
        img.naturalWidth > 0 &&
        canvasWidth &&
        canvasHeight
      ) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth;
        let drawHeight;
        let offsetX;
        let offsetY;

        if (isMobile) {
          drawHeight = canvasHeight * MOBILE_IMAGE_SCALE;
          drawWidth = drawHeight * imgRatio;

          const minWidth = canvasWidth * MOBILE_IMAGE_MIN_WIDTH;
          if (drawWidth < minWidth) {
            drawWidth = minWidth;
            drawHeight = drawWidth / imgRatio;
          }

          offsetX = (canvasWidth - drawWidth) / 2;
          offsetY = (canvasHeight - drawHeight) * 0.52;
        } else if (canvasRatio > imgRatio) {
          drawWidth = canvasWidth;
          drawHeight = canvasWidth / imgRatio;
          offsetX = 0;
          offsetY = (canvasHeight - drawHeight) * 0.5;
        } else {
          drawHeight = canvasHeight;
          drawWidth = canvasHeight * imgRatio;
          offsetX = (canvasWidth - drawWidth) * 0.5;
          offsetY = 0;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }

      rafRef.current = requestAnimationFrame(renderFrame);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded]);

  // Sync scroll progress to frame target
  useEffect(() => {
    if (!isLoaded) return;
    return smoothProgress.on("change", (v) => {
      frameRef.current.target = v * (TOTAL_FRAMES - 1);
    });
  }, [isLoaded, smoothProgress]);

  return (
    <>
      <Preloader progress={progress} isComplete={isLoaded} />

      <div ref={containerRef} className="relative h-[400svh]">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full sequence-canvas"
            style={{ background: "#050505" }}
          />

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Story overlay texts */}
          {storyTexts.map((story, index) => (
            <StoryOverlay
              key={index}
              story={story}
              scrollProgress={smoothProgress}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function StoryOverlay({
  story,
  scrollProgress,
}: {
  story: StoryText;
  scrollProgress: ReturnType<typeof useSpring>;
}) {
  const opacity = useTransform(
    scrollProgress,
    [
      story.progress[0],
      story.progress[0] + 0.05,
      story.progress[1] - 0.05,
      story.progress[1],
    ],
    [0, 1, 1, 0],
  );

  const y = useTransform(
    scrollProgress,
    [
      story.progress[0],
      story.progress[0] + 0.08,
      story.progress[1] - 0.08,
      story.progress[1],
    ],
    [40, 0, 0, -40],
  );

  const positionClasses = {
    center: "left-1/2 -translate-x-1/2 text-center",
    left: "left-8 md:left-16 lg:left-24 text-left",
    right: "right-8 md:right-16 lg:right-24 text-right",
  };

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 max-w-xl px-4 ${positionClasses[story.position]}`}
      style={{ opacity, y }}
    >
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight drop-shadow-lg">
        {story.title}
      </h2>
      {story.subtitle && (
        <p className="mt-4 text-base md:text-lg text-white/70 font-light tracking-wide">
          {story.subtitle}
        </p>
      )}
      {story.cta && (
        <div className="mt-8 flex justify-center">
          <MagneticButton
            className="px-8 py-4 bg-white text-black rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
            onClick={() => {
              const el = document.getElementById("projects");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Portfolio
          </MagneticButton>
        </div>
      )}
    </motion.div>
  );
}
