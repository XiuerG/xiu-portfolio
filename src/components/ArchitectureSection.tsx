import type { ReactNode } from "react";

import type { ArchIcon, CaseBlock } from "@/lib/projects";

/* ------------------------------------------------------------------ */
/* "How it works" system-architecture blocks                          */
/*                                                                    */
/* A case study's system section reads header → diagram → comparison  */
/* → decisions. All four blocks share one breakout width so their     */
/* left edges line up into a single column, wider than the prose      */
/* measure but still calm: light borders, soft raised fills, no heavy */
/* shadows or gradients.                                              */
/* ------------------------------------------------------------------ */

const BREAKOUT =
  "relative left-1/2 w-[min(calc(100vw-3rem),80rem)] -translate-x-1/2";

/** Narrow the CaseBlock union down to one `kind`. */
type ArchBlock<K extends CaseBlock["kind"]> = Extract<CaseBlock, { kind: K }>;

/* Section opener — title + intro on the left, a small framing card on
   the right. The card stays quiet: it frames the section, it doesn't
   compete with the diagram below it. */
export function ArchIntro({
  block,
  accent,
}: {
  block: ArchBlock<"archIntro">;
  accent: string;
}) {
  return (
    <div className={BREAKOUT}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-start md:gap-14">
        <div>
          <h3 className="font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-4xl">
            {block.title}
          </h3>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-bone/90">
            {block.body}
          </p>
        </div>

        <aside
          className="rounded-2xl border border-line bg-raised/40 p-6"
          style={{ borderLeft: `2px solid ${accent}` }}
        >
          <h4
            className="font-mono text-[0.65rem] uppercase tracking-[0.2em]"
            style={{ color: accent }}
          >
            {block.callout.title}
          </h4>
          <ul className="mt-4 space-y-3">
            {block.callout.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[0.9rem] leading-relaxed text-mist"
              >
                <span
                  className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full"
                  style={{ background: accent }}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* The pipeline diagram. Six numbered nodes read left to right on wide
   screens (one row, joined by a hairline track), reflow to 3 and 2
   columns on smaller screens, and stack into a vertical thread on
   phones. */
export function ArchFlow({
  block,
  accent,
}: {
  block: ArchBlock<"archFlow">;
  accent: string;
}) {
  const last = block.steps.length - 1;

  return (
    <div className={`${BREAKOUT} py-2`}>
      <ol className="grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {block.steps.map((step, i) => (
          <li key={step.title} className="flex h-full flex-col">
            {/* Vertical thread between stacked cards (phones only). */}
            {i > 0 && (
              <span
                className="mb-1 ml-[0.875rem] block h-5 w-px bg-line sm:hidden"
                aria-hidden
              />
            )}

            {/* Node: number chip, plus the track that joins it to the
                next node when all six sit on one row. */}
            <div className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] tabular-nums"
                style={{
                  borderColor: `${accent}66`,
                  color: accent,
                  background: `${accent}12`,
                }}
              >
                {i + 1}
              </span>
              {i < last && (
                <span
                  className="-mr-3 hidden h-px flex-1 bg-line xl:block"
                  aria-hidden
                />
              )}
            </div>

            <div className="mt-3 flex flex-1 flex-col rounded-xl border border-line bg-raised/40 p-4">
              <h4 className="font-display text-[0.95rem] font-semibold leading-snug">
                {step.title}
              </h4>
              <p className="mt-2 flex-1 text-[0.8rem] leading-[1.65] text-mist">
                {step.body}
              </p>
              <div className="mt-4 flex items-start gap-2 border-t border-line pt-3">
                <StepIcon name={step.icon} accent={accent} />
                <span className="font-mono text-[0.65rem] leading-[1.45] text-mist">
                  {step.label}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* Three quiet cards for the decisions behind the pipeline. */
export function ArchCards({
  block,
  accent,
}: {
  block: ArchBlock<"archCards">;
  accent: string;
}) {
  return (
    <div className={BREAKOUT}>
      <div className="grid gap-5 md:grid-cols-3">
        {block.items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-line bg-raised/40 p-6 md:p-7"
          >
            <span
              className="block h-px w-7"
              style={{ background: accent }}
              aria-hidden
            />
            <h4 className="mt-5 font-display text-[1.05rem] font-semibold leading-snug">
              {item.title}
            </h4>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-mist">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Hairline step glyphs — a reading aid for the small label row, sized
   to sit beside 10px type without pulling attention. */
function StepIcon({ name, accent }: { name?: ArchIcon; accent: string }) {
  if (!name) return null;
  const paths: Record<ArchIcon, ReactNode> = {
    narrative: <path d="M2 4.2h10v6H7l-3 2.4V10.2H2z" />,
    extract: (
      <>
        <path d="M1.6 2.8h10.8L8.3 7.4v4.2L5.7 10V7.4z" />
      </>
    ),
    plan: (
      <>
        <path d="M2.6 2.4v8.6" />
        <path d="M2.6 4.6h4a2 2 0 0 1 2 2v5" />
        <path d="M2.6 4.6h8.8" />
      </>
    ),
    search: (
      <>
        <circle cx="6.2" cy="6.2" r="3.9" />
        <path d="M9.1 9.1 12 12" />
      </>
    ),
    match: (
      <>
        <path d="M5.6 8.4 3.9 10a2.4 2.4 0 0 1-3.4-3.4l1.7-1.7" />
        <path d="M8.4 5.6 10.1 4a2.4 2.4 0 0 1 3.4 3.4l-1.7 1.7" />
        <path d="M5.2 8.8 8.8 5.2" />
      </>
    ),
    output: (
      <>
        <path d="M2.4 2.6h9.2v9.8H2.4z" />
        <path d="M4.8 7.4l1.8 1.8 3-3.4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 14 14"
      className="mt-[0.15rem] h-3 w-3 shrink-0"
      fill="none"
      stroke={accent}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
