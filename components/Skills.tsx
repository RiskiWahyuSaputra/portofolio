"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, CreditCard, Database, Server } from "lucide-react";

const stackGroups = [
  {
    title: "Frontend",
    icon: Code2,
    description: "Interface, styling, and build workflow",
    count: "06",
    accent: "from-cyan-300/70 via-blue-400/30 to-transparent",
    glow: "from-cyan-500/10 to-blue-500/5",
    iconColor: "text-cyan-200",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "HTML/CSS/JS",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    description: "Application logic, APIs, and realtime systems",
    count: "04",
    accent: "from-red-300/70 via-orange-400/30 to-transparent",
    glow: "from-red-500/10 to-orange-500/5",
    iconColor: "text-red-200",
    items: ["Laravel", "Laravel Reverb", "CodeIgniter", "PHP"],
  },
  {
    title: "Database",
    icon: Database,
    description: "Relational data modeling and persistence",
    count: "02",
    accent: "from-sky-300/70 via-teal-400/30 to-transparent",
    glow: "from-sky-500/10 to-teal-500/5",
    iconColor: "text-sky-200",
    items: ["MySQL", "Migration"],
  },
  {
    title: "Tools & Integration",
    icon: CreditCard,
    description: "Collaboration and production integrations",
    count: "05",
    accent: "from-emerald-300/70 via-lime-400/30 to-transparent",
    glow: "from-emerald-500/10 to-lime-500/5",
    iconColor: "text-emerald-200",
    items: ["GitHub", "Midtrans", "WhatsApp API", "Gemini API", "Groq API"],
  },
];

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="skills"
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-16"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            02 / Skills
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            Tech Stack
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stackGroups.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="group relative min-h-[220px] overflow-hidden rounded-lg border border-white/10 bg-[#101010] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 md:p-6"
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${group.accent}`}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${group.glow} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                      <group.icon size={22} className={group.iconColor} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {group.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-white/45">
                        {group.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-white/30">
                    {group.count}
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-none text-white/70 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
