"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TextReveal from "./TextReveal";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

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
            01 / About
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-4xl font-semibold text-white leading-tight"
            >
              Who I Am
            </motion.h2>
          </div>

          <div className="lg:col-span-8">
            <div className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed">
              <TextReveal
                text="Riski Wahyu Saputra is a Web Developer graduate from Politeknik Negeri Lampung, specializing in modern web application development. With experience at BEST CORPORATION SYARIAH, he builds scalable and efficient systems using modern technologies."
                delay={0.2}
                stagger={0.015}
              />
            </div>

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
