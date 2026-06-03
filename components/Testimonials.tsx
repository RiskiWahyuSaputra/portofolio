"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLang } from "./LangContext";

type Testimonial = {
  quote: { EN: string; ID: string };
  author: string;
  role: { EN: string; ID: string };
};

const testimonials: Testimonial[] = [
  {
    quote: {
      EN: "Riski delivered an exceptional e-commerce platform that streamlined our entire sales process. His attention to detail and technical expertise are outstanding.",
      ID: "Riski menghadirkan platform e-commerce luar biasa yang menyelesaikan seluruh proses penjualan kami. Perhatian terhadap detail dan keahlian teknisnya sangat mengesankan.",
    },
    author: "Project Manager",
    role: { EN: "BEST CORPORATION SYARIAH", ID: "BEST CORPORATION SYARIAH" },
  },
  {
    quote: {
      EN: "The school management system Riski built transformed how we handle student data. It's intuitive, fast, and incredibly reliable.",
      ID: "Sistem manajemen sekolah yang dibangun Riski mengubah cara kami mengelola data siswa. Intuitif, cepat, dan sangat andal.",
    },
    author: "Academic Coordinator",
    role: { EN: "Educational Institution", ID: "Institusi Pendidikan" },
  },
  {
    quote: {
      EN: "Working with Riski was a great experience. He understood our requirements perfectly and delivered a scalable inventory solution ahead of schedule.",
      ID: "Bekerja dengan Riski adalah pengalaman yang luar biasa. Ia memahami kebutuhan kami dengan sempurna dan menghadirkan solusi inventaris yang skalabel lebih cepat dari jadwal.",
    },
    author: "Operations Lead",
    role: { EN: "Retail Company", ID: "Perusahaan Ritel" },
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const sectionLabel = lang === "EN" ? "Testimonials" : "Testimoni";
  const heading = lang === "EN" ? "What People Say" : "Apa Kata Mereka";

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {sectionLabel}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            {heading}
          </h2>
        </motion.div>

        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
              <Quote size={40} className="text-white/10 mb-6" />
              <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed max-w-3xl">
                "{testimonials[current].quote[lang]}"
              </p>
              <div className="mt-8">
                <p className="text-white font-medium">
                  {testimonials[current].author}
                </p>
                <p className="text-sm text-white/40 mt-1">
                  {testimonials[current].role[lang]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-white w-8"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
