"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, CreditCard, Database, Server } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiVite,
  SiTailwindcss,
  SiJavascript,
  SiLaravel,
  SiCodeigniter,
  SiPhp,
  SiMysql,
  SiGithub,
  SiWhatsapp,
  SiGooglegemini,
  SiStripe,
} from "react-icons/si";

type SkillItem = {
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
};

const itemIcons: Record<string, SkillItem> = {
  React: {
    name: "React",
    icon: SiReact,
    color: "#61DAFB",
  },
  "Next.js": {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#ffffff",
  },
  TypeScript: {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
  },
  Vite: {
    name: "Vite",
    icon: SiVite,
    color: "#646CFF",
  },
  "Tailwind CSS": {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "#06B6D4",
  },
  "HTML/CSS/JS": {
    name: "HTML/CSS/JS",
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  Laravel: {
    name: "Laravel",
    icon: SiLaravel,
    color: "#FF2D20",
  },
  "Laravel Reverb": {
    name: "Laravel Reverb",
    icon: SiLaravel,
    color: "#FF2D20",
  },
  CodeIgniter: {
    name: "CodeIgniter",
    icon: SiCodeigniter,
    color: "#EF4223",
  },
  PHP: {
    name: "PHP",
    icon: SiPhp,
    color: "#777BB4",
  },
  MySQL: {
    name: "MySQL",
    icon: SiMysql,
    color: "#4479A1",
  },
  Migration: {
    name: "Migration",
    icon: SiMysql,
    color: "#4479A1",
  },
  "SQL Server": {
    name: "SQL Server",
    icon: SiMysql,
    color: "#CC2927",
  },
  GitHub: {
    name: "GitHub",
    icon: SiGithub,
    color: "#ffffff",
  },
  Midtrans: {
    name: "Midtrans",
    icon: SiStripe,
    color: "#00897B",
  },
  "WhatsApp API": {
    name: "WhatsApp API",
    icon: SiWhatsapp,
    color: "#25D366",
  },
  "Gemini API": {
    name: "Gemini API",
    icon: SiGooglegemini,
    color: "#4285F4",
  },
  "Groq API": {
    name: "Groq API",
    icon: SiGooglegemini,
    color: "#F55036",
  },
};

const stackGroups = [
  {
    title: "Frontend",
    icon: Code2,
    description: "Interface, styling, and build workflow",
    count: "06",
    accent: "from-cyan-400/30 via-blue-500/20 to-transparent",
    glow: "group-hover:from-cyan-500/15 group-hover:to-blue-500/8",
    iconColor: "text-cyan-300",
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
    accent: "from-red-400/30 via-orange-500/20 to-transparent",
    glow: "group-hover:from-red-500/15 group-hover:to-orange-500/8",
    iconColor: "text-red-300",
    items: ["Laravel", "Laravel Reverb", "CodeIgniter", "PHP"],
  },
  {
    title: "Database",
    icon: Database,
    description: "Relational data modeling and persistence",
    count: "03",
    accent: "from-sky-400/30 via-teal-500/20 to-transparent",
    glow: "group-hover:from-sky-500/15 group-hover:to-teal-500/8",
    iconColor: "text-sky-300",
    items: ["MySQL", "Migration", "SQL Server"],
  },
  {
    title: "Tools & Integration",
    icon: CreditCard,
    description: "Collaboration and production integrations",
    count: "05",
    accent: "from-emerald-400/30 via-lime-500/20 to-transparent",
    glow: "group-hover:from-emerald-500/15 group-hover:to-lime-500/8",
    iconColor: "text-emerald-300",
    items: ["GitHub", "Midtrans", "WhatsApp API", "Gemini API", "Groq API"],
  },
];

function SkillBadge({ name }: { name: string }) {
  const skill = itemIcons[name];
  if (!skill) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/60 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/85">
        {name}
      </span>
    );
  }

  const Icon = skill.icon;
  return (
    <motion.span
      className="group/badge relative inline-flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white/60 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.07] hover:text-white/85 cursor-default"
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {/* Glow on hover */}
      <span
        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover/badge:opacity-20"
        style={{
          background: `radial-gradient(100px at 50% 50%, ${skill.color}22, transparent)`,
        }}
      />
      <span style={{ color: skill.color }} className="relative z-[1] flex items-center transition-all duration-300 group-hover/badge:scale-110">
        <Icon size={16} />
      </span>
      <span className="relative z-[1]">{name}</span>
    </motion.span>
  );
}

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="skills"
      className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]"
    >
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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

        {/* Bento grid: first card spans full width on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {stackGroups.map((group, index) => {
            const isFullWidth = index === 0;

            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className={`group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0d0d0d] p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14] md:p-7 ${
                  isFullWidth ? "md:col-span-2" : ""
                }`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r ${group.accent}`}
                />
                {/* Hover glow background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 ${group.glow}`}
                />

                <div className="relative z-10 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] transition-all duration-300 group-hover:border-white/[0.15] group-hover:bg-white/[0.06]">
                        <group.icon size={22} className={group.iconColor} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {group.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-white/40">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white/20 group-hover:text-white/40 transition-colors duration-300">
                      {group.count}
                    </span>
                  </div>

                  {/* Skills grid with icons */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <SkillBadge key={item} name={item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
