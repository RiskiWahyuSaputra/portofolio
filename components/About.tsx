"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLang } from "./LangContext";
import Lanyard from "./Lanyard";
import VariableProximity from "./VariableProximity";

const t = {
  EN: {
    label: "01 / About",
    heading: "Who I Am",
    bio: "Riski Wahyu Saputra is an IT Developer/Fullstack Web Developer graduate from Politeknik Negeri Lampung, specializing in modern web application development. With experience at BEST CORPORATION SYARIAH, he builds scalable and efficient systems using modern technologies.",
  },
  ID: {
    label: "01 / Tentang",
    heading: "Tentang Saya",
    bio: "Riski Wahyu Saputra adalah seorang IT Developer lulusan Politeknik Negeri Lampung, yang berspesialisasi dalam pengembangan aplikasi web modern. Dengan pengalaman di BEST CORPORATION SYARIAH, ia membangun sistem yang skalabel dan efisien menggunakan teknologi terkini.",
  },
};

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
      style={{ scaleX }}
    />
  );
}

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const headingContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { lang } = useLang();
  const tx = t[lang];

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lanyardY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const lanyardRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const lanyardOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.6, 1, 1, 0.6],
  );

  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.5, 1, 1, 0.5],
  );

  const bgGlowY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgGlowOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.3, 0.8, 0.8, 0.3],
  );

  return (
    <>
      <ScrollProgressBar />
      <section
        ref={ref}
        id="about"
        className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505] overflow-hidden"
      >
        {/* Parallax background glow */}
        <motion.div
          className="pointer-events-none absolute -top-1/2 left-1/2 -translate-x-1/2 h-[800px] w-[800px] md:h-[1000px] md:w-[1000px] rounded-full"
          style={{
            y: bgGlowY,
            opacity: bgGlowOpacity,
            background:
              "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)",
          }}
        />

        {/* Floating orbs */}
        <motion.div
          className="pointer-events-none absolute top-1/4 right-10 h-32 w-32 rounded-full opacity-10 blur-3xl"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -60]),
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-1/4 left-10 h-40 w-40 rounded-full opacity-10 blur-3xl"
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, 40]),
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
              className="text-sm font-mono text-white/40 tracking-widest uppercase"
            >
              {tx.label}
            </motion.span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
            {/* Text column with parallax */}
            <motion.div
              className="lg:col-span-6"
              style={{ y: textY, opacity: textOpacity }}
            >
              <div ref={headingContainerRef} style={{ position: "relative" }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                >
                  <VariableProximity
                    label={tx.heading}
                    className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight"
                    fromFontVariationSettings="'wght' 300, 'opsz' 9"
                    toFontVariationSettings="'wght' 900, 'opsz' 40"
                    containerRef={headingContainerRef}
                    radius={120}
                    falloff="gaussian"
                  />
                </motion.div>
              </div>

              <TypingText
                key={tx.bio}
                text={tx.bio}
                active={isInView}
                delay={280}
                speed={16}
                className="mt-8 max-w-2xl text-xl md:text-2xl lg:text-[1.7rem] font-light text-white/80 leading-relaxed text-justify [text-align-last:left]"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-12 flex max-w-2xl flex-wrap gap-3"
              >
                {[
                  "Politeknik Negeri Lampung",
                  "Management Informatics",
                  "Information Technology",
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-all duration-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Lanyard column with parallax */}
            <motion.div
              style={{
                y: lanyardY,
                rotate: lanyardRotate,
                opacity: lanyardOpacity,
              }}
              className="min-h-[440px] md:min-h-[560px] lg:col-span-6 lg:-my-24 lg:min-h-[640px]"
            >
              {isInView && (
                <motion.div
                  initial={{ opacity: 0, y: -140, rotate: -7 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 64,
                    damping: 13,
                    mass: 1.15,
                    delay: 0.1,
                  }}
                >
                  <Lanyard
                    key="about-lanyard-drop"
                    position={[0, 0, 14]}
                    gravity={[0, -40, 0]}
                    fov={18}
                    height="clamp(440px, 58vw, 720px)"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent" />
      </section>
    </>
  );
}

function TypingText({
  text,
  active,
  className = "",
  delay = 0,
  speed = 40,
}: {
  text: string;
  active: boolean;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [visibleText, setVisibleText] = useState("");
  const visibleRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    let rafId: number;
    let startTime: number | null = null;
    let delayElapsed = false;
    let delayStartTime: number | null = null;

    const tick = (timestamp: number) => {
      if (!delayElapsed) {
        if (delayStartTime === null) delayStartTime = timestamp;
        if (timestamp - delayStartTime >= delay) {
          delayElapsed = true;
          startTime = timestamp;
        }
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const targetIndex = Math.min(Math.floor(elapsed / speed), text.length);

      if (targetIndex > visibleRef.current) {
        visibleRef.current = targetIndex;
        setVisibleText(text.slice(0, targetIndex));
      }

      if (visibleRef.current < text.length) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [active, delay, speed, text]);

  return (
    <p aria-label={text} className={`grid ${className}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {visibleText}
        <motion.span
          className="ml-1 inline-block h-[0.9em] w-px translate-y-[0.12em] bg-white/70"
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </span>
    </p>
  );
}
