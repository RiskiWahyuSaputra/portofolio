"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, GitCommit, Calendar } from "lucide-react";
import { useLang } from "./LangContext";

export default function GitHubContributions() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();

  // Ganti dengan username GitHub Anda
  const githubUsername = "RiskiWahyuSaputra";

  const lx = {
    EN: {
      section: "08 / GitHub Activity",
      heading: "Contribution Graph",
      description: "My coding activity and contributions on GitHub",
      viewProfile: "View GitHub Profile",
      stats: {
        commits: "Commits",
        repos: "Repositories",
        contributions: "Contributions",
      },
    },
    ID: {
      section: "08 / Aktivitas GitHub",
      heading: "Grafik Kontribusi",
      description: "Aktivitas coding dan kontribusi saya di GitHub",
      viewProfile: "Lihat Profil GitHub",
      stats: {
        commits: "Commit",
        repos: "Repositori",
        contributions: "Kontribusi",
      },
    },
  }[lang];

  return (
    <section
      ref={ref}
      id="github"
      className="relative py-24 md:py-48 px-6 md:px-12 lg:px-24 bg-[#050505]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-10 md:mb-16"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {lx.section}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            {lx.heading}
          </h2>
          <p className="mt-4 text-base md:text-lg text-white/50 max-w-2xl">
            {lx.description}
          </p>
        </motion.div>

        {/* GitHub Stats Cards - Style GitHub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d]">
              <GitCommit size={20} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">6/year</div>
              <div className="text-xs text-[#8b949e] uppercase tracking-wide">
                {lx.stats.commits}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d]">
              <Code2 size={20} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">41</div>
              <div className="text-xs text-[#8b949e] uppercase tracking-wide">
                {lx.stats.repos}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#21262d] border border-[#30363d]">
              <Calendar size={20} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">2026</div>
              <div className="text-xs text-[#8b949e] uppercase tracking-wide">
                {lx.stats.contributions}
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub Contribution Graph - Style GitHub Asli */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-[#30363d] p-6 md:p-8"
        >
          {/* Contribution Graph - GitHub Style dengan kotak hitam dan hijau */}
          <div className="relative w-full overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#30363d_transparent] bg-[#0d1117] rounded-lg p-4">
            <img
              src={`https://ghchart.rshah.org/239a3b/${githubUsername}`}
              alt="GitHub Contribution Graph"
              className="w-full min-w-[600px]"
              style={{ 
                imageRendering: "crisp-edges",
                mixBlendMode: "screen"
              }}
            />
          </div>

          {/* GitHub Streak Stats - Style GitHub */}
          <div className="mt-6 pt-6 border-t border-[#30363d]">
            <div className="flex justify-center">
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=dark&hide_border=true&background=0d1117&stroke=30363d&ring=58a6ff&fire=58a6ff&currStreakLabel=c9d1d9&sideLabels=c9d1d9&currStreakNum=c9d1d9&sideNums=c9d1d9&dates=8b949e`}
                alt="GitHub Streak"
                className="w-full max-w-2xl rounded-lg"
              />
            </div>
          </div>

          {/* View Profile Button */}
          <div className="mt-8 flex justify-center">
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#21262d] px-6 py-3 text-sm font-medium text-[#c9d1d9] hover:border-[#58a6ff] hover:bg-[#1f6feb] hover:text-white transition-all"
            >
              <Code2 size={18} />
              {lx.viewProfile}
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
