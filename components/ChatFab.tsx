"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { useLang } from "./LangContext";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type ChatResponse = {
  reply?: string;
  error?: string;
};

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

export default function ChatFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { lang } = useLang();

  const welcomeMessage = lang === "EN"
    ? "Hello! I'm Kiyu Assistant. I'm here to share details about Riski — his work as an IT Developer at PT Bandung Eco Sinergi Teknologi, his projects, skills, and contact info. What would you like to know?"
    : "Halo! Saya Kiyu Assistant. Saya siap berbagi informasi seputar Riski — pekerjaannya sebagai IT Developer di PT Bandung Eco Sinergi Teknologi, proyek, keahlian, dan kontaknya. Ada yang ingin kamu tanyakan?";

  const suggestionChips = lang === "EN"
    ? [
        { label: "📄 Download CV / Resume", query: "Can I download Riski's CV / resume?" },
        { label: "🏢 Experience at BEST CORP", query: "What is Riski's experience and role at PT Bandung Eco Sinergi Teknologi?" },
        { label: "💻 Remote / WFH / WFO?", query: "Is Riski open for Remote, WFH, or WFO work arrangements?" },
        { label: "🚀 Services & Freelance", query: "What services can Riski build, and is he open for freelance projects?" },
        { label: "💬 Contact via WhatsApp", query: "How can I contact Riski on WhatsApp?" },
      ]
    : [
        { label: "📄 Unduh CV / Resume", query: "Boleh lihat dan download CV / resume Riski?" },
        { label: "🏢 Pengalaman di BEST CORP", query: "Apa saja pengalaman dan tanggung jawab Riski di PT Bandung Eco Sinergi Teknologi?" },
        { label: "💻 Kerja Remote / WFH / WFO?", query: "Apakah Riski bisa bekerja secara Remote, WFH, atau WFO?" },
        { label: "🚀 Jasa Web & Freelance", query: "Layanan web apa saja yang bisa Riski buat, dan apakah terbuka untuk freelance?" },
        { label: "💬 Hubungi via WhatsApp", query: "Bagaimana cara menghubungi Riski lewat WhatsApp?" },
      ];

  // Update welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
      },
    ]);
  }, [lang, welcomeMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isSending]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  async function sendChatMessage(contentToSend: string) {
    const content = contentToSend.trim();

    if (!content || isSending) {
      return;
    }

    const userMessage = createMessage("user", content);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .map(({ role, content: messageContent }) => ({
              role,
              content: messageContent,
            })),
          lang: lang,
        }),
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? (lang === "EN" ? "Bot can't respond right now." : "Bot belum bisa membalas saat ini."));
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.reply ?? ""),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : (lang === "EN" ? "An error occurred while contacting the bot." : "Terjadi kesalahan saat menghubungi bot."),
      );
    } finally {
      setIsSending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendChatMessage(input);
  }

  const chatTitle = "Kiyu Assistant";
  const chatSubtitle = lang === "EN" ? "AI Portfolio Guide" : "Panduan Portofolio AI";
  const typingText = lang === "EN" ? "Typing..." : "Mengetik...";
  const inputPlaceholder = lang === "EN" ? "Type a message..." : "Tulis pesan...";
  const closeChatLabel = lang === "EN" ? "Close chat" : "Tutup chat";
  const openChatLabel = lang === "EN" ? "Open chat" : "Buka chat";
  const sendMessageLabel = lang === "EN" ? "Send message" : "Kirim pesan";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
            className="mb-4 flex h-[min(560px,calc(100svh-7rem))] w-[calc(100vw-2rem)] max-w-[420px] sm:max-w-[440px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]/95 shadow-2xl shadow-black/80 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white shadow-sm p-1">
                  <Image
                    src="/images/icon-fab.png"
                    alt="Kiyu Assistant"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">
                    {chatTitle}
                  </h2>
                  <p className="text-xs text-white/50">{chatSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label={closeChatLabel}
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 space-y-3.5 overflow-y-auto px-5 py-5 text-sm"
            >
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "bg-white text-black font-medium shadow-sm"
                          : "border border-white/10 bg-white/[0.04] text-white/85 shadow-inner"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">
                        {message.content.replace(/\*\*/g, "")}
                      </p>
                      {message.id === "welcome" && !isSending && (
                        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                          {suggestionChips.map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => sendChatMessage(chip.query)}
                              className="text-left text-xs bg-white/[0.06] hover:bg-white/15 text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {!isUser && (() => {
                        const lower = message.content.toLowerCase();
                        const showCv = lower.includes("cv") || lower.includes("resume") || lower.includes("unduh cv") || lower.includes("download cv");
                        const showLinkedin = lower.includes("linkedin");
                        const showWhatsapp = lower.includes("whatsapp") || lower.includes("wa ") || lower.includes("wa:") || lower.includes("kontak wa") || lower.includes("nomor wa");
                        const showEmail = lower.includes("email") || lower.includes("surel") || lower.includes("gmail");
                        const showGithub = lower.includes("github") || lower.includes("repo") || lower.includes("repository") || lower.includes("kode");

                        const hasButtons = showCv || showLinkedin || showWhatsapp || showEmail || showGithub;
                        if (!hasButtons) return null;

                        return (
                          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-2">
                            {showCv && (
                              <a
                                href="/cv/CV_Riski_Wahyu_Saputra.pdf"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 transition-colors border border-white/15"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>{lang === "ID" ? "Download CV" : "Download Resume"}</span>
                              </a>
                            )}
                            {showLinkedin && (
                              <a
                                href="https://www.linkedin.com/in/riski-wahyu-saputra-6a9078294/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0077b5]/20 hover:bg-[#0077b5]/35 text-[#70b5f9] hover:text-white text-xs font-medium px-2.5 py-1.5 transition-colors border border-[#0077b5]/30"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                                <span>LinkedIn</span>
                              </a>
                            )}
                            {showWhatsapp && (
                              <a
                                href="https://wa.me/6285789910963"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/35 text-[#25D366] hover:text-white text-xs font-medium px-2.5 py-1.5 transition-colors border border-[#25D366]/30"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.19.53-.98.98-1.46 1.04-.44.06-.99.09-3.21-.83-1.9-1.07-3.11-3.01-3.21-3.14-.09-.13-.77-1.03-.77-1.97 0-.94.49-1.4 1.03-1.4.19 0 .38 0 .54.01.17.01.41-.06.64.49.23.55.78 1.9.85 2.04.07.14.12.3.02.49-.09.19-.14.3-.28.47-.14.16-.29.36-.42.49-.14.14-.29.3-.12.59.16.29.73 1.2 1.56 1.94 1.07.95 1.98 1.25 2.26 1.39.28.14.45.12.62-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.7-.12 1.23z"/>
                                </svg>
                                <span>WhatsApp</span>
                              </a>
                            )}
                            {showGithub && (
                              <a
                                href="https://github.com/RiskiWahyuSaputra"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 transition-colors border border-white/15"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                                </svg>
                                <span>GitHub</span>
                              </a>
                            )}
                            {showEmail && (
                              <a
                                href="mailto:kiik37734@gmail.com"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-2.5 py-1.5 transition-colors border border-white/15"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Email</span>
                              </a>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/50">
                    <Loader2 size={15} className="animate-spin" />
                    {typingText}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="border-t border-red-500/20 bg-red-500/10 px-5 py-2.5 text-xs leading-5 text-red-200">
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2.5 border-t border-white/10 p-4 bg-black/40"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                maxLength={1200}
                placeholder={inputPlaceholder}
                className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/30"
              />
              <button
                type="submit"
                aria-label={sendMessageLabel}
                disabled={!input.trim() || isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 active:scale-95"
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={isOpen ? closeChatLabel : openChatLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white text-black shadow-2xl shadow-black/60 transition-all duration-300 hover:scale-105 hover:border-white/40 hover:shadow-cyan-500/20 active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -24, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 24, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-center w-full h-full"
          >
            {isOpen ? (
              <X size={24} className="text-black" />
            ) : (
              <Image
                src="/images/icon-fab.png"
                alt=""
                width={64}
                height={64}
                className="h-full w-full rounded-full object-cover p-0.5 transition-transform duration-300 group-hover:scale-110"
                priority
              />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
