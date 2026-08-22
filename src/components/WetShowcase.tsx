"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNextProject } from "@/lib/projects";
import "./wetguard-industry.css";

/* ==================================================================
   WET Guard — a faithful port of the "WET Guard Portfolio.dc.html"
   design document (Claude Design project 6d92b717), rendered as the
   standalone page behind /work/wet-guard.

   The markup below is the design's own, converted to JSX; the product
   UI in each band is the design's recreation rather than a screenshot,
   which is what the document ships. Design-system classes and tokens
   live in ./wetguard-industry.css, scoped to `.wg`.

   Two behaviours come from the document's DCLogic class: a scroll
   reveal that adds `.in` to [data-reveal], and a scrollspy that tints
   the active .navlink.

   The safety model departs from the source document. The original gated
   the scripted dialogue and interrupted with a full-width alarm; this
   version follows the single-interface / progressive-disclosure design:
   monitoring runs silently, a signal earns a quiet queue entry, and the
   full read only exists behind a deliberate click. See SAFETY_STATES.
   ================================================================== */

type SafetyState = "monitoring" | "review" | "intervention";

/* The escalation ladder. Note how little changes between the first two:
   a detected signal earns a quiet queue entry and a deliberate click, not a
   change to the patient's writing flow. Only imminent danger reaches the
   third state, where the system is finally allowed to interrupt. */
const SAFETY_STATES: {
  key: SafetyState;
  label: string;
  status: string;
  dot: string;
  detail?: string;
  action?: string;
  note: string;
}[] = [
  {
    key: "monitoring",
    label: "Monitoring",
    status: "Active",
    dot: "var(--ui-ok)",
    note: "The classifier is running on every autosave. Nothing about the writing surface changes, and nothing is shown to the patient that was not already disclosed before the session began.",
  },
  {
    key: "review",
    label: "Review",
    status: "Active",
    dot: "var(--ui-ok)",
    detail: "Review queued",
    action: "Review signal",
    note: "A signal worth a human read, with no evidence of imminent danger. It is logged and queued; the writing continues untouched. The indicators stay behind the button — detection is not diagnosis.",
  },
  {
    key: "intervention",
    label: "Intervention",
    status: "Assessment requested",
    dot: "var(--ui-warn)",
    detail: "Clinician joining",
    action: "Begin safety assessment",
    note: "Only an explicit, imminent signal reaches this state — the one case where changing the therapeutic flow is the safer choice. A clinician takes over the session directly.",
  },
];

