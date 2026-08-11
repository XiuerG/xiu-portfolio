"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CV_PATH } from "@/lib/site";
import { getAssetPath } from "@/lib/utils";
import { TypingRole } from "@/components/TypingRole";

/** Section anchors mirrored as scroll dots in the hero's right-side visual. */
const SECTION_DOTS = [
  { id: "about", label: "About" },
  { id: "research", label: "Research Work" },
  { id: "design", label: "Design & Interaction" },
  { id: "contact", label: "Contact" },
];

/**
 * Hero — a full-height opener over an interactive dot field. The grid of dots
 * drifts away from the cursor and warms to terracotta near it (canvas, so it
 * stays cheap). Headline words rise in on load. All motion is disabled for
 * reduced-motion users, who get a calm static field.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dots: { ox: number; oy: number }[] = [];
    const gap = 38;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      dots = [];
      for (let y = gap; y < h; y += gap)
        for (let x = gap; x < w; x += gap) dots.push({ ox: x, oy: y });
    };
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = c.getBoundingClientRect();
      w = r.width;
      h = r.height;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.classList.contains("light");
      ctx.fillStyle = isLight ? "rgba(20, 20, 18, 0.12)" : "rgba(255, 255, 255, 0.12)";
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.ox, d.oy, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();

    if (reduce) {
      drawStatic();
      window.addEventListener("resize", () => {
        resize();
        drawStatic();
      });
      return () => window.removeEventListener("resize", resize);
    }

    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.classList.contains("light");
      const dotColor = isLight ? "rgba(20, 20, 18, 0.12)" : "rgba(255, 255, 255, 0.12)";
      const accentRgb = isLight ? "196, 79, 39" : "224, 118, 77";
      const R = 150;
      for (const d of dots) {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        let px = d.ox;
        let py = d.oy;
        let rad = 1.15;
        if (dist < R) {
          const f = 1 - dist / R;
          const push = f * 26;
          px = d.ox + (dx / dist) * push;
          py = d.oy + (dy / dist) * push;
          rad = 1.15 + f * 3;
          ctx.fillStyle = `rgba(${accentRgb},${0.35 + f * 0.55})`;
        } else {
          ctx.fillStyle = dotColor;
        }
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <header
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 md:px-[5vw]"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div className="relative z-[1] mx-auto grid w-full max-w-[1200px] items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
       <div className="text-left">
        <motion.h1
          className="m-0 font-display text-[clamp(52px,8.5vw,112px)] font-bold leading-[0.98] tracking-[-0.03em]"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Xiuer&nbsp;Gu
        </motion.h1>

        <motion.div
          className="mt-5 flex min-h-[1.6em] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <TypingRole />
        </motion.div>

        <motion.p
          className="mt-8 max-w-[48ch] text-[clamp(16px,1.5vw,18px)] leading-[1.65] text-mist"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          Combining Information Studies and Art &amp; Technology to research,
          design, and build more humane and accessible digital health
          technologies.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-start gap-4"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <a
            href="#research"
            className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.04]"
          >
            View Research
          </a>
          <a
            href={getAssetPath(CV_PATH)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-7 py-3 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-mist"
          >
            Download CV
          </a>
        </motion.div>
       </div>

        {/* Right: ambient accent glow + scroll dots — the visual half. */}
        <div className="relative hidden min-h-[420px] md:block" aria-hidden>
          <span
            className="ambient-blob"
            style={{
              background: "var(--color-accent)",
              width: "clamp(280px, 30vw, 460px)",
              height: "clamp(280px, 30vw, 460px)",
              right: "4%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <ul className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-3">
            {SECTION_DOTS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-label={s.label}
                  className="block h-2 w-2 rounded-full border border-mist/60 transition-colors hover:bg-accent"
                  style={i === 0 ? { background: "var(--color-accent)", borderColor: "transparent" } : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 z-[1] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist md:left-[5vw]">
        <span
          className="inline-block h-[34px] w-px bg-accent"
          style={{ animation: reduce ? "none" : "blink 1.8s ease-in-out infinite" }}
          aria-hidden
        />
        Scroll to explore
      </div>

      <div className="absolute bottom-8 right-6 z-[1] max-w-[240px] text-right text-[13px] leading-[1.7] text-mist md:right-[5vw]">
        Current focus
        <br />
        <span className="text-bone">
          Health HCI, human-centered AI, and accessible digital health.
        </span>
      </div>
    </header>
  );
}
