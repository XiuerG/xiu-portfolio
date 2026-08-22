"use client";

import { useEffect, useState } from "react";

/* Temporary direction comparison. Delete once one is chosen. */

const DIRECTIONS = [
  { id: "none", name: "Grain only", note: "Current" },
  { id: "press", name: "A · Printed page", note: "Margin rules · crop marks · margin numerals" },
  { id: "bands", name: "B · Editorial bands", note: "Alternating grounds · full-bleed statement" },
  { id: "depth", name: "C · Ambient depth", note: "Colour washes · scroll spine" },
] as const;

export default function BgLab() {
  const [active, setActive] = useState<string>("press");

  useEffect(() => {
    const b = document.body;
    DIRECTIONS.forEach((d) => b.classList.remove(`dir-${d.id}`));
    b.classList.add(`dir-${active}`);
    return () => DIRECTIONS.forEach((d) => b.classList.remove(`dir-${d.id}`));
  }, [active]);

  useEffect(() => {
    const onScroll = () => {
      const p =
        window.scrollY /
        Math.max(1, document.body.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty("--spine", `${p * 100}%`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* Decorations that only paint under the matching direction */}
      <div className="lab-crop" aria-hidden />
      <div className="lab-spine" aria-hidden>
        <span />
      </div>

      <div className="px-6 pb-32 pt-32 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">
            Direction lab · temporary
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {DIRECTIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`rounded-full border px-5 py-2.5 font-display text-sm font-semibold transition-colors duration-200 ${
                  active === d.id
                    ? "border-accent text-accent"
                    : "border-line text-mist hover:border-mist"
                }`}
              >
                {d.name}
                <span className="ml-2 font-mono text-[0.58rem] font-normal uppercase tracking-[0.1em] opacity-70">
                  {d.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Sample n="01" label="Context" tone="a">
        <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
          Care doesn&rsquo;t end at discharge — it moves home.
        </h2>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-mist">
          When a patient leaves the hospital, a community health worker helps the
          family find transportation, meals, home safety, and caregiver relief.
          The information exists; the time to find and verify it does not.
        </p>
      </Sample>

      <Sample n="02" label="Findings" tone="b">
        <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-[2.6rem]">
          What we found
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["Evaluation", "Design", "Deployment"].map((t) => (
            <div key={t} className="rounded-2xl border border-line bg-raised/40 p-7">
              <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist">
                {t}
              </h3>
              <p className="mt-4 font-display text-[1.05rem] font-semibold leading-snug">
                A card sitting on the treated ground.
              </p>
            </div>
          ))}
        </div>
      </Sample>

      <div className="lab-statement">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] opacity-70">
            Statement
          </p>
          <p className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl">
            Fluent does not necessarily mean equitable.
          </p>
        </div>
      </div>

      <Sample n="03" label="Reflection" tone="a">
        <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-[2.6rem]">
          Context matters as much as the recommendation.
        </h2>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-mist">
          A resource is only useful when it fits the person&rsquo;s real
          constraints. Language, insurance, urgency, and missing information all
          shape whether a recommendation can actually become care.
        </p>
        <div className="h-[40vh]" />
      </Sample>
    </>
  );
}

function Sample({
  n,
  label,
  tone,
  children,
}: {
  n: string;
  label: string;
  tone: "a" | "b";
  children: React.ReactNode;
}) {
  return (
    <section className={`lab-section lab-tone-${tone}`}>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <span className="lab-index" aria-hidden>
          {n}
        </span>
        <p className="mb-6 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">
          {label}
        </p>
        {children}
      </div>
    </section>
  );
}

const CSS = `
.lab-section { position: relative; border-top: 1px solid var(--color-line); padding: 5rem 0; }
.lab-index {
  display: none;
  position: absolute;
  left: -2.5rem; top: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--color-mist);
  opacity: 0.55;
}
.lab-statement { padding: 6rem 0; }
.lab-crop, .lab-spine { display: none; }

/* ---------- A · Printed page ---------- */
body.dir-press .lab-index { display: block; }
body.dir-press::before {
  content: "";
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image:
    linear-gradient(var(--color-line), var(--color-line)),
    linear-gradient(var(--color-line), var(--color-line));
  background-size: 1px 100%, 1px 100%;
  background-position: max(2.5rem, calc(50% - 620px)) 0, min(calc(100% - 2.5rem), calc(50% + 620px)) 0;
  background-repeat: no-repeat;
  opacity: 0.75;
}
body.dir-press .lab-crop {
  display: block;
  position: fixed; inset: 1.4rem; z-index: 40; pointer-events: none;
}
body.dir-press .lab-crop::before,
body.dir-press .lab-crop::after {
  content: ""; position: absolute; width: 14px; height: 14px;
  border: 1px solid var(--color-mist); opacity: 0.4;
}
body.dir-press .lab-crop::before { top: 0; left: 0; border-right: 0; border-bottom: 0; }
body.dir-press .lab-crop::after { bottom: 0; right: 0; border-left: 0; border-top: 0; }
body.dir-press .lab-statement {
  border-block: 1px solid var(--color-line);
}

/* ---------- B · Editorial bands ---------- */
body.dir-bands .lab-tone-b { background: color-mix(in srgb, var(--color-raised) 70%, transparent); }
body.dir-bands .lab-section { border-top: 0; }
body.dir-bands .lab-statement {
  background: var(--color-study);
  color: #fff;
  padding-block: 7rem;
}
.light body.dir-bands .lab-statement { color: #fff; }

/* ---------- C · Ambient depth ---------- */
body.dir-depth::before {
  content: "";
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image:
    radial-gradient(58% 42% at 6% 2%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 66%),
    radial-gradient(52% 38% at 96% 62%, color-mix(in srgb, var(--color-study) 16%, transparent), transparent 66%);
}
body.dir-depth .lab-spine {
  display: block;
  position: fixed; left: 1.6rem; top: 22vh; bottom: 22vh; width: 2px; z-index: 40;
  background: color-mix(in srgb, var(--color-mist) 22%, transparent);
  pointer-events: none;
}
body.dir-depth .lab-spine span {
  position: absolute; left: 0; top: 0; width: 100%;
  height: var(--spine, 0%);
  background: var(--color-accent);
}
body.dir-depth .lab-statement { border-block: 1px solid var(--color-line); }
`;
