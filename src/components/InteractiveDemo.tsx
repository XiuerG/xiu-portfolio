"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* ================================================================== */
/* CoReLink — interactive product replica (v2).                        */
/* A faithful, click-driven rebuild of the CoReLink app: persistent    */
/* left nav + six screens (Cases · Intake · Needs Summary · Resources  */
/* · Coordination Plan · Share & Export) + a connection-method modal.  */
/* The whole 1440×944 canvas is scaled to fit the portfolio frame.     */
/* ================================================================== */

/* Product palette (from the v2 design). */
const C = {
  appBg: "#eceae4",
  panelBg: "#f7f6f3",
  navBg: "#fbfaf7",
  card: "#ffffff",
  ink: "#22312c",
  body: "#3a4843",
  muted: "#66756e",
  faint: "#98a39d",
  faint2: "#c2beb2",
  line: "#e5e2da",
  line2: "#efede7",
  line3: "#e9e6de",
  green: "#1f6f5c",
  greenHover: "#1b5f4f",
  greenSoft: "#eaf2ee",
  greenBorder: "#b7d4c8",
  greenDark: "#1c4a3e",
  greenChip: "#dce8e2",
  amber: "#8f6811",
  amberSoft: "#fbf4e3",
  amberBorder: "#ead9ae",
  amberBg: "#fffdf6",
  red: "#a8442f",
  redSoft: "#f9ece7",
  purple: "#5b4b8a",
  purpleBorder: "#dcd4e8",
  purpleBg: "#faf8fd",
  purpleSoft: "#efecf5",
  slate: "#4a5a7a",
  slateSoft: "#eef1f6",
  shadow: "0 1px 3px rgba(20,30,25,.05)",
  shadowUp: "0 2px 6px rgba(31,111,92,.25)",
};

const SANS = "'Source Sans 3', system-ui, sans-serif";
const SERIF = "'Lora', Georgia, serif";

type Screen =
  | "cases"
  | "intake"
  | "summary"
  | "resources"
  | "plan"
  | "share";
type Lang = "es" | "en";
type CaseTab = "active" | "followup" | "closed";
type ConnMethod = "share" | "assist" | "refer";
type Modal = { name: string; desc: string } | null;

