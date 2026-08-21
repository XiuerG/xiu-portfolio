"use client";

import { useState } from "react";
import Link from "next/link";

/* ================================================================== */
/* WET Guard Portfolio — Full Editorial Case Study Page               */
/* Exact 1:1 React implementation of WET Guard Portfolio.dc.html       */
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
              className="flex h-6 w-6 items-center justify-center rounded-sm text-ground"
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
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(120%_80%_at_70%_20%,#000_30%,transparent_80%)]" />

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

          {/* ── LAPTOP MOCKUP ─────────────────────────────────────── */}
          <div className="mt-12 w-full max-w-4xl">
            <div className="rounded-[26px] border border-neutral-700 bg-neutral-900 p-3 sm:p-4 shadow-2xl">
              <div className="flex justify-center pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600 shadow-inner" />
              </div>
              <div className="overflow-hidden rounded-lg bg-[#F3F4F8] text-neutral-900 text-left shadow-inner">
                <div className="flex h-[440px] sm:h-[500px] bg-[#F3F4F8]">
                  {/* Laptop Sidebar */}
                  <div className="w-14 flex-none border-r border-gray-200 bg-white p-3 flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a56db] text-white font-bold shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#1a56db]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Laptop Main Content */}
                  <div className="flex-1 flex items-center justify-between p-6 sm:p-10">
                    <div className="space-y-3">
                      <h2 className="font-display text-3xl font-extrabold text-gray-900 sm:text-4xl">WET Guard</h2>
                      <p className="text-sm font-semibold text-[#1a56db]">AI Guided Written Exposure Therapy</p>
                      <div className="flex gap-4 pt-2 font-sans text-xs text-gray-600">
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-[#1a56db]">✓</span> Clinical Validated</span>
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-[#1a56db]">✓</span> HIPAA Compliant</span>
                      </div>
                    </div>

                    {/* Start session card */}
                    <div className="w-80 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl text-left">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <div className="font-bold text-base text-gray-900">Start Session</div>
                          <div className="text-[11px] text-gray-400">Configure your simulation parameters</div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#1a56db]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2.5 text-xs">
                        <div>
                          <span className="font-mono text-[10px] font-semibold uppercase text-gray-500">Therapist Name</span>
                          <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 font-medium">
                            Dr. Sarah Wilson
                          </div>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] font-semibold uppercase text-gray-500">Patient Name</span>
                          <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 font-medium">
                            Alex R.
                          </div>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] font-semibold uppercase text-gray-500">WET Session #</span>
                          <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 font-medium">
                            <span>WET Session 1</span>
                            <span className="text-gray-400">▾</span>
                          </div>
                        </div>
                      </div>

                      <button className="mt-4 w-full rounded-xl bg-[#1a56db] py-3 font-semibold text-xs text-white shadow-md">
                        Start Session →
                      </button>
                    </div>
                  </div>
                </div>
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

            {/* PHONE 01: Onboarding Frame */}
            <div className="justify-self-center">
              <BlueprintCard className="w-[320px] rounded-[40px] p-2 bg-[#0b0b0f] shadow-2xl">
                <div className="relative h-[620px] rounded-[32px] overflow-hidden bg-[#F2F2F7] text-neutral-900 text-left">
                  <div className="p-5 pt-8">
                    <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a56db] text-white shadow-md">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                      </div>
                      <div className="font-extrabold text-xl text-gray-900">Welcome to WET Mobile</div>
                      <div className="text-[11px] text-gray-500 font-medium mt-1">AI Guided Written Exposure Therapy</div>

                      <div className="mt-5 space-y-3.5 text-left text-xs">
                        <div>
                          <span className="text-[11px] font-semibold text-gray-700">Patient Name</span>
                          <div className="mt-1 rounded-xl border border-gray-100 bg-white p-3 font-medium text-gray-900 shadow-sm">Alex R.</div>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-gray-700">Therapist Name</span>
                          <div className="mt-1 rounded-xl border border-gray-100 bg-white p-3 font-medium text-gray-900 shadow-sm">Dr. Sarah Wilson</div>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-gray-700">WET Session #</span>
                          <div className="mt-1 flex justify-between rounded-xl border border-gray-100 bg-white p-3 font-medium text-gray-900 shadow-sm">
                            <span className="font-semibold">WET Session 1</span>
                            <span className="text-gray-400">▾</span>
                          </div>
                        </div>
                      </div>

                      <button className="mt-6 w-full rounded-2xl bg-gradient-to-b from-[#0A84FF] to-[#007AFF] py-3.5 font-semibold text-xs text-white shadow-lg">
                        Start Session ▶
                      </button>
                      <div className="mt-3 text-[9.5px] text-gray-400 text-center">By starting, you agree to the privacy terms and conditions.</div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-gray-100 bg-white py-3 text-[10px] text-gray-500">
                    <span className="font-semibold text-[#007AFF]">Home</span>
                    <span>Therapy</span>
                    <span>Session</span>
                  </div>
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

            {/* DESKTOP 02: Console Frame */}
            <BlueprintCard className="p-0 overflow-hidden shadow-2xl">
              <div className="flex h-[470px] bg-[#F3F4F8] text-neutral-900 text-left">
                <div className="w-14 flex-none border-r border-gray-200 bg-white p-3 flex flex-col justify-between">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a56db] text-white font-bold">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-between p-8 sm:p-12">
                  <div className="space-y-3">
                    <h2 className="font-display text-4xl font-extrabold text-gray-900">WET Guard</h2>
                    <p className="text-sm font-semibold text-[#1a56db]">AI Guided Written Exposure Therapy</p>
                    <div className="flex gap-4 pt-2 font-sans text-xs text-gray-600">
                      <span className="flex items-center gap-1.5 font-medium"><span className="text-[#1a56db]">✓</span> Clinical Validated</span>
                      <span className="flex items-center gap-1.5 font-medium"><span className="text-[#1a56db]">✓</span> HIPAA Compliant</span>
                    </div>
                  </div>
                  <div className="w-80 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                    <div className="font-bold text-base text-gray-900">Start Session</div>
                    <div className="text-xs text-gray-400 mt-1">Configure your simulation parameters</div>
                    <button className="mt-6 w-full rounded-xl bg-[#1a56db] py-3 font-semibold text-xs text-white shadow-md">
                      Start Session →
                    </button>
                  </div>
                </div>
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

            {/* DESKTOP 03: Escalation Frame */}
            <BlueprintCard className="p-0 overflow-hidden shadow-2xl">
              <div className="flex h-[500px] bg-[#F3F4F8] text-neutral-900 text-left">
                <div className="flex-1 flex flex-col justify-between p-6">
                  <div className="max-w-xl mx-auto space-y-4 w-full">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <div className="font-bold text-red-600 text-sm flex items-center gap-2">
                        <span>⚠️</span> Safety gate — session escalated
                      </div>
                      <p className="mt-1 text-xs text-red-700 leading-relaxed">
                        A risk indicator was detected in the patient's last message. The therapist agent was held back and this session is routed to a human clinician. No automated reply was generated.
                      </p>
                    </div>
                  </div>
                  <div className="max-w-xl mx-auto w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-400">
                    Session paused — awaiting clinician
                  </div>
                </div>
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

            {/* DESKTOP 04: Summary Frame */}
            <BlueprintCard className="p-0 overflow-hidden shadow-2xl">
              <div className="bg-[#F3F4F8] p-8 text-neutral-900 text-left">
                <div className="font-bold text-2xl text-gray-900">Session Summary</div>
                <div className="text-xs text-gray-500 mt-1">Comprehensive clinical analysis for session WET-2026-014.</div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="font-bold text-xs uppercase tracking-wider text-gray-400">Session Identity</div>
                    <div className="mt-3 font-bold text-lg text-gray-900">Alex R.</div>
                    <div className="text-xs text-gray-500 mt-1">Duration: 48m 12s · WET Session 1</div>
                  </div>
                  <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <div className="font-bold text-xs uppercase tracking-wider text-gray-400">Safety Status</div>
                    <div className="mt-3 font-bold text-lg text-blue-600">Real-time Verified</div>
                    <div className="text-xs text-gray-500 mt-1">Emotional Regulation: 88% · Cognitive Coherence: 94%</div>
                  </div>
                </div>
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

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[320px_1fr]">
            {/* Phone Summary Frame */}
            <BlueprintCard className="w-[320px] rounded-[40px] p-2 bg-[#0b0b0f] shadow-2xl justify-self-center">
              <div className="h-[560px] rounded-[32px] overflow-y-auto bg-[#F2F2F7] p-4 text-neutral-900 text-left">
                <div className="font-bold text-base text-gray-900 text-center py-2">Session Summary</div>
                <div className="mt-3 rounded-2xl bg-white p-4 text-xs space-y-2 shadow-sm">
                  <div className="font-semibold text-gray-400 uppercase text-[10px]">Session Identity</div>
                  <div>Patient: <strong className="text-gray-900">Alex R.</strong></div>
                  <div>Therapist: <strong className="text-gray-900">Dr. Sarah Wilson</strong></div>
                  <div>Duration: <strong className="text-gray-900">14m 02s</strong></div>
                </div>
                <div className="mt-3 rounded-2xl bg-blue-50 p-4 text-xs">
                  <div className="font-bold text-blue-600">AI Narrative Summary</div>
                  <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">Session 1 delivered standard WET psychoeducation. Active engagement; no risk triggers detected.</p>
                </div>
              </div>
            </BlueprintCard>

            {/* Comparison Matrix Table */}
            <div className="space-y-6">
              <div className="divide-y divide-line/40">
                {[
                  { job: "Navigation", mobile: "Fixed 3-tab bottom bar", console: "Hover-expand icon rail" },
                  { job: "Configure", mobile: "Single stacked card", console: "Hero + side form card" },
                  { job: "Converse", mobile: "Full-bleed bubbles", console: "Centered column + info rail" },
                  { job: "Safety", mobile: "Inline banner in thread", console: "Banner + live vitals monitor" },
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
