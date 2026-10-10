"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { useLang } from "./LangContext";

type Lang = "EN" | "ID";
type Localized = Record<Lang, string>;

interface TimelineEntry {
  kind: "work" | "education";
  period: Localized;
  role: Localized;
  org: string;
  orgNote?: string;
  type: Localized;
  location?: Localized;
  description: Localized;
  skills: string[];
  current?: boolean;
}

const entries: TimelineEntry[] = [
  {
    kind: "work",
    period: { EN: "Aug 2026 — Present", ID: "Agu 2026 — Sekarang" },
    role: {
      EN: "Information Technology Developer",
      ID: "Information Technology Developer",
    },
    org: "BEST Corporation Syariah",
    orgNote: "PT Bandung Eco Sinergi Teknologi",
    type: { EN: "Full-time", ID: "Penuh waktu" },
    location: { EN: "Bandung, West Java · On-site", ID: "Bandung, Jawa Barat · On-site" },
    description: {
      EN: "Building internal web applications and maintaining systems based on incoming helpdesk tickets, keeping every digital service and operational workflow running optimally and reliably.",
      ID: "Membangun aplikasi web internal sekaligus melakukan pemeliharaan (maintenance) sistem berdasarkan tiket helpdesk yang masuk, memastikan setiap layanan digital dan alur kerja operasional perusahaan berjalan optimal dan andal.",
    },
    skills: ["IT Development", "Front-End Design", "Laravel", "React"],
    current: true,
  },
  {
    kind: "work",
    period: { EN: "Feb 2026 — Jul 2026", ID: "Feb 2026 — Jul 2026" },
    role: {
      EN: "Information Technology Developer",
      ID: "Information Technology Developer",
    },
    org: "BEST Corporation Syariah",
    orgNote: "PT Bandung Eco Sinergi Teknologi",
    type: { EN: "Apprenticeship", ID: "Magang" },
    location: { EN: "Bandung, West Java · On-site", ID: "Bandung, Jawa Barat · On-site" },
    description: {
      EN: "Joined the IT team as an apprentice, contributing to internal web application development and day-to-day system maintenance before moving into a full-time role.",
      ID: "Bergabung dengan tim IT sebagai peserta magang, berkontribusi dalam pengembangan aplikasi web internal dan pemeliharaan sistem sehari-hari sebelum diangkat menjadi karyawan penuh waktu.",
    },
    skills: ["Web Development", "JavaScript", "PHP", "MySQL"],
  },
  {
    kind: "education",
    period: { EN: "Education", ID: "Pendidikan" },
    role: {
      EN: "Department of Information Technology",
      ID: "Jurusan Teknologi Informasi",
    },
    org: "Politeknik Negeri Lampung",
    type: { EN: "Diploma", ID: "Diploma" },
    location: { EN: "Bandar Lampung, Lampung", ID: "Bandar Lampung, Lampung" },
    description: {
      EN: "Studied software and web development fundamentals, including building a QRIS-based practicum payment application for the department.",
      ID: "Mempelajari dasar-dasar pengembangan perangkat lunak dan web, termasuk membangun aplikasi pembayaran praktikum berbasis QRIS untuk jurusan.",
    },
    skills: ["Software Engineering", "Web Programming", "Database"],
  },
];

const labels = {
  EN: { section: "07 / Experience", heading: "Career Journey", current: "Current" },
  ID: { section: "07 / Pengalaman", heading: "Perjalanan Karier", current: "Saat ini" },
};

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();
  const lx = labels[lang];

  // The glowing line fills as the timeline scrolls through the viewport
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={ref}
      id="experience"
      className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-14 md:mb-20"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {lx.section}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            {lx.heading}
          </h2>
        </motion.div>

        <div ref={timelineRef} className="relative">
          {/* Base line */}
          <div className="absolute left-[11px] md:left-[180px] top-2 bottom-2 w-px bg-white/10" />
          {/* Glowing progress line */}
          <motion.div
            className="absolute left-[11px] md:left-[180px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
            style={{ scaleY: lineProgress }}
          />

          <ol className="space-y-12 md:space-y-16">
            {entries.map((entry, i) => (
              <TimelineItem
                key={`${entry.org}-${i}`}
                entry={entry}
                lang={lang}
                currentLabel={lx.current}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  entry,
  lang,
  currentLabel,
}: {
  entry: TimelineEntry;
  lang: Lang;
  currentLabel: string;
}) {
  const Icon = entry.kind === "work" ? Briefcase : GraduationCap;

  return (
    <motion.li
      className="relative grid grid-cols-[24px_1fr] md:grid-cols-[180px_1fr] gap-x-6 md:gap-x-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Period (desktop, left of the line) */}
      <div className="hidden md:block pr-10 pt-1 text-right">
        <span className="text-sm font-mono text-white/50 tracking-wide">
          {entry.period[lang]}
        </span>
      </div>

      {/* Node on the line */}
      <span
        className={`absolute left-[5px] md:left-[174px] top-2 h-[13px] w-[13px] rounded-full border ${
          entry.current
            ? "border-cyan-300 bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12),0_0_16px_rgba(34,211,238,0.7)]"
            : "border-white/30 bg-[#050505]"
        }`}
        aria-hidden="true"
      >
        {entry.current && (
          <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-40" />
        )}
      </span>

      <div className="col-start-2">
        <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 transition-colors duration-300 hover:border-cyan-400/25 hover:bg-white/[0.035]">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="md:hidden text-xs font-mono text-white/50 tracking-wide mr-1">
              {entry.period[lang]}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
              <Icon size={12} />
              {entry.type[lang]}
            </span>
            {entry.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                {currentLabel}
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-semibold text-white leading-snug">
            {entry.role[lang]}
          </h3>
          <p className="mt-1 text-base text-white/70">
            {entry.org}
            {entry.orgNote && (
              <span className="text-white/35"> · {entry.orgNote}</span>
            )}
          </p>
          {entry.location && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/40">
              <MapPin size={13} />
              {entry.location[lang]}
            </p>
          )}

          <p className="mt-5 text-sm md:text-base font-light text-white/60 leading-relaxed">
            {entry.description[lang]}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {entry.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/[0.08] px-3 py-1 text-xs font-mono text-white/45 transition-colors duration-300 group-hover:text-white/65"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.li>
  );
}