export function WetShowcase() {
  /* Three states, not two. A detected signal is not an emergency, and only a
     genuine imminent-danger signal is allowed to change the writing flow. */
  const [safety, setSafety] = useState<SafetyState>("monitoring");
  const ACTIVE = SAFETY_STATES.find((st) => st.key === safety)!;

  /* Progressive disclosure: the full signal detail only exists once someone
     deliberately opens the safety workflow. Detection is not diagnosis, so
     none of it is asserted at the patient mid-exposure. */
  const [signalOpen, setSignalOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector(".wg");
    if (!root) return;

    const reveals = Array.from(root.querySelectorAll("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((e) => e.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((e) => io.observe(e));

    // [data-reveal] starts at opacity 0, so anything that never gets an
    // intersection callback would stay invisible. Backstop the whole set.
    const backstop = window.setTimeout(() => {
      reveals.forEach((e) => e.classList.add("in"));
    }, 1500);

    const links = Array.from(
      root.querySelectorAll<HTMLElement>("nav .navlink"),
    );
    const sections = Array.from(root.querySelectorAll("section[id]"));
    let spy: IntersectionObserver | undefined;
    if (sections.length) {
      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((l) => {
              l.style.color = "";
            });
            const active = links.find(
              (l) => l.getAttribute("href") === "#" + en.target.id,
            );
            if (active) active.style.color = "var(--color-accent)";
          });
        },
        { rootMargin: "-45% 0px -50% 0px" },
      );
      sections.forEach((sec) => spy!.observe(sec));
    }

    return () => {
      window.clearTimeout(backstop);
      io.disconnect();
      spy?.disconnect();
    };
  }, []);

  /**
   * Phone scaling for the console mockups. They are drawn at a desktop width
   * and scaled down whole (see the `zoom` rule in wetguard-industry.css), which
   * needs a ratio CSS cannot compute on its own — `zoom` takes a number, not a
   * calc(). Publish one as a custom property and keep it in step with resizes.
   */
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".wg");
    if (!root) return;

    const DESIGN_WIDTH = 900;
    const GUTTER = 40; // the section padding the mockups sit inside

    const apply = () => {
      if (window.innerWidth >= 768) {
        root.style.removeProperty("--wg-app-scale");
        return;
      }
      const scale = Math.min(
        1,
        (window.innerWidth - GUTTER) / DESIGN_WIDTH,
      );
      root.style.setProperty("--wg-app-scale", String(Math.max(0.3, scale)));
    };

    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  const next = getNextProject("wet-guard");

  return (
    <>
      <div className="wg">
        <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
          {/* ══ NAV ══ */}
          <nav
            style={{
              position: "sticky",
              top: "60px",
              zIndex: "30",
              display: "flex",
              alignItems: "center",
              gap: "28px",
              padding: "16px 40px",
              background:
                "color-mix(in srgb, var(--color-bg) 82%, transparent)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid var(--color-divider)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  background: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-bg)"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: "600",
                  fontSize: "18px",
                  letterSpacing: ".01em",
                }}
              >
                WET&nbsp;Guard
              </span>
              <span
                style={{
                  fontSize: "13px",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  borderLeft: "1px solid var(--color-divider)",
                  paddingLeft: "10px",
                }}
              >
                Case&nbsp;Study
              </span>
            </div>
            <a
              href="#overview"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Overview
            </a>
            <a
              href="#process"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Process
            </a>
            <a
              href="#features"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Features
            </a>
            <a
              href="#platforms"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Platforms
            </a>
            <a
              href="#results"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Results
            </a>
            <a
              href="#purpose"
              className="navlink"
              style={{ fontSize: "14px", letterSpacing: ".02em" }}
            >
              Purpose
            </a>
          </nav>

          {/* ══ HERO ══ */}
          <header
            style={{
              position: "relative",
              padding: "76px 40px 60px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0",
                backgroundImage:
                  "linear-gradient(var(--color-divider) 1px,transparent 1px),linear-gradient(90deg,var(--color-divider) 1px,transparent 1px)",
                backgroundSize: "44px 44px",
                opacity: ".5",
                animation: "wg-gridpan 22s linear infinite",
                WebkitMaskImage:
                  "radial-gradient(120% 80% at 70% 20%,#000 30%,transparent 80%)",
                maskImage:
                  "radial-gradient(120% 80% at 70% 20%,#000 30%,transparent 80%)",
              }}
            ></div>
            <div
              style={{
                position: "relative",
                maxWidth: "1180px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "13.5px",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                Digital Health · Human&ndash;AI Interaction
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(48px,6.4vw,80px)",
                  lineHeight: ".96",
                  margin: "18px 0 0",
                  letterSpacing: "-.025em",
                }}
              >
                WET&nbsp;Guard
              </h1>
              <p
                style={{
                  fontSize: "clamp(16px,1.8vw,21px)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: "600",
                  color: "var(--color-accent-700)",
                  margin: "10px 0 0",
                  letterSpacing: ".01em",
                }}
              >
                A clinician-mediated system for delivering Written Exposure
                Therapy.
              </p>
              <p
                style={{
                  maxWidth: "600px",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "color-mix(in srgb,var(--color-text) 72%,transparent)",
                  margin: "18px 0 0",
                }}
              >
                WET Guard translates a structured clinical protocol into a
                guided digital workflow &mdash; helping clinicians deliver
                therapy consistently while keeping the patient&rsquo;s writing
                experience focused, uninterrupted, and human.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "22px",
                }}
              >
                <span
                  className="tag tag-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Digital Health
                </span>
                <span
                  className="tag tag-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Human&ndash;AI Interaction
                </span>
                <span
                  className="tag tag-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Clinical Workflow
                </span>
                <span
                  className="tag tag-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Product Design
                </span>
                <span
                  className="tag tag-outline"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Front-end Development
                </span>
              </div>

              {/* LAPTOP */}
              <div style={{ width: "min(1000px,100%)", marginTop: "52px" }}>
                <ConsoleLaptop />
              </div>

              {/* meta cells */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "16px",
                  marginTop: "44px",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "15px",
                    }}
                  >
                    Interaction Design &amp; Front-End Lead
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color:
                        "color-mix(in srgb,var(--color-text) 66%,transparent)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      marginTop: "3px",
                    }}
                  >
                    Role
                  </div>
                </div>
                <div
                  style={{ width: "1px", background: "var(--color-divider)" }}
                ></div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "15px",
                    }}
                  >
                    React · Tailwind · FastAPI
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color:
                        "color-mix(in srgb,var(--color-text) 66%,transparent)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      marginTop: "3px",
                    }}
                  >
                    Stack
                  </div>
                </div>
                <div
                  style={{ width: "1px", background: "var(--color-divider)" }}
                ></div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "15px",
                    }}
                  >
                    2 clients · 1 system
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      color:
                        "color-mix(in srgb,var(--color-text) 66%,transparent)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      marginTop: "3px",
                    }}
                  >
                    Scope
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ══ OVERVIEW / CHALLENGE ══ */}
          <section
            id="overview"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                01 — Overview &amp; Challenge
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.1fr",
                  gap: "56px",
                  marginTop: "26px",
                  alignItems: "start",
                }}
              >
                <div data-reveal>
                  <h2
                    style={{
                      fontSize: "38px",
                      lineHeight: "1.05",
                      margin: "0",
                    }}
                  >
                    Turning a clinical protocol into a usable treatment
                    workflow.
                  </h2>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color:
                        "color-mix(in srgb,var(--color-text) 74%,transparent)",
                      marginTop: "18px",
                    }}
                  >
                    Written Exposure Therapy is intentionally structured. Each
                    session follows a defined sequence of instructions, timed
                    writing, clinician guidance, and review. That structure
                    supports treatment fidelity &mdash; but it also creates an
                    interaction challenge: software has to organize the protocol
                    without becoming another source of attention during
                    exposure.
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.65",
                      color:
                        "color-mix(in srgb,var(--color-text) 74%,transparent)",
                    }}
                  >
                    The design problem was therefore not simply how to digitize
                    WET. It was how to preserve three things at once:{" "}
                    <b>clinical fidelity</b>, <b>therapeutic continuity</b>, and{" "}
                    <b>appropriate safety oversight</b>.
                  </p>
                </div>
                <div
                  data-reveal
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div
                    className="blueprint wg-card"
                    style={{ padding: "20px" }}
                  >
                    <i className="corner tl"></i>
                    <i className="corner tr"></i>
                    <i className="corner bl"></i>
                    <i className="corner br"></i>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      Problem 01
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "20px",
                        marginTop: "8px",
                        lineHeight: "1.15",
                      }}
                    >
                      Protocol fidelity
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "10px 0 0",
                      }}
                    >
                      Keep required steps, timing, and session structure visible
                      without asking clinicians to reconstruct the protocol from
                      memory.
                    </p>
                  </div>
                  <div
                    className="blueprint wg-card"
                    style={{ padding: "20px" }}
                  >
                    <i className="corner tl"></i>
                    <i className="corner tr"></i>
                    <i className="corner bl"></i>
                    <i className="corner br"></i>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      Problem 02
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "20px",
                        marginTop: "8px",
                        lineHeight: "1.15",
                      }}
                    >
                      Therapeutic continuity
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "10px 0 0",
                      }}
                    >
                      Reduce interface changes and unnecessary decisions once
                      exposure writing begins.
                    </p>
                  </div>
                  <div
                    className="blueprint wg-card"
                    style={{ padding: "20px" }}
                  >
                    <i className="corner tl"></i>
                    <i className="corner tr"></i>
                    <i className="corner bl"></i>
                    <i className="corner br"></i>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      Problem 03
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "20px",
                        marginTop: "8px",
                        lineHeight: "1.15",
                      }}
                    >
                      Safety oversight
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "10px 0 0",
                      }}
                    >
                      Surface potential concerns for human review without
                      treating automated detection as a clinical conclusion.
                    </p>
                  </div>
                  <div
                    className="blueprint wg-card"
                    style={{ padding: "20px" }}
                  >
                    <i className="corner tl"></i>
                    <i className="corner tr"></i>
                    <i className="corner bl"></i>
                    <i className="corner br"></i>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                      }}
                    >
                      Problem 04
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "20px",
                        marginTop: "8px",
                        lineHeight: "1.15",
                      }}
                    >
                      Research traceability
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "10px 0 0",
                      }}
                    >
                      Capture structured session events that can later support
                      protocol evaluation and research.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ PROCESS ══ */}
          <section
            id="process"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
              background: "var(--color-surface)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                02 — Design Process
              </div>
              <h2
                data-reveal
                style={{ fontSize: "38px", margin: "22px 0 8px" }}
              >
                From clinical protocol to interaction rules.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  lineHeight: "1.65",
                  color: "color-mix(in srgb,var(--color-text) 66%,transparent)",
                  maxWidth: "640px",
                  margin: "0 0 46px",
                }}
              >
                Instead of treating the guideline as content to display, I
                translated its constraints into rules for how the interface
                should behave.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: "0",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "22px",
                    left: "8%",
                    right: "8%",
                    height: "1px",
                    background: "var(--color-divider)",
                  }}
                ></div>
                <div
                  data-reveal
                  style={{ position: "relative", paddingRight: "22px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-accent)",
                      fontSize: "18px",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    01
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      marginTop: "16px",
                    }}
                  >
                    Structure what must stay fixed
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Protocol-defined steps, session sequence, and timing become
                    system constraints rather than optional reminders.
                  </p>
                </div>
                <div
                  data-reveal
                  style={{ position: "relative", paddingRight: "22px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-accent)",
                      fontSize: "18px",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    02
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      marginTop: "16px",
                    }}
                  >
                    Reduce decisions during exposure
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Before writing begins, the system prepares the session so
                    the active writing state can remain deliberately minimal.
                  </p>
                </div>
                <div
                  data-reveal
                  style={{ position: "relative", paddingRight: "22px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-accent)",
                      fontSize: "18px",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    03
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      marginTop: "16px",
                    }}
                  >
                    Let safety stay present without taking over
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Monitoring can continue in the background, but detection
                    alone should not automatically interrupt exposure.
                  </p>
                </div>
                <div data-reveal style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--color-accent)",
                      border: "1px solid var(--color-accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-bg)",
                      fontSize: "18px",
                      position: "relative",
                      zIndex: "1",
                    }}
                  >
                    04
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      marginTop: "16px",
                    }}
                  >
                    Keep clinical judgment human
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    The system can organize signals and context; interpretation
                    and intervention remain with the clinician.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ══ CORE FEATURES ══ */}
          <section
            id="features"
            style={{
              padding: "70px 40px 20px",
              borderTop: "1px solid var(--color-divider)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                03 — Core Features
              </div>
              <h2
                data-reveal
                style={{ fontSize: "38px", margin: "22px 0 8px" }}
              >
                Four moments that define the product.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  color: "color-mix(in srgb,var(--color-text) 66%,transparent)",
                  maxWidth: "640px",
                  margin: "0 0 54px",
                }}
              >
                The workflow is built around the points where structure,
                attention, and clinical responsibility matter most.
              </p>

              {/* Feature 01 — WET Mobile onboarding.
                  Same two-part rhythm as moments 02–04: a header row, then a
                  full-width stage. Pairing the 756px device against ~300px of
                  copy left a large void beside the text. */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "34px",
                  marginBottom: "80px",
                }}
              >
                <div
                  data-reveal
                  style={{
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: "48px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color:
                          "color-mix(in srgb,var(--color-text) 64%,transparent)",
                      }}
                    >
                      Moment 01
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "6px",
                      }}
                    >
                      <span className="tag tag-accent">Session Setup</span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color:
                            "color-mix(in srgb,var(--color-text) 64%,transparent)",
                        }}
                      >
                        Constrained clinical setup
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "28px",
                        margin: "16px 0 0",
                        lineHeight: "1.12",
                      }}
                    >
                      Prepare the session before exposure begins.
                    </h3>
                  </div>
                  <div style={{ maxWidth: "62ch" }}>
                    <p
                      style={{
                        fontSize: "14.5px",
                        lineHeight: "1.6",
                        color:
                          "color-mix(in srgb,var(--color-text) 72%,transparent)",
                        marginTop: "14px",
                      }}
                    >
                      The clinician configures the session before the patient
                      starts writing. Only protocol-relevant choices are
                      exposed, reducing setup ambiguity and keeping session
                      structure consistent.
                    </p>
                    <ul
                      style={{
                        listStyle: "none",
                        padding: "0",
                        margin: "22px 0 0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      <li
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "14px",
                          color:
                            "color-mix(in srgb,var(--color-text) 74%,transparent)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          +
                        </span>
                        Establish session context.
                      </li>
                      <li
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "14px",
                          color:
                            "color-mix(in srgb,var(--color-text) 74%,transparent)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          +
                        </span>
                        Apply protocol-defined defaults.
                      </li>
                      <li
                        style={{
                          display: "flex",
                          gap: "10px",
                          fontSize: "14px",
                          color:
                            "color-mix(in srgb,var(--color-text) 74%,transparent)",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-accent)",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          +
                        </span>
                        Resolve decisions before writing starts.
                      </li>
                    </ul>
                  </div>
                </div>
                {/* The console's own start screen, shown in the same laptop
                    as the hero so the two presentations stay identical. */}
                {/* Same frame treatment as moments 02–04 — the console's own
                    setup screen, not the hero's laptop presentation. */}
                <div
                  data-reveal
                  className="blueprint"
                  style={{
                    padding: "0",
                    background: "var(--ui-surface)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                  }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    className="app wg-frame"
                    style={{
                      display: "flex",
                      // wg-frame sets column direction for the padded moments;
                      // this screen puts its rail beside the content.
                      flexDirection: "row",
                      background: "var(--ui-bg)",
                    }}
                  >
                    <ConsoleStartScreen />
                  </div>
                </div>
              </div>

              {/* Feature 02 — Desktop console */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "34px",
                  marginBottom: "80px",
                }}
              >
                <div
                  data-reveal
                  style={{
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: "48px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color:
                          "color-mix(in srgb,var(--color-text) 64%,transparent)",
                      }}
                    >
                      Moment 02
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "6px",
                      }}
                    >
                      <span className="tag tag-accent">Guided Entry</span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color:
                            "color-mix(in srgb,var(--color-text) 64%,transparent)",
                        }}
                      >
                        Scripted protocol delivery
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "28px",
                        margin: "16px 0 0",
                        lineHeight: "1.12",
                      }}
                    >
                      Guide the patient from setup into writing.
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "14.5px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 72%,transparent)",
                      margin: "0 0 6px",
                    }}
                  >
                    Once the session is configured, the patient does not land
                    straight in an empty text field. A guided sequence delivers
                    the protocol&rsquo;s own instructions in order &mdash; what
                    this session is for, what to write about, how long it lasts
                    &mdash; and ends in a single action that starts the timer.
                    The wording is scripted by the protocol rather than composed
                    freely, so every patient receives the same preparation and
                    the clinician stays responsible for the session around it.
                  </p>
                </div>
                {/* DESKTOP: Start screen */}
                <div
                  data-reveal
                  className="blueprint"
                  style={{
                    padding: "0",
                    background: "var(--ui-surface)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                  }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    className="app wg-frame"
                    style={{ background: "var(--ui-bg)", padding: "26px 30px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-accent)",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "var(--ui-ok)",
                              flex: "none",
                            }}
                          ></span>
                          Pre-session guidance
                        </div>
                        <div
                          style={{
                            fontSize: "26px",
                            fontWeight: "800",
                            letterSpacing: "-.02em",
                            color: "var(--ui-text)",
                            marginTop: "6px",
                          }}
                        >
                          WET Session 1
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          border: "1px solid var(--ui-line)",
                          background: "var(--ui-surface)",
                          borderRadius: "11px",
                          padding: "8px 14px",
                          fontSize: "13px",
                          fontWeight: "600",
                          color: "var(--ui-text-2)",
                        }}
                      >
                        Session Info
                      </div>
                    </div>
                    <div
                      className="wg-frame-body"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 300px",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--ui-accent-soft)",
                                color: "var(--ui-accent)",
                                flex: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                              </svg>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "var(--ui-faint)",
                                  marginBottom: "3px",
                                }}
                              >
                                WET Guide
                              </div>
                              <div
                                style={{
                                  background: "var(--ui-bg)",
                                  borderRadius: "12px",
                                  padding: "10px 13px",
                                  fontSize: "13.5px",
                                  lineHeight: "1.55",
                                  color: "var(--ui-text-2)",
                                }}
                              >
                                Hello Alex, welcome. Before we begin, I&rsquo;ll
                                walk you through what this session involves.
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--ui-accent-soft)",
                                color: "var(--ui-accent)",
                                flex: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                              </svg>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "var(--ui-faint)",
                                  marginBottom: "3px",
                                }}
                              >
                                WET Guide
                              </div>
                              <div
                                style={{
                                  background: "var(--ui-bg)",
                                  borderRadius: "12px",
                                  padding: "10px 13px",
                                  fontSize: "13.5px",
                                  lineHeight: "1.55",
                                  color: "var(--ui-text-2)",
                                }}
                              >
                                Today you&rsquo;ll write about the traumatic
                                event in detail &mdash; what happened, and what
                                you were thinking and feeling as it happened.
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--ui-accent-soft)",
                                color: "var(--ui-accent)",
                                flex: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                              </svg>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "var(--ui-faint)",
                                  marginBottom: "3px",
                                }}
                              >
                                WET Guide
                              </div>
                              <div
                                style={{
                                  background: "var(--ui-bg)",
                                  borderRadius: "12px",
                                  padding: "10px 13px",
                                  fontSize: "13.5px",
                                  lineHeight: "1.55",
                                  color: "var(--ui-text-2)",
                                }}
                              >
                                Write continuously for the full thirty minutes.
                                Don&rsquo;t worry about spelling or grammar, and
                                no one will ask you to read it aloud.
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--ui-accent-soft)",
                                color: "var(--ui-accent)",
                                flex: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                              </svg>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  color: "var(--ui-faint)",
                                  marginBottom: "3px",
                                }}
                              >
                                WET Guide
                              </div>
                              <div
                                style={{
                                  background: "var(--ui-bg)",
                                  borderRadius: "12px",
                                  padding: "10px 13px",
                                  fontSize: "13.5px",
                                  lineHeight: "1.55",
                                  color: "var(--ui-text-2)",
                                }}
                              >
                                When you&rsquo;re ready, we&rsquo;ll begin.
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: "20px",
                            background: "transparent",
                          }}
                        >
                          <div
                            style={{
                              background: "var(--ui-accent)",
                              borderRadius: "12px",
                              padding: "12px",
                              textAlign: "center",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "var(--ui-on-accent)",
                            }}
                          >
                            Begin Writing (30 min)
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-faint)",
                            marginBottom: "14px",
                          }}
                        >
                          Session Identity
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: "var(--ui-accent-soft)",
                              color: "var(--ui-accent)",
                              flex: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "var(--ui-text)",
                              }}
                            >
                              Alex R.
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--ui-faint)",
                              }}
                            >
                              WET-2026-014 &middot; Session 1
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "16px",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--ui-line)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "var(--ui-muted)",
                            }}
                          >
                            Elapsed
                          </span>
                          <span
                            style={{
                              fontSize: "15px",
                              fontWeight: "700",
                              color: "var(--ui-text)",
                            }}
                          >
                            0:11
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: "16px",
                            background: "var(--ui-accent-soft)",
                            border: "1px solid var(--ui-accent-soft)",
                            borderRadius: "12px",
                            padding: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13.5px",
                              fontWeight: "700",
                              color: "var(--ui-accent)",
                            }}
                          >
                            Next step
                          </div>
                          <div
                            style={{
                              marginTop: "5px",
                              fontSize: "13.5px",
                              lineHeight: "1.55",
                              color: "var(--ui-accent-ink)",
                            }}
                          >
                            After the introduction, select Begin Writing to
                            start the 30-minute session.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 03 — Safety Gate */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "34px",
                  marginBottom: "80px",
                }}
              >
                <div
                  data-reveal
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 340px",
                    gap: "48px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color:
                          "color-mix(in srgb,var(--color-text) 64%,transparent)",
                      }}
                    >
                      Moment 03
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "6px",
                      }}
                    >
                      <span className="tag tag-accent">Safety Monitoring</span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color:
                            "color-mix(in srgb,var(--color-text) 64%,transparent)",
                        }}
                      >
                        Progressive disclosure, not interruption
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "28px",
                        margin: "16px 0 0",
                        lineHeight: "1.12",
                      }}
                    >
                      Safety stays present without taking over.
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "14.5px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 72%,transparent)",
                      margin: "0 0 6px",
                    }}
                  >
                    Exposure writing depends on sustained attention. A
                    technically &ldquo;non-blocking&rdquo; alert can still
                    interrupt the patient cognitively if the interface suddenly
                    highlights their words, changes colour, or announces a risk
                    classification. WET Guard therefore separates detection from
                    intervention: potential safety signals are monitored in the
                    background and surfaced progressively for clinician review,
                    and the writing session remains active unless a clinician
                    determines that intervention is warranted.
                  </p>
                </div>
                {/* DESKTOP: exposure writing + escalation */}
                <div
                  data-reveal
                  className="blueprint"
                  style={{
                    padding: "0",
                    background: "var(--ui-surface)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                  }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    className="app wg-frame"
                    style={{
                      background: "var(--ui-bg)",
                      padding: "26px 30px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-accent)",
                          }}
                        >
                          <span
                            style={{
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: "var(--ui-ok)",
                              flex: "none",
                            }}
                          ></span>
                          Writing in progress
                        </div>
                        <div
                          style={{
                            fontSize: "26px",
                            fontWeight: "800",
                            letterSpacing: "-.02em",
                            color: "var(--ui-text)",
                            marginTop: "6px",
                          }}
                        >
                          WET Session 1
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          border: "1px solid var(--ui-line)",
                          background: "var(--ui-surface)",
                          borderRadius: "11px",
                          padding: "8px 14px",
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "var(--ui-text)",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--ui-muted)"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        17:22
                      </div>
                    </div>
                    <div
                      className="wg-frame-body"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 300px",
                        gap: "20px",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            height: "3px",
                            background: "var(--ui-line)",
                            borderRadius: "2px",
                            overflow: "hidden",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              width: "42%",
                              height: "100%",
                              background: "var(--ui-accent)",
                            }}
                          ></div>
                        </div>
                        {/* the narrative stays exactly as the patient wrote it — no inline
                        marking, which would read as a grammar checker telling them the
                        sentence is wrong and invite self-censoring */}
                        <p
                          style={{
                            margin: "0 0 11px",
                            fontSize: "14px",
                            lineHeight: "1.72",
                            color: "var(--ui-text-2)",
                          }}
                        >
                          I keep coming back to the sound before anything else
                          &mdash; the tyres, then the guardrail. I had driven
                          that stretch for six years and never once thought
                          about it.
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "14px",
                            lineHeight: "1.72",
                            color: "var(--ui-text-2)",
                          }}
                        >
                          When I try to stay with it now my chest goes tight and
                          I lose the order of things. Honestly some days I
                          don&rsquo;t want to live anymore. I keep thinking
                          everyone would be better off without me. I know I am
                          supposed to keep going, so I am going to keep going.
                          <span className="wg-caret" aria-hidden="true"></span>
                        </p>
                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--ui-line)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              color: "var(--ui-faint)",
                            }}
                          >
                            412 words &middot; autosaved 14s ago
                          </span>
                          <div
                            style={{
                              background: "var(--ui-accent)",
                              borderRadius: "11px",
                              padding: "8px 16px",
                              fontSize: "13.5px",
                              fontWeight: "600",
                              color: "var(--ui-on-accent)",
                            }}
                          >
                            Finish Writing
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-faint)",
                            marginBottom: "14px",
                          }}
                        >
                          Session Identity
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background: "var(--ui-accent-soft)",
                              color: "var(--ui-accent)",
                              flex: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="19"
                              height="19"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "var(--ui-text)",
                              }}
                            >
                              Alex R.
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--ui-faint)",
                              }}
                            >
                              WET-2026-014 &middot; Session 1
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "16px",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--ui-line)",
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <div style={{ flex: "1" }}>
                            <div
                              style={{
                                fontSize: "12.5px",
                                fontWeight: "800",
                                letterSpacing: ".1em",
                                color: "var(--ui-faint)",
                              }}
                            >
                              REMAINING
                            </div>
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "var(--ui-text)",
                              }}
                            >
                              17:22
                            </div>
                          </div>
                          <div style={{ flex: "1" }}>
                            <div
                              style={{
                                fontSize: "12.5px",
                                fontWeight: "800",
                                letterSpacing: ".1em",
                                color: "var(--ui-faint)",
                              }}
                            >
                              WORDS
                            </div>
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "var(--ui-text)",
                              }}
                            >
                              412
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "18px",
                            paddingTop: "14px",
                            borderTop: "1px solid var(--ui-line)",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "var(--ui-text)",
                          }}
                        >
                          Safety review
                        </div>
                        <div
                          style={{
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontSize: "13.5px",
                            color: "var(--ui-muted)",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: "var(--ui-ok)",
                              flex: "none",
                            }}
                          ></span>
                          Active
                        </div>
                        <div
                          style={{
                            marginTop: "12px",
                            background: "var(--ui-subtle)",
                            border: "1px solid var(--ui-line)",
                            borderRadius: "10px",
                            padding: "10px 11px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "var(--ui-text-2)",
                            }}
                          >
                            Review requested
                          </div>
                          <div
                            style={{
                              marginTop: "2px",
                              fontSize: "13px",
                              color: "var(--ui-faint)",
                            }}
                          >
                            12:38
                          </div>
                        </div>
                        <button
                          onClick={() => setSignalOpen(true)}
                          style={{
                            marginTop: "10px",
                            width: "100%",
                            cursor: "pointer",
                            border: "1px solid var(--ui-line-2)",
                            background: "var(--ui-surface)",
                            borderRadius: "10px",
                            padding: "9px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "var(--ui-text-2)",
                            fontFamily: "inherit",
                          }}
                        >
                          Review signal
                        </button>
                      </div>
                    </div>
                    {/* signal drawer — opened on request, never pushed */}
                    {signalOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          bottom: "0",
                          width: "320px",
                          background: "var(--ui-surface)",
                          borderLeft: "1px solid var(--ui-line)",
                          boxShadow: "-18px 0 44px rgba(15,23,42,.10)",
                          padding: "18px",
                          display: "flex",
                          flexDirection: "column",
                          zIndex: "3",
                          overflowY: "auto",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "700",
                              color: "var(--ui-text)",
                            }}
                          >
                            Safety review
                          </span>
                          <button
                            onClick={() => setSignalOpen(false)}
                            aria-label="Close signal detail"
                            style={{
                              cursor: "pointer",
                              border: "0",
                              background: "transparent",
                              color: "var(--ui-faint)",
                              fontSize: "16px",
                              lineHeight: "1",
                              padding: "2px 4px",
                              fontFamily: "inherit",
                            }}
                          >
                            &times;
                          </button>
                        </div>
                        <div
                          style={{
                            marginTop: "3px",
                            fontSize: "13px",
                            color: "var(--ui-faint)",
                          }}
                        >
                          Detected at 12:38
                        </div>
                        <blockquote
                          style={{
                            margin: "14px 0 0",
                            borderLeft: "2px solid var(--ui-line-2)",
                            padding: "2px 0 2px 11px",
                            fontSize: "13px",
                            lineHeight: "1.65",
                            color: "var(--ui-muted)",
                          }}
                        >
                          &ldquo;&hellip;some days I don&rsquo;t want to live
                          anymore. I keep thinking everyone would be better off
                          without me.&rdquo;
                        </blockquote>
                        <div
                          style={{
                            marginTop: "16px",
                            fontSize: "12.5px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            color: "var(--ui-faint)",
                          }}
                        >
                          SIGNALS FOR REVIEW
                        </div>
                        <ul
                          style={{
                            margin: "8px 0 0",
                            padding: "0",
                            listStyle: "none",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            fontSize: "13px",
                            color: "var(--ui-muted)",
                          }}
                        >
                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "var(--ui-faint)",
                                flex: "none",
                                marginTop: "7px",
                              }}
                            ></span>
                            Language suggesting possible suicidal ideation
                          </li>
                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "var(--ui-faint)",
                                flex: "none",
                                marginTop: "7px",
                              }}
                            ></span>
                            Language suggesting perceived burdensomeness
                          </li>
                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "var(--ui-faint)",
                                flex: "none",
                                marginTop: "7px",
                              }}
                            ></span>
                            No explicit plan detected in this passage
                          </li>
                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "var(--ui-faint)",
                                flex: "none",
                                marginTop: "7px",
                              }}
                            ></span>
                            No means mentioned in this passage
                          </li>
                          <li
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "flex-start",
                            }}
                          >
                            <span
                              style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                background: "var(--ui-faint)",
                                flex: "none",
                                marginTop: "7px",
                              }}
                            ></span>
                            Immediate intent cannot be determined from writing
                            alone
                          </li>
                        </ul>
                        <div
                          style={{
                            marginTop: "16px",
                            background: "var(--ui-subtle)",
                            border: "1px solid var(--ui-line)",
                            borderRadius: "10px",
                            padding: "11px 12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "12.5px",
                              fontWeight: "800",
                              letterSpacing: ".1em",
                              color: "var(--ui-faint)",
                            }}
                          >
                            SYSTEM ACTION
                          </div>
                          <div
                            style={{
                              marginTop: "6px",
                              fontSize: "13px",
                              color: "var(--ui-text-2)",
                              lineHeight: "1.55",
                            }}
                          >
                            Clinical review requested.
                            <br />
                            Writing session remains active.
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "auto",
                            paddingTop: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "7px",
                          }}
                        >
                          <div
                            style={{
                              background: "var(--ui-accent)",
                              borderRadius: "10px",
                              padding: "9px",
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "var(--ui-on-accent)",
                            }}
                          >
                            Open safety assessment
                          </div>
                          <div style={{ display: "flex", gap: "7px" }}>
                            <div
                              style={{
                                flex: "1",
                                border: "1px solid var(--ui-line-2)",
                                borderRadius: "10px",
                                padding: "8px",
                                textAlign: "center",
                                fontSize: "13.5px",
                                fontWeight: "600",
                                color: "var(--ui-text-2)",
                              }}
                            >
                              Mark reviewed
                            </div>
                            <div
                              style={{
                                flex: "1",
                                border: "1px solid var(--ui-line)",
                                borderRadius: "10px",
                                padding: "8px",
                                textAlign: "center",
                                fontSize: "13.5px",
                                fontWeight: "600",
                                color: "var(--ui-faint)",
                              }}
                            >
                              Document &amp; continue
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feature 04 — Session Summary */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "34px",
                  marginBottom: "40px",
                }}
              >
                <div
                  data-reveal
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 340px",
                    gap: "48px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color:
                          "color-mix(in srgb,var(--color-text) 64%,transparent)",
                      }}
                    >
                      Moment 04
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "6px",
                      }}
                    >
                      <span className="tag tag-accent">Clinical Report</span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color:
                            "color-mix(in srgb,var(--color-text) 64%,transparent)",
                        }}
                      >
                        Session summary
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "28px",
                        margin: "16px 0 0",
                        lineHeight: "1.12",
                      }}
                    >
                      Turn a completed session into a clinical handoff.
                    </h3>
                  </div>
                  <p
                    style={{
                      fontSize: "14.5px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 72%,transparent)",
                      margin: "0 0 6px",
                    }}
                  >
                    When writing ends, the session should not collapse into a
                    raw transcript. WET Guard organizes the session context,
                    completion status, protocol checkpoints, and relevant review
                    events into a summary the clinician can quickly revisit. The
                    summary supports review and documentation; it does not
                    generate a diagnosis or treatment recommendation.
                  </p>
                </div>
                {/* DESKTOP: Summary */}
                <div
                  data-reveal
                  className="blueprint"
                  style={{
                    padding: "0",
                    background: "var(--ui-surface)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                  }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    className="app"
                    style={{ background: "var(--ui-bg)", padding: "26px 30px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-accent)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                            <path d="M22 4L12 14.01l-3-3" />
                          </svg>
                          Session Concluded
                        </div>
                        <h1
                          style={{
                            fontSize: "26px",
                            fontWeight: "800",
                            letterSpacing: "-.02em",
                            color: "var(--ui-text)",
                            fontFamily: "system-ui",
                            margin: "6px 0 0",
                          }}
                        >
                          Session Summary
                        </h1>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--ui-faint)",
                            margin: "4px 0 0",
                          }}
                        >
                          Structured session record for clinician review —
                          WET-2026-014.
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            border: "1px solid var(--ui-line)",
                            borderRadius: "11px",
                            padding: "8px 14px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "var(--ui-text-2)",
                            background: "var(--ui-surface)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.3-4.3" />
                          </svg>
                          Review
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            background: "var(--ui-accent)",
                            borderRadius: "11px",
                            padding: "8px 14px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "var(--ui-on-accent)",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
                          </svg>
                          Share Report
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-faint)",
                            marginBottom: "14px",
                          }}
                        >
                          Session Identity
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "14px",
                          }}
                        >
                          <div
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              background: "var(--ui-accent-soft)",
                              color: "var(--ui-accent)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--ui-faint)",
                              }}
                            >
                              Patient Profile
                            </div>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "800",
                                color: "var(--ui-text)",
                              }}
                            >
                              Alex R.
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid var(--ui-subtle)",
                            padding: "8px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span style={{ color: "var(--ui-muted)" }}>
                            Duration
                          </span>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--ui-text)",
                            }}
                          >
                            48m 12s
                          </span>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid var(--ui-subtle)",
                            padding: "8px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span style={{ color: "var(--ui-muted)" }}>
                            WET Session
                          </span>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--ui-text)",
                            }}
                          >
                            Session 1
                          </span>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid var(--ui-subtle)",
                            padding: "8px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "13px",
                          }}
                        >
                          <span style={{ color: "var(--ui-muted)" }}>
                            Condition
                          </span>
                          <span
                            style={{
                              fontWeight: "700",
                              color: "var(--ui-text)",
                            }}
                          >
                            PTSD to STH
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: "10px",
                            background: "var(--ui-subtle)",
                            borderRadius: "9px",
                            padding: "8px 12px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "var(--ui-ok)",
                            }}
                          ></span>
                          <span
                            style={{
                              fontSize: "13.5px",
                              fontWeight: "500",
                              color: "var(--ui-muted)",
                            }}
                          >
                            Synced to Local Vault
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          background: "var(--ui-surface)",
                          borderRadius: "16px",
                          padding: "20px",
                          boxShadow: "0 1px 3px var(--ui-hairline)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "14px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "800",
                              letterSpacing: ".1em",
                              textTransform: "uppercase",
                              color: "var(--ui-faint)",
                            }}
                          >
                            Safety Status
                          </span>
                          <span
                            style={{
                              fontSize: "12.5px",
                              fontWeight: "800",
                              letterSpacing: ".08em",
                              textTransform: "uppercase",
                              color: "var(--ui-accent)",
                              border: "1px solid var(--ui-accent-soft)",
                              borderRadius: "20px",
                              padding: "2px 8px",
                            }}
                          >
                            Real-time
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "7px",
                              background: "var(--ui-accent)",
                              borderRadius: "11px",
                              padding: "6px 14px",
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--ui-on-accent)"
                              strokeWidth="2"
                            >
                              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                              <path d="M22 4L12 14.01l-3-3" />
                            </svg>
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: "800",
                                color: "var(--ui-on-accent)",
                              }}
                            >
                              None
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "13.5px",
                              color: "var(--ui-faint)",
                            }}
                          >
                            No critical triggers identified
                          </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13.5px",
                              marginBottom: "5px",
                            }}
                          >
                            <span style={{ color: "var(--ui-muted)" }}>
                              Emotional Regulation
                            </span>
                            <span
                              style={{
                                fontWeight: "800",
                                color: "var(--ui-accent)",
                              }}
                            >
                              88%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "7px",
                              background: "var(--ui-subtle)",
                              borderRadius: "20px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: "88%",
                                background: "var(--ui-accent)",
                                borderRadius: "20px",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "13.5px",
                              marginBottom: "5px",
                            }}
                          >
                            <span style={{ color: "var(--ui-muted)" }}>
                              Cognitive Coherence
                            </span>
                            <span
                              style={{
                                fontWeight: "800",
                                color: "var(--ui-accent)",
                              }}
                            >
                              94%
                            </span>
                          </div>
                          <div
                            style={{
                              height: "7px",
                              background: "var(--ui-subtle)",
                              borderRadius: "20px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: "94%",
                                background: "var(--ui-accent)",
                                borderRadius: "20px",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "14px",
                            background: "var(--ui-subtle)",
                            borderRadius: "11px",
                            padding: "12px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "var(--ui-muted)",
                              marginBottom: "8px",
                            }}
                          >
                            Safety Trends
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              gap: "5px",
                              height: "52px",
                            }}
                          >
                            <div
                              style={{
                                flex: "1",
                                height: "30%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "45%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "40%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "55%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "60%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "70%",
                                background: "var(--ui-chart)",
                                borderRadius: "3px",
                              }}
                            ></div>
                            <div
                              style={{
                                flex: "1",
                                height: "88%",
                                background: "var(--ui-accent)",
                                borderRadius: "3px",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: "var(--ui-surface)",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0 1px 3px var(--ui-hairline)",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "9px",
                            background: "var(--ui-warn-soft)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                          }}
                        >
                          ✦
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "800",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--ui-faint)",
                          }}
                        >
                          Generated summary · for clinician review
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: "800",
                          color: "var(--ui-text)",
                          fontFamily: "system-ui",
                          margin: "0 0 8px",
                        }}
                      >
                        Key Clinical Themes
                      </h3>
                      <p
                        style={{
                          fontSize: "13.5px",
                          lineHeight: "1.65",
                          color: "var(--ui-muted)",
                          margin: "0",
                        }}
                      >
                        Session 1 of 5 delivered the standard WET
                        psychoeducation. Alex engaged actively, asking one
                        clarifying question that was answered within protocol
                        before continuing. The therapist paused at each scripted
                        checkpoint and issued the first writing directive at the
                        appropriate point. No risk indicators were detected
                        across the session.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        background: "var(--ui-accent)",
                        borderRadius: "16px",
                        padding: "16px 22px",
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--ui-on-accent)"
                          strokeWidth="2"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "800",
                            color: "var(--ui-on-accent)",
                          }}
                        >
                          Session data protected
                        </div>
                        <div
                          style={{
                            fontSize: "13.5px",
                            color: "var(--ui-accent-soft)",
                            marginTop: "2px",
                          }}
                        >
                          Encrypted at rest and in transit. Access limited to
                          authorized clinical staff.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ PLATFORMS ══ */}
          <section
            id="platforms"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
              background: "var(--color-surface)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                04 — Mobile vs. Desktop
              </div>
              <h2
                data-reveal
                style={{ fontSize: "38px", margin: "22px 0 8px" }}
              >
                One workflow, shared across the session.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  color: "color-mix(in srgb,var(--color-text) 66%,transparent)",
                  maxWidth: "660px",
                  margin: "0 0 46px",
                }}
              >
                Patients and clinicians interact with different parts of the
                same treatment process, but the experience is designed as one
                continuous workflow rather than two disconnected products.
                Patients encounter only what is necessary to enter, write, and
                respond. Clinicians retain the controls needed to prepare the
                protocol, monitor the session, and review exceptions.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "340px 1fr",
                  gap: "48px",
                  alignItems: "start",
                }}
              >
                {/* PHONE: the patient app, swipeable across its four screens.
                    The column stretches so the frame width cannot follow each
                    screen's content; the carousel centres itself inside it. */}
                <div data-reveal>
                  <PhoneCarousel />
                </div>

                <div data-reveal style={{ alignSelf: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "16px 0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          width: "110px",
                          flex: "none",
                        }}
                      >
                        Before writing
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Patient interaction
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Join and receive instructions
                        </div>
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Clinician responsibility
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Prepare protocol and session context
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "16px 0",
                        borderTop: "1px solid var(--color-divider)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          width: "110px",
                          flex: "none",
                        }}
                      >
                        Session start
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Patient interaction
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Enter the session
                        </div>
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Clinician responsibility
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Confirm protocol and begin
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "16px 0",
                        borderTop: "1px solid var(--color-divider)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          width: "110px",
                          flex: "none",
                        }}
                      >
                        Writing
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Patient interaction
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Focus on the narrative
                        </div>
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Clinician responsibility
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Maintain session oversight
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "16px 0",
                        borderTop: "1px solid var(--color-divider)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          width: "110px",
                          flex: "none",
                        }}
                      >
                        Safety signal
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Patient interaction
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Writing remains stable
                        </div>
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Clinician responsibility
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Review the surfaced signal
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "20px",
                        padding: "16px 0",
                        borderTop: "1px solid var(--color-divider)",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "17px",
                          width: "110px",
                          flex: "none",
                        }}
                      >
                        Session end
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Patient interaction
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Complete the writing phase
                        </div>
                      </div>
                      <div style={{ flex: "1" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginBottom: "3px",
                          }}
                        >
                          Clinician responsibility
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color:
                              "color-mix(in srgb,var(--color-text) 72%,transparent)",
                          }}
                        >
                          Review structured session summary
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      marginTop: "28px",
                      paddingTop: "24px",
                      borderTop: "1px solid var(--color-divider)",
                    }}
                  >
                    <div
                      style={{
                        borderLeft: "2px solid var(--color-accent)",
                        paddingLeft: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "16px",
                        }}
                      >
                        Shared workflow, role-appropriate controls
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.55",
                          color:
                            "color-mix(in srgb,var(--color-text) 68%,transparent)",
                          margin: "6px 0 0",
                        }}
                      >
                        Both roles move through a single treatment process. What
                        differs is not the system but which controls each role
                        is responsible for at each step.
                      </p>
                    </div>
                    <div
                      style={{
                        borderLeft: "2px solid var(--color-accent)",
                        paddingLeft: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "16px",
                        }}
                      >
                        One system, two vantage points
                      </div>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.55",
                          color:
                            "color-mix(in srgb,var(--color-text) 68%,transparent)",
                          margin: "6px 0 0",
                        }}
                      >
                        The patient sees only what is needed to write; the
                        clinician keeps preparation, oversight, and review.
                        Neither is a separate product.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ INTERACTIONS / MOTION ══ */}
          <section
            id="interactions"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
              background: "var(--color-surface)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                05 — Interaction &amp; Motion
              </div>
              <h2
                data-reveal
                style={{ fontSize: "38px", margin: "22px 0 8px" }}
              >
                Small decisions that protect the session.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  color: "color-mix(in srgb,var(--color-text) 66%,transparent)",
                  maxWidth: "640px",
                  margin: "0 0 46px",
                }}
              >
                The most important interaction choices are often the ones that
                remove friction before it can become disruption.
              </p>

              {/* the safety demo is the only piece left in this band, so it
                  no longer sits in a two-column grid */}
              <div style={{ maxWidth: "720px", margin: "0 auto 26px" }}>
                {/* Live safety toggle */}
                <div
                  data-reveal
                  className="blueprint wg-card"
                  style={{ padding: "24px", background: "transparent" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "18px",
                      }}
                    >
                      Safety states &mdash; live
                    </div>
                    <span className="tag tag-accent">interactive</span>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color:
                        "color-mix(in srgb,var(--color-text) 66%,transparent)",
                      margin: "0 0 16px",
                    }}
                  >
                    Detection should not automatically become interruption. Step
                    the classifier through all three states and watch how little
                    the writing surface changes.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid var(--color-divider)",
                      marginBottom: "14px",
                    }}
                  >
                    {SAFETY_STATES.map((st, i) => (
                      <button
                        key={st.key}
                        onClick={() => setSafety(st.key)}
                        aria-pressed={safety === st.key}
                        style={{
                          flex: "1",
                          cursor: "pointer",
                          fontFamily: "var(--font-heading)",
                          fontWeight: "600",
                          fontSize: "14px",
                          padding: "9px 6px",
                          border: "0",
                          borderLeft: i
                            ? "1px solid var(--color-divider)"
                            : "0",
                          background:
                            safety === st.key
                              ? "var(--color-accent)"
                              : "transparent",
                          color:
                            safety === st.key
                              ? "var(--color-bg)"
                              : "var(--color-text)",
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                  <div
                    className="app"
                    style={{
                      background: "var(--ui-bg)",
                      borderRadius: "14px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        background: "var(--ui-surface)",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid var(--ui-hairline)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "700",
                          color: "var(--ui-text)",
                        }}
                      >
                        Safety Monitoring
                      </div>
                      <div
                        style={{
                          marginTop: "7px",
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          fontSize: "13px",
                          color: "var(--ui-muted)",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            flex: "none",
                            background: ACTIVE.dot,
                          }}
                        ></span>
                        {ACTIVE.status}
                      </div>
                      {ACTIVE.detail && (
                        <div
                          style={{
                            marginTop: "10px",
                            background: "var(--ui-subtle)",
                            border: "1px solid var(--ui-line)",
                            borderRadius: "10px",
                            padding: "10px 11px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "var(--ui-text-2)",
                            }}
                          >
                            {ACTIVE.detail}
                          </div>
                          <div
                            style={{
                              marginTop: "2px",
                              fontSize: "13px",
                              color: "var(--ui-faint)",
                            }}
                          >
                            Signal detected at 12:38
                          </div>
                        </div>
                      )}
                      {ACTIVE.action && (
                        <div
                          style={{
                            marginTop: "9px",
                            border: "1px solid var(--ui-line-2)",
                            borderRadius: "10px",
                            padding: "8px",
                            textAlign: "center",
                            fontSize: "13.5px",
                            fontWeight: "600",
                            color: "var(--ui-text-2)",
                          }}
                        >
                          {ACTIVE.action}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "13.5px",
                        lineHeight: "1.6",
                        color:
                          "color-mix(in srgb,var(--color-text) 62%,transparent)",
                      }}
                    >
                      {ACTIVE.note}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ RESULTS ══ */}
          <section
            id="results"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                06 — Results &amp; Data
              </div>
              <h2
                data-reveal
                style={{ fontSize: "38px", margin: "22px 0 8px" }}
              >
                Built to support evaluation.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  lineHeight: "1.65",
                  color: "color-mix(in srgb,var(--color-text) 66%,transparent)",
                  maxWidth: "680px",
                  margin: "0 0 46px",
                }}
              >
                Because WET Guard structures the treatment workflow, it can
                capture session-level events consistently enough to support
                later clinical and HCI research &mdash; without making analytics
                the centre of the patient experience.
              </p>

              <div
                data-reveal
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: "0",
                  border: "1px solid var(--color-divider)",
                  marginBottom: "46px",
                }}
              >
                <div
                  style={{
                    padding: "26px 22px",
                    borderRight: "1px solid var(--color-divider)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      color: "var(--color-accent)",
                      lineHeight: "1.15",
                    }}
                  >
                    Protocol events
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 62%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Required steps and session transitions
                  </div>
                </div>
                <div
                  style={{
                    padding: "26px 22px",
                    borderRight: "1px solid var(--color-divider)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      color: "var(--color-accent)",
                      lineHeight: "1.15",
                    }}
                  >
                    Session measures
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 62%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Timing, completion, and interaction events
                  </div>
                </div>
                <div
                  style={{
                    padding: "26px 22px",
                    borderRight: "1px solid var(--color-divider)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      color: "var(--color-accent)",
                      lineHeight: "1.15",
                    }}
                  >
                    Safety events
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 62%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Signals, review status, and escalation actions
                  </div>
                </div>
                <div style={{ padding: "26px 22px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      color: "var(--color-accent)",
                      lineHeight: "1.15",
                    }}
                  >
                    Research-ready logs
                  </div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color:
                        "color-mix(in srgb,var(--color-text) 62%,transparent)",
                      marginTop: "8px",
                    }}
                  >
                    Structured records for later analysis
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "44px",
                  paddingTop: "46px",
                  borderTop: "1px solid var(--color-divider)",
                }}
              >
                <div data-reveal>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                      marginBottom: "10px",
                    }}
                  >
                    Scope of evaluation
                  </div>
                  <h3 style={{ fontSize: "24px", margin: "0 0 8px" }}>
                    What we evaluated &mdash; and what remains to be validated.
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 70%,transparent)",
                    }}
                  >
                    WET Guard reached a functioning prototype developed in
                    collaboration with clinicians. Clinicians participated in
                    formative evaluation of the workflow, protocol fit, and key
                    interaction decisions, with their feedback informing
                    subsequent design iterations.
                  </p>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 70%,transparent)",
                      margin: "0",
                    }}
                  >
                    This work was not a patient clinical trial. It therefore
                    does not claim treatment effectiveness, diagnostic accuracy,
                    or clinical validation.
                  </p>
                </div>
                <div
                  data-reveal
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      borderLeft: "2px solid var(--color-accent)",
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                      }}
                    >
                      Designed and built
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "6px 0 0",
                      }}
                    >
                      The protocol workflow, safety-review model, and patient-
                      and clinician-facing interactions, integrated with the
                      existing backend.
                    </p>
                  </div>
                  <div
                    style={{
                      borderLeft: "2px solid var(--color-accent)",
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                      }}
                    >
                      Evaluated with clinicians
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "6px 0 0",
                      }}
                    >
                      Clinical collaborators reviewed protocol alignment,
                      workflow usability, and safety-related interactions,
                      informing iterative refinement of the prototype.
                    </p>
                  </div>
                  <div
                    style={{
                      borderLeft: "2px solid var(--color-divider)",
                      paddingLeft: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "16px",
                      }}
                    >
                      Not yet clinically validated
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color:
                          "color-mix(in srgb,var(--color-text) 68%,transparent)",
                        margin: "6px 0 0",
                      }}
                    >
                      No patient study or controlled clinical trial was
                      conducted. Treatment effectiveness and the accuracy of
                      automated safety signals remain to be established.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ CLINICAL & RESEARCH PURPOSE ══ */}
          <section
            id="purpose"
            style={{
              padding: "70px 40px",
              borderTop: "1px solid var(--color-divider)",
            }}
          >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div
                data-reveal
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13.5px",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "1px",
                    background: "var(--color-accent)",
                  }}
                ></span>
                07 &mdash; Clinical &amp; research purpose
              </div>
              <h2
                data-reveal
                style={{
                  fontSize: "38px",
                  margin: "22px 0 8px",
                  maxWidth: "860px",
                }}
              >
                A support layer, not a substitute for care.
              </h2>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  lineHeight: "1.65",
                  color: "color-mix(in srgb,var(--color-text) 70%,transparent)",
                  maxWidth: "760px",
                  margin: "0 0 46px",
                }}
              >
                WET Guard is a clinician-mediated system designed to support the
                delivery of Written Exposure Therapy. It translates a structured
                clinical protocol into a guided digital workflow, helping
                clinicians maintain treatment fidelity while preserving a
                focused, low-interruption writing experience for patients.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "22px",
                }}
              >
                <div
                  data-reveal
                  className="blueprint wg-card"
                  style={{ padding: "20px" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    01
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      margin: "8px 0 0",
                      lineHeight: "1.2",
                    }}
                  >
                    Protocol adherence
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      margin: "8px 0 0",
                    }}
                  >
                    Guide clinicians through the required structure, timing, and
                    session sequence of WET without replacing clinical judgment.
                  </p>
                </div>
                <div
                  data-reveal
                  className="blueprint wg-card"
                  style={{ padding: "20px" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    02
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      margin: "8px 0 0",
                      lineHeight: "1.2",
                    }}
                  >
                    Therapeutic continuity
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      margin: "8px 0 0",
                    }}
                  >
                    Keep the writing experience focused and minimally
                    disruptive, especially during emotionally demanding exposure
                    periods.
                  </p>
                </div>
                <div
                  data-reveal
                  className="blueprint wg-card"
                  style={{ padding: "20px" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    03
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      margin: "8px 0 0",
                      lineHeight: "1.2",
                    }}
                  >
                    Safety-aware support
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      margin: "8px 0 0",
                    }}
                  >
                    Monitor for potential safety concerns in the background and
                    surface signals for clinician review without automatically
                    interrupting the writing process.
                  </p>
                </div>
                <div
                  data-reveal
                  className="blueprint wg-card"
                  style={{ padding: "20px" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: "var(--color-accent)",
                    }}
                  >
                    04
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "19px",
                      margin: "8px 0 0",
                      lineHeight: "1.2",
                    }}
                  >
                    Structured research data
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color:
                        "color-mix(in srgb,var(--color-text) 68%,transparent)",
                      margin: "8px 0 0",
                    }}
                  >
                    Capture session-level measures such as timing, completion,
                    adherence, and intervention events to support later
                    evaluation of treatment delivery.
                  </p>
                </div>
              </div>
              <p
                data-reveal
                style={{
                  fontSize: "15px",
                  lineHeight: "1.7",
                  color: "color-mix(in srgb,var(--color-text) 74%,transparent)",
                  maxWidth: "820px",
                  margin: "46px 0 0",
                  paddingTop: "30px",
                  borderTop: "1px solid var(--color-divider)",
                }}
              >
                WET Guard is not intended to automate therapy or make clinical
                decisions. It acts as a support layer between the treatment
                protocol, the clinician, and the patient &mdash; making a
                structured intervention easier to deliver consistently, observe,
                and study.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Closing CTA — the shared case-study ending, matching the other
          project pages. Deliberately outside `.wg` so it uses the site's
          own tokens rather than the Industry scope. */}
      <div className="border-t border-line px-6 py-24 text-center md:px-10">
        <p className="font-display text-3xl font-bold md:text-5xl">
          Thanks for reading!
        </p>
        <p className="mt-4 text-lg text-mist">Where do we go from here?</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#contact"
            className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.05]"
          >
            Get in Touch
          </Link>
          <Link
            href="/"
            className="rounded-full border border-line px-7 py-3 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-mist"
          >
            Return to Home
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="rounded-full border border-line px-7 py-3 font-display text-sm font-semibold text-bone transition-colors duration-300 hover:border-mist"
          >
            Next: {next.title} →
          </Link>
        </div>
      </div>
    </>
  );
}

