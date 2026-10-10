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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = input.trim();

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
                      {!isUser && (message.content.toLowerCase().includes("cv") || message.content.toLowerCase().includes("resume") || message.content.toLowerCase().includes("unduh") || message.content.toLowerCase().includes("download")) && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                          <a
                            href="/cv/CV_Riski_Wahyu_Saputra.pdf"
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 transition-colors border border-white/15"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>{lang === "ID" ? "Download CV (PDF)" : "Download Resume (PDF)"}</span>
                          </a>
                        </div>
                      )}
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
