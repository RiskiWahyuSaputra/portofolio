"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2,
  Database,
  Palette,
  GitBranch,
  Layers,
  Server,
  Boxes,
  FileCode,
} from "lucide-react";

const skills = [
  {
    name: "Laravel",
    icon: Layers,
    description: "Modern PHP framework for robust applications",
    color: "from-red-500/20 to-orange-500/20",
    border: "hover:border-red-500/40",
  },
  {
    name: "Next.js",
    icon: Server,
    description:
      "Next.js is a JavaScript framework based on React that is used to build modern web applications",
    color: "from-red-500/20 to-orange-500/20",
    border: "hover:border-red-500/40",
  },
  {
    name: "CodeIgniter",
    icon: Server,
    description: "Lightweight framework for rapid development",
    color: "from-orange-500/20 to-yellow-500/20",
    border: "hover:border-orange-500/40",
  },
  {
    name: "React",
    icon: Code2,
    description: "Component-based UI library",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "hover:border-cyan-500/40",
  },
  {
    name: "Tailwind CSS",
    icon: Palette,
    description: "Utility-first CSS framework",
    color: "from-sky-500/20 to-indigo-500/20",
    border: "hover:border-sky-500/40",
  },
  {
    name: "PHP",
    icon: FileCode,
    description: "Server-side scripting language",
    color: "from-indigo-500/20 to-purple-500/20",
    border: "hover:border-indigo-500/40",
  },
  {
    name: "MySQL",
    icon: Database,
    description: "Relational database management",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/40",
  },
  {
    name: "GitHub",
    icon: GitBranch,
    description: "Version control & collaboration",
    color: "from-gray-500/20 to-slate-500/20",
    border: "hover:border-gray-500/40",
  },
  {
    name: "HTML, CSS, JS",
    icon: Boxes,
    description: "Core web technologies",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "hover:border-yellow-500/40",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.33, 1, 0.68, 1],
              }}
              className={`group relative p-6 rounded-2xl bg-[#111] border border-white/5 ${skill.border} hover:border-white/20 transition-all duration-500 cursor-default`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <skill.icon
                  size={28}
                  className="text-white/60 group-hover:text-white transition-colors duration-300"
                />
                <h3 className="mt-4 text-lg font-medium text-white">
                  {skill.name}
                </h3>
                <p className="mt-2 text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  {skill.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