/* ==================================================================
   PhoneCarousel — the patient app across its four screens.

   One device frame, four states, stepped with the arrows or the dots.
   Every screen is sized to sit inside the fixed 640px frame above the
   tab bar, so nothing scrolls or spills out of the device.
   ================================================================== */

/* ==================================================================
   ConsoleLaptop — the clinician console's start screen in a laptop.
   Shared by the hero and by Moment 01 so the two cannot drift apart.
   ================================================================== */

/* ==================================================================
   ConsoleStartScreen — the clinician console's session-setup screen.
   Presentation-agnostic: the hero shows it inside a laptop, Moment 01
   shows it in the same flat frame the other moments use.
   ================================================================== */

function ConsoleStartScreen() {
  return (
    <>
      {/* sidebar — collapsed to icons, expands on hover */}
      <div
        className="sidebar-demo"
        style={{
          flex: "none",
          background: "var(--ui-surface)",
          borderRight: "1px solid var(--ui-line)",
          display: "flex",
          flexDirection: "column",
          padding: "16px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 3px 14px",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              flex: "none",
              borderRadius: "11px",
              background: "var(--ui-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-on-accent)"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          </div>
          <span
            className="lbl"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--ui-text)",
            }}
          >
            WET Guard
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px",
              borderRadius: "10px",
              background: "var(--ui-accent-soft)",
              color: "var(--ui-accent)",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flex: "none" }}
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            <span
              className="lbl"
              style={{ fontSize: "13.5px", fontWeight: "600" }}
            >
              Start Session
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px",
              borderRadius: "10px",
              background: "transparent",
              color: "var(--ui-faint)",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flex: "none" }}
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <span
              className="lbl"
              style={{ fontSize: "13.5px", fontWeight: "600" }}
            >
              Therapy
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px",
              borderRadius: "10px",
              background: "transparent",
              color: "var(--ui-faint)",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flex: "none" }}
            >
              <path d="M18 20V10M12 20V4M6 20v-6" />
            </svg>
            <span
              className="lbl"
              style={{ fontSize: "13.5px", fontWeight: "600" }}
            >
              Session Summary
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px",
              borderRadius: "10px",
              color: "var(--ui-faint)",
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flex: "none" }}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span
              className="lbl"
              style={{ fontSize: "13.5px", fontWeight: "600" }}
            >
              Settings
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "9px",
              borderRadius: "10px",
              background: "var(--ui-accent)",
              color: "var(--ui-on-accent)",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ flex: "none" }}
            >
              <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 00-3 0zM12 15l-3-3a22 22 0 015-9l3 3a22 22 0 01-9 5zM9 12H4s.5-2.8 2-4a3 3 0 013 0M12 15v5s2.8-.5 4-2a3 3 0 000-3" />
            </svg>
            <span
              className="lbl"
              style={{ fontSize: "13.5px", fontWeight: "600" }}
            >
              Launch
            </span>
          </div>
        </div>
      </div>
      {/* main */}
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(28px,5vw,72px)",
          padding: "0 clamp(24px,4vw,52px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "0 1 auto",
            maxWidth: "360px",
            textAlign: "left",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(30px,3.6vw,42px)",
              fontWeight: "800",
              letterSpacing: "-.02em",
              color: "var(--ui-text)",
              fontFamily: "system-ui",
              margin: "0",
              lineHeight: "1.04",
            }}
          >
            WET Guard
          </h2>
          <p
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "var(--ui-accent)",
              margin: "12px 0 0",
            }}
          >
            Clinician-guided Written Exposure Therapy
          </p>
          <div
            style={{
              display: "flex",
              gap: "22px",
              marginTop: "26px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "13.5px",
                fontWeight: "600",
                color: "var(--ui-muted)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-accent)"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Protocol-guided
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                fontSize: "13.5px",
                fontWeight: "600",
                color: "var(--ui-muted)",
              }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-accent)"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Access controlled
            </div>
          </div>
        </div>
        <div
          style={{
            width: "clamp(290px,32%,340px)",
            flex: "none",
          }}
        >
          <div
            style={{
              background: "var(--ui-surface)",
              borderRadius: "16px",
              padding: "22px",
              boxShadow: "0 12px 34px rgba(15,23,42,.1)",
              border: "1px solid var(--ui-hairline)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "var(--ui-text)",
                  }}
                >
                  Start Session
                </div>
                <div
                  style={{
                    fontSize: "13.5px",
                    color: "var(--ui-faint)",
                    marginTop: "2px",
                  }}
                >
                  Configure the session before writing begins
                </div>
              </div>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "11px",
                  background: "var(--ui-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--ui-accent)"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--ui-muted)",
                    marginBottom: "6px",
                  }}
                >
                  Clinician Name
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid var(--ui-line)",
                    background: "var(--ui-subtle)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ui-faint)"
                    strokeWidth="2"
                  >
                    <path d="M11 2v2M5 2v2M9 15a5 5 0 01-5-5V4h10v6a5 5 0 01-5 5zM9 15v3a4 4 0 004 4 4 4 0 004-4v-1" />
                    <circle cx="20" cy="10" r="2" />
                  </svg>
                  <span
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ui-text)",
                    }}
                  >
                    Dr. Sarah Wilson
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--ui-muted)",
                    marginBottom: "6px",
                  }}
                >
                  Patient Name
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid var(--ui-line)",
                    background: "var(--ui-subtle)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ui-faint)"
                    strokeWidth="2"
                  >
                    <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ui-text)",
                    }}
                  >
                    Alex R.
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--ui-muted)",
                    marginBottom: "6px",
                  }}
                >
                  Session ID
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "1px solid var(--ui-line)",
                    background: "var(--ui-subtle)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ui-faint)"
                    strokeWidth="2"
                  >
                    <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
                  </svg>
                  <span
                    style={{
                      fontSize: "13.5px",
                      color: "var(--ui-text)",
                    }}
                  >
                    WET-2026-014
                  </span>
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    color: "var(--ui-muted)",
                    marginBottom: "6px",
                  }}
                >
                  WET Session #
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid var(--ui-line)",
                    background: "var(--ui-subtle)",
                    borderRadius: "11px",
                    padding: "9px 12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--ui-faint)"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: "var(--ui-text)",
                      }}
                    >
                      WET Session 1
                    </span>
                  </div>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--ui-faint)"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "18px",
                background: "var(--ui-accent)",
                borderRadius: "11px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--ui-on-accent)",
                }}
              >
                Start Session
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-on-accent)"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "var(--ui-faint)",
                marginTop: "12px",
              }}
            >
              Need assistance?{" "}
              <span
                style={{
                  fontWeight: "600",
                  color: "var(--ui-accent)",
                }}
              >
                Contact System Administrator
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ConsoleLaptop() {
  return (
    <>
      <div
        style={{
          background: "linear-gradient(180deg,#33333a,#141417)",
          borderRadius: "26px",
          padding: "14px 14px 16px",
          boxShadow:
            "0 44px 90px -26px rgba(15,23,42,.42),0 0 0 1px rgba(0,0,0,.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "9px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4a4a52",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.4)",
            }}
          ></span>
        </div>
        <div
          style={{
            borderRadius: "9px",
            overflow: "hidden",
            background: "var(--ui-bg)",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,.35)",
          }}
        >
          <div
            className="app"
            style={{
              display: "flex",
              height: "clamp(480px,48vw,560px)",
              background: "var(--ui-bg)",
            }}
          >
            <ConsoleStartScreen />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "16px",
          background: "linear-gradient(180deg,var(--ui-line),var(--ui-faint))",
          borderRadius: "0 0 14px 14px",
          boxShadow: "0 24px 34px -14px rgba(0,0,0,.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "130px",
            height: "7px",
            background: "var(--ui-faint)",
            borderRadius: "0 0 9px 9px",
          }}
        ></div>
      </div>
    </>
  );
}

