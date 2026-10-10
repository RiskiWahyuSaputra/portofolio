"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Preloader from "./Preloader";
import MagneticButton from "./MagneticButton";
import { useLang } from "./LangContext";
import { smoothScrollTo } from "./SmoothScroll";

const TOTAL_FRAMES = 240;
const MOBILE_BREAKPOINT = 768;
const MOBILE_IMAGE_SCALE = 0.58;
const MOBILE_IMAGE_MIN_WIDTH = 0.9;
const FRAME_PATH = (i: number) =>
  `/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

interface StoryText {
  progress: [number, number];
  position: "center" | "left" | "right";
  title: { EN: string; ID: string };
  subtitle?: { EN: string; ID: string };
  cta?: boolean;
}

const storyTexts: StoryText[] = [
  {
    progress: [0, 0.15],
    position: "center",
    title: { EN: "Hi, I'm Riski Wahyu Saputra", ID: "Halo, Saya Riski Wahyu Saputra" },
    subtitle: {
      EN: "IT Developer",
      ID: "IT Developer",
    },
  },
  {
    progress: [0.18, 0.32],
    position: "center",
    title: { EN: "IT Developer", ID: "IT Developer" },
    subtitle: {
      EN: "PT Bandung Eco Sinergi Teknologi",
      ID: "PT Bandung Eco Sinergi Teknologi",
    },
  },
  {
    progress: [0.35, 0.48],
    position: "left",
    title: {
      EN: "Web Development & Maintenance",
      ID: "Pengembangan Web & Maintenance",
    },
    subtitle: {
      EN: "Building enterprise web applications and maintaining systems according to IT helpdesk requests",
      ID: "Membangun aplikasi web internal dan pemeliharaan sistem sesuai kebutuhan helpdesk",
    },
  },
  {
    progress: [0.52, 0.68],
    position: "right",
    title: { EN: "Building modern web apps", ID: "Membangun aplikasi web modern" },
    subtitle: {
      EN: "Laravel • React • Next.js • Vite • TypeScript • Tailwind • PHP • MySQL",
      ID: "Laravel • React • Next.js • Vite • TypeScript • Tailwind • PHP • MySQL",
    },
  },
  {
    progress: [0.72, 0.85],
    position: "center",
    title: { EN: "Crafting scalable & user-friendly systems", ID: "Merancang sistem yang skalabel & ramah pengguna" },
  },
  {
    progress: [0.9, 1],
    position: "center",
    title: {
      EN: "Let's build something great together",
      ID: "Ayo bangun sesuatu yang hebat bersama",
    },
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
  const frameRef = useRef({ target: 0 });
  const rafRef = useRef<number>(0);
  const { lang } = useLang();

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
      img.decoding = "async";
      img.onload = () => {
        img.decode().catch(() => {}).finally(checkComplete);
      };
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
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let drawnFrame = -1;
    let isVisible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = "high";

      canvasSizeRef.current = {
        width,
        height,
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      };
      // Resizing clears the canvas, so force a redraw
      drawnFrame = -1;
    };

    // Draws only when the frame index actually changes, instead of
    // repainting a full-screen image on every animation frame.
    const renderFrame = () => {
      rafRef.current = 0;
      if (!isVisible) return;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(frameRef.current.target)),
      );
      if (frameIndex === drawnFrame) return;

      const img = imagesRef.current[frameIndex];
      const {
        width: canvasWidth,
        height: canvasHeight,
        isMobile,
      } = canvasSizeRef.current;

      if (
        !img ||
        !img.complete ||
        img.naturalWidth === 0 ||
        !canvasWidth ||
        !canvasHeight
      ) {
        return;
      }

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

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      drawnFrame = frameIndex;
    };

    const requestDraw = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const onResize = () => {
      resize();
      requestDraw();
    };

    // Stop drawing once the hero is scrolled out of view
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) requestDraw();
    });
    observer.observe(container);

    const unsubscribe = smoothProgress.on("change", (v) => {
      frameRef.current.target = v * (TOTAL_FRAMES - 1);
      requestDraw();
    });

    frameRef.current.target = smoothProgress.get() * (TOTAL_FRAMES - 1);
    resize();
    requestDraw();
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
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
              lang={lang}
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
  lang,
}: {
  story: StoryText;
  scrollProgress: ReturnType<typeof useSpring>;
  lang: "EN" | "ID";
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

  const ctaLabel = lang === "EN" ? "View Portfolio" : "Lihat Portofolio";

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 max-w-xl px-4 ${positionClasses[story.position]}`}
      style={{ opacity, y }}
    >
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight drop-shadow-lg">
        {story.title[lang]}
      </h2>
      {story.subtitle && (
        <p className="mt-4 text-base md:text-lg text-white/70 font-light tracking-wide">
          {story.subtitle[lang]}
        </p>
      )}
      {story.cta && (
        <div className="mt-8 flex justify-center">
          <MagneticButton
            className="px-8 py-4 bg-white text-black rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors"
            onClick={() => {
              smoothScrollTo("#projects");
            }}
          >
            {ctaLabel}
          </MagneticButton>
        </div>
      )}
    </motion.div>
  );
}