/* ================================================================== */
/* FitFrame — scales the fixed 1440×944 app to fit its container,       */
/* keeping the whole product visible (no page scrolling to see it).     */
/* ================================================================== */
function FitFrame({ children }: { children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (!w || !h) return;
      setScale(Math.min(w / 1440, h / 944));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="flex w-full items-center justify-center overflow-hidden"
      style={{ aspectRatio: "1440 / 944", maxHeight: "calc(100dvh - 172px)" }}
    >
      <div
        style={{
          width: 1440,
          height: 944,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* The self-running demo walks these core steps. Intake advances itself when
   its scripted conversation finishes; every other screen is driven by the
   simulated cursor below — it walks to real controls and clicks them, so the
   demo performs the same flow a visitor would. */
const AUTO_SEQUENCE: Screen[] = [
  "intake",
  "summary",
  "resources",
  "plan",
  "share",
];
const nextScreen = (s: Screen): Screen => {
  const i = AUTO_SEQUENCE.indexOf(s);
  return AUTO_SEQUENCE[(i + 1) % AUTO_SEQUENCE.length];
};

/** One scripted click: wait `pause`, walk the cursor to `sim`, press it. */
type Beat = { sim: string; pause: number };

/* Beats reference `data-sim` keys on real controls. A beat that navigates
   ends the screen's script early (the effect re-runs on screen change). */
const SCRIPT: Record<Screen, Beat[]> = {
  cases: [],
  intake: [], // self-driven by IntakeScreen's typing sequence
  summary: [{ sim: "summary-next", pause: 4200 }],
  resources: [
    { sim: "resource-select", pause: 3200 },
    { sim: "method-assist", pause: 1700 },
    { sim: "modal-confirm", pause: 1500 },
  ],
  plan: [{ sim: "plan-share", pause: 5000 }],
  share: [
    { sim: "share-en", pause: 3600 },
    { sim: "share-es", pause: 3000 },
  ],
};
/* Breathing room after the last beat, before looping to the next screen. */
const TAIL_MS = 2200;
/* Cursor travel + press timings. */
const TRAVEL_MS = 650;
const PRESS_MS = 160;

/** Total time the auto-demo spends on a screen — drives the progress bar. */
const screenDuration = (s: Screen) =>
  SCRIPT[s].reduce((sum, b) => sum + b.pause + TRAVEL_MS + PRESS_MS, 0) +
  TAIL_MS;

/* ================================================================== */
/* Root                                                                */
/* ================================================================== */
export function InteractiveDemo() {
  const [screen, setScreen] = useState<Screen>("cases");
  const [lang, setLang] = useState<Lang>("es");
  const [caseTab, setCaseTab] = useState<CaseTab>("active");
  const [modal, setModal] = useState<Modal>(null);
  const [connMethod, setConnMethod] = useState<ConnMethod>("refer");
  const [isAuto, setIsAuto] = useState(false);
  const [userDrove, setUserDrove] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  /* Simulated cursor — canvas coordinates (1440×944 space). */
  const [cursor, setCursor] = useState({ x: 1180, y: 600 });
  const [pressing, setPressing] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(false);
  /* True only while the script is dispatching a click, so the nav handlers
     can tell a scripted press from a real visitor taking over. */
  const scriptRef = useRef(false);

  /* Load the product fonts once, client-side. */
  useEffect(() => {
    const id = "corelink-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Lora:wght@500;600&family=Source+Sans+3:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }, []);

  const pauseAuto = useCallback(() => {
    autoRef.current = false;
    setIsAuto(false);
  }, []);
  const startAuto = useCallback(() => {
    autoRef.current = true;
    setIsAuto(true);
    setScreen("intake");
    setPlayKey((k) => k + 1);
  }, []);

  /* Auto-play kicks off when the demo scrolls into view — unless the visitor
     has taken over, or prefers reduced motion. */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!autoRef.current && !userDrove && !mq.matches) startAuto();
          } else {
            pauseAuto();
          }
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startAuto, pauseAuto, userDrove]);

  /* Walk the demo cursor to a real control and press it. Shared by the beat
     script below and by Intake's own conversation sequence. */
  const pressTarget = useCallback(async (key: string) => {
    const canvas = canvasRef.current;
    const el = canvas?.querySelector<HTMLElement>(`[data-sim="${key}"]`);
    if (!canvas || !el) return;
    const cRect = canvas.getBoundingClientRect();
    const scale = cRect.width / 1440 || 1;
    const tRect = el.getBoundingClientRect();
    setCursor({
      x: (tRect.left + tRect.width / 2 - cRect.left) / scale,
      y: (tRect.top + tRect.height / 2 - cRect.top) / scale,
    });
    await new Promise((r) => setTimeout(r, TRAVEL_MS));
    if (!autoRef.current) return;
    setPressing(true);
    await new Promise((r) => setTimeout(r, PRESS_MS));
    setPressing(false);
    if (!autoRef.current) return;
    /* Fire the control's real handler — the same path a click would take. */
    scriptRef.current = true;
    el.click();
    scriptRef.current = false;
  }, []);

  /* Every non-intake screen runs its beat script: walk the cursor to a real
     control, press it, let the app react. A beat that navigates cancels the
     rest (this effect re-runs on screen change); otherwise we advance after
     the tail. */
  useEffect(() => {
    if (!isAuto || screen === "intake") return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const live = () => !cancelled && autoRef.current;

    (async () => {
      for (const beat of SCRIPT[screen]) {
        await sleep(beat.pause);
        if (!live()) return;
        await pressTarget(beat.sim);
        if (!live()) return;
      }
      await sleep(TAIL_MS);
      if (!live()) return;
      const nxt = nextScreen(screen);
      if (nxt === "intake") setPlayKey((k) => k + 1);
      setScreen(nxt);
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuto, screen, playKey, pressTarget]);

  /* A press from the script keeps the demo playing; a press from a real
     visitor hands the product over to them. */
  const takeOver = useCallback(() => {
    if (scriptRef.current) return;
    setUserDrove(true);
    pauseAuto();
  }, [pauseAuto]);

  const go = useCallback(
    (s: Screen) => {
      takeOver();
      if (s === "intake") setPlayKey((k) => k + 1);
      setScreen(s);
    },
    [takeOver],
  );
  const openModal = useCallback(
    (name: string, desc: string) => {
      takeOver();
      setConnMethod("refer");
      setModal({ name, desc });
    },
    [takeOver],
  );
  const confirmAdd = useCallback(() => {
    setModal(null);
    setScreen("plan");
  }, []);
  const replay = useCallback(() => {
    setUserDrove(false);
    setModal(null);
    startAuto();
  }, [startAuto]);

  return (
    <div
      ref={wrapperRef}
      className="relative left-1/2 w-[min(calc(100vw-3rem),82rem)] -translate-x-1/2"
    >
      {/* Dark browser chrome — reads as "the product, running". */}
      <div
        className="overflow-hidden rounded-2xl border border-line"
        style={{
          background: "#121212",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.55), 0 0 120px rgba(78,141,118,0.22), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div
          className="flex items-center gap-3 border-b border-line px-4 py-2.5"
          style={{ background: "#141414" }}
        >
          <span className="flex gap-1.5" aria-hidden>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span
                key={c}
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c, opacity: 0.7 }}
              />
            ))}
          </span>
          <span
            className="mx-auto hidden rounded-full px-4 py-1 font-mono text-[11px] tracking-[0.04em] sm:block"
            style={{ background: "#1d1d1d", color: "var(--color-mist)" }}
          >
            corelink.app / case-A-102
          </span>
          <span
            className="ml-auto flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] sm:ml-0"
            style={{ color: "var(--color-accent)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--color-accent)",
                animation: "blink 1.8s ease-in-out infinite",
              }}
              aria-hidden
            />
            Live demo
          </span>
        </div>

        <div style={{ background: C.appBg, padding: 14 }}>
          <FitFrame>
            <div
              ref={canvasRef}
              style={{
                width: 1440,
                height: 944,
                background: C.card,
                borderRadius: 16,
                boxShadow: "0 8px 40px rgba(20,30,25,.14)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                fontFamily: SANS,
                color: C.ink,
                fontSize: 14,
                position: "relative",
              }}
            >
              <TopBar onGo={go} />

              {/* Auto-play dwell progress — fills over the current step's timer. */}
              <div
                style={{
                  position: "relative",
                  height: 2,
                  background: C.line2,
                  flexShrink: 0,
                }}
              >
                {isAuto && screen !== "intake" && (
                  <span
                    key={`progress-${screen}-${playKey}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      transformOrigin: "left",
                      background: C.green,
                      animation: `growLine ${screenDuration(screen)}ms linear both`,
                    }}
                  />
                )}
              </div>

              <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <LeftNav screen={screen} onGo={go} />
                {/* Fixed viewport: the app screen never grows with its
                    content — each screen fits, or scrolls its own inner
                    region. */}
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    background: C.panelBg,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {screen === "cases" && (
                    <CasesScreen
                      tab={caseTab}
                      setTab={setCaseTab}
                      onGo={go}
                    />
                  )}
                  {screen === "intake" && (
                    <IntakeScreen
                      key={playKey}
                      reduce={reduce}
                      press={pressTarget}
                      onGo={go}
                    />
                  )}
                  {screen === "summary" && <SummaryScreen onGo={go} />}
                  {screen === "resources" && (
                    <ResourcesScreen onSelect={openModal} onGo={go} />
                  )}
                  {screen === "plan" && <PlanScreen onGo={go} />}
                  {screen === "share" && (
                    <ShareScreen lang={lang} setLang={setLang} />
                  )}
                </div>
              </div>

              {modal && (
                <ConnectionModal
                  modal={modal}
                  method={connMethod}
                  setMethod={setConnMethod}
                  onCancel={() => setModal(null)}
                  onConfirm={confirmAdd}
                />
              )}

              {/* Simulated cursor — only while the demo drives itself. */}
              {isAuto && !reduce && (
                <SimCursor x={cursor.x} y={cursor.y} pressing={pressing} />
              )}
            </div>
          </FitFrame>
        </div>
      </div>

      {/* portfolio caption */}
      <div
        className="mt-4 flex flex-wrap items-center gap-2.5 text-[13px]"
        style={{ color: "var(--color-mist)" }}
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{
            background: isAuto ? "var(--color-accent)" : "#6b6b6b",
            animation: isAuto ? "blink 1.6s ease-in-out infinite" : "none",
          }}
        />
        {isAuto
          ? "Playing itself — the notes type in, CoReLink reads them, and it works the case through to a bilingual handout. Click anything to take over."
          : "You’re driving — walk the case from the left nav, select a resource to choose how the family connects, flip the handout to Español."}
        <button
          type="button"
          onClick={replay}
          className="ml-auto rounded-full border border-line px-3.5 py-1 font-display text-xs font-semibold text-bone transition-colors hover:border-mist"
        >
          ↻ Replay
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Top bar                                                             */
/* ================================================================== */
function TopBar({ onGo }: { onGo: (s: Screen) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "13px 26px",
        background: C.card,
        borderBottom: `1px solid ${C.line}`,
        flexShrink: 0,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => onGo("cases")}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: C.green,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          C
        </span>
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-.2px" }}>
          CoReLink
        </span>
      </div>
      <span style={{ width: 1, height: 22, background: C.line }} />
      <span style={{ fontSize: 13.5, color: C.muted }}>
        Case <b style={{ color: C.ink }}>A-102</b> · Travis County · 85 M ·
        Alzheimer&apos;s
      </span>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            color: C.green,
            background: C.greenSoft,
            borderRadius: 999,
            padding: "4px 12px",
            fontWeight: 600,
          }}
        >
          🛡 PHI auto-masked
        </span>
        <span style={{ fontSize: 12.5, color: C.faint }}>autosaved 12:04</span>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: C.greenChip,
            color: C.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          MG
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Left nav                                                            */
/* ================================================================== */
function LeftNav({
  screen,
  onGo,
}: {
  screen: Screen;
  onGo: (s: Screen) => void;
}) {
  const navItem = (
    key: Screen,
    label: string,
    badge?: ReactNode,
    icon?: ReactNode,
  ) => {
    const on = screen === key;
    return (
      <div
        onClick={() => onGo(key)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 11,
          fontSize: 14,
          borderRadius: 9,
          padding: "9px 12px",
          cursor: "pointer",
          background: on ? C.greenSoft : "transparent",
          color: on ? C.green : C.muted,
          fontWeight: on ? 700 : 400,
        }}
      >
        {icon ?? badge}
        {label}
      </div>
    );
  };

  const numBadge = (n: string) => (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        background: C.greenChip,
        color: C.green,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {n}
    </span>
  );

  const sectionLabel: CSSProperties = {
    fontSize: 11,
    color: C.faint,
    fontWeight: 700,
    letterSpacing: ".6px",
    padding: "0 6px 6px",
  };

  return (
    <div
      style={{
        width: 236,
        background: C.navBg,
        borderRight: `1px solid ${C.line}`,
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        overflow: "auto",
        flexShrink: 0,
      }}
    >
      <div style={sectionLabel}>WORKSPACE</div>
      {navItem(
        "cases",
        "Cases",
        undefined,
        <span style={{ width: 20, textAlign: "center" }}>▸</span>,
      )}

      <div style={{ ...sectionLabel, padding: "16px 6px 6px" }}>
        CURRENT CASE · A-102
      </div>
      {navItem("intake", "Case Intake", numBadge("1"))}
      {navItem("summary", "Needs Summary", numBadge("2"))}
      {navItem("resources", "Resources", numBadge("3"))}
      {navItem("plan", "Coordination Plan", numBadge("4"))}

      <div style={{ height: 1, background: C.line3, margin: "14px 6px" }} />
      {navItem(
        "share",
        "Share & Export",
        undefined,
        <span style={{ width: 20, textAlign: "center" }}>⇪</span>,
      )}

      <div
        style={{
          marginTop: "auto",
          background: C.card,
          border: `1px solid ${C.line}`,
          borderRadius: 11,
          padding: "13px 14px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.green,
            marginBottom: 6,
          }}
        >
          Case progress
        </div>
        <div
          style={{
            height: 6,
            background: "#eceae2",
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div style={{ width: "62%", height: "100%", background: C.green }} />
        </div>
        <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
          Intake &amp; needs confirmed. 4 resources selected · 6 tasks · 2
          referrals pending.
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Small shared bits                                                   */
/* ================================================================== */
function Pill({
  children,
  color,
  bg,
  border,
  weight = 700,
}: {
  children: ReactNode;
  color: string;
  bg?: string;
  border?: string;
  weight?: number;
}) {
  return (
    <span
      style={{
        fontSize: 12,
        color,
        background: bg,
        border,
        borderRadius: 999,
        padding: "2px 11px",
        fontWeight: weight,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function GreenButton({
  children,
  onClick,
  style,
  sim,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  /** Marks this as a target the auto-demo cursor can find and click. */
  sim?: string;
}) {
  return (
    <span
      onClick={onClick}
      data-sim={sim}
      style={{
        background: C.green,
        color: "#fff",
        borderRadius: 10,
        padding: "11px 24px",
        fontSize: 14.5,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: C.shadowUp,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function GhostButton({
  children,
  onClick,
  style,
  sim,
}: {
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  /** Marks this as a target the auto-demo cursor can find and click. */
  sim?: string;
}) {
  return (
    <span
      onClick={onClick}
      data-sim={sim}
      style={{
        border: `1.5px solid #d6d2c8`,
        color: C.muted,
        borderRadius: 10,
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* The auto-demo's pointer: glides to each control and presses it, so the
   walkthrough reads as someone using the product rather than slides. */
function SimCursor({
  x,
  y,
  pressing,
}: {
  x: number;
  y: number;
  pressing: boolean;
}) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        transition: `transform ${TRAVEL_MS}ms cubic-bezier(.5,.05,.2,1)`,
        pointerEvents: "none",
        zIndex: 60,
      }}
    >
      {/* press ripple */}
      <span
        style={{
          position: "absolute",
          left: -19,
          top: -19,
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: `2px solid ${C.green}`,
          background: "rgba(31,111,92,.16)",
          opacity: pressing ? 1 : 0,
          transform: `scale(${pressing ? 1 : 0.3})`,
          transition: "opacity .18s ease, transform .18s ease",
        }}
      />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          display: "block",
          filter: "drop-shadow(0 2px 5px rgba(0,0,0,.4))",
          transform: `scale(${pressing ? 0.85 : 1})`,
          transition: "transform .18s ease",
        }}
      >
        <path
          d="M5 3 L5 18.5 L9.1 14.6 L11.8 20.6 L14.6 19.3 L11.9 13.4 L17.5 13.2 Z"
          fill="#fff"
          stroke={C.greenDark}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const label: CSSProperties = {
  fontSize: 11,
  color: C.faint,
  fontWeight: 700,
  letterSpacing: ".5px",
};

/* ================================================================== */
/* 1 — Cases                                                           */
/* ================================================================== */
function CasesScreen({
  tab,
  setTab,
  onGo,
}: {
  tab: CaseTab;
  setTab: (t: CaseTab) => void;
  onGo: (s: Screen) => void;
}) {
  const tabStyle = (x: CaseTab): CSSProperties =>
    tab === x
      ? {
          padding: "7px 16px",
          borderRadius: 999,
          fontSize: 13.5,
          cursor: "pointer",
          fontWeight: 600,
          background: C.ink,
          color: "#fff",
        }
      : {
          padding: "7px 16px",
          borderRadius: 999,
          fontSize: 13.5,
          cursor: "pointer",
          fontWeight: 600,
          color: C.muted,
          border: `1px solid #d6d2c8`,
        };

  const tag = (t: string, dim?: boolean) => (
    <span
      style={{
        background: C.panelBg,
        borderRadius: 7,
        padding: "4px 10px",
        color: dim ? C.faint : C.body,
      }}
    >
      {t}
    </span>
  );

  const stat = (k: string, v: string, color?: string) => (
    <div>
      <div style={{ color: C.faint }}>{k}</div>
      <div style={{ fontWeight: 700, color: color ?? C.ink, fontSize: 15 }}>
        {v}
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "30px 40px 48px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-.3px" }}>
            Cases
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 3 }}>
            Pick up where you left off — follow-ups and pending referrals surface
            first.
          </div>
        </div>
        <GreenButton
          onClick={() => onGo("intake")}
          style={{ marginLeft: "auto", padding: "11px 22px" }}
        >
          ＋ New case
        </GreenButton>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span style={tabStyle("active")} onClick={() => setTab("active")}>
          Active · 3
        </span>
        <span style={tabStyle("followup")} onClick={() => setTab("followup")}>
          Follow-up needed · 2
        </span>
        <span style={tabStyle("closed")} onClick={() => setTab("closed")}>
          Closed · 12
        </span>
      </div>

      {tab === "active" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* A-102 */}
          <div
            onClick={() => onGo("summary")}
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "20px 22px",
              boxShadow: C.shadow,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>
                A-102 · Travis Co.
              </span>
              <Pill color={C.red} bg={C.redSoft}>
                DISCHARGE IN 2 DAYS
              </Pill>
            </div>
            <div style={{ fontSize: 13.5, color: C.muted }}>
              85 M · Alzheimer&apos;s · Spanish · Medicare · caregiver wife 75
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                fontSize: 12.5,
              }}
            >
              {tag("Transport")}
              {tag("Medications")}
              {tag("Home safety")}
              {tag("Respite")}
              {tag("+1", true)}
            </div>
            <div style={{ height: 1, background: "#efede7" }} />
            <div style={{ display: "flex", gap: 22, fontSize: 12.5 }}>
              {stat("Referrals pending", "2", C.amber)}
              {stat("Next follow-up", "Jul 21")}
              {stat("Open barriers", "1", C.red)}
            </div>
            <div style={{ fontSize: 12.5, color: C.green, fontWeight: 600 }}>
              Open case →
            </div>
          </div>

          {/* A-101 */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "20px 22px",
              boxShadow: C.shadow,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>
                A-101 · Hays Co.
              </span>
              <Pill color={C.muted} bg="#f0efe9" weight={600}>
                In progress
              </Pill>
            </div>
            <div style={{ fontSize: 13.5, color: C.muted }}>
              72 F · diabetes · English · Medicaid · lives alone
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                fontSize: 12.5,
              }}
            >
              {tag("Food assistance")}
              {tag("Transport")}
              {tag("Mental health")}
            </div>
            <div style={{ height: 1, background: "#efede7" }} />
            <div style={{ display: "flex", gap: 22, fontSize: 12.5 }}>
              {stat("Referrals pending", "1")}
              {stat("Next follow-up", "Jul 24")}
              {stat("Open barriers", "0")}
            </div>
            <div style={{ fontSize: 12.5, color: C.green, fontWeight: 600 }}>
              Open case →
            </div>
          </div>

          {/* A-100 */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "20px 22px",
              boxShadow: C.shadow,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>
                A-100 · Travis Co.
              </span>
              <Pill color={C.muted} bg="#f0efe9" weight={600}>
                Intake started
              </Pill>
            </div>
            <div style={{ fontSize: 13.5, color: C.muted }}>
              68 M · post-stroke · Vietnamese · Medicare + Medicaid
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                fontSize: 12.5,
              }}
            >
              {tag("needs not yet confirmed", true)}
            </div>
            <div style={{ height: 1, background: "#efede7" }} />
            <div style={{ fontSize: 13, color: C.muted }}>
              Narrative captured — finish extracting needs to search resources.
            </div>
            <div style={{ fontSize: 12.5, color: C.green, fontWeight: 600 }}>
              Continue intake →
            </div>
          </div>
        </div>
      )}

      {tab === "followup" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "22px 24px",
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700 }}>
                A-102 · Travis Co.
              </span>
              <Pill color={C.amber} bg={C.amberSoft}>
                2 referrals awaiting response
              </Pill>
              <span
                onClick={() => onGo("plan")}
                style={{
                  marginLeft: "auto",
                  fontSize: 12.5,
                  color: C.green,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Open plan →
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  border: `1px solid ${C.line}`,
                  borderRadius: 11,
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  Transportation — ETA Transportation
                </div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                  Referral sent Jul 14 ·{" "}
                  <span style={{ color: C.amber, fontWeight: 600 }}>
                    follow up Jul 21
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <GreenButton style={{ padding: "5px 14px", fontSize: 12.5 }}>
                    Mark enrolled
                  </GreenButton>
                  <GhostButton style={{ padding: "5px 14px", fontSize: 12.5 }}>
                    Log a call
                  </GhostButton>
                </div>
              </div>
              <div
                style={{
                  border: `1.5px solid ${C.amberBorder}`,
                  background: C.amberBg,
                  borderRadius: 11,
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  Home safety assessment — Travis EMS
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: C.amber,
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  Unable to contact provider ×2
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>
                  Alternative resource available: Meals on Wheels home-safety
                  add-on.
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <span
                    onClick={() => onGo("resources")}
                    style={{
                      background: C.amber,
                      color: "#fff",
                      borderRadius: 8,
                      padding: "5px 14px",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    See alternative
                  </span>
                  <GhostButton style={{ padding: "5px 14px", fontSize: 12.5 }}>
                    Retry
                  </GhostButton>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                background: C.greenSoft,
                borderRadius: 11,
                padding: "13px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: C.green,
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                C
              </span>
              <span style={{ fontSize: 14 }}>
                Has the family heard back from the transportation provider?
              </span>
              <span style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                <span
                  style={{
                    background: C.green,
                    color: "#fff",
                    borderRadius: 999,
                    padding: "4px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Yes
                </span>
                <span
                  style={{
                    border: `1.5px solid ${C.green}`,
                    color: C.green,
                    borderRadius: 999,
                    padding: "4px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Not yet
                </span>
              </span>
            </div>
          </div>

          <div
            style={{
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: C.shadow,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                A-098 · Travis Co.
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
                Food assistance referral · sent Jul 9 · follow up overdue by 2
                days
              </div>
            </div>
            <Pill color={C.red} bg={C.redSoft}>
              Overdue
            </Pill>
            <GhostButton style={{ padding: "8px 16px", fontSize: 13 }}>
              Follow up now
            </GhostButton>
          </div>
        </div>
      )}

      {tab === "closed" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {[
            ["A-095 · Bexar Co.", "Dementia education + respite · enrolled", "resolved", "Jun 24"],
            ["A-091 · Hays Co.", "Transport + food · declined by family", "declined", "Jun 18"],
            ["A-088 · Travis Co.", "Legal aid + financial assistance · enrolled", "resolved", "Jun 12"],
          ].map(([t, d, state, date]) => (
            <div
              key={t}
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 11,
                padding: "15px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 14,
              }}
            >
              <span style={{ fontWeight: 700 }}>{t}</span>
              <span style={{ color: C.muted }}>{d}</span>
              {state === "resolved" ? (
                <Pill color={C.green} bg={C.greenSoft}>
                  Closed · resolved
                </Pill>
              ) : (
                <Pill color={C.muted} bg="#f0efe9" weight={600}>
                  Closed · declined
                </Pill>
              )}
              <span style={{ marginLeft: "auto", fontSize: 12.5, color: C.faint }}>
                {date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* 2 — Intake                                                          */
/* ================================================================== */
/* Intake plays itself: the CHW's notes type in, CoReLink reads them, the case
   file builds, then it asks the one question that changes eligibility — and
   the demo answers it. Phases gate what's on screen. */
type IntakePhase =
  | "intro"
  | "typing"
  | "sent"
  | "thinking"
  | "answering"
  | "asking"
  | "answered"
  | "done";

const CHW_NOTE =
  "An 85-year-old Spanish-speaking male in Travis County (ZIP 78744), " +
  "hospitalized after a fall. Moderate-stage Alzheimer's. Primary caregiver " +
  "is his 75-year-old wife, limited English. Discharge in two days. Medicare, " +
  "no Medicaid, limited income. Needs: transport home, affordable medications, " +
  "home safety, meal prep & personal care. Wife feels overwhelmed and isolated…";

const REPLY_LEAD =
  "Got it — I have most of what I need. Only two gaps actually change which programs he qualifies for:";
const REPLY_TOKENS = REPLY_LEAD.split(/(\s+)/);

/* Case-file rows appear in this order while CoReLink "reads". */
const FILE_KEYS = ["LOCATION", "LANGUAGE", "INSURANCE", "CAREGIVER"] as const;

function IntakeScreen({
  onGo,
  reduce,
  press,
}: {
  onGo: (s: Screen) => void;
  reduce: boolean;
  /** Walks the shared demo cursor to a `data-sim` control and clicks it. */
  press: (sim: string) => Promise<void>;
}) {
  const still = reduce;
  const [phase, setPhase] = useState<IntakePhase>(still ? "done" : "intro");
  const [typed, setTyped] = useState("");
  const [replyN, setReplyN] = useState(still ? REPLY_TOKENS.length : 0);
  const [fileN, setFileN] = useState(still ? FILE_KEYS.length : 0);
  const [needsN, setNeedsN] = useState(still ? 5 : 0);
  const [medicaid, setMedicaid] = useState<string | null>(still ? "No" : null);

  const feedRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef(press);
  useEffect(() => {
    pressRef.current = press;
  });

  /* Keep the newest line in view inside the fixed chat feed / input box. */
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
    if (typeRef.current) {
      typeRef.current.scrollTop = typeRef.current.scrollHeight;
    }
  }, [typed, replyN, phase]);

  useEffect(() => {
    if (still) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      await sleep(700);
      if (cancelled) return;

      /* 1 — the notes type themselves into the input */
      setPhase("typing");
      for (let i = 1; i <= CHW_NOTE.length; i += 2) {
        if (cancelled) return;
        setTyped(CHW_NOTE.slice(0, Math.min(i, CHW_NOTE.length)));
        await sleep(11);
      }
      setTyped(CHW_NOTE);
      await sleep(420);
      if (cancelled) return;

      /* 2 — sent: the note becomes a message, input clears */
      setPhase("sent");
      setTyped("");
      await sleep(560);
      if (cancelled) return;

      /* 3 — CoReLink reads; the case file builds a row at a time */
      setPhase("thinking");
      for (let i = 1; i <= FILE_KEYS.length; i++) {
        await sleep(360);
        if (cancelled) return;
        setFileN(i);
      }
      await sleep(420);
      if (cancelled) return;

      /* 4 — the reply streams in */
      setPhase("answering");
      for (let i = 1; i <= REPLY_TOKENS.length; i++) {
        if (cancelled) return;
        setReplyN(i);
        await sleep(34);
      }
      await sleep(280);
      if (cancelled) return;

      /* 5 — the questions land, needs fill in */
      setPhase("asking");
      for (let i = 1; i <= 5; i++) {
        await sleep(200);
        if (cancelled) return;
        setNeedsN(i);
      }
      await sleep(900);
      if (cancelled) return;

      /* 6 — the demo answers the gating question with the cursor… */
      await pressRef.current("intake-medicaid-no");
      if (cancelled) return;
      setPhase("answered");

      await sleep(1400);
      if (cancelled) return;
      setPhase("done");
      await sleep(700);
      if (cancelled) return;

      /* …then moves on the same way a visitor would. */
      await pressRef.current("intake-next");
    })();

    return () => {
      cancelled = true;
    };
  }, [still]);

  const noteSent = phase !== "intro" && phase !== "typing";
  const showReply =
    phase === "answering" ||
    phase === "asking" ||
    phase === "answered" ||
    phase === "done";
  const showQuestions =
    phase === "asking" || phase === "answered" || phase === "done";

  const fileRow = (k: string, v: ReactNode) => (
    <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
      <span
        style={{ width: 82, color: C.faint, fontSize: 12.5, paddingTop: 2 }}
      >
        {k}
      </span>
      <span>{v}</span>
    </div>
  );
  const need = (dot: string, text: string, extra?: ReactNode, urgent?: boolean) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: urgent ? C.redSoft : C.panelBg,
        borderRadius: 9,
        padding: "9px 13px",
      }}
    >
      <span
        style={{ width: 8, height: 8, borderRadius: "50%", background: dot }}
      />
      {text}
      {extra}
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* chat column — header and input are fixed; only the feed scrolls */}
      <div
        style={{
          flex: 1.15,
          display: "flex",
          flexDirection: "column",
          padding: "26px 34px 22px",
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div style={{ flexShrink: 0, marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Case intake</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>
            Paste notes, type, or dictate.{" "}
            <span style={{ color: C.green, fontWeight: 600 }}>
              Spanish input works too.
            </span>{" "}
            CoReLink extracts context as you go.
          </div>
        </div>

        {/* conversation feed */}
        <div
          ref={feedRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingRight: 4,
          }}
        >
          {/* CHW pasted notes */}
          {noteSent && (
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "80%",
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: "14px 14px 4px 14px",
            padding: "15px 19px",
            boxShadow: C.shadow,
            animation: "fadeUp .35s ease both",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: C.faint,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            MG · CHW — pasted notes
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.55, color: C.body }}>
            {CHW_NOTE}
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              color: C.amber,
              background: C.amberSoft,
              borderRadius: 6,
              padding: "4px 10px",
              display: "inline-block",
            }}
          >
            🛡 Masked before processing: [NAME] ×2 · [PHONE] ·{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
              review
            </span>
          </div>
        </div>
          )}

          {/* CoReLink reading the notes */}
          {phase === "thinking" && (
            <div
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.card,
                border: `1px solid ${C.greenBorder}`,
                borderRadius: "14px 14px 14px 4px",
                padding: "13px 19px",
                boxShadow: C.shadow,
                animation: "fadeUp .3s ease both",
              }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.faint,
                    animation: "blink 1.1s ease-in-out infinite",
                    animationDelay: `${d * 0.18}s`,
                  }}
                />
              ))}
              <span style={{ fontSize: 13.5, color: C.muted, marginLeft: 4 }}>
                Reading the notes…
              </span>
            </div>
          )}

          {/* CoReLink reply */}
          {showReply && (
        <div
          style={{
            alignSelf: "flex-start",
            maxWidth: "80%",
            background: C.card,
            border: `1px solid ${C.greenBorder}`,
            borderRadius: "14px 14px 14px 4px",
            padding: "15px 19px",
            boxShadow: C.shadow,
            animation: "fadeUp .35s ease both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                background: C.green,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              C
            </span>
            <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>
              CoReLink
            </span>
          </div>
          <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>
            {REPLY_TOKENS.slice(0, replyN).join("")}
            {phase === "answering" && (
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  marginLeft: 2,
                  transform: "translateY(2px)",
                  borderRadius: 2,
                  background: C.green,
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </div>
          {showQuestions && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              background: C.panelBg,
              borderRadius: 10,
              animation: "fadeUp .35s ease both",
            }}
          >
            <div
              style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}
            >
              ① Does he have{" "}
              <span style={{ borderBottom: `2px solid ${C.greenBorder}` }}>
                Medicaid
              </span>
              ?
              <span
                style={{ fontWeight: 400, fontSize: 12.5, color: C.muted }}
              >
                required for matching — changes MAP &amp; transport eligibility
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["Yes", "No", "Not sure"].map((t) => {
                const on = medicaid === t;
                return (
                  <span
                    key={t}
                    data-sim={`intake-medicaid-${t.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMedicaid(t)}
                    style={{
                      border: `1.5px solid ${on ? C.green : "#d6d2c8"}`,
                      background: on ? C.green : "transparent",
                      color: on ? "#fff" : C.muted,
                      borderRadius: 999,
                      padding: "5px 18px",
                      fontSize: 13.5,
                      fontWeight: on ? 700 : 400,
                      cursor: "pointer",
                      transition: "all .2s ease",
                    }}
                  >
                    {t}
                  </span>
                );
              })}
              {medicaid && (
                <span
                  style={{
                    fontSize: 12.5,
                    color: C.green,
                    fontWeight: 600,
                    animation: "fadeUp .3s ease both",
                  }}
                >
                  ✓ answered — matching updated
                </span>
              )}
            </div>
          </div>
          )}
          {showQuestions && (
          <div
            style={{
              marginTop: 8,
              padding: "12px 14px",
              background: C.panelBg,
              borderRadius: 10,
              color: C.muted,
              animation: "fadeUp .35s ease both",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: C.faint }}>
              ② Roughly what monthly budget for paid help, if any?{" "}
              <span style={{ fontWeight: 400, fontSize: 12 }}>
                helpful but optional
              </span>
            </div>
          </div>
          )}
        </div>
          )}
        </div>

        {/* input — pinned to the bottom of the column, never moves */}
        <div
          style={{
            marginTop: 16,
            flexShrink: 0,
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            background: C.card,
            border: `1.5px solid ${phase === "typing" ? C.greenBorder : "#d6d2c8"}`,
            borderRadius: 12,
            padding: "13px 17px",
            transition: "border-color .3s ease",
          }}
        >
          {phase === "typing" ? (
            <div
              ref={typeRef}
              style={{
                flex: 1,
                maxHeight: 66,
                overflowY: "auto",
                scrollbarWidth: "none",
                fontSize: 14.5,
                lineHeight: 1.5,
                color: C.ink,
              }}
            >
              {typed}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  marginLeft: 1,
                  transform: "translateY(2px)",
                  borderRadius: 2,
                  background: C.green,
                  animation: "blink 1s step-end infinite",
                }}
              />
            </div>
          ) : (
            <span style={{ flex: 1, fontSize: 14.5, color: C.faint }}>
              Answer, or add more context…
            </span>
          )}
          <span style={{ fontSize: 17, color: C.muted, cursor: "pointer" }}>
            🎙
          </span>
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: C.green,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              cursor: "pointer",
              opacity: phase === "typing" ? 1 : 0.45,
              transition: "opacity .3s ease",
              flexShrink: 0,
            }}
          >
            ↑
          </span>
        </div>
      </div>

      {/* case file sidebar */}
      <div
        style={{
          width: 426,
          background: C.card,
          borderLeft: `1px solid ${C.line}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            padding: "19px 24px 13px",
            borderBottom: `1px solid ${C.line2}`,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>Case file</span>
          <span style={{ fontSize: 12, color: C.faint, marginLeft: 10 }}>
            builds as you type
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12.5,
              color: C.green,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit all
          </span>
        </div>
        <div
          style={{
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {fileN === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.panelBg,
                borderRadius: 9,
                padding: "14px 13px",
                fontSize: 13.5,
                color: C.muted,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: C.faint,
                  animation: "blink 1.1s ease-in-out infinite",
                }}
              />
              Waiting for case notes…
            </div>
          )}
          {[
            fileRow("LOCATION", "Travis County · ZIP 78744"),
            fileRow("LANGUAGE", "Spanish — patient & caregiver"),
            fileRow(
              "INSURANCE",
              <span>
                Medicare ·{" "}
                {medicaid ? (
                  <span
                    style={{
                      color: C.green,
                      background: C.greenSoft,
                      borderRadius: 6,
                      padding: "1px 8px",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    Medicaid: {medicaid} ✓
                  </span>
                ) : (
                  <span
                    style={{
                      color: C.amber,
                      background: C.amberSoft,
                      borderRadius: 6,
                      padding: "1px 8px",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    Medicaid: asking ①
                  </span>
                )}
              </span>,
            ),
            fileRow("CAREGIVER", "Wife, 75 · limited English · weekends daughter"),
          ]
            .slice(0, fileN)
            .map((row, i) => (
              <div key={FILE_KEYS[i]} style={{ animation: "fadeUp .3s ease both" }}>
                {row}
              </div>
            ))}
          {needsN > 0 && (
            <>
          <div style={{ height: 1, background: C.line2, margin: "3px 0" }} />
          <div
            style={{
              fontSize: 12.5,
              color: C.faint,
              fontWeight: 600,
              letterSpacing: ".4px",
            }}
          >
            NEEDS DETECTED · {needsN}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              fontSize: 14,
            }}
          >
            {[
              need(
                C.red,
                "Transport: hospital → home",
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11.5,
                    color: C.red,
                    fontWeight: 700,
                    letterSpacing: ".3px",
                  }}
                >
                  URGENT · 2 DAYS
                </span>,
                true,
              ),
              need(C.green, "Affordable medications"),
              need(C.green, "Home safety modifications"),
              need(C.green, "Meal prep & personal care"),
              need(
                "#7a6a9c",
                "Caregiver support & respite",
                <span
                  style={{ marginLeft: "auto", fontSize: 11.5, color: C.faint }}
                >
                  caregiver
                </span>,
              ),
            ]
              .slice(0, needsN)
              .map((row, i) => (
                <div key={i} style={{ animation: "fadeUp .3s ease both" }}>
                  {row}
                </div>
              ))}
            {needsN === 5 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: C.faint,
                  fontSize: 13,
                  padding: "2px 13px",
                  cursor: "pointer",
                }}
              >
                ＋ add a need
              </div>
            )}
          </div>
            </>
          )}
        </div>
        <div
          style={{
            marginTop: "auto",
            flexShrink: 0,
            padding: "17px 24px",
            borderTop: `1px solid ${C.line2}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{ fontSize: 12.5, color: medicaid ? C.green : C.amber }}
          >
            {medicaid
              ? "1 optional gap left — budget. You can refine it any time."
              : "2 gaps remain — you can review the summary now and refine later."}
          </div>
          <GreenButton
            sim="intake-next"
            onClick={() => onGo("summary")}
            style={{ padding: "12px 0", textAlign: "center", fontSize: 15 }}
          >
            Review needs summary →
          </GreenButton>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 3 — Needs Summary                                                   */
/* ================================================================== */
function SummaryScreen({ onGo }: { onGo: (s: Screen) => void }) {
  const needRow = (
    n: string,
    numBg: string,
    title: string,
    meta?: ReactNode,
    tag?: ReactNode,
    owner?: string,
    ownerColor?: string,
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 11,
        padding: "9px 18px",
        fontSize: 15,
      }}
    >
      <span style={{ color: C.faint2, cursor: "grab" }}>⠿</span>
      <span
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          borderRadius: 7,
          background: numBg,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <span style={{ fontWeight: 600 }}>{title}</span>
      {tag}
      {meta}
      <span
        style={{
          marginLeft: "auto",
          fontSize: 12,
          color: ownerColor ?? C.faint,
          fontWeight: ownerColor ? 600 : 400,
        }}
      >
        {owner ?? "patient"}
      </span>
    </div>
  );

  const barrier = (dot: string, text: string) => (
    <span
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: "7px 15px",
        fontSize: 13.5,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot }} />
      {text}
    </span>
  );

  return (
    <div
      style={{
        padding: "20px 40px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
      }}
    >
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.3px" }}>
          Review what CoReLink understood
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
          Confirm or fix before matching — nothing is decided automatically.
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
      >
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: "12px 20px",
          }}
        >
          <div style={label}>LOCATION</div>
          <div style={{ fontSize: 16.5, fontWeight: 600, marginTop: 8 }}>
            Travis County · ZIP 78744{" "}
            <span
              style={{ fontSize: 13, color: C.faint, cursor: "pointer" }}
            >
              ✎
            </span>
          </div>
        </div>
        <div
          style={{
            background: C.amberBg,
            border: `1.5px solid ${C.amberBorder}`,
            borderRadius: 12,
            padding: "12px 20px",
          }}
        >
          <div style={{ ...label, color: C.amber }}>LANGUAGE — PLEASE CONFIRM</div>
          <div style={{ fontSize: 16.5, fontWeight: 600, marginTop: 8 }}>
            Spanish — patient &amp; caregiver
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <span
              style={{
                background: C.green,
                color: "#fff",
                borderRadius: 8,
                padding: "4px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Confirm
            </span>
            <span
              style={{
                border: `1.5px solid #d6d2c8`,
                color: C.muted,
                borderRadius: 8,
                padding: "4px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Fix
            </span>
          </div>
        </div>
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: "12px 20px",
          }}
        >
          <div style={label}>INSURANCE</div>
          <div style={{ fontSize: 16.5, fontWeight: 600, marginTop: 8 }}>
            Medicare · no Medicaid{" "}
            <span
              style={{ fontSize: 13, color: C.faint, cursor: "pointer" }}
            >
              ✎
            </span>
          </div>
        </div>
        <div
          style={{
            background: C.amberBg,
            border: `1.5px dashed ${C.amberBorder}`,
            borderRadius: 12,
            padding: "12px 20px",
          }}
        >
          <div style={{ ...label, color: C.amber }}>
            INCOME / BUDGET — UNKNOWN
          </div>
          <div style={{ fontSize: 14.5, color: C.muted, marginTop: 8 }}>
            Affects eligibility for Central Health MAP &amp; sliding-scale
            programs.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <span
              style={{
                border: `1.5px solid ${C.amber}`,
                color: C.amber,
                borderRadius: 8,
                padding: "4px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              ＋ Add info
            </span>
            <span
              style={{
                border: `1.5px solid #d6d2c8`,
                color: C.muted,
                borderRadius: 8,
                padding: "4px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Skip for now
            </span>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <span style={label}>PRIORITIZED NEEDS</span>
          <span style={{ fontSize: 12, color: C.faint2 }}>
            AI-suggested order · drag to reorder
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.red,
                letterSpacing: ".5px",
                marginBottom: 7,
              }}
            >
              IMMEDIATE
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {needRow(
                "1",
                C.ink,
                "Transportation: hospital → home",
                undefined,
                <Pill color={C.red} bg={C.redSoft}>
                  discharge in 2 days
                </Pill>,
              )}
              {needRow(
                "2",
                C.ink,
                "Home safety modifications",
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  fall risk in current home
                </span>,
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.muted,
                letterSpacing: ".5px",
                marginBottom: 7,
              }}
            >
              IMPORTANT
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {needRow("3", C.muted, "Affordable / discounted medications")}
              {needRow(
                "4",
                C.muted,
                "Caregiver support & respite",
                <span style={{ fontSize: 12.5, color: C.muted }}>
                  wife, 75 — overwhelmed, isolated
                </span>,
                undefined,
                "caregiver",
                C.purple,
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.faint,
                letterSpacing: ".5px",
                marginBottom: 7,
              }}
            >
              LONGER-TERM
            </div>
            {needRow("5", C.faint, "Meal prep & personal care")}
          </div>
        </div>
      </div>

      <div>
        <div style={{ ...label, marginBottom: 10 }}>BARRIERS TO WATCH</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {barrier(C.red, "No reliable vehicle")}
          {barrier(C.amber, "Spanish-language intake required")}
          {barrier(C.amber, "Caregiver only free weekends")}
          {barrier(C.amber, "Cost concerns · limited income")}
          <span
            style={{
              border: `1.5px dashed #d6d2c8`,
              color: C.faint,
              borderRadius: 10,
              padding: "9px 15px",
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            ＋ add barrier
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 18,
          marginTop: 4,
        }}
      >
        <GhostButton onClick={() => onGo("intake")}>← Back to intake</GhostButton>
        <GreenButton sim="summary-next" onClick={() => onGo("resources")} style={{ padding: "11px 26px", fontSize: 15 }}>
          Confirm &amp; find resources →
        </GreenButton>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 4 — Resources                                                       */
/* ================================================================== */
function ResourcesScreen({
  onSelect,
  onGo,
}: {
  onSelect: (name: string, desc: string) => void;
  onGo: (s: Screen) => void;
}) {
  const coverage = (
    state: "added" | "viewing" | "empty" | "warn",
    text: string,
    right: string,
  ) => {
    const styles: Record<string, CSSProperties> = {
      added: {
        background: C.card,
        border: `1px solid ${C.greenBorder}`,
        color: C.ink,
      },
      viewing: {
        background: C.greenSoft,
        border: `1.5px solid ${C.green}`,
        fontWeight: 700,
        color: C.green,
      },
      empty: {
        background: C.card,
        border: `1px solid ${C.line}`,
        color: C.muted,
      },
      warn: {
        background: C.amberBg,
        border: `1.5px dashed ${C.amberBorder}`,
        color: C.amber,
        fontWeight: 600,
      },
    };
    const icon =
      state === "added"
        ? "✓"
        : state === "viewing"
          ? "●"
          : state === "warn"
            ? "!"
            : "○";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderRadius: 9,
          padding: "8px 12px",
          ...styles[state],
        }}
      >
        <span style={{ color: state === "added" ? C.green : "inherit", fontWeight: 700 }}>
          {icon}
        </span>
        {text}
        <span
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color:
              state === "added"
                ? C.green
                : state === "empty"
                  ? C.faint
                  : "inherit",
            fontWeight: state === "added" ? 700 : 600,
          }}
        >
          {right}
        </span>
      </div>
    );
  };

  const selChip = (name: string, tag: string, tagColor: string, tagBg: string) => (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        background: C.panelBg,
        borderRadius: 9,
        padding: "9px 12px",
      }}
    >
      {name}{" "}
      <span
        style={{
          fontSize: 10.5,
          color: tagColor,
          background: tagBg,
          borderRadius: 5,
          padding: "1px 7px",
          fontWeight: 700,
        }}
      >
        {tag}
      </span>
      <span style={{ marginLeft: "auto", color: C.faint2, cursor: "pointer" }}>
        ✕
      </span>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 28px",
          background: C.card,
          borderBottom: `1px solid ${C.line}`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 14, color: C.muted }}>
          <b style={{ color: C.ink }}>16 matches</b> across 5 needs · searched
          Jun 30, 12:07
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: C.greenSoft,
              color: C.green,
              border: `1.5px solid ${C.greenBorder}`,
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Español available ✓
          </span>
          {["Free / low-cost", "≤ 10 mi", "Verified only"].map((f) => (
            <span
              key={f}
              style={{
                border: `1.5px solid #d6d2c8`,
                color: C.muted,
                borderRadius: 999,
                padding: "4px 14px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* left coverage sidebar */}
        <div
          style={{
            width: 240,
            background: C.navBg,
            borderRight: `1px solid ${C.line}`,
            padding: "20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ ...label, marginBottom: 8, letterSpacing: ".6px" }}>
              NEEDS COVERAGE
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 13.5,
              }}
            >
              {coverage("added", "Transport", "1 added")}
              {coverage("viewing", "Medications", "viewing")}
              {coverage("empty", "Home safety", "0")}
              {coverage("empty", "Personal care", "0")}
              {coverage("warn", "Respite", "0 picked")}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.muted,
              lineHeight: 1.55,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 10,
              padding: "12px 14px",
            }}
          >
            <b style={{ color: C.ink }}>Professional review</b>
            <br />
            You decide what fits — and how each family will connect. Nothing is
            added to the plan automatically.
          </div>
          <div
            style={{
              marginTop: "auto",
              fontSize: 12,
              color: C.faint,
              lineHeight: 1.5,
            }}
          >
            Filtered by: 78744 · Spanish · Medicare
          </div>
        </div>

        {/* main resource list */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            background: C.panelBg,
            overflow: "auto",
          }}
        >
          {/* Transportation */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 17, fontWeight: 700 }}>
                Transportation — hospital → home
              </span>
              <Pill color={C.red} bg={C.redSoft}>
                URGENT
              </Pill>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                gap: 14,
              }}
            >
              <ResourceCard
                name="ETA Transportation LLC"
                badge={{ text: "✓ Verified Jun 28", color: C.green, bg: C.greenSoft }}
                meta={
                  <>
                    Wheelchair &amp; ambulatory rides, Austin metro ·{" "}
                    <b style={{ color: C.ink }}>(737) 272-8472</b>
                  </>
                }
                why={{
                  bg: C.greenSoft,
                  color: C.greenDark,
                  label: "Why this matches",
                  text: "serves ZIP 78744 ✓ · accepts Medicare ✓ · Spanish phone line ✓ · free quote ✓",
                }}
                source="etatransportationtx.com"
                sim="resource-select"
                onSelect={() =>
                  onSelect(
                    "ETA Transportation LLC",
                    "Wheelchair & ambulatory rides, hospital → home",
                  )
                }
              />
              <ResourceCard
                variant="confirm"
                name="Suvida Healthcare"
                badge={{ text: "📞 Call to confirm", color: C.amber, bg: C.amberSoft }}
                meta={
                  <>
                    Spanish-first senior clinic, patient transport ·{" "}
                    <b style={{ color: C.ink }}>888-478-8432</b>
                  </>
                }
                why={{
                  bg: C.amberSoft,
                  color: "#6b5310",
                  label: "Verify first",
                  text: "“established patients only”: is he enrolled? Spanish-first care ✓ · serves area ✓",
                }}
                source="suvidahealthcare.com"
                onSelect={() =>
                  onSelect(
                    "Suvida Healthcare",
                    "Spanish-first senior clinic · backup patient transport",
                  )
                }
              />
            </div>
          </div>

          {/* Medications */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 17, fontWeight: 700 }}>
                Affordable medications
              </span>
              <span style={{ fontSize: 12.5, color: C.faint }}>3 matches</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
                gap: 14,
              }}
            >
              <ResourceCard
                name="Central Health MAP"
                badge={{ text: "✓ Verified Jun 28", color: C.green, bg: C.greenSoft }}
                meta={
                  <>
                    Medical Access Program, Travis County ·{" "}
                    <b style={{ color: C.ink }}>512-978-8130</b>
                  </>
                }
                why={{
                  bg: C.greenSoft,
                  color: C.greenDark,
                  label: "Why this matches",
                  text: (
                    <>
                      low-income Rx coverage ✓ · Travis Co. residents ✓ ·{" "}
                      <span style={{ color: C.amber, fontWeight: 700 }}>
                        eligibility needs income info — 1 gap ⚠
                      </span>
                    </>
                  ),
                }}
                source="centralhealth.net"
                onSelect={() =>
                  onSelect(
                    "Central Health MAP",
                    "Discounted medications program, Travis County",
                  )
                }
              />
              <UnreachableCard />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 11,
              padding: "12px 20px",
              fontSize: 14,
              color: C.muted,
              cursor: "pointer",
            }}
          >
            <span style={{ fontWeight: 600, color: C.ink }}>More needs:</span>{" "}
            Home safety (2) · Personal care (3) · Caregiver respite (2)
            <span
              style={{
                marginLeft: "auto",
                fontSize: 13,
                color: C.green,
                fontWeight: 600,
              }}
            >
              expand ▾
            </span>
          </div>
        </div>

        {/* right selected sidebar */}
        <div
          style={{
            width: 280,
            background: C.card,
            borderLeft: `1px solid ${C.line}`,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "18px 22px 12px",
              borderBottom: `1px solid ${C.line2}`,
            }}
          >
            <span style={{ fontSize: 14.5, fontWeight: 700 }}>
              Selected for plan
            </span>
            <span style={{ fontSize: 12.5, color: C.faint, marginLeft: 8 }}>
              4 items
            </span>
          </div>
          <div
            style={{
              padding: "14px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 13.5,
              flex: 1,
              overflow: "auto",
            }}
          >
            {selChip("ETA Transportation", "REFERRAL", "#fff", C.ink)}
            {selChip("Central Health MAP", "ASSIST", C.green, C.greenSoft)}
            {selChip("EMS home-safety visit", "SHARE", C.slate, C.slateSoft)}
            {selChip("AGE support group", "SHARE", C.slate, C.slateSoft)}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: C.amberBg,
                border: `1.5px dashed ${C.amberBorder}`,
                borderRadius: 9,
                padding: "9px 12px",
                color: C.amber,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ! No respite pick yet — wife is at risk
            </div>
          </div>
          <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.line2}` }}>
            <GreenButton
              onClick={() => onGo("plan")}
              style={{ padding: "12px 0", textAlign: "center", fontSize: 14.5, width: "100%" }}
            >
              Build coordination plan →
            </GreenButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  name,
  badge,
  meta,
  why,
  source,
  variant = "verified",
  onSelect,
  sim,
}: {
  name: string;
  badge: { text: string; color: string; bg: string };
  meta: ReactNode;
  why: { bg: string; color: string; label: string; text: ReactNode };
  source: string;
  variant?: "verified" | "confirm";
  onSelect: () => void;
  /** Marks this card's select button as an auto-demo cursor target. */
  sim?: string;
}) {
  const confirm = variant === "confirm";
  return (
    <div
      style={{
        flex: 1,
        background: confirm ? C.amberBg : C.card,
        border: `${confirm ? "1.5px" : "1px"} solid ${confirm ? C.amberBorder : C.line}`,
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: confirm ? undefined : C.shadow,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{name}</span>
        <span style={{ marginLeft: "auto" }}>
          <Pill color={badge.color} bg={badge.bg}>
            {badge.text}
          </Pill>
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: C.muted, marginTop: 3 }}>{meta}</div>
      <div
        style={{
          background: why.bg,
          borderRadius: 9,
          padding: "9px 13px",
          marginTop: 10,
          fontSize: 13,
          lineHeight: 1.6,
          color: why.color,
        }}
      >
        <b>{why.label}</b> — {why.text}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <span style={{ fontSize: 12, color: C.faint }}>source: {source}</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: C.muted,
              border: `1.5px solid #d6d2c8`,
              borderRadius: 8,
              padding: "5px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            View details
          </span>
          <span
            onClick={onSelect}
            data-sim={sim}
            style={{
              fontSize: 13,
              color: confirm ? C.amber : "#fff",
              background: confirm ? "transparent" : C.green,
              border: confirm ? `1.5px solid ${C.amber}` : "none",
              borderRadius: 8,
              padding: "5px 16px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Select resource
          </span>
        </span>
      </div>
    </div>
  );
}

