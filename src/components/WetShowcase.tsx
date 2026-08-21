"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getAssetPath } from "@/lib/utils";

/* ================================================================== */
/* WET Guard Showcase — one protocol, two hands.                       */
/* Written in the case study's own voice: the project accent, warm     */
/* surfaces, editorial type. Includes live walkthrough stage,         */
/* comparison matrix, interactive safety gate demo, and evaluation stats.*/
/* ================================================================== */

type Surface = "console" | "mobile";

type Step = {
  id: string;
  label: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
};

const CONSOLE_STEPS: readonly Step[] = [
  {
    id: "signin",
    label: "Sign in",
    title: "Secure clinician entry",
    desc: "The entry screen says what the platform is before it asks for anything — session tracking, safety screening, structured WET protocol support — so the first field arrives with context rather than ahead of it.",
    src: "/wetguard/web-1-login.png",
    alt: "WET Guard console — clinician sign-in beside the product summary",
  },
  {
    id: "configure",
    label: "Configure",
    title: "Start session — simulation parameters",
    desc: "A brand hero beside a compact configuration card: therapist, patient, session ID, and which of the five WET sessions this run belongs to. A hover-expanding icon rail keeps navigation out of the canvas until it is needed.",
    src: "/wetguard/web-2-config.png",
    alt: "WET Guard console — session configuration card defining the conditions for a run",
  },
  {
    id: "converse",
    label: "Converse",
    title: "Scripted pre-session guidance",
    desc: "The WET Guide delivers the protocol's scripted psychoeducation turn by turn. A live rail carries patient, condition, elapsed time, and the next step, so the operator always knows where in the protocol the conversation sits.",
    src: "/wetguard/web-3-chat.png",
    alt: "WET Guard console — WET Guide dialogue with a live session information rail",
  },
  {
    id: "safety",
    label: "Safety gate",
    title: "Real-time risk gating and escalation",
    desc: "Every patient message is risk-classified before the agent answers. On a high-risk signal the therapist agent is held back, the session routes to a human clinician, and the banner states exactly what happened — no clinical drama, no false reassurance.",
    src: "/wetguard/console-escalation.png",
    alt: "WET Guard console — safety gate banner escalating a session to a human clinician",
  },
  {
    id: "writing",
    label: "Writing",
    title: "Thirty-minute timed narrative exposure",
    desc: "A near-empty canvas is the point. Countdown, elapsed time, and word count sit in the side rail so the writing surface stays quiet, and the session saves itself when the timer runs out.",
    src: "/wetguard/web-4-writing.png",
    alt: "WET Guard console — timed exposure writing canvas with countdown and word count",
  },
  {
    id: "report",
    label: "Report",
    title: "Session summary and evaluation output",
    desc: "The evaluation engine returns raw scores. The summary turns them into progress bars, a stability trend, a generated narrative, and program progress across the five-session arc — read in seconds instead of parsed.",
    src: "/wetguard/web-5-summary.png",
    alt: "WET Guard console — session summary with safety analysis and evaluation output",
  },
];

const MOBILE_STEPS: readonly Step[] = [
  {
    id: "onboard",
    label: "Onboard",
    title: "One-screen patient start",
    desc: "Identity, therapist, and session number compressed into a single soft card. Icon-led fields reduce reading load for a distressed user, every target is touch-safe, and a privacy line keeps the first tap low-stakes.",
    src: "/wetguard/phone-welcome.png",
    alt: "WET Mobile — patient onboarding card with therapist, session ID, and WET session number",
  },
  {
    id: "converse",
    label: "Converse",
    title: "Guided WET session",
    desc: "Full-bleed bubbles and timestamped turns inside a fixed three-tab shell. The patient can ask a clarifying question; the guide answers within protocol before continuing to the next scripted checkpoint.",
    src: "/wetguard/phone-session.png",
    alt: "WET Mobile — guided therapy session conversation with the WET Guide",
  },
  {
    id: "review",
    label: "Review",
    title: "Session info and safety status",
    desc: "The same classification the clinician sees, restated calmly for the patient: risk status, session identity, and one action to summarize and end the session.",
    src: "/wetguard/phone-info.png",
    alt: "WET Mobile — session information and safety status screen",
  },
];