/* ── the patient app's four screens, rebuilt from the shipped UI ──── */

const UI = {
  back: (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--ui-text-2)"
      strokeWidth="2"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  navTitle: {
    fontSize: "15px",
    fontWeight: "700" as const,
    color: "var(--ui-text)",
  },
  label: {
    fontSize: "12px",
    fontWeight: "800" as const,
    letterSpacing: ".08em",
    textTransform: "uppercase" as const,
    color: "var(--ui-faint)",
  },
  fieldLabel: {
    fontSize: "12.5px",
    fontWeight: "700" as const,
    color: "var(--ui-text-2)",
    marginBottom: "5px",
  },
  field: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    border: "1px solid var(--ui-line)",
    background: "var(--ui-surface)",
    borderRadius: "11px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "var(--ui-text)",
  },
  primary: {
    background: "var(--ui-accent)",
    color: "var(--ui-on-accent)",
    borderRadius: "12px",
    padding: "12px",
    textAlign: "center" as const,
    fontSize: "13.5px",
    fontWeight: "700" as const,
  },
  card: {
    background: "var(--ui-surface)",
    borderRadius: "14px",
    border: "1px solid var(--ui-hairline)",
  },
};

function Bubble({
  side,
  who,
  time,
  children,
}: {
  side: "left" | "right";
  who?: string;
  time?: string;
  children: React.ReactNode;
}) {
  const right = side === "right";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: right ? "flex-end" : "flex-start",
      }}
    >
      {who && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "4px",
          }}
        >
          {!right && (
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--ui-line)",
                flex: "none",
              }}
            />
          )}
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "var(--ui-text-2)",
            }}
          >
            {who}
          </span>
          {right && (
            <span
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--ui-line)",
                flex: "none",
              }}
            />
          )}
        </div>
      )}
      <div
        style={{
          maxWidth: "88%",
          marginLeft: right ? "0" : "27px",
          marginRight: right ? "27px" : "0",
          background: right ? "var(--ui-accent)" : "var(--ui-surface)",
          color: right ? "var(--ui-on-accent)" : "var(--ui-text-2)",
          border: right ? "0" : "1px solid var(--ui-hairline)",
          borderRadius: right ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          padding: "10px 12px",
          fontSize: "12.5px",
          lineHeight: "1.5",
        }}
      >
        {children}
      </div>
      {time && (
        <div
          style={{
            fontSize: "11px",
            color: "var(--ui-faint)",
            marginTop: "4px",
            marginLeft: right ? "0" : "27px",
            marginRight: right ? "27px" : "0",
          }}
        >
          {time}
        </div>
      )}
    </div>
  );
}