function UnreachableCard() {
  return (
    <div
      style={{
        flex: 1,
        background: "#f3f2ee",
        border: "1px solid #e0ded6",
        borderRadius: 12,
        padding: "16px 20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#8a9089" }}>
          Families First Social Services
        </span>
        <span style={{ marginLeft: "auto" }}>
          <Pill color="#8a9089" bg="#e9e7e0">
            ⊘ Site unreachable
          </Pill>
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: C.faint, marginTop: 3 }}>
        Public-assistance help for Spanish speakers
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#8a9089",
          marginTop: 10,
          lineHeight: 1.6,
        }}
      >
        Last checked Jun 25 — details may be outdated. We&apos;ll retry
        automatically.
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 12,
        }}
      >
        <span
          style={{
            border: "1.5px solid #b8b4a8",
            color: C.muted,
            borderRadius: 8,
            padding: "6px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ↻ Retry now
        </span>
        <span
          style={{
            border: "1.5px solid #b8b4a8",
            color: C.muted,
            borderRadius: 8,
            padding: "6px 16px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Report outdated
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 5 — Coordination Plan                                               */
/* ================================================================== */
function PlanScreen({ onGo }: { onGo: (s: Screen) => void }) {
  const legend = (color: string, text: string) => (
    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      {text}
    </span>
  );

  const item = (p: {
    name: string;
    meta: string;
    method: { text: string; color: string; bg: string };
    status: { text: string; color: string; bg: string };
    followUp: string;
    notes: string;
  }) => (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 13,
        padding: "18px 22px",
        boxShadow: C.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{p.name}</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 2 }}>
            {p.meta} ·{" "}
            <span style={{ color: C.green, cursor: "pointer" }}>source card</span>
          </div>
        </div>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            borderRadius: 999,
            padding: "5px 14px",
            whiteSpace: "nowrap",
            background: p.method.bg,
            color: p.method.color,
          }}
        >
          {p.method.text}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 16,
          borderTop: `1px solid ${C.line2}`,
          paddingTop: 14,
        }}
      >
        <div>
          <div style={{ ...label, fontSize: 11, letterSpacing: ".4px" }}>
            STATUS
          </div>
          <div style={{ marginTop: 6 }}>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                borderRadius: 999,
                padding: "3px 12px",
                color: p.status.color,
                background: p.status.bg,
              }}
            >
              {p.status.text}
            </span>
          </div>
        </div>
        <div>
          <div style={{ ...label, fontSize: 11, letterSpacing: ".4px" }}>
            FOLLOW-UP
          </div>
          <div
            style={{
              fontSize: 14,
              marginTop: 7,
              fontWeight: p.followUp === "—" ? 400 : 600,
              color: p.followUp === "—" ? C.faint : C.ink,
            }}
          >
            {p.followUp}
          </div>
        </div>
      </div>
      <div
        style={{
          background: C.panelBg,
          borderRadius: 9,
          padding: "10px 14px",
          fontSize: 13.5,
          color: C.body,
          lineHeight: 1.5,
        }}
      >
        <span
          style={{ ...label, fontSize: 11, letterSpacing: ".4px" }}
        >
          NOTES
        </span>
        {p.notes}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <GhostButton style={{ padding: "5px 14px", fontSize: 13, borderRadius: 8 }}>
          Edit
        </GhostButton>
        <GhostButton style={{ padding: "5px 14px", fontSize: 13, borderRadius: 8 }}>
          Update status
        </GhostButton>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            color: C.red,
          }}
        >
          Remove
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: "28px 40px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flex: 1,
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.3px" }}>
            Care Coordination Plan
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>
            Track how selected resources will be shared, supported, or referred.
          </div>
        </div>
        <GreenButton
          sim="plan-share"
          onClick={() => onGo("share")}
          style={{ marginLeft: "auto", padding: "10px 20px", fontSize: 14 }}
        >
          Generate caregiver summary →
        </GreenButton>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 12.5,
          color: C.muted,
          flexWrap: "wrap",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span>
          <b style={{ color: C.ink, fontSize: 15 }}>5</b> plan items
        </span>
        <span style={{ width: 1, height: 14, background: "#d6d2c8" }} />
        {legend(C.ink, "1 send referral")}
        {legend(C.green, "2 assist with contact")}
        {legend("#7d88a6", "2 share with patient")}
      </div>

      {/* Only the plan list scrolls — the title and the primary action stay
          put, so the screen keeps a fixed shape however long the plan gets. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {item({
          name: "ETA Transportation",
          meta: "Wheelchair rides, hospital → home · (737) 272-8472",
          method: { text: "Send referral", color: "#fff", bg: C.ink },
          status: { text: "Waiting for response", color: C.amber, bg: C.amberSoft },
          followUp: "Jul 21, 2026",
          notes: "Referral submitted Jul 14 · Spanish-language phone line requested.",
        })}
        {item({
          name: "Central Health MAP",
          meta: "Discounted medications program · 512-978-8130",
          method: { text: "Assist with contact", color: C.green, bg: C.greenSoft },
          status: { text: "In progress", color: C.green, bg: C.greenSoft },
          followUp: "Jul 22, 2026",
          notes: "Helping caregiver gather proof of income before applying.",
        })}
        {item({
          name: "Austin–Travis County EMS",
          meta: "Free home-safety assessment after a fall",
          method: { text: "Share with patient", color: C.slate, bg: C.slateSoft },
          status: { text: "Not started", color: C.muted, bg: "#f0efe9" },
          followUp: "Jul 24, 2026",
          notes: "Sent contact info in Spanish; caregiver will call Friday.",
        })}
        {item({
          name: "AGE of Central Texas",
          meta: "Spanish caregiver support group · Thursdays 10 am",
          method: { text: "Share with patient", color: C.slate, bg: C.slateSoft },
          status: { text: "Completed", color: "#fff", bg: C.green },
          followUp: "—",
          notes: "Wife attended her first Thursday session — she is not alone.",
        })}
        {item({
          name: "Suvida Healthcare",
          meta: "Backup transport · Spanish-first senior clinic",
          method: { text: "Assist with contact", color: C.green, bg: C.greenSoft },
          status: { text: "Unable to connect", color: C.red, bg: C.redSoft },
          followUp: "Jul 25, 2026",
          notes: "Provider did not answer; try again next week.",
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 6 — Share & Export                                                  */
/* ================================================================== */
function ShareScreen({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const es = lang === "es";
  const langBtn = (active: boolean): CSSProperties => ({
    padding: "5px 16px",
    cursor: "pointer",
    fontWeight: 600,
    ...(active
      ? { background: C.ink, color: "#fff", borderRadius: 999 }
      : { color: C.muted }),
  });

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* left export options */}
      <div
        style={{
          width: 400,
          background: C.card,
          borderRight: `1px solid ${C.line}`,
          padding: "26px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Share &amp; export</div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 4 }}>
            The care team keeps the full plan. Families get a reviewed,
            plain-language version — internal status &amp; notes stay private.
          </div>
        </div>
        <div style={{ ...label, letterSpacing: ".5px" }}>FOR THE FAMILY</div>
        <div
          style={{
            border: `1.5px solid ${C.green}`,
            background: C.greenSoft,
            borderRadius: 11,
            padding: "14px 16px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
              color: C.greenDark,
            }}
          >
            🖨 Caregiver PDF{" "}
            <span
              style={{
                marginLeft: "auto",
                fontSize: 12,
                background: C.green,
                color: "#fff",
                borderRadius: 6,
                padding: "2px 9px",
              }}
            >
              preview →
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: "#4d6a5f", marginTop: 4 }}>
            Large type · plain words · EN / ES · one day per page
          </div>
        </div>
        {[
          ["✉ Email / text to family", "Secure link to the caregiver summary"],
        ].map(([t, d]) => (
          <div
            key={t}
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 11,
              padding: "14px 16px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{d}</div>
          </div>
        ))}

        <div style={{ ...label, letterSpacing: ".5px", marginTop: 6 }}>
          FOR THE RECORD
        </div>
        {[
          ["⬇ Excel — care team plan", "Full tracker: owners, status, follow-up, barriers"],
          ["📋 Copy case note", "Paste into your EHR / documentation"],
        ].map(([t, d]) => (
          <div
            key={t}
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 11,
              padding: "14px 16px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{d}</div>
          </div>
        ))}
        <div
          style={{
            marginTop: "auto",
            fontSize: 12,
            color: C.faint,
            lineHeight: 1.5,
          }}
        >
          Suggestions come from public sources. Verify details with each provider
          before enrolling.
        </div>
      </div>

      {/* right PDF preview */}
      <div
        style={{
          flex: 1,
          background: C.appBg,
          padding: "24px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ ...label, letterSpacing: ".5px" }}>
            CAREGIVER HANDOFF — LIVE PREVIEW
          </span>
          <span
            style={{
              marginLeft: "auto",
              display: "flex",
              background: C.card,
              border: `1.5px solid #d6d2c8`,
              borderRadius: 999,
              overflow: "hidden",
              fontSize: 13,
            }}
          >
            <span
              data-sim="share-en"
              onClick={() => setLang("en")}
              style={langBtn(!es)}
            >
              English
            </span>
            <span
              data-sim="share-es"
              onClick={() => setLang("es")}
              style={langBtn(es)}
            >
              Español
            </span>
          </span>
        </div>

        <div
          style={{
            background: C.card,
            border: "1px solid #d9d5ca",
            borderRadius: 6,
            boxShadow: "0 3px 12px rgba(20,30,25,.12)",
            padding: "28px 34px",
            maxWidth: 620,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {es ? <PdfEs /> : <PdfEn />}
        </div>
        <div style={{ fontSize: 12, color: C.faint, textAlign: "center" }}>
          Large type · plain words · one day per page · print-ready
        </div>
      </div>
    </div>
  );
}

function pdfCard(opts: {
  eyebrow?: ReactNode;
  title: ReactNode;
  titleSerif?: boolean;
  badge: { text: string; color: string; bg: string };
  chip: { text: string; color: string; bg: string };
  sub?: ReactNode;
  purple?: boolean;
}) {
  return (
    <div
      style={{
        border: `1px solid ${opts.purple ? C.purpleBorder : C.line}`,
        background: opts.purple ? C.purpleBg : undefined,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        {opts.eyebrow ? (
          <span style={{ fontSize: 14, color: C.muted }}>{opts.eyebrow}</span>
        ) : (
          <span
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: opts.purple ? C.purple : C.ink,
            }}
          >
            {opts.title}
          </span>
        )}
        <span style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              background: opts.badge.bg,
              color: opts.badge.color,
              borderRadius: 999,
              padding: "2px 9px",
              whiteSpace: "nowrap",
            }}
          >
            {opts.badge.text}
          </span>
        </span>
      </div>
      {opts.eyebrow && (
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 18,
            fontWeight: 600,
            marginTop: 2,
          }}
        >
          {opts.title}
        </div>
      )}
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          background: opts.chip.bg,
          color: opts.chip.color,
          borderRadius: 7,
          padding: "5px 10px",
          marginTop: 9,
          display: "inline-block",
        }}
      >
        {opts.chip.text}
      </div>
      {opts.sub && (
        <div
          style={{
            fontSize: 12.5,
            color: C.muted,
            marginTop: 7,
            lineHeight: 1.5,
          }}
        >
          {opts.sub}
        </div>
      )}
    </div>
  );
}

