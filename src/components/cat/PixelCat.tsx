"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { CatState } from "./useCatState";
import { tone } from "@/lib/profile";

/**
 * The pixel cat — a front-facing gray tabby (灰色狸花猫), pinned to the
 * bottom-right of the viewport. It blinks on a loose timer, opens a warm hover
 * bubble, and on click opens the chat dialog. Reduced-motion freezes the blink.
 */

const ROWS = [
  "..kkk......kkk..",
  ".kgik......kigk.",
  ".kgigk....kgigk.",
  ".kggggggggggggk.",
  ".kgggddggddgggk.",
  ".kggggdggdggggk.",
  ".kgweggggggewgk.",
  ".kgeeggggggeegk.",
  ".kggggllllggggk.",
  "lkgggllppllgggkl",
  ".kgdggllllggdgk.",
  "l.kggggggggggk.l",
  "...kggggggggk...",
  "....kkkkkkkk....",
];

const PALETTE: Record<string, string> = {
  k: "#3a3d44", // outline
  g: "#9aa0a9", // gray fur
  d: "#686d76", // darker tabby stripes
  i: "#c9a6a6", // inner ear
  l: "#c8cdd4", // muzzle + whiskers
  p: "#e0a6a3", // nose
  e: "#84cf93", // eye (green)
  w: "#eef0f2", // eye highlight
};

const COLS = 16;
const GRID_ROWS = 14;
const EYE_COLS = new Set([3, 4, 11, 12]);

export function PixelCat({
  state,
  size = 104,
  isMobile = false,
  onClick,
  onHoverChange,
  buttonRef,
}: {
  state: CatState;
  size?: number;
  isMobile?: boolean;
  onClick: () => void;
  onHoverChange: (hovering: boolean) => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const reduce = useReducedMotion();
  const [blink, setBlink] = useState(false);
  const [showLine, setShowLine] = useState(false);
  // Mobile has no hover, so nudge the bubble once per session for discoverability.
  const [nudge, setNudge] = useState(false);
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Loose, natural blinking; active only when awake, paused for reduced-motion.
  useEffect(() => {
    if (reduce || state === "idle") return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 2800 + Math.random() * 2800;
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduce, state]);

  // Warm hover bubble, a beat late (desktop only).
  useEffect(() => {
    if (state === "hover") {
      lineTimer.current = setTimeout(() => setShowLine(true), 350);
    } else {
      setShowLine(false);
      if (lineTimer.current) clearTimeout(lineTimer.current);
    }
    return () => {
      if (lineTimer.current) clearTimeout(lineTimer.current);
    };
  }, [state]);

  // Mobile discoverability nudge: a beat after arrival, the bubble surfaces once
  // per session (since there's no hover), then tucks away after a while. The
  // "seen" flag is written only after it has actually shown for its full run (or
  // the chat is opened), so an early remount can't silently swallow it.
  useEffect(() => {
    if (!isMobile) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("catNudged")) return;

    const show = setTimeout(() => setNudge(true), 1500);
    const hide = setTimeout(() => {
      setNudge(false);
      sessionStorage.setItem("catNudged", "1");
    }, 11000);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [isMobile]);

  // Opening the dialog dismisses the nudge and counts as seen.
  useEffect(() => {
    if (state === "active" || state === "talking") {
      setNudge(false);
      if (typeof window !== "undefined") sessionStorage.setItem("catNudged", "1");
    }
  }, [state]);

  const currentPalette: Record<string, string> = {
    ...PALETTE,
    e: (state === "hover" || state === "active" || state === "talking") ? "#bd5a3c" : "#84cf93",
  };

  const isSleeping = state === "idle";
  const isStirred = state === "stirred";

  const rects: React.ReactElement[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let ch = ROWS[r][c];
      if (ch === ".") continue;

      // Eye state/drawing logic:
      if ((r === 6 || r === 7) && EYE_COLS.has(c)) {
        if (isSleeping || (blink && (state === "hover" || state === "active" || state === "talking"))) {
          // Closed eyes (sleeping, or blinking while awake)
          ch = r === 6 ? "g" : "d";
        } else if (isStirred) {
          // Squinting eyes (row 6 closed, row 7 open)
          if (r === 6) {
            ch = "g";
          }
        }
      }

      const fill = currentPalette[ch];
      if (!fill) continue;
      rects.push(
        <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={fill} />,
      );
    }
  }

  const height = (size * GRID_ROWS) / COLS;

  const bubbleVisible = showLine || nudge;

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 md:bottom-7 md:right-7"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none mb-1 max-w-[200px] rounded-2xl rounded-br-sm border border-line bg-raised/90 px-3.5 py-2 text-sm text-bone shadow-lg backdrop-blur"
          >
            {tone.hoverLines[0]}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        aria-label="Ask Xiuer's pixel cat — opens a chat that answers questions about Xiuer"
        aria-haspopup="dialog"
        className="pointer-events-auto relative rounded-xl p-1 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2"
      >
        {/* Glow backdrop - only visible on hover/active/talking states */}
        <div
          className={`absolute inset-0 -z-10 rounded-full blur-xl transition-all duration-500 ${state === "hover" || state === "active" || state === "talking"
            ? "bg-ember/20 opacity-100 scale-110"
            : "bg-accent/5 opacity-0 scale-95"
            }`}
        />
        <svg
          width={size}
          height={height}
          viewBox={`0 0 ${COLS} ${GRID_ROWS}`}
          shapeRendering="crispEdges"
          aria-hidden
          style={{ display: "block" }}
        >
          {rects}
        </svg>
      </button>
    </div>
  );
}
