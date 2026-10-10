"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "./LangContext";

type Lang = "EN" | "ID";

const PROMPT_USER = "kiyu@portfolio";
const CAREER_START = new Date(2026, 1, 1); // Feb 2026, start of apprenticeship

const LINKS = {
  whatsapp: "https://wa.me/6285789910963",
  linkedin: "https://www.linkedin.com/in/riski-wahyu-saputra-6a9078294/",
  github: "https://github.com/RiskiWahyuSaputra",
  email: "mailto:kiik37734@gmail.com",
};

const TECH = [
  { name: "PHP", version: "8.2", group: "backend" },
  { name: "Laravel", version: "12", group: "backend" },
  { name: "MySQL", version: "—", group: "database" },
  { name: "Next.js", version: "16", group: "frontend" },
  { name: "React", version: "19", group: "frontend" },
  { name: "TypeScript", version: "5", group: "frontend" },
  { name: "Tailwind CSS", version: "4", group: "frontend" },
  { name: "Linux", version: "Ubuntu", group: "os" },
];

const RECENT_PROJECTS = [
  "Best Warehouse",
  "Best Finance",
  "Best Arsip",
  "BEST CSO",
  "Sekretariat (E-Signature)",
];

const QUICK_COMMANDS = ["help", "whoami", "tech", "stats", "contact", "clear"];

const t = {
  EN: {
    section: "10 / Terminal",
    heading: "Talk to my terminal",
    sub: "Type a command or tap one of the shortcuts below.",
    welcome: "Welcome! Type 'help' to see available commands.",
    placeholder: "type a command…",
    help: {
      help: "show this list",
      whoami: "who am I",
      tech: "tools & versions I work with",
      stats: "uptime & recent projects",
      contact: "open WhatsApp & show contact links",
      clear: "clear the terminal",
    },
    whoami: "Riski Wahyu Saputra — IT Developer at BEST Corporation Syariah (Bandung).",
    notFound: (cmd: string) => `command not found: ${cmd}. Try 'help'.`,
    sudo: "Nice try. This incident will be reported. 🙂",
    status: "status",
    online: "online · open to opportunities",
    uptime: "uptime",
    since: "since Feb 2026",
    months: "mo",
    days: "d",
    personal: "personal projects",
    work: "enterprise systems maintained",
    contributions: "GitHub contributions (last year)",
    recent: "recent projects",
    opening: "Opening WhatsApp in a new tab…",
  },
  ID: {
    section: "10 / Terminal",
    heading: "Coba terminal saya",
    sub: "Ketik perintah atau klik salah satu shortcut di bawah.",
    welcome: "Selamat datang! Ketik 'help' untuk melihat daftar perintah.",
    placeholder: "ketik perintah…",
    help: {
      help: "tampilkan daftar ini",
      whoami: "siapa saya",
      tech: "tools & versi yang saya gunakan",
      stats: "uptime & proyek terkini",
      contact: "buka WhatsApp & tampilkan kontak",
      clear: "bersihkan terminal",
    },
    whoami: "Riski Wahyu Saputra — IT Developer di BEST Corporation Syariah (Bandung).",
    notFound: (cmd: string) => `perintah tidak ditemukan: ${cmd}. Coba 'help'.`,
    sudo: "Usaha yang bagus. Kejadian ini akan dilaporkan. 🙂",
    status: "status",
    online: "online · terbuka untuk peluang",
    uptime: "uptime",
    since: "sejak Feb 2026",
    months: "bln",
    days: "hr",
    personal: "proyek personal",
    work: "sistem enterprise dikelola",
    contributions: "kontribusi GitHub (1 tahun)",
    recent: "proyek terkini",
    opening: "Membuka WhatsApp di tab baru…",
  },
};

type Line = { id: number; kind: "input" | "output"; content: React.ReactNode };

function getUptime() {
  const now = new Date();
  let months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    (now.getMonth() - CAREER_START.getMonth());
  let days = now.getDate() - CAREER_START.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  return { months: Math.max(0, months), days };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-40 shrink-0 text-cyan-300/80 sm:w-56">{label}</span>
      <span className="text-white/80">{value}</span>
    </div>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-cyan-300"
    >
      {children}
    </a>
  );
}