const PROBLEMS = [
  {
    num: "01",
    title: "Safety can't be an afterthought",
    desc: "Risk signals must surface instantly and route to a human — without alarming the patient.",
  },
  {
    num: "02",
    title: "One protocol, two contexts",
    desc: "A patient on a phone and a clinician at a console need the same flow, shaped differently.",
  },
  {
    num: "03",
    title: "Measurable by design",
    desc: "Eight fidelity metrics needed to read at a glance, not as raw JSON.",
  },
  {
    num: "04",
    title: "Trust through restraint",
    desc: "A calm, near-monochrome interface so the words carry the weight, not the chrome.",
  },
] as const;

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Protocol Research",
    desc: "Read the WET treatment manual & safety guidelines. Mapped the 5-session arc and every scripted checkpoint.",
  },
  {
    num: "02",
    title: "Flows & Wireframes",
    desc: "Storyboarded login → configure → converse → escalate → summarize, for both patient and clinician roles.",
  },
  {
    num: "03",
    title: "System & UI",
    desc: "Built a calm iOS-grade token set — one primary blue, generous radii, quiet surfaces — reused across both apps.",
  },
  {
    num: "04",
    title: "Build & Wire",
    desc: "Shipped React clients against the FastAPI backend — live risk classification, streaming replies, real evaluation.",
  },
] as const;

const COMPARISON = [
  { job: "Navigation", mobile: "Fixed three-tab bottom bar", console: "Hover-expand icon rail" },
  { job: "Configure", mobile: "Single stacked card", console: "Hero plus side form card" },
  { job: "Converse", mobile: "Full-bleed bubbles", console: "Centered column plus info rail" },
  { job: "Safety", mobile: "Inline banner in thread", console: "Banner plus live vitals monitor" },
  { job: "Report", mobile: "Scrollable summary + export", console: "Two-column analytics dashboard" },
] as const;

const HEADLINE = [
  { value: "0.93", label: "Overall protocol fidelity" },
  { value: "8", label: "Evaluation dimensions scored" },
  { value: "100%", label: "Risk turns gated to a human" },
  { value: "2", label: "Platforms, one design system" },
] as const;

const DIMENSIONS = [
  { label: "Verbatim delivery", score: 93 },
  { label: "Patient interaction", score: 100 },
  { label: "Professional boundaries", score: 100 },
  { label: "Suicidality assessed", score: 100 },
  { label: "Prompt adherence", score: 88 },
  { label: "Derailment management", score: 85 },
] as const;

