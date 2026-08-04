"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

/** Headline, split into fixed display lines. `em` words render in italic terracotta. */
const HEADLINE_LINES: { t: string; em?: boolean }[][] = [
  [{ t: "I" }, { t: "design" }, { t: "tools" }],
  [{ t: "that" }, { t: "remember" }],
  [{ t: "there" }, { t: "is" }, { t: "a" }, { t: "person", em: true }],
  [{ t: "on" }, { t: "the" }, { t: "other" }, { t: "side." }],
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

  let wordIndex = 0;

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

      <div className="relative z-[1] mx-auto w-full max-w-[1120px] text-center">
        <motion.div
          className="mb-6 font-display text-[clamp(16px,1.8vw,22px)] font-medium text-mist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Hi, I&apos;m Xiuer Gu!
        </motion.div>

        <h1 className="m-0 font-display text-[clamp(36px,6.2vw,84px)] font-bold leading-[1.08] tracking-[-0.02em]">
          {HEADLINE_LINES.map((line, li) => (
            <span key={li} className="block">
              {line.map((wd) => {
                const i = wordIndex++;
                return (
                  <span
                    key={i}
                    className="inline-block overflow-hidden align-top"
                  >
                    <motion.span
                      className={
                        "inline-block" + (wd.em ? " text-accent" : "")
                      }
                      initial={{ opacity: 0, y: reduce ? "0em" : "0.72em" }}
                      animate={{ opacity: 1, y: "0em" }}
                      transition={{
                        duration: 0.7,
                        delay: reduce ? 0 : 0.15 + i * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {wd.t}
                      {"\u00A0"}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-[58ch] text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-mist"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
        >
          I work across healthcare, accessibility, and human-AI interaction —
          combining research, design, and front-end development to make support
          systems feel more usable, humane, and real.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <a
            href="#work"
            className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.04]"
          >
            View my work
          </a>
          <a
            href="/contact"
            className="rounded-full border border-line px-7 py-3 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-mist"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-6 z-[1] flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist md:left-[5vw]">
        <span
          className="inline-block h-[34px] w-px bg-accent"
          style={{ animation: reduce ? "none" : "blink 1.8s ease-in-out infinite" }}
          aria-hidden
        />
        Scroll to explore
      </div>

      <div className="absolute bottom-8 right-6 z-[1] text-right text-[13px] leading-[1.7] text-mist md:right-[5vw]">
        Currently
        <br />
        <span className="text-bone">Designing &amp; building AI health tools</span>
      </div>
    </header>
  );
}
