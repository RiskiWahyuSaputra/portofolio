"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useLang } from "./LangContext";

// three.js + physics (~3 MB of JS/WASM) stay out of the initial load
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });
import VariableProximity from "./VariableProximity";
import MagneticButton from "./MagneticButton";
import TextType from "./TextType";

const t = {
  EN: {
    label: "01 / About",
    heading: "Who I Am",
    bio: "Riski Wahyu Saputra is an IT Developer at PT Bandung Eco Sinergi Teknologi. He handles web development and application maintenance based on incoming IT helpdesk tickets, ensuring internal enterprise systems, operational tools, and business workflows run reliably and efficiently.",
  },
  ID: {
    label: "01 / Tentang",
    heading: "Tentang Saya",
    bio: "Riski Wahyu Saputra adalah seorang IT Developer di PT Bandung Eco Sinergi Teknologi. Bertanggung jawab dalam membangun aplikasi web internal sekaligus melakukan pemeliharaan (maintenance) sistem berdasarkan tiket helpdesk yang masuk, memastikan setiap layanan digital dan alur kerja operasional perusahaan berjalan optimal dan andal.",
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
  // CV download — update this path to match the PDF in /public/cv/
  const CV_PATH = "/cv/CV_Riski_Wahyu_Saputra.pdf";

  // Load + mount the 3D lanyard once the visitor has started interacting and
  // then pauses scrolling (or when the section is reached, whichever comes
  // first), so its one-time setup doesn't land mid-scroll or slow page load.
  const [isIdle, setIsIdle] = useState(false);
  const mountLanyard = isIdle || isInView;
  useEffect(() => {
    const SCROLL_QUIET_MS = 500;
    let lastScroll = 0;
    let idleId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const interactionEvents = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
    const onScroll = () => {
      lastScroll = performance.now();
    };
    const onFirstInteraction = () => {
      interactionEvents.forEach((type) =>
        window.removeEventListener(type, onFirstInteraction),
      );
      lastScroll = performance.now();
      tryMount();
    };
    const tryMount = () => {
      if (performance.now() - lastScroll < SCROLL_QUIET_MS) {
        timeoutId = setTimeout(tryMount, 250);
        return;
      }
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(
          () => {
            if (performance.now() - lastScroll < SCROLL_QUIET_MS) tryMount();
            else setIsIdle(true);
          },
          { timeout: 1000 },
        );
      } else {
        setIsIdle(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    interactionEvents.forEach((type) =>
      window.addEventListener(type, onFirstInteraction, { passive: true }),
    );
    return () => {
      window.removeEventListener("scroll", onScroll);
      interactionEvents.forEach((type) =>
        window.removeEventListener(type, onFirstInteraction),
      );
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timeoutId);
    };
  }, []);

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

  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 40]);

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
            y: orbY1,
            background:
              "radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent)",
          }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-1/4 left-10 h-40 w-40 rounded-full opacity-10 blur-3xl"
          style={{
            y: orbY2,
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

              <TextType
                key={tx.bio}
                text={[tx.bio]}
                typingSpeed={16}
                initialDelay={280}
                pauseDuration={1800}
                deletingSpeed={10}
                loop={false}
                showCursor={true}
                cursorCharacter="|"
                startOnVisible={true}
                className="mt-8 max-w-2xl text-xl md:text-2xl lg:text-[1.7rem] font-light text-white/80 leading-relaxed text-justify [text-align-last:left]"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="mt-12 flex max-w-2xl flex-wrap gap-3"
              >
                {[
                  "PT Bandung Eco Sinergi Teknologi",
                  "IT Developer",
                  "Politeknik Negeri Lampung",
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

              {/* Download CV Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-10"
              >
                <a
                  href={CV_PATH}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MagneticButton
                    className="group relative inline-flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-4 text-sm font-medium text-white/80 tracking-wide uppercase backdrop-blur-sm hover:border-white/[0.25] hover:bg-white/[0.08] hover:text-white transition-all duration-300"
                    strength={0.3}
                  >
                    {/* Download icon */}
                    <svg
                      className="h-5 w-5 text-white/60 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    <span>
                      {lang === "ID" ? "Unduh CV Saya" : "Download My CV"}
                    </span>
                    {/* Arrow icon */}
                    <svg
                      className="h-4 w-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </MagneticButton>
                </a>
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
              {mountLanyard && (
                <motion.div
                  initial={{ opacity: 0, y: -140, rotate: -7 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0, rotate: 0 }
                      : { opacity: 0, y: -140, rotate: -7 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 64,
                    damping: 13,
                    mass: 1.15,
                    delay: 0.1,
                  }}
                >
                  <Lanyard
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