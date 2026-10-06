"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, GitCommit, Calendar } from "lucide-react";
import { useLang } from "./LangContext";
import contributionData from "./github-data.json";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function GitHubContributions() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const githubUsername = "RiskiWahyuSaputra";

  const lx = {
    EN: {
      section: "08 / GitHub Activity",
      heading: "Contribution Graph",
      description: "My coding activity and contributions on GitHub",
      viewProfile: "View GitHub Profile",
      totalNote: "826 contributions in the last year",
      less: "Less",
      more: "More",
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
      totalNote: "826 kontribusi dalam 1 tahun terakhir",
      less: "Sedikit",
      more: "Banyak",
      stats: {
        commits: "Commit",
        repos: "Repositori",
        contributions: "Kontribusi",
      },
    },
  }[lang];

  // Hitung posisi label bulan sesuai indeks minggu
  const monthLabels: { index: number; name: string }[] = [];
  let currentMonth = -1;
  contributionData.weeks.forEach((week, weekIndex) => {
    const firstDay = week.days[0];
    if (firstDay) {
      const monthIndex = parseInt(firstDay.date.split("-")[1], 10) - 1;
      if (monthIndex !== currentMonth) {
        monthLabels.push({ index: weekIndex, name: MONTH_NAMES[monthIndex] });
        currentMonth = monthIndex;
      }
    }
  });

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

        {/* GitHub Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          <div className="flex items-center gap-5 p-6 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#21262d] border border-[#30363d]">
              <GitCommit size={24} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">800+</div>
              <div className="text-xs text-[#8b949e] uppercase font-mono tracking-wider mt-0.5">
                {lx.stats.commits}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#21262d] border border-[#30363d]">
              <Code2 size={24} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">35+</div>
              <div className="text-xs text-[#8b949e] uppercase font-mono tracking-wider mt-0.5">
                {lx.stats.repos}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff]/50 transition-colors shadow-lg shadow-black/40">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#21262d] border border-[#30363d]">
              <Calendar size={24} className="text-[#58a6ff]" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">826</div>
              <div className="text-xs text-[#8b949e] uppercase font-mono tracking-wider mt-0.5">
                {lx.stats.contributions}
              </div>
            </div>
          </div>
        </motion.div>

        {/* GitHub Contribution Graph Native - Dark Mode Presisi & Ukuran Proporsional */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="relative rounded-2xl overflow-hidden bg-[#0d1117] border border-[#30363d] p-6 md:p-10 shadow-2xl shadow-black/50"
        >
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#30363d] mb-6 gap-2">
            <div className="text-base md:text-lg font-semibold text-[#e6edf3] tracking-tight">
              {lx.totalNote}
            </div>
            <div className="text-sm font-mono text-[#8b949e]">
              GitHub @{githubUsername}
            </div>
          </div>

          {/* Interactive Heatmap - Memenuhi lebar kontainer secara proporsional */}
          <div className="relative w-full overflow-x-auto pb-4 [scrollbar-width:thin] [scrollbar-color:#30363d_transparent]">
            <div className="w-full min-w-[820px] select-none py-2">
              {/* Header Bulan */}
              <div className="flex pl-10 mb-3 text-xs font-mono text-[#8b949e] relative h-5">
                {monthLabels.map((m) => (
                  <span
                    key={`${m.name}-${m.index}`}
                    style={{ left: `calc(40px + ${(m.index / 53) * 100}%)` }}
                    className="absolute"
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Hari & Kolom Minggu */}
              <div className="flex gap-2">
                {/* Label Hari (Mon, Wed, Fri) */}
                <div className="flex flex-col justify-between pr-2 text-[11px] font-mono text-[#8b949e] w-10 h-[126px] py-1 select-none">
                  <span className="opacity-0">Sun</span>
                  <span>Mon</span>
                  <span className="opacity-0">Tue</span>
                  <span>Wed</span>
                  <span className="opacity-0">Thu</span>
                  <span>Fri</span>
                  <span className="opacity-0">Sat</span>
                </div>

                {/* Kolom Minggu (Scales smoothly to container width) */}
                <div className="grid grid-flow-col auto-cols-fr gap-[3.5px] md:gap-[4px] flex-1">
                  {contributionData.weeks.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-rows-7 gap-[3.5px] md:gap-[4px]">
                      {week.days.map((day) => (
                        <div
                          key={day.date}
                          className="aspect-square w-full min-w-[12px] max-w-[17px] rounded-[3px] transition-transform hover:scale-125 hover:z-10 cursor-pointer"
                          style={{
                            backgroundColor:
                              day.level === 0
                                ? "#161b22"
                                : day.level === 1
                                ? "#0e4429"
                                : day.level === 2
                                ? "#006d32"
                                : day.level === 3
                                ? "#26a641"
                                : "#39d353",
                            outline:
                              day.level === 0
                                ? "1px solid rgba(255,255,255,0.04)"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Legend */}
              <div className="flex items-center justify-end gap-2.5 mt-5 text-xs font-mono text-[#8b949e]">
                <span>{lx.less}</span>
                <div className="flex gap-1 items-center">
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#161b22] border border-white/5" />
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#0e4429]" />
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#006d32]" />
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#26a641]" />
                  <span className="w-3.5 h-3.5 rounded-[3px] bg-[#39d353]" />
                </div>
                <span>{lx.more}</span>
              </div>
            </div>
          </div>

          {/* Floating Tooltip */}
          {hoveredDay && (
            <div
              className="fixed z-50 pointer-events-none px-3 py-1.5 text-xs rounded-lg bg-[#1f242c] text-white border border-[#30363d] shadow-xl -translate-x-1/2 -translate-y-full font-mono transition-opacity"
              style={{ left: hoveredDay.x, top: hoveredDay.y }}
            >
              <div className="font-semibold text-[#58a6ff]">
                {hoveredDay.count} {hoveredDay.count === 1 ? "contribution" : "contributions"}
              </div>
              <div className="text-[11px] text-[#8b949e]">{hoveredDay.date}</div>
            </div>
          )}

          {/* GitHub Streak Stats - Diperbesar agar seimbang */}
          <div className="mt-8 pt-8 border-t border-[#30363d]">
            <div className="flex justify-center">
              <img
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=dark&hide_border=true&background=0d1117&stroke=30363d&ring=58a6ff&fire=58a6ff&currStreakLabel=c9d1d9&sideLabels=c9d1d9&currStreakNum=c9d1d9&sideNums=c9d1d9&dates=8b949e`}
                alt="GitHub Streak"
                className="w-full max-w-3xl rounded-xl"
              />
            </div>
          </div>

          {/* View Profile Button - Lebih proporsional & menonjol */}
          <div className="mt-8 flex justify-center">
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-3 rounded-xl border border-[#30363d] bg-[#21262d] px-7 py-3.5 text-sm font-semibold text-[#c9d1d9] hover:border-[#58a6ff] hover:bg-[#1f6feb] hover:text-white transition-all shadow-md hover:shadow-[#1f6feb]/25"
            >
              <Code2 size={20} />
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