function PdfEs() {
  return (
    <>
      <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: C.greenDark }}>
        Plan de cuidado — esta semana
      </div>
      <div style={{ fontSize: 12.5, color: C.faint, margin: "4px 0 14px" }}>
        Para la familia de [NOMBRE] · preparado por María G., su CHW · 16 de
        julio 2026
      </div>
      <div style={{ fontSize: 13, color: C.body, margin: "-4px 0 12px", lineHeight: 1.5 }}>
        Los <b>5 servicios</b> que corresponden a su caso — y quién se encarga de
        cada uno.
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        <Pill color={C.green} bg={C.greenSoft}>Su CHW le ayuda</Pill>
        <Pill color={C.slate} bg={C.slateSoft}>Usted contacta</Pill>
        <Pill color={C.green} bg={C.greenSoft}>✓ Verificado</Pill>
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: C.green,
          letterSpacing: ".5px",
          marginBottom: 9,
        }}
      >
        SU CHW SE ENCARGA POR USTED · 3
      </div>
      {pdfCard({
        eyebrow: "Transporte del hospital a casa",
        title: "ETA Transportation · (737) 272-8472",
        badge: { text: "✓ Verificado", color: C.green, bg: C.greenSoft },
        chip: {
          text: "Su CHW está enviando la referencia — usted no necesita llamar.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
      })}
      {pdfCard({
        title: "Medicinas más baratas — programa MAP",
        badge: { text: "✓ Verificado", color: C.green, bg: C.greenSoft },
        chip: {
          text: "Su CHW le ayudará con la solicitud.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
        sub: "Prepare: comprobante de ingresos, tarjeta de Medicare.",
      })}
      {pdfCard({
        title: "Transporte de respaldo — Suvida Healthcare",
        badge: { text: "Por confirmar", color: C.amber, bg: C.amberSoft },
        chip: {
          text: "Su CHW llamará para confirmar la elegibilidad — usted no necesita hacer nada.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
        sub: "Clínica en español para personas mayores · 888-478-8432",
      })}
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: C.slate,
          letterSpacing: ".5px",
          margin: "16px 0 9px",
        }}
      >
        USTED PUEDE CONTACTAR DIRECTAMENTE · 2
      </div>
      {pdfCard({
        title: "Visita de seguridad en casa — gratis",
        badge: { text: "✓ Verificado", color: C.green, bg: C.greenSoft },
        chip: {
          text: "Llame usted para agendar la visita.",
          color: C.slate,
          bg: C.slateSoft,
        },
        sub: "EMS de Austin–Travis · EMSFallPrevention@austintexas.gov",
      })}
      {pdfCard({
        purple: true,
        title: "Para usted, señora — grupo de apoyo en español",
        badge: { text: "Recomendado", color: C.purple, bg: C.purpleSoft },
        chip: { text: "Puede unirse directamente.", color: C.slate, bg: C.slateSoft },
        sub: "AGE of Central Texas · jueves 10 am · No está sola.",
      })}
      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: `1px solid ${C.line2}`,
          fontSize: 11.5,
          color: C.faint,
          lineHeight: 1.5,
        }}
      >
        Verifique la información con cada proveedor. Preparado con CoReLink — las
        sugerencias provienen de fuentes públicas.
      </div>
    </>
  );
}

