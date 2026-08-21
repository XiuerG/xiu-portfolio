"use client";

import { useState } from "react";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";

/* ================================================================== */
/* WET Guard Portfolio — Full Editorial Case Study Page               */
/* Embeds real screenshots from /public/wetguard/ into device frames   */
/* ================================================================== */

function BlueprintCard({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative border border-line bg-raised/40 p-6 ${className}`}
      style={style}
    >
      {/* Blueprint corner ticks */}
      <span className="absolute -left-px -top-px h-1.5 w-1.5 border-l border-t border-accent" />
      <span className="absolute -right-px -top-px h-1.5 w-1.5 border-r border-t border-accent" />
      <span className="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-accent" />
      <span className="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-accent" />
      {children}
    </div>
  );
}

export function WetShowcase({ accent = "#84b59f" }: { accent?: string }) {
  const [riskOn, setRiskOn] = useState(false);

  return (
    <div className="relative min-h-screen bg-ground text-bone font-sans overflow-x-hidden selection:bg-accent/30 selection:text-bone">
      {/* ── ══ NAV ══ ────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-ground/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-sm text-ground font-bold"
              style={{ background: accent }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f2f2f3" strokeWidth="1.8">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight text-bone">WET Guard</span>
          </Link>
          <span className="hidden sm:inline-block border-l border-line pl-3 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: accent }}>
            Case Study
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-mist">
          <a href="#overview" className="hover:text-accent transition-colors">Overview</a>
          <a href="#process" className="hover:text-accent transition-colors">Process</a>
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#platforms" className="hover:text-accent transition-colors">Platforms</a>
          <a href="#results" className="hover:text-accent transition-colors">Results</a>
        </div>
      </nav>

      {/* ── ══ HERO ══ ────────────────────────────────────────────────── */}
      <header className="relative px-6 pt-16 pb-16 md:px-10 md:pt-20 text-center overflow-hidden">
        {/* Grid pattern backdrop */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(120%_80%_at_70%_20%,#000_30%,transparent_80%)]" />

        <div className="relative mx-auto max-w-5xl flex flex-col items-center">
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            UI / UX Case Study · 2026
            <span className="h-[1px] w-6" style={{ background: accent }} />
          </div>

          <h1 className="mt-4 font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-bone">
            WET Guard
          </h1>

          <p className="mt-3 font-display text-lg sm:text-xl font-semibold tracking-wide" style={{ color: accent }}>
            AI-Guided Written Exposure Therapy — Mobile &amp; Desktop
          </p>

          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-mist">
            A clinician-assisted platform running the evidence-based WET protocol for PTSD — with an AI therapist, real-time safety gating, and an 8-dimension evaluation engine, designed end to end across two form factors.
          </p>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            {["AI Therapy Flow", "Safety Gate", "iOS Mobile", "Desktop Console", "Clinical Report"].map((tag) => (
              <span key={tag} className="rounded-full border border-line bg-raised/40 px-3.5 py-1 text-bone/90">
                {tag}
              </span>
            ))}
          </div>

          {/* ── LAPTOP HERO SCREENSHOT ─────────────────────────────── */}
          <div className="mt-12 w-full max-w-5xl">
            <div className="rounded-[26px] border border-neutral-700 bg-neutral-900 p-2 sm:p-3 shadow-2xl">
              <div className="flex justify-center pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 shadow-inner" />
              </div>
              <div className="overflow-hidden rounded-lg bg-neutral-950 border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/wetguard/web-2-config.png")}
                  alt="WET Guard desktop console start session screenshot"
                  className="w-full h-auto object-cover rounded-md shadow-2xl"
                />
              </div>
            </div>
            <div className="h-3 w-full rounded-b-xl bg-neutral-700 shadow-md" />
          </div>

          {/* Meta cells */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-b border-line py-6 text-left">
            <div>
              <div className="font-display text-sm font-medium text-bone">Interaction Design &amp; Front-End Lead</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Role</div>
            </div>
            <div className="h-6 w-px bg-line hidden sm:block" />
            <div>
              <div className="font-display text-sm font-medium text-bone">React · Tailwind · FastAPI</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Stack</div>
            </div>
            <div className="h-6 w-px bg-line hidden sm:block" />
            <div>
              <div className="font-display text-sm font-medium text-bone">2 clients · 1 system</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Scope</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── ══ 01 — OVERVIEW & CHALLENGE ══ ────────────────────────────── */}
      <section id="overview" className="px-6 py-16 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            01 — Overview &amp; Challenge
          </div>

          <div className="mt-6 grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-bone md:text-4xl">
                Making a clinical protocol feel safe to use.
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-mist">
                Written Exposure Therapy is a rigid, script-driven treatment for PTSD. The hard part is not the AI — it is wrapping a high-stakes therapeutic conversation in an interface that a clinician trusts, a patient isn't frightened by, and a researcher can measure.
              </p>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-mist">
                Every screen had to balance three tensions at once: <strong className="font-semibold text-bone">warmth vs. authority</strong>, <strong className="font-semibold text-bone">guidance vs. control</strong>, and <strong className="font-semibold text-bone">transparency vs. calm</strong>.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <BlueprintCard>
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 01</div>
                <div className="mt-2 font-display text-lg font-semibold text-bone leading-snug">Safety can't be an afterthought</div>
                <p className="mt-2 text-xs leading-relaxed text-mist">Risk signals must surface instantly and route to a human — without alarming the patient.</p>
              </BlueprintCard>
              <BlueprintCard>
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 02</div>
                <div className="mt-2 font-display text-lg font-semibold text-bone leading-snug">One protocol, two contexts</div>
                <p className="mt-2 text-xs leading-relaxed text-mist">A patient on a phone and a clinician at a console need the same flow, shaped differently.</p>
              </BlueprintCard>
              <BlueprintCard>
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 03</div>
                <div className="mt-2 font-display text-lg font-semibold text-bone leading-snug">Measurable by design</div>
                <p className="mt-2 text-xs leading-relaxed text-mist">Eight fidelity metrics needed to read at a glance, not as raw JSON.</p>
              </BlueprintCard>
              <BlueprintCard>
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 04</div>
                <div className="mt-2 font-display text-lg font-semibold text-bone leading-snug">Trust through restraint</div>
                <p className="mt-2 text-xs leading-relaxed text-mist">A calm, near-monochrome interface so the words carry the weight, not the chrome.</p>
              </BlueprintCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── ══ 02 — DESIGN PROCESS ══ ─────────────────────────────────── */}
      <section id="process" className="px-6 py-16 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            02 — Design Process
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-bone md:text-4xl">
            From clinical guideline to shipped interface.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Protocol Research", desc: "Read the WET treatment manual & safety guidelines. Mapped the 5-session arc and every scripted checkpoint." },
              { num: "02", title: "Flows & Wireframes", desc: "Storyboarded login → configure → converse → escalate → summarize, for both patient and clinician roles." },
              { num: "03", title: "System & UI", desc: "Built a calm iOS-grade token set — one primary blue, generous radii, quiet surfaces — reused across both apps." },
              { num: "04", title: "Build & Wire", desc: "Shipped React clients against the FastAPI backend — live risk classification, streaming replies, real evaluation.", highlight: true },
            ].map((s) => (
              <div key={s.num} className="relative rounded-lg border border-line bg-ground p-6">
                <div
                  className="flex h-11 w-11 items-center justify-center font-mono text-lg font-bold"
                  style={{
                    background: s.highlight ? accent : "transparent",
                    color: s.highlight ? "#0b0b0f" : accent,
                    border: `1px solid ${accent}`,
                  }}
                >
                  {s.num}
                </div>
                <div className="mt-4 font-display text-lg font-semibold text-bone">{s.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-mist">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ══ 03 — CORE FEATURES ══ ──────────────────────────────────── */}
      <section id="features" className="px-6 py-16 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl space-y-24">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
              <span className="h-[1px] w-6" style={{ background: accent }} />
              03 — Core Features
            </div>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-bone md:text-4xl">
              Five moments that define the product.
            </h2>
            <p className="mt-2 text-sm text-mist">
              Each recreated below at full fidelity from the shipped React clients.
            </p>
          </div>

          {/* Feature 01 — WET Mobile onboarding */}
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="font-mono text-6xl font-bold opacity-20">01</div>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded bg-accent/20 px-2.5 py-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>WET Mobile</span>
                <span className="font-mono text-xs uppercase tracking-wider text-mist">Patient onboarding</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-bone">A one-screen start that reassures before it asks.</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                The mobile entry compresses identity, therapist, and session number into a single soft card. A gradient primary button and a privacy line keep the first tap low-stakes. Everything is 44px+ touch-safe and sits inside a native iOS tab shell.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-mist">
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Icon-led fields reduce reading load for distressed users.</li>
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Custom session dropdown keeps the flow inside one card.</li>
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Persistent bottom tab bar for Home · Therapy · Session.</li>
              </ul>
            </div>

            {/* PHONE SCREENSHOT 01 */}
            <div className="justify-self-center">
              <BlueprintCard className="w-[310px] rounded-[40px] p-2 bg-[#0b0b0f] shadow-2xl">
                <div className="overflow-hidden rounded-[32px] border border-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getAssetPath("/wetguard/phone-welcome.png")}
                    alt="WET Mobile onboarding real screenshot"
                    className="w-full h-auto object-cover rounded-[30px]"
                  />
                </div>
              </BlueprintCard>
            </div>
          </div>

          {/* Feature 02 — Desktop console */}
          <div className="space-y-6">
            <div className="grid items-end gap-12 lg:grid-cols-[340px_1fr]">
              <div>
                <div className="font-mono text-6xl font-bold opacity-20">02</div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-accent/20 px-2.5 py-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>Desktop Console</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">Clinician workstation</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-bone">A focused console for the clinician side.</h3>
              </div>
              <p className="text-sm leading-relaxed text-mist">
                The desktop start splits into a confident brand hero and a compact configuration card. A hover-expanding rail keeps navigation out of the way until it's needed — the same task as mobile, re-proportioned for a wide screen and a working professional.
              </p>
            </div>

            {/* DESKTOP SCREENSHOT 02 */}
            <BlueprintCard className="p-2 overflow-hidden shadow-2xl">
              <div className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/wetguard/web-2-config.png")}
                  alt="WET Guard clinician workstation screenshot"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </BlueprintCard>
          </div>

          {/* Feature 03 — Safety Gate */}
          <div className="space-y-6">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_340px]">
              <div>
                <div className="font-mono text-6xl font-bold opacity-20">03</div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-accent/20 px-2.5 py-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>Safety Gate</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">Real-time risk monitoring</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-bone">The moment safety takes over.</h3>
              </div>
              <p className="text-sm leading-relaxed text-mist">
                Every patient message is risk-classified before the AI answers. On a high-risk signal the therapist agent is held back, the session is routed to a human, and a calm-but-firm banner explains what happened — no clinical drama, no false reassurance.
              </p>
            </div>

            {/* DESKTOP SCREENSHOT 03 */}
            <BlueprintCard className="p-2 overflow-hidden shadow-2xl">
              <div className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/wetguard/console-escalation.png")}
                  alt="WET Guard safety gate escalation screenshot"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </BlueprintCard>
          </div>

          {/* Feature 04 — Session Summary */}
          <div className="space-y-6">
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_340px]">
              <div>
                <div className="font-mono text-6xl font-bold opacity-20">04</div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-accent/20 px-2.5 py-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>Clinical Report</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">Session summary</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-bone">Raw metrics, rendered human.</h3>
              </div>
              <p className="text-sm leading-relaxed text-mist">
                The 8-dimension evaluation engine returns JSON; the summary turns it into progress bars, a stability trend, an AI narrative, and one-tap export to PDF, EHR, or raw data — everything a researcher or clinician needs after the session ends.
              </p>
            </div>

            {/* DESKTOP SCREENSHOT 04 */}
            <BlueprintCard className="p-2 overflow-hidden shadow-2xl">
              <div className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/wetguard/web-5-summary.png")}
                  alt="WET Guard session summary clinical report screenshot"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </BlueprintCard>
          </div>
        </div>
      </section>

      {/* ── ══ 04 — MOBILE VS. DESKTOP ══ ─────────────────────────────── */}
      <section id="platforms" className="px-6 py-16 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            04 — Mobile vs. Desktop
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-bone md:text-4xl">
            One protocol, two hands.
          </h2>

          <p className="mt-2 text-sm text-mist max-w-2xl">
            The patient meets WET on a phone; the clinician works it from a console. The same five-step flow is re-proportioned — never redrawn — for each context.
          </p>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[310px_1fr]">
            {/* PHONE SCREENSHOT PLATFORM */}
            <BlueprintCard className="w-[310px] rounded-[40px] p-2 bg-[#0b0b0f] shadow-2xl justify-self-center">
              <div className="overflow-hidden rounded-[32px] border border-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/wetguard/phone-info.png")}
                  alt="WET Mobile session summary screenshot"
                  className="w-full h-auto object-cover rounded-[30px]"
                />
              </div>
            </BlueprintCard>

            {/* Comparison Matrix Table */}
            <div className="space-y-6">
              <div className="divide-y divide-line/40">
                {[
                  { job: "Navigation", mobile: "Fixed 3-tab bottom bar", console: "Hover-expand icon rail" },
                  { job: "Configure", mobile: "Single stacked card", console: "Hero plus side form card" },
                  { job: "Converse", mobile: "Full-bleed bubbles", console: "Centered column plus info rail" },
                  { job: "Safety", mobile: "Inline banner in thread", console: "Banner plus live vitals monitor" },
                  { job: "Report", mobile: "Scrollable summary + export", console: "Two-column analytics dashboard" },
                ].map((r) => (
                  <div key={r.job} className="grid grid-cols-[100px_1fr_1fr] gap-4 py-4 text-xs">
                    <div className="font-mono font-bold uppercase" style={{ color: accent }}>{r.job}</div>
                    <div className="text-bone/90">{r.mobile}</div>
                    <div className="text-bone/90">{r.console}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-4">
                <BlueprintCard>
                  <div className="font-display font-semibold text-bone text-sm">Shared foundation</div>
                  <p className="mt-2 text-xs text-mist leading-relaxed">One color, type, and component set drives both — a change to the token sheet updates every screen on both platforms.</p>
                </BlueprintCard>
                <BlueprintCard>
                  <div className="font-display font-semibold text-bone text-sm">Divergent posture</div>
                  <p className="mt-2 text-xs text-mist leading-relaxed">Mobile is reassuring and linear; desktop is dense and analytical — same words, different confidence.</p>
                </BlueprintCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ══ 05 — INTERACTION & MOTION ══ ──────────────────────────── */}
      <section id="interactions" className="px-6 py-16 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            05 — Interaction &amp; Motion
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-bone md:text-4xl">
            Details you can feel.
          </h2>
          <p className="mt-2 text-sm text-mist">
            Live, interactive fragments pulled straight from the build — try them.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Live Risk Signal Toggle */}
            <BlueprintCard className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-display font-bold text-bone text-base">Safety Gate — live</div>
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider" style={{ background: `${accent}20`, color: accent }}>Interactive</span>
                </div>
                <p className="mt-2 text-xs text-mist">Flip the last patient message from safe to high-risk and watch the interface respond.</p>

                <div className="mt-6 rounded-xl border border-line bg-ground p-4">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-mist">Risk Level</span>
                    <span className={`font-bold ${riskOn ? "text-red-400" : "text-emerald-400"}`}>{riskOn ? "HIGH" : "NONE"}</span>
                  </div>
                  {riskOn && (
                    <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                      <span className="font-semibold text-red-400">⚠️ Session escalated to human clinician</span>
                      <p className="mt-1 text-[11px] opacity-80">The therapist agent was held back. No automated reply was generated.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setRiskOn(!riskOn)}
                className="mt-6 w-full rounded-lg py-3 font-display text-xs font-semibold cursor-pointer shadow-md"
                style={{ background: accent, color: "#0b0b0f" }}
              >
                Toggle risk signal ({riskOn ? "Reset to Safe" : "Trigger High Risk"})
              </button>
            </BlueprintCard>

            {/* AI thinking state */}
            <BlueprintCard>
              <div className="font-display font-bold text-bone text-base">AI thinking state</div>
              <p className="mt-2 text-xs text-mist">A three-dot indicator keeps the wait honest while the therapist agent composes.</p>
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-ground p-4">
                <div className="h-6 w-6 rounded-full bg-mist/20" />
                <div className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-2">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:0.4s]" />
                </div>
              </div>
            </BlueprintCard>
          </div>
        </div>
      </section>

      {/* ── ══ 06 — RESULTS & DATA ══ ─────────────────────────────────── */}
      <section id="results" className="px-6 py-16 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            06 — Results &amp; Data
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-bone md:text-4xl">
            Designed to be measured.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { val: "0.93", lbl: "Overall protocol fidelity" },
              { val: "8", lbl: "Evaluation dimensions scored" },
              { val: "100%", lbl: "Risk turns gated to a human" },
              { val: "2", lbl: "Platforms, one design system" },
            ].map((m) => (
              <div key={m.lbl} className="rounded-lg border border-line bg-ground p-6">
                <div className="font-display text-4xl font-extrabold" style={{ color: accent }}>{m.val}</div>
                <div className="mt-2 text-xs text-mist">{m.lbl}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>Session 1 · granular metrics</div>
              <h3 className="mt-2 font-display text-2xl font-bold text-bone">The report the UI has to carry.</h3>
              <p className="mt-3 text-sm text-mist leading-relaxed">
                Each dimension is a weighted score from the evaluation engine. The summary screen turns these numbers into progress bars and narrative a clinician reads in seconds.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { label: "Verbatim Delivery", score: 93 },
                { label: "Patient Interaction", score: 100 },
                { label: "Professional Boundaries", score: 100 },
                { label: "Suicidality Assessed", score: 100 },
                { label: "Prompt Adherence", score: 88 },
                { label: "Derailment Management", score: 85 },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between">
                    <span className="text-bone/90">{d.label}</span>
                    <span className="font-mono font-bold" style={{ color: accent }}>{d.score}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ══ CLOSING ══ ─────────────────────────────────────────────── */}
      <footer className="px-6 py-24 md:px-10 border-t border-line text-center bg-raised/40">
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Thanks for reading</div>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-5xl text-bone">
            Let's design the calm<br />into hard problems.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-mist max-w-xl mx-auto leading-relaxed">
            WET Guard was an exercise in restraint — an interface that stays quiet so a difficult conversation can happen safely across every screen.
          </p>

          <BlueprintCard className="mt-12 inline-flex flex-wrap justify-center gap-8 text-left bg-transparent">
            <div>
              <div className="font-mono text-[10px] uppercase text-mist">Role</div>
              <div className="font-display text-sm font-semibold text-bone mt-1">Interaction Design &amp; Front-End Lead</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-mist">Project</div>
              <div className="font-display text-sm font-semibold text-bone mt-1">WET Guard · 2026</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-mist">Contact</div>
              <div className="font-display text-sm font-semibold text-bone mt-1">gxe.melody@gmail.com</div>
            </div>
          </BlueprintCard>
        </div>
      </footer>
    </div>
  );
}