const PHONE_SCREENS: {
  key: string;
  label: string;
  tabBar?: boolean;
  render: () => React.ReactNode;
}[] = [
  {
    key: "welcome",
    label: "Welcome",
    tabBar: true,
    render: () => (
      <div
        style={{
          padding: "22px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "13px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "54px",
              height: "54px",
              borderRadius: "16px",
              background: "var(--ui-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-on-accent)"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "800",
              color: "var(--ui-text)",
              textAlign: "center",
            }}
          >
            Welcome to WET Mobile
          </div>
          <div
            style={{
              fontSize: "12.5px",
              color: "var(--ui-muted)",
              textAlign: "center",
              marginTop: "4px",
              lineHeight: "1.45",
            }}
          >
            Clinician-guided Written Exposure Therapy
          </div>
        </div>
        <div>
          <div style={UI.fieldLabel}>Patient Name</div>
          <div style={UI.field}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-faint)"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1" />
            </svg>
            Alex R.
          </div>
        </div>
        <div>
          <div style={UI.fieldLabel}>Clinician Name</div>
          <div style={UI.field}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-faint)"
              strokeWidth="2"
            >
              <path d="M6 3v7a6 6 0 0012 0V3" />
              <circle cx="18" cy="18" r="3" />
            </svg>
            Dr. Sarah Wilson
          </div>
        </div>
        <div>
          <div style={UI.fieldLabel}>WET Session #</div>
          <div style={{ ...UI.field, justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-faint)"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              WET Session 1
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-faint)"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        <div
          style={{
            ...UI.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Start Session
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="var(--ui-on-accent)"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div
          style={{
            fontSize: "11.5px",
            color: "var(--ui-faint)",
            textAlign: "center",
            lineHeight: "1.45",
          }}
        >
          Your writing is monitored for safety during the session. If a serious
          safety concern is detected, a clinician may review it.
        </div>
      </div>
    ),
  },
  {
    key: "guidance",
    label: "Guidance",
    render: () => (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: "none",
            background: "var(--ui-surface)",
            borderBottom: "1px solid var(--ui-line)",
            padding: "14px 14px 11px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {UI.back}
            <div style={UI.navTitle}>Therapy Session</div>
            <div
              style={{
                fontSize: "11.5px",
                fontWeight: "700",
                color: "#e0575f",
              }}
            >
              End
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "4px",
              fontSize: "12px",
              color: "var(--ui-muted)",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "var(--ui-ok)",
              }}
            />
            Recording for Alex R.
          </div>
        </div>

        <div
          style={{
            flex: "1",
            minHeight: "0",
            overflow: "hidden",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Bubble side="left" who="WET Guide" time="14:02:09">
            Survivors of traumatic experiences often go through changes in their
            reactions, emotions, and thoughts.
          </Bubble>
          <Bubble side="right" who="Alex R." time="14:02:41">
            What&rsquo;s the difference between flashbacks and intrusive
            thoughts?
          </Bubble>
          <Bubble side="left" who="WET Guide">
            A good question. Flashbacks feel as if the event is happening now,
            while intrusive thoughts are unwanted memories you know are past.
          </Bubble>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginLeft: "27px",
            }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--ui-faint)",
                  animation: `wg-tdot .9s ease-in-out ${d * 0.15}s infinite`,
                }}
              />
            ))}
            <span
              style={{
                fontSize: "12px",
                fontStyle: "italic",
                color: "var(--ui-faint)",
              }}
            >
              typing
            </span>
          </div>
        </div>

        <div style={{ flex: "none", padding: "10px 14px 14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              background: "var(--ui-surface)",
              border: "1px solid var(--ui-line)",
              borderRadius: "22px",
              padding: "6px 6px 6px 10px",
            }}
          >
            <span
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "var(--ui-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
                color: "var(--ui-muted)",
                fontSize: "15px",
              }}
            >
              +
            </span>
            <span
              style={{
                flex: "1",
                fontSize: "12.5px",
                color: "var(--ui-faint)",
              }}
            >
              Enter your message…
            </span>
            <span
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "var(--ui-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "none",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-on-accent)"
                strokeWidth="2"
              >
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "writing",
    label: "Writing",
    render: () => (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: "none",
            background: "var(--ui-surface)",
            padding: "13px 14px 0",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <div style={{ paddingTop: "3px" }}>{UI.back}</div>
          <div style={{ flex: "1" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11.5px",
                fontWeight: "800",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--ui-accent)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "var(--ui-ok)",
                }}
              />
              Writing in progress
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "800",
                color: "var(--ui-text)",
                marginTop: "2px",
              }}
            >
              WET Session 1
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              border: "1px solid var(--ui-line)",
              borderRadius: "20px",
              padding: "5px 10px",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--ui-text)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ui-muted)"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            17:22
          </div>
        </div>

        <div style={{ flex: "none", padding: "10px 14px 0" }}>
          <div
            style={{
              height: "3px",
              background: "var(--ui-line)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "42%",
                height: "100%",
                background: "var(--ui-accent)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            flex: "1",
            minHeight: "0",
            padding: "10px 14px",
            display: "flex",
          }}
        >
          <div
            style={{
              ...UI.card,
              flex: "1",
              display: "flex",
              flexDirection: "column",
              padding: "13px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12.5px",
                lineHeight: "1.6",
                color: "var(--ui-text-2)",
              }}
            >
              I keep coming back to the sound before anything else — the tyres,
              then the guardrail.
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "12.5px",
                lineHeight: "1.6",
                color: "var(--ui-text-2)",
              }}
            >
              When I try to stay with it now my chest goes tight and I lose the
              order of things. I know I am supposed to keep going, so I am going
              to keep going
              <span className="wg-caret" aria-hidden="true" />
            </p>
            <div
              style={{
                marginTop: "auto",
                paddingTop: "11px",
                borderTop: "1px solid var(--ui-hairline)",
                fontSize: "11.5px",
                color: "var(--ui-faint)",
              }}
            >
              412 words · autosaved 14s ago
            </div>
          </div>
        </div>

        <div
          style={{
            flex: "none",
            padding: "0 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ ...UI.card, padding: "11px 12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: "700",
                  color: "var(--ui-text)",
                }}
              >
                Safety review
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "var(--ui-muted)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--ui-ok)",
                  }}
                />
                Active
              </span>
            </div>
            <div
              style={{
                marginTop: "9px",
                background: "var(--ui-bg)",
                borderRadius: "9px",
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span style={{ color: "var(--ui-text-2)", fontWeight: "600" }}>
                Review requested
              </span>
              <span style={{ color: "var(--ui-faint)" }}>12:38</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "9px" }}>
            <div
              style={{
                flex: "1",
                border: "1px solid var(--ui-line-2)",
                background: "var(--ui-surface)",
                borderRadius: "12px",
                padding: "11px",
                textAlign: "center",
                fontSize: "12.5px",
                fontWeight: "700",
                color: "var(--ui-text-2)",
              }}
            >
              Review signal
            </div>
            <div
              style={{
                flex: "1.2",
                ...UI.primary,
                padding: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
              }}
            >
              Finish Writing
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--ui-on-accent)"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "summary",
    label: "Summary",
    render: () => (
      <div
        style={{
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "11px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {UI.back}
          <div
            style={{
              ...UI.navTitle,
              flex: "1",
              textAlign: "center",
              marginRight: "19px",
            }}
          >
            Session Summary
          </div>
        </div>

        <div
          style={{
            background: "var(--ui-ok-soft)",
            borderRadius: "11px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--ui-ok)",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          Session concluded
        </div>

        <div style={UI.label}>Session identity</div>
        <div style={{ ...UI.card, padding: "2px 13px" }}>
          {[
            ["Patient", "Alex R."],
            ["Clinician", "Dr. Sarah Wilson"],
            ["WET Session", "Session 1"],
            ["Duration", "14m 02s"],
          ].map(([k, v], n) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: n ? "1px solid var(--ui-hairline)" : "none",
                fontSize: "12.5px",
              }}
            >
              <span style={{ color: "var(--ui-muted)" }}>{k}</span>
              <span style={{ fontWeight: "700", color: "var(--ui-text)" }}>
                {v}
              </span>
            </div>
          ))}
        </div>

        <div style={UI.label}>Generated summary · for clinician review</div>
        <div
          style={{
            background: "var(--ui-accent-soft)",
            borderRadius: "12px",
            padding: "12px",
            fontSize: "12.5px",
            lineHeight: "1.5",
            color: "var(--ui-text-2)",
          }}
        >
          <div
            style={{
              fontWeight: "800",
              color: "var(--ui-accent-ink)",
              marginBottom: "5px",
            }}
          >
            Clinical summary
          </div>
          Session 1 followed the standard WET sequence. The patient engaged
          throughout and each scripted checkpoint was completed. No safety
          signals were raised for review.
        </div>

        <div
          style={{
            background: "var(--ui-accent)",
            borderRadius: "12px",
            padding: "11px 13px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "var(--ui-on-accent)",
          }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ flex: "none" }}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: "800" }}>
              Session data protected
            </div>
            <div style={{ fontSize: "11.5px", opacity: 0.85 }}>
              Encrypted at rest and in transit.
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--ui-text)",
            color: "var(--ui-bg)",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 11l9-8 9 8v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Start New Session
        </div>
      </div>
    ),
  },
];

