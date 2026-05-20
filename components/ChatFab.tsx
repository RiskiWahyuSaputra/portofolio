"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";

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

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Halo, saya asisten portfolio Riski. Silakan tanya tentang project, skill, atau kontak langsung via WhatsApp dan email.",
  },
];

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

export default function ChatFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
        }),
      });

      const data = (await response.json()) as ChatResponse;

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Bot belum bisa membalas saat ini.");
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.reply ?? ""),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Terjadi kesalahan saat menghubungi bot.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
            className="mb-4 flex h-[min(620px,calc(100svh-7rem))] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0f0f0f]/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white p-1.5">
                  <Image
                    src="/images/icon-fab.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </span>
                <div>
                  <h2 className="text-sm font-medium text-white">
                    Riski Assistant
                  </h2>
                  <p className="text-xs text-white/40">Groq powered chat</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <p
                      className={`max-w-[82%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-6 ${
                        isUser
                          ? "bg-white text-black"
                          : "border border-white/10 bg-white/[0.04] text-white/75"
                      }`}
                    >
                      {message.content}
                    </p>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/50">
                    <Loader2 size={14} className="animate-spin" />
                    Mengetik...
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-xs leading-5 text-red-100/80">
                {error}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 border-t border-white/10 p-3"
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
                placeholder="Tulis pesan..."
                className="max-h-28 min-h-10 flex-1 resize-none rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/25"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!input.trim() || isSending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white text-black shadow-2xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ opacity: 0, rotate: -24, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 24, scale: 0.8 }}
            transition={{ duration: 0.18 }}
          >
            {isOpen ? (
              <X size={22} />
            ) : (
              <Image
                src="/images/icon-fab.png"
                alt=""
                width={54}
                height={54}
                className="h-14 w-14 rounded-full object-cover"
                priority
              />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
