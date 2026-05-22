"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "./LangContext";
import Lanyard from "./Lanyard";

const t = {
  EN: {
    label: "01 / About",
    heading: "Who I Am",
    bio: "Riski Wahyu Saputra is a Web Developer graduate from Politeknik Negeri Lampung, specializing in modern web application development. With experience at BEST CORPORATION SYARIAH, he builds scalable and efficient systems using modern technologies.",
  },
  ID: {
    label: "01 / Tentang",
    heading: "Tentang Saya",
    bio: "Riski Wahyu Saputra adalah seorang Web Developer lulusan Politeknik Negeri Lampung, yang berspesialisasi dalam pengembangan aplikasi web modern. Dengan pengalaman di BEST CORPORATION SYARIAH, ia membangun sistem yang skalabel dan efisien menggunakan teknologi terkini.",
  },
};

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-16"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {tx.label}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
            >
              {tx.heading}
            </motion.h2>

            {/* Lanyard 3D Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="mt-8 md:mt-12"
            >
              <Lanyard position={[0, 0, 18]} gravity={[0, -40, 0]} height={520} />
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <TypingText
              key={tx.bio}
              text={tx.bio}
              active={isInView}
              delay={450}
              speed={34}
              className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <div className="px-6 py-3 border border-white/10 rounded-full text-sm text-white/60">
                Politeknik Negeri Lampung
              </div>
              <div className="px-6 py-3 border border-white/10 rounded-full text-sm text-white/60">
                Management Informatics
              </div>
              <div className="px-6 py-3 border border-white/10 rounded-full text-sm text-white/60">
                Information Technology
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
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

  useEffect(() => {
    if (!active) {
      return;
    }

    let index = 0;
    let typingTimer: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      typingTimer = setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));

        if (index >= text.length && typingTimer) {
          clearInterval(typingTimer);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      if (typingTimer) {
        clearInterval(typingTimer);
      }
    };
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