function runCommand(raw: string, lang: Lang): React.ReactNode | "clear" | null {
  const tx = t[lang];
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return null;

  switch (cmd) {
    case "help":
      return (
        <div className="space-y-0.5">
          {Object.entries(tx.help).map(([name, desc]) => (
            <Row key={name} label={name} value={<span className="text-white/60">{desc}</span>} />
          ))}
        </div>
      );
    case "whoami":
      return <span className="text-white/80">{tx.whoami}</span>;
    case "tech":
      return (
        <div className="space-y-0.5">
          {TECH.map((tool) => (
            <div key={tool.name} className="flex gap-3">
              <span className="w-28 shrink-0 text-white/85">{tool.name}</span>
              <span className="w-16 shrink-0 text-emerald-300">{tool.version}</span>
              <span className="text-white/35">{tool.group}</span>
            </div>
          ))}
        </div>
      );
    case "stats": {
      const { months, days } = getUptime();
      return (
        <div className="space-y-0.5">
          <Row
            label={tx.status}
            value={
              <span className="inline-flex items-center gap-2 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                {tx.online}
              </span>
            }
          />
          <Row
            label={tx.uptime}
            value={`${months}${tx.months} ${days}${tx.days} (${tx.since})`}
          />
          <Row label={tx.personal} value="13+" />
          <Row label={tx.work} value="6" />
          <Row label={tx.contributions} value="826" />
          <Row label={tx.recent} value={RECENT_PROJECTS.join(" · ")} />
        </div>
      );
    }
    case "contact":
      window.open(LINKS.whatsapp, "_blank", "noopener,noreferrer");
      return (
        <div className="space-y-0.5">
          <span className="text-emerald-300">{tx.opening}</span>
          <Row label="whatsapp" value={<ExtLink href={LINKS.whatsapp}>+62 857-8991-0963</ExtLink>} />
          <Row label="linkedin" value={<ExtLink href={LINKS.linkedin}>riski-wahyu-saputra</ExtLink>} />
          <Row label="github" value={<ExtLink href={LINKS.github}>RiskiWahyuSaputra</ExtLink>} />
          <Row label="email" value={<ExtLink href={LINKS.email}>kiik37734@gmail.com</ExtLink>} />
        </div>
      );
    case "clear":
      return "clear";
    default:
      if (cmd.startsWith("sudo")) return <span className="text-amber-300">{tx.sudo}</span>;
      return <span className="text-rose-300">{tx.notFound(raw.trim().split(/\s+/)[0])}</span>;
  }
}

export default function Terminal() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { lang } = useLang();
  const tx = t[lang];

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const idRef = useRef(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest output visible without scrolling the page itself
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const execute = (raw: string) => {
    const result = runCommand(raw, lang);
    if (raw.trim()) {
      setHistory((prev) => [...prev, raw.trim()]);
    }
    setHistoryIndex(-1);
    setInput("");

    if (result === "clear") {
      setLines([]);
      return;
    }

    const next: Line[] = [{ id: idRef.current++, kind: "input", content: raw }];
    if (result) next.push({ id: idRef.current++, kind: "output", content: result });
    setLines((prev) => [...prev, ...next]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const prompt = (
    <span className="shrink-0">
      <span className="text-emerald-400">{PROMPT_USER}</span>
      <span className="text-white/40">:</span>
      <span className="text-sky-400">~</span>
      <span className="text-white/40">$</span>
    </span>
  );

  return (
    <section
      ref={ref}
      id="terminal"
      className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-[#050505]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="mb-10 md:mb-14"
        >
          <span className="text-sm font-mono text-white/40 tracking-widest uppercase">
            {tx.section}
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-white">
            {tx.heading}
          </h2>
          <p className="mt-4 text-white/50">{tx.sub}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] shadow-[0_0_0_1px_rgba(34,211,238,0.04),0_20px_80px_-20px_rgba(34,211,238,0.15)]"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs font-mono text-white/40">
              {PROMPT_USER}: ~ — zsh
            </span>
          </div>

          {/* Output */}
          <div
            ref={outputRef}
            data-lenis-prevent
            onClick={() => {
              if (!window.getSelection()?.toString()) {
                inputRef.current?.focus({ preventScroll: true });
              }
            }}
            className="h-[340px] md:h-[380px] overflow-y-auto overscroll-contain px-4 md:px-6 py-5 font-mono text-[13px] md:text-sm leading-relaxed cursor-text [scrollbar-width:thin] [scrollbar-color:#333_transparent]"
          >
            <p className="text-white/50">{tx.welcome}</p>

            {lines.map((line) =>
              line.kind === "input" ? (
                <div key={line.id} className="mt-3 flex flex-wrap gap-x-2">
                  {prompt}
                  <span className="break-all text-white">{line.content}</span>
                </div>
              ) : (
                <div key={line.id} className="mt-1 overflow-x-auto">
                  {line.content}
                </div>
              ),
            )}

            <div className="mt-3 flex items-center gap-2">
              {prompt}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tx.placeholder}
                aria-label={tx.placeholder}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="min-w-0 flex-1 bg-transparent text-white caret-cyan-300 outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Quick commands */}
          <div className="flex flex-wrap gap-2 border-t border-white/[0.06] bg-white/[0.015] px-4 md:px-6 py-3">
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => execute(cmd)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-white/60 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {cmd}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
