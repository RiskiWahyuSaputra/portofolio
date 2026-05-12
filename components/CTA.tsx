"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "./LangContext";

const t = {
  EN: {
    label: "Get In Touch",
    heading: "Let's work\ntogether",
    sub: "I'm open for opportunities & freelance projects",
    cta: "Contact Me",
    github: "View GitHub",
  },
  ID: {
    label: "Hubungi Saya",
    heading: "Mari bekerja\nbersama",
    sub: "Saya terbuka untuk peluang kerja & proyek freelance",
    cta: "Hubungi Saya",
    github: "Lihat GitHub",
  },
};

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();
  const tx = t[lang];

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {tx.label}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          className="mt-6 text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight whitespace-pre-line"
        >
          {tx.heading}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="mt-6 text-lg md:text-xl text-white/50 font-light"
        >
          {tx.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            className="px-8 py-4 bg-white text-black rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors flex items-center gap-2"
            onClick={() => { window.location.href = "mailto:kiik37734@gmail.com"; }}
          >
            {tx.cta}
            <ArrowUpRight size={16} />
          </MagneticButton>

          <a
            href="https://github.com/RiskiWahyuSaputra"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 text-white rounded-full text-sm font-medium tracking-wide hover:bg-white/5 transition-colors"
          >
            {tx.github}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/5"
        >
          <p className="text-white/30 text-sm">kiik37734@gmail.com</p>
        </motion.div>
      </div>
    </section>
  );
}
