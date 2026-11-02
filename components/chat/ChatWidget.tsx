"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { localAnswer, quickReplies } from "@/lib/knowledge";
import { Icon } from "../ui/Icon";
import { ease } from "../ui/motion";

type Msg = { role: "user" | "assistant"; content: string; source?: "quick" | "ai" | "local" };

const FALLBACK_SIGNAL = "\u0000FALLBACK";
const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Vivek's AI assistant, grounded in his resume. Pick a quick question or ask me anything about his experience, projects or skills.",
  source: "quick",
};

const STREAM_CHUNK = 3;
const STREAM_MS = 16;

/** Floating assistant: streamed quick replies + free-form questions answered by Gemini. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [seen, setSeen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const streamTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setLast = (content: string, source: Msg["source"] = "ai") =>
    setMessages((m) => [...m.slice(0, -1), { role: "assistant", content, source }]);

  const clearStream = () => {
    if (streamTimer.current) {
      clearTimeout(streamTimer.current);
      streamTimer.current = null;
    }
  };

  const streamText = (text: string, source: Msg["source"]) =>
    new Promise<void>((resolve) => {
      let i = 0;
      const tick = () => {
        i = Math.min(text.length, i + STREAM_CHUNK);
        setLast(text.slice(0, i), source);
        if (i < text.length) {
          streamTimer.current = setTimeout(tick, STREAM_MS);
        } else {
          streamTimer.current = null;
          resolve();
        }
      };
      streamTimer.current = setTimeout(tick, 220);
    });

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => clearStream(), []);

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));

  const pickQuick = async (q: (typeof quickReplies)[number]) => {
    if (busy) return;
    clearStream();
    setMessages((m) => [...m, { role: "user", content: q.q }, { role: "assistant", content: "", source: "quick" }]);
    setBusy(true);
    try {
      await streamText(q.a, "quick");
    } finally {
      setBusy(false);
    }
  };

  const askAI = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    clearStream();
    setInput("");
    const history = [...messages.filter((m) => m !== GREETING), { role: "user" as const, content: question }];
    setMessages((m) => [...m, { role: "user", content: question }, { role: "assistant", content: "", source: "ai" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        setLast(res.status === 429 ? await res.text() : localAnswer(question), "local");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (acc.startsWith(FALLBACK_SIGNAL)) {
          setLast(localAnswer(question), "local");
          return;
        }
        setLast(acc, "ai");
      }
      if (!acc.trim()) setLast(localAnswer(question), "local");
    } catch {
      setLast(localAnswer(question), "local");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="chat">
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat__panel"
            role="dialog"
            aria-label="Chat with Vivek's AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
          >
            <header className="chat__head">
              <span className="chat__avatar">
                <Image src="/vivek-portrait-hd.png" alt="" width={40} height={40} />
                <i className="live-dot" aria-hidden="true" />
              </span>
              <div>
                <p className="chat__title">Ask about Vivek</p>
                <p className="chat__sub mono">AI· </p>
              </div>
              <button type="button" className="chat__close" onClick={() => setOpen(false)} aria-label="Close chat">
                <Icon name="close" size={18} />
              </button>
            </header>

            <div className="chat__list" ref={listRef} aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`chat__msg chat__msg--${m.role}`}>
                  {m.content ? (
                    <p>{m.content}</p>
                  ) : (
                    <span className="chat__typing" aria-label="Thinking">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  {m.role === "assistant" && m.source === "ai" && m.content && <span className="chat__tag mono">AI</span>}
                </div>
              ))}
            </div>

            <div className="chat__quick" aria-label="Quick questions">
              {quickReplies
                .filter((q) => !asked.has(q.q))
                .map((q) => (
                  <button key={q.q} type="button" onClick={() => pickQuick(q)} disabled={busy}>
                    {q.q}
                  </button>
                ))}
            </div>

            <form
              className="chat__form"
              onSubmit={(e) => {
                e.preventDefault();
                askAI(input);
              }}
            >
              <Icon name="spark" size={16} className="chat__spark" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the AI anything about Vivek…"
                aria-label="Your question"
                maxLength={800}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
                <Icon name="arrow" size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={launcherRef}
        type="button"
        className={`chat__launcher${open ? " is-open" : ""}`}
        onClick={() => {
          setOpen((v) => !v);
          setSeen(true);
        }}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat with Vivek's AI assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5, ease }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <Icon name={open ? "close" : "chat"} size={22} />
        {!open && <span className="chat__label">Ask AI</span>}
        {!seen && <span className="chat__ping" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
