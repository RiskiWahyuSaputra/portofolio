"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "./LangContext";
import { StatCats, type StatCatKind } from "./StatCats";

const stats: { value: number; suffix: string; label: { EN: string; ID: string }; cat: StatCatKind }[] = [
  { value: 13, suffix: "+", label: { EN: "Projects", ID: "Proyek" }, cat: "projects" },
  { value: 20, suffix: "+", label: { EN: "Skills", ID: "Keahlian" }, cat: "skills" },
  { value: 1, suffix: "", label: { EN: "Company", ID: "Perusahaan" }, cat: "company" },
  { value: 100, suffix: "%", label: { EN: "Dedication", ID: "Dedikasi" }, cat: "dedication" },
];

function CountUp({
  target,
  suffix,
  isInView,
  children,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
  children?: ReactNode;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span className="relative tabular-nums">
      {count}
      {suffix}
      {children}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  // Cats' idle animations only run while the section is on screen
  const isOnScreen = useInView(ref);
  const { lang } = useLang();

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a] border-y border-white/5"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 md:gap-12 ${isInView ? "ctacats--on" : ""} ${isOnScreen ? "" : "ctacats--paused"}`}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label[lang]}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  isInView={isInView}
                >
                  <StatCats kind={stat.cat} />
                </CountUp>
              </div>
              <div className="mt-2 text-sm text-white/40 tracking-wide uppercase">
                {stat.label[lang]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