function PdfEn() {
  return (
    <>
      <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: C.greenDark }}>
        Care plan — this week
      </div>
      <div style={{ fontSize: 12.5, color: C.faint, margin: "4px 0 14px" }}>
        For the family of [NAME] · prepared by María G., your CHW · July 16, 2026
      </div>
      <div style={{ fontSize: 13, color: C.body, margin: "-4px 0 12px", lineHeight: 1.5 }}>
        All <b>5 matched services</b> for your case — and who handles each one.
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 18 }}>
        <Pill color={C.green} bg={C.greenSoft}>CHW helps you</Pill>
        <Pill color={C.slate} bg={C.slateSoft}>You contact</Pill>
        <Pill color={C.green} bg={C.greenSoft}>✓ Verified</Pill>
      </div>
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: C.green,
          letterSpacing: ".5px",
          marginBottom: 9,
        }}
      >
        YOUR CHW IS HANDLING THESE FOR YOU · 3
      </div>
      {pdfCard({
        eyebrow: "Ride from hospital to home",
        title: "ETA Transportation · (737) 272-8472",
        badge: { text: "✓ Verified", color: C.green, bg: C.greenSoft },
        chip: {
          text: "Your CHW is submitting the referral — you don't need to call.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
      })}
      {pdfCard({
        title: "Cheaper medications — MAP program",
        badge: { text: "✓ Verified", color: C.green, bg: C.greenSoft },
        chip: {
          text: "Your CHW will help you apply.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
        sub: "Bring: proof of income, Medicare card.",
      })}
      {pdfCard({
        title: "Backup transport — Suvida Healthcare",
        badge: { text: "Call to confirm", color: C.amber, bg: C.amberSoft },
        chip: {
          text: "Your CHW will call to confirm eligibility — nothing for you to do.",
          color: C.greenDark,
          bg: C.greenSoft,
        },
        sub: "Spanish-first senior clinic · 888-478-8432",
      })}
      <div
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          color: C.slate,
          letterSpacing: ".5px",
          margin: "16px 0 9px",
        }}
      >
        YOU CAN CONTACT THESE DIRECTLY · 2
      </div>
      {pdfCard({
        title: "Free home-safety visit",
        badge: { text: "✓ Verified", color: C.green, bg: C.greenSoft },
        chip: { text: "You call to schedule the visit.", color: C.slate, bg: C.slateSoft },
        sub: "Austin–Travis County EMS · EMSFallPrevention@austintexas.gov",
      })}
      {pdfCard({
        purple: true,
        title: "For you — Spanish-language support group",
        badge: { text: "Recommended", color: C.purple, bg: C.purpleSoft },
        chip: { text: "You can join directly.", color: C.slate, bg: C.slateSoft },
        sub: "AGE of Central Texas · Thursdays 10 am · You are not alone.",
      })}
      <div
        style={{
          marginTop: 18,
          paddingTop: 12,
          borderTop: `1px solid ${C.line2}`,
          fontSize: 11.5,
          color: C.faint,
          lineHeight: 1.5,
        }}
      >
        Please verify details with each provider. Prepared with CoReLink —
        suggestions come from public sources.
      </div>
    </>
  );
}

