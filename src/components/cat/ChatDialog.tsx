"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useDragControls, useReducedMotion } from "motion/react";
import { greeting, suggestedPrompts, tone } from "@/lib/profile";
import { answerFromKnowledge } from "@/lib/answer";
import { PreviewCard } from "./PreviewCard";

/**
 * Chat dialog (DESIGN_SPEC §6.1, §7.3, §9).
 *
 * - Desktop: expands from the bottom-right corner (same origin as the cat).
 * - Mobile: a full-screen overlay (§8).
 * - Focus moves in, is trapped, Esc closes, focus returns to the cat (§9).
 * - States: empty (chips), thinking, streaming, warm fallback, error (§7.3).
 * - Cards (§6.2) are surfaced after the cat's words, max two, slow fade.
 */

type Msg = {
  role: "user" | "assistant";
  content: string;
  cards: string[];
};

export function ChatDialog({
  isMobile,
  onClose,
  onBusyChange,
}: {
  isMobile: boolean;
  onClose: () => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: greeting, cards: [] },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [errored, setErrored] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragControls = useDragControls();

  const onlyGreeting = messages.length === 1;

  useEffect(() => {
    onBusyChange(busy);
  }, [busy, onBusyChange]);

  // Focus the input on open.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  // Keep transcript pinned to the newest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Esc to close + Tab focus trap (§9).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setErrored(false);
    setInput("");

    const next: Msg[] = [
      ...messages,
      { role: "user", content: question, cards: [] },
      { role: "assistant", content: "", cards: [] },
    ];
    setMessages(next);
    setBusy(true);

    const apply = (fn: (m: Msg) => Msg) =>
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = fn(copy[copy.length - 1]);
        return copy;
      });

    const streamLocal = async (answerText: string, slugs: string[]) => {
      const words = answerText.split(/(\s+)/);
      for (const w of words) {
        apply((m) => ({ ...m, content: m.content + w }));
        if (w.trim()) await new Promise((r) => setTimeout(r, 16));
      }
      for (const slug of slugs.slice(0, 2)) {
        await new Promise((r) => setTimeout(r, 260));
        apply((m) =>
          m.cards.includes(slug) ? m : { ...m, cards: [...m.cards, slug].slice(0, 2) },
        );
      }
    };

    const useClientChat = process.env.NEXT_PUBLIC_USE_CLIENT_CHAT === "true";

    try {
      if (useClientChat) {
        const a = answerFromKnowledge(question);
        await streamLocal(a.text, a.slugs);
        return;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.content || m.role === "user")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.type === "text") {
              apply((m) => ({ ...m, content: m.content + evt.value }));
            } else if (evt.type === "card" && evt.slug) {
              apply((m) =>
                m.cards.includes(evt.slug)
                  ? m
                  : { ...m, cards: [...m.cards, evt.slug].slice(0, 2) },
              );
            } else if (evt.type === "error") {
              throw new Error("stream error");
            }
          } catch {
            /* ignore malformed partial line */
          }
        }
      }
    } catch {
      if (!useClientChat) {
        try {
          const a = answerFromKnowledge(question);
          await streamLocal(a.text, a.slugs);
          return;
        } catch {
          /* fall through to error state */
        }
      }
      setErrored(true);
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: tone.error,
          cards: [],
        };
        return copy;
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const content = (
    <>
      {/* Header — on mobile the bar doubles as a drag handle to dismiss. */}
      <div
        className={
          isMobile
            ? "relative flex items-center justify-between border-b border-line px-4 pb-3 pt-2 touch-none"
            : "flex items-center justify-between border-b border-line px-4 py-3"
        }
        onPointerDown={isMobile ? (e) => dragControls.start(e) : undefined}
        style={isMobile ? { cursor: "grab" } : undefined}
      >
        {isMobile && (
          <span
            aria-hidden
            className="absolute left-1/2 top-1.5 h-1 w-9 -translate-x-1/2 rounded-full bg-line"
          />
        )}
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-ember" aria-hidden />
          <p className="text-sm text-bone">No.&nbsp;11 · Xiuer&apos;s cat</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="-mr-1 rounded-md px-2 py-1 font-mono text-xs uppercase tracking-wider text-mist transition-colors hover:text-bone"
        >
          Close
        </button>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} busy={busy} />
        ))}

        {busy && messages[messages.length - 1]?.content === "" && (
          <p className="pl-1 font-mono text-xs lowercase tracking-wide text-mist">
            {tone.thinking}
            <span className="animate-pulse">…</span>
          </p>
        )}
      </div>

      {/* Empty-state chips (§7.3) — single horizontal scrolling row on desktop,
          stacked top-to-bottom on mobile. */}
      {onlyGreeting && !busy && (
        <div
          className={
            isMobile
              ? "flex flex-col gap-2 px-4 pb-3"
              : "flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }
        >
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className={
                "rounded-full border border-line px-3 py-1.5 text-left text-sm text-mist transition-colors hover:border-accent hover:text-bone" +
                (isMobile ? " w-full" : " shrink-0 whitespace-nowrap")
              }
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-3 border-t border-line px-3 py-3"
        style={
          isMobile
            ? { paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }
            : undefined
        }
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the cat…"
          aria-label="Ask the cat a question about Xiuer"
          className="min-w-0 flex-1 bg-transparent px-1 text-base text-bone placeholder:text-mist focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="shrink-0 rounded-full bg-ember px-4 py-2 font-mono text-xs uppercase tracking-wider text-ground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? "…" : "Ask"}
        </button>
      </form>

      {errored && (
        <p className="px-4 pb-3 text-xs text-mist" role="status">
          {tone.error}
        </p>
      )}
    </>
  );

  // Mobile: a bottom sheet that slides up, dims the page behind, and can be
  // swiped down from the header to dismiss (§8). Page stays present underneath.
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[60]">
        <motion.div
          className="absolute inset-0 bg-ground/60 backdrop-blur-sm"
          aria-hidden
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Xiuer's pixel cat"
          drag="y"
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 600) onClose();
          }}
          initial={reduce ? { opacity: 0 } : { y: "100%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 flex h-[86dvh] flex-col overflow-hidden rounded-t-2xl border-t border-line bg-raised shadow-2xl"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  // Desktop: a panel that expands from the bottom-right corner (§6.1).
  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chat with Xiuer's pixel cat"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: "bottom right" }}
      className="fixed bottom-7 right-7 z-[60] flex max-h-[min(70vh,560px)] w-[380px] flex-col overflow-hidden rounded-2xl border border-line bg-raised/95 shadow-2xl backdrop-blur"
    >
      {content}
    </motion.div>
  );
}

function Bubble({ msg, busy }: { msg: Msg; busy: boolean }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent/15 px-3.5 py-2 text-bone">
          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {msg.content && (
        <p className="whitespace-pre-wrap leading-relaxed text-bone">
          {msg.content}
          {busy && (
            <span className="ml-0.5 inline-block animate-pulse text-mist">▍</span>
          )}
        </p>
      )}
      {msg.cards.map((slug) => (
        <PreviewCard key={slug} slug={slug} />
      ))}
    </div>
  );
}
