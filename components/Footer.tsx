"use client";

import { motion } from "framer-motion";
import { useLang } from "./LangContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { lang } = useLang();

  return (
    <footer className="relative py-12 px-6 md:px-12 lg:px-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-2 md:gap-4"
        >
          <span className="text-lg font-semibold text-white">
            Riski Wahyu Saputra.
          </span>
          <span className="text-white/30 hidden md:inline">|</span>
          <span className="text-sm text-white/40">
            {lang === "EN"
              ? "IT Developer | Full Stack Web Developer"
              : "IT Developer | Full Stack Web Developer"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-6"
        >
          <a
            href="https://github.com/RiskiWahyuSaputra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/riski-wahyu-saputra-6a9078294/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:kiik37734@gmail.com"
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Email
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xs text-white/20"
        >
          © {currentYear} Riski Wahyu Saputra
        </motion.p>
      </div>
    </footer>
  );
}