function PhoneCarousel() {
  const [i, setI] = useState(0);
  const total = PHONE_SCREENS.length;
  const go = (d: number) => setI((v) => (v + d + total) % total);
  const screen = PHONE_SCREENS[i];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        width: "100%",
      }}
    >
      <div
        className="blueprint"
        style={{
          padding: "9px",
          background: "#0b0b0f",
          borderRadius: "40px",
          boxShadow: "var(--shadow-lg)",
          width: "320px",
        }}
      >
        <i className="corner tl"></i>
        <i className="corner tr"></i>
        <i className="corner bl"></i>
        <i className="corner br"></i>
        <div
          className="app wg-phone"
          style={{
            borderRadius: "32px",
            overflow: "hidden",
            background: "var(--ui-bg)",
            height: "640px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Flow layout, not absolute: the responsive layer releases the
              fixed height on narrow screens, and an absolutely positioned
              screen would collapse the frame to zero height there. */}
          <div
            key={screen.key}
            style={{ flex: "1", minHeight: "0", overflow: "hidden" }}
          >
            {screen.render()}
          </div>
          {screen.tabBar && (
            <div
              style={{
                flex: "none",
                height: "74px",
                borderTop: "1px solid var(--ui-line)",
                background: "var(--ui-surface)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {[
                { t: "Home", on: true },
                { t: "Therapy", on: false },
                { t: "Session", on: false },
              ].map((tab) => (
                <div
                  key={tab.t}
                  style={{
                    flex: "1",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: tab.on ? "700" : "500",
                    color: tab.on ? "var(--ui-accent)" : "var(--ui-faint)",
                  }}
                >
                  {tab.t}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          onClick={() => go(-1)}
          aria-label="Previous screen"
          style={{
            width: "34px",
            height: "34px",
            cursor: "pointer",
            border: "1px solid var(--color-divider)",
            background: "transparent",
            color: "var(--color-text)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {PHONE_SCREENS.map((s, n) => (
            <button
              key={s.key}
              onClick={() => setI(n)}
              aria-label={s.label}
              aria-current={n === i ? "true" : undefined}
              style={{
                width: n === i ? "22px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "0",
                cursor: "pointer",
                padding: "0",
                background:
                  n === i ? "var(--color-accent)" : "var(--color-divider)",
                transition: "width .25s ease, background .25s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          aria-label="Next screen"
          style={{
            width: "34px",
            height: "34px",
            cursor: "pointer",
            border: "1px solid var(--color-divider)",
            background: "transparent",
            color: "var(--color-text)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "13px",
          fontWeight: "700",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "color-mix(in srgb,var(--color-text) 64%,transparent)",
        }}
      >
        {i + 1} / {total} · {screen.label}
      </div>
    </div>
  );
}
