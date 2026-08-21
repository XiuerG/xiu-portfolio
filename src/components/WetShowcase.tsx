"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { getAssetPath } from "@/lib/utils";

/* ================================================================== */
/* WET Guard Portfolio — Full Editorial Case Study Page               */
/* Faithfully recreated from WET Guard Portfolio.dc.html             */
/* ================================================================== */

function BlueprintCard({
  children,
  className = "",
  accent = "#84b59f",
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
}) {
  return (
    <div className={`relative rounded-none border border-line bg-raised/40 p-6 ${className}`}>
      {/* Blueprint corner markers */}
      <span className="absolute -left-px -top-px h-2 w-2 border-l border-t" style={{ borderColor: accent }} />
      <span className="absolute -right-px -top-px h-2 w-2 border-r border-t" style={{ borderColor: accent }} />
      <span className="absolute -bottom-px -left-px h-2 w-2 border-b border-l" style={{ borderColor: accent }} />
      <span className="absolute -bottom-px -right-px h-2 w-2 border-b border-r" style={{ borderColor: accent }} />
      {children}
    </div>
  );
}

export function WetShowcase({ accent = "#84b59f" }: { accent?: string }) {
  const [riskOn, setRiskOn] = useState(false);
  const [activeTab, setActiveTab] = useState<"console" | "mobile">("console");
  const [consoleIdx, setConsoleIdx] = useState(0);
  const [mobileIdx, setMobileIdx] = useState(0);

  return (
    <div className="relative min-h-screen bg-ground text-bone font-sans overflow-x-hidden selection:bg-accent/30 selection:text-bone">
      {/* ── Sticky Case Study Navigation ────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-line bg-ground/80 px-6 py-4 backdrop-blur-md md:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex h-6 w-6 items-center justify-center rounded text-ground transition-transform group-hover:scale-105"
              style={{ background: accent }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </svg>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">WET Guard</span>
          </Link>
          <span className="hidden sm:inline-block border-l border-line pl-3 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
            Case Study · 2026
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-mist">
          <a href="#overview" className="hover:text-bone transition-colors">Overview</a>
          <a href="#process" className="hover:text-bone transition-colors">Process</a>
          <a href="#features" className="hover:text-bone transition-colors">Features</a>
          <a href="#platforms" className="hover:text-bone transition-colors">Platforms</a>
          <a href="#results" className="hover:text-bone transition-colors">Results</a>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <header className="relative px-6 pt-16 pb-20 md:px-10 md:pt-24 text-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative mx-auto max-w-5xl flex flex-col items-center">
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            UI / UX Case Study · 2026
            <span className="h-[1px] w-6" style={{ background: accent }} />
          </div>

          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            WET Guard
          </h1>

          <p className="mt-3 font-display text-xl font-medium tracking-wide md:text-2xl" style={{ color: accent }}>
            AI-Guided Written Exposure Therapy — Mobile &amp; Desktop
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist">
            A clinician-assisted platform running the evidence-based WET protocol for PTSD — with an AI therapist, real-time safety gating, and an 8-dimension evaluation engine, designed end to end across two form factors.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 font-mono text-xs">
            {["AI Therapy Flow", "Safety Gate", "iOS Mobile", "Desktop Console", "Clinical Report"].map((tag) => (
              <span key={tag} className="rounded-full border border-line bg-raised/40 px-3.5 py-1 text-bone/90">
                {tag}
              </span>
            ))}
          </div>

          {/* ── LAPTOP MOCKUP HERO ─────────────────────────────────── */}
          <div className="mt-12 w-full max-w-5xl">
            <div className="rounded-[24px] border border-neutral-700 bg-neutral-900 p-3 sm:p-4 shadow-2xl">
              {/* Laptop camera dot */}
              <div className="flex justify-center pb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              </div>
              {/* Screen display */}
              <div className="overflow-hidden rounded-lg bg-[#F3F4F8] text-neutral-900 text-left shadow-inner">
                <div className="flex h-[420px] sm:h-[500px] bg-[#F3F4F8]">
                  {/* Sidebar */}
                  <div className="w-14 flex-none border-r border-gray-200 bg-white p-3 flex flex-col items-center justify-between">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                        W
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main screen area */}
                  <div className="flex-1 flex items-center justify-between p-6 sm:p-10">
                    <div className="space-y-3">
                      <h2 className="font-display text-3xl font-extrabold text-gray-900 sm:text-4xl">WET Guard</h2>
                      <p className="text-sm font-semibold text-blue-600">AI Guided Written Exposure Therapy</p>
                      <div className="flex gap-4 pt-2 font-sans text-xs text-gray-600">
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-blue-600">✓</span> Clinical Validated</span>
                        <span className="flex items-center gap-1.5 font-medium"><span className="text-blue-600">✓</span> HIPAA Compliant</span>
                      </div>
                    </div>

                    {/* Start session card */}
                    <div className="w-80 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl text-left">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div>
                          <div className="font-bold text-sm text-gray-900">Start Session</div>
                          <div className="text-[11px] text-gray-400">Configure your simulation parameters</div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2.5 text-xs">
                        <div>
                          <span className="font-mono text-[10px] uppercase text-gray-400">Therapist Name</span>
                          <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-800">
                            Dr. Sarah Wilson
                          </div>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-gray-400">Patient Name</span>
                          <div className="mt-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-800">
                            Alex R.
                          </div>
                        </div>
                        <div>
                          <span className="font-mono text-[10px] uppercase text-gray-400">WET Session #</span>
                          <div className="mt-1 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-800">
                            <span>WET Session 1</span>
                            <span className="text-gray-400">▾</span>
                          </div>
                        </div>
                      </div>

                      <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-xs text-white shadow-md">
                        Start Session →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Laptop base line */}
            <div className="h-3 w-full rounded-b-xl bg-neutral-700 shadow-md" />
          </div>

          {/* Meta cells row */}
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

      {/* ── Section 01 — Overview & Challenge ─────────────────────── */}
      <section id="overview" className="px-6 py-20 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            01 — Overview &amp; Challenge
          </div>

          <div className="mt-6 grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">
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
              <BlueprintCard accent={accent}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 01</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-bone">Safety can't be an afterthought</h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">Risk signals must surface instantly and route to a human — without alarming the patient.</p>
              </BlueprintCard>
              <BlueprintCard accent={accent}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 02</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-bone">One protocol, two contexts</h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">A patient on a phone and a clinician at a console need the same flow, shaped differently.</p>
              </BlueprintCard>
              <BlueprintCard accent={accent}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 03</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-bone">Measurable by design</h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">Eight fidelity metrics needed to read at a glance, not as raw JSON.</p>
              </BlueprintCard>
              <BlueprintCard accent={accent}>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>Problem 04</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-bone">Trust through restraint</h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">A calm, near-monochrome interface so the words carry the weight, not the chrome.</p>
              </BlueprintCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 02 — Design Process ────────────────────────────── */}
      <section id="process" className="px-6 py-20 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            02 — Design Process
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            From clinical guideline to shipped interface.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", title: "Protocol Research", desc: "Read the WET treatment manual & safety guidelines. Mapped the 5-session arc and every scripted checkpoint." },
              { num: "02", title: "Flows & Wireframes", desc: "Storyboarded login → configure → converse → escalate → summarize, for both patient and clinician roles." },
              { num: "03", title: "System & UI", desc: "Built a calm iOS-grade token set — one primary blue, generous radii, quiet surfaces — reused across both apps." },
              { num: "04", title: "Build & Wire", desc: "Shipped React clients against the FastAPI backend — live risk classification, streaming replies, real evaluation." },
            ].map((step) => (
              <div key={step.num} className="relative rounded-xl border border-line bg-ground p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold" style={{ border: `1px solid ${accent}`, color: accent }}>
                  {step.num}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-bone">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-mist">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 03 — Core Features & Showcase ───────────────────── */}
      <section id="features" className="px-6 py-20 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            03 — Core Features
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Five moments that define the product.
          </h2>

          <p className="mt-2 text-base text-mist">
            Each recreated below at full fidelity from the shipped React clients.
          </p>

          {/* Feature 01: WET Mobile Onboarding */}
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <span className="font-mono text-5xl font-bold opacity-20">01</span>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded bg-accent/20 px-2 py-0.5 font-mono text-xs font-semibold" style={{ color: accent }}>WET Mobile</span>
                <span className="font-mono text-xs uppercase tracking-wider text-mist">Patient onboarding</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold text-bone">A one-screen start that reassures before it asks.</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                The mobile entry compresses identity, therapist, and session number into a single soft card. A gradient primary button and a privacy line keep the first tap low-stakes. Everything is 44px+ touch-safe and sits inside a native iOS tab shell.
              </p>
              <ul className="mt-6 space-y-2 text-xs text-mist">
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Icon-led fields reduce reading load for distressed users.</li>
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Custom session dropdown keeps the flow inside one card.</li>
                <li className="flex items-center gap-2"><span style={{ color: accent }}>+</span> Persistent bottom tab bar for Home · Therapy · Session.</li>
              </ul>
            </div>

            {/* iPhone Frame */}
            <div className="justify-self-center w-[300px] rounded-[40px] border-4 border-neutral-800 bg-neutral-950 p-3 shadow-2xl">
              <div className="relative h-[580px] overflow-hidden rounded-[32px] bg-[#F2F2F7] text-neutral-900 text-left">
                <div className="p-4 pt-8">
                  <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold shadow-md">
                      W
                    </div>
                    <div className="font-bold text-lg text-gray-900">Welcome to WET Mobile</div>
                    <div className="text-[10px] text-gray-500">AI Guided Written Exposure Therapy</div>

                    <div className="mt-4 space-y-3 text-left text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-gray-600">Patient Name</span>
                        <div className="mt-1 rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-900">Alex R.</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-gray-600">Therapist Name</span>
                        <div className="mt-1 rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-900">Dr. Sarah Wilson</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-gray-600">WET Session #</span>
                        <div className="mt-1 flex justify-between rounded-xl border border-gray-200 bg-white p-2.5 font-medium text-gray-900">
                          <span>WET Session 1</span>
                          <span>▾</span>
                        </div>
                      </div>
                    </div>

                    <button className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-xs text-white shadow-lg">
                      Start Session ▶
                    </button>
                  </div>
                </div>

                {/* iOS bottom tab bar */}
                <div className="absolute inset-x-0 bottom-0 flex justify-around border-t border-gray-200 bg-white py-3 text-[10px] text-gray-500">
                  <span className="font-semibold text-blue-600">Home</span>
                  <span>Therapy</span>
                  <span>Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 02 & 03 & 04 Interactive Surface Switcher */}
          <div className="mt-20 rounded-2xl border border-line bg-raised/30 p-6 md:p-10">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="font-display text-xl font-bold">Interactive Surface Switcher</h3>
              <div className="flex gap-4 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("console")}
                  className={`pb-2 transition-colors border-b-2 cursor-pointer ${activeTab === "console" ? "text-bone" : "text-mist border-transparent"}`}
                  style={{ borderColor: activeTab === "console" ? accent : undefined }}
                >
                  Clinician Console
                </button>
                <button
                  onClick={() => setActiveTab("mobile")}
                  className={`pb-2 transition-colors border-b-2 cursor-pointer ${activeTab === "mobile" ? "text-bone" : "text-mist border-transparent"}`}
                  style={{ borderColor: activeTab === "mobile" ? accent : undefined }}
                >
                  Patient App
                </button>
              </div>
            </div>

            <div className="mt-8">
              {/* Screenshots preview */}
              <div className="overflow-hidden rounded-xl border border-line bg-ground p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath(activeTab === "console" ? "/wetguard/web-3-chat.png" : "/wetguard/phone-session.png")}
                  alt="WET Guard surface screenshot preview"
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 04 — Mobile vs. Desktop ────────────────────────── */}
      <section id="platforms" className="px-6 py-20 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            04 — Mobile vs. Desktop
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            One protocol, two hands.
          </h2>

          <p className="mt-2 text-base text-mist max-w-2xl">
            The patient meets WET on a phone; the clinician works it from a console. The same five-step flow is re-proportioned — never redrawn — for each context.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line font-mono text-xs text-mist uppercase tracking-widest">
                  <th className="pb-3 font-semibold">Dimension</th>
                  <th className="pb-3 font-semibold">Patient App</th>
                  <th className="pb-3 font-semibold">Clinician Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {[
                  { job: "Navigation", mobile: "Fixed three-tab bottom bar", console: "Hover-expand icon rail" },
                  { job: "Configure", mobile: "Single stacked card", console: "Hero plus side form card" },
                  { job: "Converse", mobile: "Full-bleed bubbles", console: "Centered column plus info rail" },
                  { job: "Safety", mobile: "Inline banner in thread", console: "Banner plus live vitals monitor" },
                  { job: "Report", mobile: "Scrollable summary + export", console: "Two-column analytics dashboard" },
                ].map((row) => (
                  <tr key={row.job}>
                    <td className="py-4 font-mono text-xs font-bold uppercase" style={{ color: accent }}>{row.job}</td>
                    <td className="py-4 text-bone/90">{row.mobile}</td>
                    <td className="py-4 text-bone/90">{row.console}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 05 — Interaction & Motion ─────────────────────── */}
      <section id="interactions" className="px-6 py-20 md:px-10 border-t border-line">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            05 — Interaction &amp; Motion
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Details you can feel.
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Live risk gating demo */}
            <BlueprintCard accent={accent} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-bone">Safety Gate — live</h3>
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
                className="mt-6 w-full rounded-lg py-2.5 font-display text-xs font-semibold cursor-pointer shadow-md"
                style={{ background: accent, color: "#0a0a0a" }}
              >
                Toggle risk signal ({riskOn ? "Reset to Safe" : "Trigger High Risk"})
              </button>
            </BlueprintCard>

            {/* AI thinking state */}
            <BlueprintCard accent={accent}>
              <h3 className="font-display text-lg font-bold text-bone">AI thinking state</h3>
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

      {/* ── Section 06 — Results & Data ───────────────────────────── */}
      <section id="results" className="px-6 py-20 md:px-10 border-t border-line bg-raised/20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>
            <span className="h-[1px] w-6" style={{ background: accent }} />
            06 — Results &amp; Data
          </div>

          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Designed to be measured.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { val: "0.93", lbl: "Overall protocol fidelity" },
              { val: "8", lbl: "Evaluation dimensions scored" },
              { val: "100%", lbl: "Risk turns gated to a human" },
              { val: "2", lbl: "Platforms, one design system" },
            ].map((m) => (
              <div key={m.lbl} className="relative rounded-xl border border-line bg-ground p-6">
                <div className="font-display text-4xl font-extrabold" style={{ color: accent }}>{m.val}</div>
                <div className="mt-2 text-xs text-mist">{m.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────── */}
      <footer className="px-6 py-24 md:px-10 border-t border-line text-center bg-raised/40">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Thanks for reading</span>
          <h2 className="mt-4 font-display text-4xl font-extrabold md:text-5xl">
            Let's design the calm<br />into hard problems.
          </h2>
          <p className="mt-4 text-base text-mist">
            WET Guard was an exercise in restraint — an interface that stays quiet so a difficult conversation can happen safely across every screen.
          </p>

          <div className="mt-10">
            <Link
              href="/#contact"
              className="inline-flex rounded-full px-8 py-3.5 font-display text-sm font-semibold text-ground shadow-lg transition-transform hover:scale-105"
              style={{ background: accent }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
