"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "./LangContext";

interface PreloaderProps {
  progress: number;
  isComplete: boolean;
}

export default function Preloader({ progress, isComplete }: PreloaderProps) {
  const { lang } = useLang();
  const loadingText = lang === "EN" ? "Loading Experience" : "Memuat Pengalaman";

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-center">
              <h2 className="text-2xl font-light tracking-[0.2em] text-white/90 uppercase mb-2">
                Riski Wahyu Saputra
              </h2>
              <p className="text-sm text-white/40 tracking-widest uppercase">
                {loadingText}
              </p>
            </div>

            <div className="relative w-64 h-[2px] bg-white/10 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white/80"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: "linear" }}
              />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-white tabular-nums">
                {Math.round(progress)}
              </span>
              <span className="text-lg text-white/40">%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