/* ================================================================== */
/* Connection-method modal                                             */
/* ================================================================== */
function ConnectionModal({
  modal,
  method,
  setMethod,
  onCancel,
  onConfirm,
}: {
  modal: { name: string; desc: string };
  method: ConnMethod;
  setMethod: (m: ConnMethod) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const opt = (
    key: ConnMethod,
    title: string,
    desc: string,
  ) => {
    const sel = method === key;
    return (
      <div
        onClick={() => setMethod(key)}
        data-sim={`method-${key}`}
        style={{
          border: `1.5px solid ${sel ? C.green : "#d6d2c8"}`,
          background: sel ? C.greenSoft : undefined,
          borderRadius: 11,
          padding: "13px 16px",
          cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{desc}</div>
      </div>
    );
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(20,30,25,.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 60,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          maxWidth: "100%",
          background: C.card,
          borderRadius: 16,
          boxShadow: "0 24px 70px rgba(20,30,25,.32)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90%",
        }}
      >
        <div style={{ padding: "22px 26px 16px", borderBottom: `1px solid ${C.line2}` }}>
          <div style={{ ...label, letterSpacing: ".5px" }}>
            ADD TO CARE COORDINATION PLAN
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 6 }}>
            {modal.name}
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 2 }}>
            {modal.desc}
          </div>
        </div>
        <div
          style={{
            padding: "20px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "auto",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            How will this patient or caregiver connect?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {opt(
              "share",
              "Share with patient",
              "Give the resource info to the patient or caregiver to follow up on their own.",
            )}
            {opt(
              "assist",
              "Assist with contact",
              "Help them call, check eligibility, prepare documents, or apply together.",
            )}
            {opt(
              "refer",
              "Send referral",
              "Submit a referral directly to the provider on the family's behalf.",
            )}
          </div>
          <div>
            <div style={{ ...label, letterSpacing: ".4px", marginBottom: 6 }}>
              FOLLOW-UP DATE
            </div>
            <div
              style={{
                border: `1.5px solid #d6d2c8`,
                borderRadius: 9,
                padding: "9px 12px",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              Jul 24, 2026 <span style={{ marginLeft: "auto", color: C.faint }}>📅</span>
            </div>
          </div>
          <div>
            <div style={{ ...label, letterSpacing: ".4px", marginBottom: 6 }}>
              NOTES
            </div>
            <div
              style={{
                border: `1.5px solid #d6d2c8`,
                borderRadius: 9,
                padding: "10px 12px",
                fontSize: 13.5,
                color: C.faint,
                minHeight: 58,
                lineHeight: 1.5,
              }}
            >
              e.g. Spanish-language intake requested; caregiver will call Friday…
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "16px 26px",
            borderTop: `1px solid ${C.line2}`,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <GhostButton onClick={onCancel} style={{ padding: "10px 20px" }}>
            Cancel
          </GhostButton>
          <GreenButton
            sim="modal-confirm"
            onClick={onConfirm}
            style={{ marginLeft: "auto", padding: "11px 24px" }}
          >
            Add to plan →
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