export function WetShowcase({ accent = "#84b59f" }: { accent?: string }) {
  const [surface, setSurface] = useState<Surface>("console");
  const [consoleIdx, setConsoleIdx] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);
  const [riskOn, setRiskOn] = useState(false);

  const steps = surface === "console" ? CONSOLE_STEPS : MOBILE_STEPS;
  const activeIdx = surface === "console" ? consoleIdx : mobileIdx;
  const setActiveIdx = surface === "console" ? setConsoleIdx : setMobileIdx;
  const step = steps[activeIdx];

  return (
    <div className="space-y-24">
      {/* ── 01 — Overview & Challenge ─────────────────────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          01 — Overview &amp; Challenge
        </div>
        <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight md:text-4xl">
              Making a clinical protocol feel safe to use.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist">
              Written Exposure Therapy is a rigid, script-driven treatment for PTSD. The hard part is not the AI — it is wrapping a high-stakes therapeutic conversation in an interface that a clinician trusts, a patient isn't frightened by, and a researcher can measure.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mist">
              Every screen had to balance three tensions at once: <strong className="font-semibold text-bone">warmth vs. authority</strong>, <strong className="font-semibold text-bone">guidance vs. control</strong>, and <strong className="font-semibold text-bone">transparency vs. calm</strong>.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <div
                key={p.num}
                className="relative rounded-2xl border border-line bg-raised/40 p-5 transition-colors hover:border-accent/40"
              >
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
                  Problem {p.num}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-bone">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 — Design Process ───────────────────────────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          02 — Design Process
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          From clinical guideline to shipped interface.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((ps) => (
            <div key={ps.num} className="relative rounded-2xl border border-line bg-raised/30 p-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl font-mono text-sm font-bold"
                style={{ border: `1px solid ${accent}`, color: accent }}
              >
                {ps.num}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-bone">
                {ps.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                {ps.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 — Core Features Walkthrough Stage ──────────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          03 — Core Features
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Five moments that define the product.
        </h2>
        <p className="mt-2 text-base text-mist max-w-2xl">
          Each recreated below at full fidelity from the shipped React clients.
        </p>

        {/* ── Surface switch stage ───────── */}
        <div className="mt-10 relative left-1/2 w-[min(calc(100vw-3rem),80rem)] -translate-x-1/2">
          <div className="flex items-center justify-center gap-8 border-b border-line">
            {(
              [
                { key: "console", label: "Clinician console" },
                { key: "mobile", label: "Patient app" },
              ] as const
            ).map((s) => {
              const on = surface === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSurface(s.key)}
                  className="relative -mb-px pb-3 font-mono text-xs uppercase tracking-[0.16em] transition-colors duration-300 cursor-pointer"
                  style={{ color: on ? accent : undefined }}
                >
                  <span className={on ? "" : "text-mist hover:text-bone"}>{s.label}</span>
                  {on && (
                    <motion.span
                      layoutId="wet-surface-underline"
                      className="absolute inset-x-0 -bottom-px h-px"
                      style={{ background: accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-12">
            {/* Step rail */}
            <nav
              aria-label={`${surface === "console" ? "Console" : "Mobile"} walkthrough`}
              className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:pb-0"
            >
              {steps.map((s, i) => {
                const on = i === activeIdx;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveIdx(i)}
                    aria-current={on ? "step" : undefined}
                    className={`group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-full border px-4 py-2 text-[15px] transition-colors duration-300 cursor-pointer md:w-full md:whitespace-normal md:rounded-none md:border-0 md:border-l md:px-0 md:py-3 md:pl-5 md:text-left ${
                      on
                        ? "border-line bg-raised/60 font-semibold md:bg-transparent"
                        : "border-line text-mist hover:text-bone md:border-line"
                    }`}
                    style={on ? { borderLeftColor: accent, color: accent } : undefined}
                  >
                    <span className="font-mono text-xs tabular-nums opacity-60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </nav>

            {/* Screenshot stage */}
            <div>
              <div
                className="rounded-2xl border border-line p-3 sm:p-5 md:p-7"
                style={{
                  background: `radial-gradient(120% 100% at 50% 0%, ${accent}14, transparent 70%)`,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${surface}-${step.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className={surface === "mobile" ? "flex justify-center py-2" : ""}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getAssetPath(step.src)}
                      alt={step.alt}
                      className={
                        surface === "mobile"
                          ? "w-[min(17rem,70vw)] rounded-xl border border-line shadow-2xl"
                          : "w-full rounded-lg border border-line shadow-2xl"
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${surface}-${step.id}-caption`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-7"
                >
                  <h4 className="font-display text-xl font-semibold leading-snug md:text-2xl">
                    {step.title}
                  </h4>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist">{step.desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 — Mobile vs. Desktop Comparison ───────────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          04 — Mobile vs. Desktop
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          One protocol, two hands.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-mist max-w-2xl">
          The patient meets WET on a phone; the clinician works it from a console. The same five-step flow is re-proportioned — never redrawn — for each context.
        </p>

        <div className="mt-10 overflow-x-auto">
          <dl className="min-w-[600px]">
            <div className="grid grid-cols-[8rem_1fr_1fr] gap-x-6 pb-4 font-mono text-xs uppercase tracking-[0.2em] text-mist border-b border-line">
              <span>Dimension</span>
              <span>Patient App</span>
              <span>Clinician Console</span>
            </div>
            {COMPARISON.map((row) => (
              <div
                key={row.job}
                className="grid grid-cols-[8rem_1fr_1fr] gap-x-6 border-b border-line/50 py-4"
              >
                <dt className="font-mono text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>
                  {row.job}
                </dt>
                <dd className="text-sm leading-relaxed text-bone/90">{row.mobile}</dd>
                <dd className="text-sm leading-relaxed text-bone/90">{row.console}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border-l-2 border-line bg-raised/30 p-6" style={{ borderLeftColor: accent }}>
            <h3 className="font-display text-lg font-semibold text-bone">Shared foundation</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              One color, type, and component set drives both — a change to the token sheet updates every screen on both platforms.
            </p>
          </div>
          <div className="rounded-2xl border-l-2 border-line bg-raised/30 p-6" style={{ borderLeftColor: accent }}>
            <h3 className="font-display text-lg font-semibold text-bone">Divergent posture</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              Mobile is reassuring and linear; desktop is dense and analytical — same words, different confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ── 05 — Interaction & Motion (Live Risk Demo) ────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          05 — Interaction &amp; Motion
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Details you can feel.
        </h2>
        <p className="mt-2 text-base text-mist">
          Live, interactive fragments pulled straight from the build — try them.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Live Safety Gate Demo */}
          <div className="rounded-2xl border border-line bg-raised/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-bone">
                  Safety Gate — live
                </h3>
                <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ background: `${accent}20`, color: accent }}>
                  Interactive
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                Flip the last patient message from safe to high-risk and watch the interface respond.
              </p>

              <div className="mt-6 rounded-xl border border-line bg-ground p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-mist">Risk Level</span>
                  <span className={`font-mono text-xs font-bold uppercase ${riskOn ? "text-red-400" : "text-emerald-400"}`}>
                    {riskOn ? "High" : "None"}
                  </span>
                </div>

                {riskOn && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200"
                  >
                    <div className="font-semibold text-red-400">⚠️ Session escalated to a human clinician</div>
                    <p className="mt-1 text-[11px] leading-relaxed text-red-300/80">
                      A risk indicator was detected in the patient's last message. The therapist agent was held back. No automated reply was generated.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            <button
              onClick={() => setRiskOn(!riskOn)}
              className="mt-6 w-full rounded-xl py-3 font-display text-sm font-semibold transition-transform active:scale-[0.98] cursor-pointer"
              style={{ background: accent, color: "#0a0a0a" }}
            >
              Toggle risk signal ({riskOn ? "Reset to Safe" : "Trigger High Risk"})
            </button>
          </div>

          {/* Thinking state & Rail demo */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-raised/40 p-6">
              <h3 className="font-display text-lg font-semibold text-bone">AI thinking state</h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                A three-dot indicator keeps the wait honest while the therapist agent composes.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-ground p-4">
                <div className="h-6 w-6 rounded-full bg-mist/20" />
                <div className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:0.4s]" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-raised/40 p-6">
              <h3 className="font-display text-lg font-semibold text-bone">Hover-expand rail</h3>
              <p className="mt-2 text-xs leading-relaxed text-mist">
                Hover the navigation rail — labels reveal without stealing canvas space.
              </p>
              <div className="group/rail mt-4 flex w-12 items-center gap-3 overflow-hidden rounded-xl border border-line bg-ground p-2 transition-all duration-300 hover:w-44">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold" style={{ background: accent, color: "#0a0a0a" }}>
                  WET
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-bone opacity-0 transition-opacity duration-300 group-hover/rail:opacity-100">
                  Start Session
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 — Results & Data ───────────────────────────────────── */}
      <section className="pt-4 border-t border-line">
        <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
          <span className="h-[1px] w-6" style={{ background: accent }} />
          06 — Results &amp; Data
        </div>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Designed to be measured.
        </h2>

        {/* 4 Stat Metrics */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEADLINE.map((m) => (
            <div
              key={m.label}
              className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 p-6"
            >
              <div className="font-display text-4xl font-bold tracking-tight" style={{ color: accent }}>
                {m.value}
              </div>
              <div className="mt-2 text-xs leading-relaxed text-mist">{m.label}</div>
              <span
                className="absolute inset-x-0 bottom-0 h-[2px]"
                style={{ background: accent }}
                aria-hidden
              />
            </div>
          ))}
        </div>

        {/* Granular metrics */}
        <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
              Session 1 · granular metrics
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold leading-tight text-bone">
              The report the UI has to carry.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Each dimension is a weighted score the evaluation engine returned for a single simulated session. The summary screen turns these numbers into the progress bars and narrative a clinician reads in seconds.
            </p>
          </div>

          <div className="space-y-4">
            {DIMENSIONS.map((d) => (
              <div key={d.label}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-bone/90">{d.label}</span>
                  <span className="font-mono font-bold" style={{ color: accent }}>{d.score}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${d.score}%`, background: accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
