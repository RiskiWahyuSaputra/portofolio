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
const FRAME_PATH = (i: number, isMobile: boolean) =>
  `/sequence/${isMobile ? "mobile" : "desktop"}/${String(i + 1).padStart(3, "0")}.webp`;
// Frames load coarse-to-fine: every 8th first (enough to start), then fill in
const LOAD_STRIDES = [8, 4, 2, 1];
const LOAD_CONCURRENCY = 6;

function getLoadOrder() {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const stride of LOAD_STRIDES) {
    for (let i = 0; i < TOTAL_FRAMES; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(TOTAL_FRAMES - 1)) order.splice(1, 0, TOTAL_FRAMES - 1);
  return order;
}

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
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
  const onFrameLoadedRef = useRef<() => void>(() => {});
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

  // Load frames progressively; the hero is usable after the first pass
  useEffect(() => {
    let cancelled = false;
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const order = getLoadOrder();
    const firstPass = Math.ceil(TOTAL_FRAMES / LOAD_STRIDES[0]);
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let next = 0;
    let done = 0;
    let started = LOAD_CONCURRENCY;
    // The remaining frames are only fetched once the visitor interacts, so
    // the initial page load stays light.
    let unlocked = false;
    const interactionEvents = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;

    const loadNext = () => {
      if (cancelled || next >= order.length) return;
      if (!unlocked && next >= firstPass) {
        started--;
        return;
      }
      const index = order[next++];
      const img = new Image();
      img.decoding = "async";
      const finish = (ok: boolean) => {
        if (cancelled) return;
        if (ok) {
          images[index] = img;
          loadedRef.current[index] = true;
          onFrameLoadedRef.current();
        }
        done++;
        if (done <= firstPass) {
          setProgress((done / firstPass) * 100);
          if (done === firstPass) setIsLoaded(true);
        }
        loadNext();
      };
      img.onload = () => {
        img.decode().then(() => finish(true), () => finish(true));
      };
      img.onerror = () => finish(false);
      img.src = FRAME_PATH(index, isMobile);
    };

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      interactionEvents.forEach((type) => window.removeEventListener(type, unlock));
      while (started < LOAD_CONCURRENCY) {
        started++;
        loadNext();
      }
    };
    interactionEvents.forEach((type) =>
      window.addEventListener(type, unlock, { passive: true }),
    );

    for (let i = 0; i < LOAD_CONCURRENCY; i++) loadNext();

    return () => {
      cancelled = true;
      interactionEvents.forEach((type) => window.removeEventListener(type, unlock));
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

      const wanted = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(frameRef.current.target)),
      );
      // Fall back to the nearest frame that has finished loading
      let frameIndex = -1;
      for (let d = 0; d < TOTAL_FRAMES; d++) {
        if (loadedRef.current[wanted - d]) {
          frameIndex = wanted - d;
          break;
        }
        if (loadedRef.current[wanted + d]) {
          frameIndex = wanted + d;
          break;
        }
      }
      if (frameIndex === -1 || frameIndex === drawnFrame) return;

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

    onFrameLoadedRef.current = requestDraw;
    frameRef.current.target = smoothProgress.get() * (TOTAL_FRAMES - 1);
    resize();
    requestDraw();
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      onFrameLoadedRef.current = () => {};
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
