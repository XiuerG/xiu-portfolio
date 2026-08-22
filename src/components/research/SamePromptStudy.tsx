import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { getAssetPath } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* "Same Prompt, Different Care?" — research highlight                */
/*                                                                    */
/* An editorial companion to the paper, not a substitute for it: the  */
/* question, the shape of the audit, the framework, two quantitative  */
/* findings and one qualitative one. It borrows the portfolio's own   */
/* tokens (bone / mist / line / raised, Poppins display, Geist Mono   */
/* eyebrows) and runs a little wider and quieter than the product     */
/* case studies.                                                      */
/* ------------------------------------------------------------------ */

/** Theme-aware research green (see --color-study in globals.css): a mid-green
 *  reads at only ~3.7:1 on the light ground and ~5.1:1 on the dark one, so the
 *  token carries a different lightness per theme. */
const ACCENT = "var(--color-study)";

/** A translucent wash of the accent — needed because the token is a variable,
 *  so `${ACCENT}1a` hex-alpha concatenation no longer works. */
const wash = (percent: number) =>
  `color-mix(in srgb, var(--color-study) ${percent}%, transparent)`;

const PUBLICATION_URL = "https://doi.org/10.1086/743397";
const POSTER_URL = "/research/care-llm-poster.pdf";

const SHELL = "mx-auto w-full max-w-6xl px-6 md:px-10";

/* ---- 02 Method -------------------------------------------------- */

type Stage = {
  title: string;
  metric: string;
  metricNote?: string;
  body: string;
  /** Two labelled mini-lists, e.g. the models and the languages. */
  lists?: { label: string; items: string[] }[];
  /** Flat evidence list (rater procedure, analysis steps). */
  items?: string[];
  /** The dataset the stage produces — sized up, but after the method. */
  emphasis?: { value: string; label: string };
  /** Small closing note under a hairline. */
  note?: string;
};

const STAGES: Stage[] = [
  {
    title: "Standardized Clinical Prompts",
    metric: "16 prompts",
    metricNote: "9 PHQ-9 + 7 GAD-7",
    body:
      "Validated screening items were rewritten as first-person mental health disclosures to approximate natural chatbot use.",
    note: "Standardized across English · Spanish · Chinese",
  },
  {
    title: "Models × Languages",
    metric: "3 LLMs × 3 languages",
    body:
      "Equivalent disclosure prompts were aligned across languages to support controlled cross-linguistic comparison.",
    lists: [
      { label: "Models", items: ["GPT-4o", "Claude Sonnet-4", "Gemini 2.5 Flash"] },
      { label: "Languages", items: ["English", "Spanish", "Chinese"] },
    ],
  },
  {
    title: "Independent Sampling",
    metric: "20 independent generations",
    metricNote: "per condition",
    body:
      "Queries were submitted through stateless APIs so each generation was independent and unaffected by prior responses.",
    emphasis: { value: "2,880", label: "total model responses" },
  },
  {
    title: "Human Evaluation",
    metric: "Bicultural human raters",
    body:
      "Every response was scored by two raters matched to its language against CARE-LLM, an eight-dimensional rubric we developed for this study.",
    items: [
      "Two language-matched raters per response",
      "Double coding",
      "200-response calibration phase",
      "Consensus resolution",
      "Third adjudicator when needed",
    ],
    note: "ICC — English 0.65 · Chinese 0.72 · Spanish 0.67",
  },
  {
    title: "Mixed-Methods Analysis",
    metric: "Two analytic strands",
    body:
      "Quantitative and qualitative strands were run separately and integrated at interpretation.",
    lists: [
      {
        label: "Quantitative",
        items: [
          "Descriptive statistics",
          "One-way ANOVA",
          "Linear mixed-effects models",
          "Cross-language consistency analysis",
        ],
      },
      {
        label: "Qualitative",
        items: [
          "Bilingual coding",
          "Reflexive thematic analysis",
          "Iterative theme development",
          "Consensus interpretation",
        ],
      },
    ],
  },
];

const METHOD_CARDS: { title: string; items: string[] }[] = [
  {
    title: "Controlled Generation",
    items: [
      "Standardized prompts",
      "Cross-language alignment",
      "Stateless API calls",
      "Repeated independent sampling",
    ],
  },
  {
    title: "Human Evaluation",
    items: [
      "Bicultural raters",
      "Double coding",
      "Calibration + adjudication",
      "Inter-rater reliability",
    ],
  },
  {
    title: "Mixed-Methods Analysis",
    items: [
      "ANOVA",
      "Mixed-effects models",
      "Consistency analysis",
      "Thematic analysis",
    ],
  },
];

/* ---- 04 Findings ------------------------------------------------ */

const MODELS = ["Claude Sonnet-4", "Gemini 2.5 Flash", "GPT-4o"];
const MODELS_SHORT = ["Claude", "Gemini", "GPT-4o"];

/** Mean CARE-LLM scores by model, pooled across languages (1–5). */
const HEATMAP: { dimension: string; scores: number[] }[] = [
  { dimension: "Safety & Triage", scores: [2.64, 2.55, 2.06] },
  { dimension: "Actionability", scores: [3.0, 3.49, 2.83] },
  { dimension: "Localization", scores: [2.41, 2.62, 1.64] },
  { dimension: "Empathy", scores: [4.02, 3.7, 2.94] },
  { dimension: "Cultural Fit", scores: [3.39, 3.48, 3.14] },
  { dimension: "Readability", scores: [4.63, 4.27, 4.47] },
  { dimension: "Safety Integrity", scores: [4.01, 3.99, 3.67] },
];

const CONSISTENCY = [
  { model: "Gemini 2.5 Flash", value: 51.6 },
  { model: "GPT-4o", value: 44.1 },
  { model: "Claude Sonnet-4", value: 36.3 },
];

const VOICES = [
  {
    language: "English",
    register: "Direct · professional · actionable",
    traits: [
      "more direct emotional validation",
      "sequenced guidance",
      "more explicit professional pathways",
    ],
  },
  {
    language: "Chinese",
    register: "Relational · gentle · collective",
    traits: [
      "interpersonal reassurance",
      "softer transitions",
      "stronger relational framing",
    ],
  },
  {
    language: "Spanish",
    register: "Warm · conversational · semi-clinical",
    traits: [
      "conversational identification",
      "narrative guidance",
      "warmer explanatory framing",
    ],
  },
];

const IMPLICATIONS = [
  { label: "Evaluation", body: "English-only benchmarking is insufficient." },
  {
    label: "Design",
    body:
      "Linguistic fluency should not be treated as evidence of equitable care.",
  },
  {
    label: "Deployment",
    body:
      "Multilingual health AI should be evaluated in the languages and contexts in which people actually use it.",
  },
];

/* ------------------------------------------------------------------ */

export function SamePromptStudy() {
  return (
    <article>
      <ScrollProgress />
      <Hero />
      <Method />
      <Findings />
      <Takeaway />

      <div className={`${SHELL} pb-24`}>
        <Link
          href="/#research"
          className="font-display text-sm font-semibold text-mist transition-colors duration-200 hover:text-bone"
        >
          ← Back to research
        </Link>
      </div>
    </article>
  );
}

/* ---- 01 Hero ---------------------------------------------------- */

function Hero() {
  return (
    <header className="px-6 pb-4 pt-40 md:px-10 md:pt-48">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <ul className="flex flex-wrap items-center gap-2">
                <Chip>Research</Chip>
                <Chip>AI Evaluation</Chip>
                <li
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]"
                  style={{ color: ACCENT, background: wash(14) }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: ACCENT }}
                    aria-hidden
                  />
                  Just accepted
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-7 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl">
                Same Prompt, Different Care?
              </h1>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-5 max-w-2xl font-display text-xl font-medium leading-snug text-bone/80 md:text-2xl">
                Evaluating Inequities in AI-Generated Mental Health Support for
                Immigrant Communities
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-mist">
                We conducted a multilingual audit of three leading large language
                models to examine whether equivalent mental health disclosures
                receive equivalent standards of support across English, Spanish,
                and Chinese. The study combines structured human evaluation,
                quantitative analysis, and qualitative thematic analysis to
                examine safety, cultural responsiveness, and linguistic equity.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
                <Fact label="Published in">
                  Journal of the Society for Social Work and Research · 2026
                </Fact>
                <Fact label="DOI">
                  <a
                    href={PUBLICATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-mist"
                  >
                    10.1086/743397
                  </a>
                </Fact>
                <Fact label="Authors">
                  Cheng Chow†, Xiuer Gu† — † equal contribution
                </Fact>
                <Fact label="Affiliation">
                  School of Social Work · School of Information, UT Austin
                </Fact>
              </dl>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href={PUBLICATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.04]"
                >
                  View publication ↗
                </a>
              </div>
            </Reveal>
          </div>

          {/* Research question + poster, stacked under the metadata on mobile */}
          <div className="lg:pt-2">
            <Reveal delay={0.12}>
              <aside
                className="rounded-2xl border border-line bg-raised/40 p-7"
                style={{ borderLeft: `2px solid ${ACCENT}` }}
              >
                <h2
                  className="font-mono text-[0.65rem] uppercase tracking-[0.2em]"
                  style={{ color: ACCENT }}
                >
                  Research question
                </h2>
                <p className="mt-4 font-display text-xl font-semibold leading-snug">
                  Does the same mental health disclosure receive the same
                  standard of AI support when expressed in a different language?
                </p>
              </aside>
            </Reveal>

            <Reveal delay={0.18}>
              <a
                href={getAssetPath(POSTER_URL)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors duration-200 hover:border-mist"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/research/care-llm-poster-thumb.webp")}
                  alt="CARE-LLM conference poster — background, methods, framework, and key findings"
                  className="w-16 shrink-0 rounded border border-line"
                />
                <span>
                  <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-mist">
                    Supplementary
                  </span>
                  <span className="mt-1 block font-display text-sm font-semibold">
                    Conference poster
                    <span
                      aria-hidden
                      className="ml-1.5 inline-block transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </header>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-line px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-mist">
      {children}
    </li>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-mist">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-bone/90">{children}</dd>
    </div>
  );
}

/* ---- Shared section chrome -------------------------------------- */

function Section({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className={SHELL}>
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
            <span className="h-px w-6 bg-line" aria-hidden />
            <span style={{ color: ACCENT }}>{eyebrow}</span>
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight md:text-[2.6rem]">
            {title}
          </h2>
          {lead && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-mist">
              {lead}
            </p>
          )}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/* ---- 02 Method -------------------------------------------------- */

function Method() {
  const last = STAGES.length - 1;
  return (
    <Section
      eyebrow="Method"
      title="How we audited multilingual AI support"
      lead="A controlled mixed-method study combining standardized multilingual prompting, repeated independent generations, bicultural human evaluation, and statistical and qualitative analysis."
    >
      <Reveal>
        <ol className="grid gap-x-3 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STAGES.map((stage, i) => (
            <li key={stage.title} className="flex flex-col">
              {i > 0 && (
                <span
                  className="mb-1 ml-[0.875rem] block h-5 w-px bg-line sm:hidden"
                  aria-hidden
                />
              )}
              <div className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] tabular-nums"
                  style={{
                    borderColor: wash(45),
                    color: ACCENT,
                    background: wash(10),
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
                <h3 className="font-display text-[0.95rem] font-semibold leading-snug xl:min-h-[2.65rem]">
                  {stage.title}
                </h3>

                <div className="mt-3 xl:min-h-[3.6rem]">
                  <p
                    className="font-display text-[0.95rem] font-bold leading-tight"
                    style={{ color: ACCENT }}
                  >
                    {stage.metric}
                  </p>
                  {stage.metricNote && (
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-mist">
                      {stage.metricNote}
                    </p>
                  )}
                </div>

                <p className="mt-3 text-[0.8rem] leading-[1.65] text-mist xl:min-h-[5.3rem]">
                  {stage.body}
                </p>

                {stage.lists && (
                  <div className="mt-4 space-y-3">
                    {stage.lists.map((list) => (
                      <div key={list.label}>
                        <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-mist">
                          {list.label}
                        </p>
                        <ul className="mt-1.5 space-y-1">
                          {list.items.map((item) => (
                            <li
                              key={item}
                              className="text-[0.78rem] leading-snug text-bone/85"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {stage.items && (
                  <ul className="mt-4 space-y-1.5">
                    {stage.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[0.78rem] leading-snug text-bone/85"
                      >
                        <span
                          className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full"
                          style={{ background: ACCENT }}
                          aria-hidden
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {(stage.emphasis || stage.note) && (
                  <div className="mt-4 flex-1" aria-hidden />
                )}

                {stage.emphasis && (
                  <div className="border-t border-line pt-3">
                    <p className="font-display text-2xl font-bold leading-none tracking-tight tabular-nums">
                      {stage.emphasis.value}
                    </p>
                    <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-mist">
                      {stage.emphasis.label}
                    </p>
                  </div>
                )}

                {stage.note && (
                  <p className="border-t border-line pt-3 font-mono text-[0.62rem] leading-[1.5] text-mist">
                    {stage.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {METHOD_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-line bg-raised/25 p-6"
            >
              <h3 className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-mist">
                {card.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.85rem] leading-relaxed text-bone/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ---- 04 Findings ------------------------------------------------ */

/** 1–5 → a restrained single-hue tint. The ceiling stays low enough that
 *  full-strength body text clears 4.5:1 on the tint in either theme. */
function tint(score: number) {
  const t = Math.min(1, Math.max(0, (score - 1) / 4));
  return wash(Math.round((0.05 + t * 0.37) * 100));
}

function Findings() {
  return (
    <Section eyebrow="Findings" title="What we found">
      {/* Finding 01 — model strengths */}
      <Reveal>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-14">
          <div>
            <FindingLabel index="Finding 01" />
            <h3 className="mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
              Different models showed different strengths.
            </h3>
            <table className="mt-8 w-full table-fixed border-collapse">
              <caption className="sr-only">
                Mean CARE-LLM scores by model, pooled across languages, on a 1–5
                scale
              </caption>
              <thead>
                <tr>
                  <th className="w-[38%] pb-3 text-left font-mono text-[0.58rem] uppercase tracking-[0.14em] font-normal text-mist">
                    Dimension
                  </th>
                  {MODELS_SHORT.map((m) => (
                    <th
                      key={m}
                      className="pb-3 text-center font-mono text-[0.58rem] uppercase tracking-[0.14em] font-normal text-mist"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HEATMAP.map((row) => (
                  <tr key={row.dimension}>
                    <th
                      scope="row"
                      className="py-1 pr-3 text-left text-[0.8rem] font-normal leading-snug text-bone/90"
                    >
                      {row.dimension}
                    </th>
                    {row.scores.map((score, i) => (
                      <td key={MODELS[i]} className="p-[2px]">
                        <div
                          className="rounded-md py-2.5 text-center text-[0.8rem] tabular-nums"
                          style={{ background: tint(score) }}
                        >
                          {score.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Scale legend */}
            <div className="mt-5 flex items-center gap-3">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-mist">
                1 — weaker alignment
              </span>
              <span
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${tint(1)}, ${tint(5)})`,
                }}
                aria-hidden
              />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-mist">
                5 — stronger
              </span>
            </div>
            <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-mist">
              Mean CARE-LLM scores pooled across languages. Models evaluated:{" "}
              {MODELS.join(" · ")}.
            </p>
          </div>

          <div className="xl:pt-16">
            <p className="text-lg leading-relaxed text-bone/90">
              Claude performed strongest in empathy, readability, and safety
              integrity, while Gemini led in actionability and resource
              localization. No single model dominated across every dimension.
            </p>
            <p className="mt-5 font-mono text-[0.62rem] leading-relaxed text-mist">
              Results describe the specific model versions evaluated in this
              study, not fixed properties of the systems or their developers.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Finding 02 — cross-language consistency */}
      <Reveal>
        <div className="mt-20 grid gap-10 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-14">
          <div>
            <FindingLabel index="Finding 02" />
            <h3 className="mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
              Equivalent prompts did not always produce equivalent care.
            </h3>

            <p className="mt-8 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-mist">
              Cross-language equivalent care
            </p>
            <ul className="mt-5 space-y-5">
              {CONSISTENCY.map((row) => (
                <li key={row.model}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[0.9rem] text-bone/90">
                      {row.model}
                    </span>
                    <span className="font-display text-[1.05rem] font-bold tabular-nums">
                      {row.value}%
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.value}%`,
                        background: ACCENT,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between font-mono text-[0.58rem] text-mist">
              <span>0%</span>
              <span>100%</span>
            </p>
            <p className="mt-4 font-mono text-[0.6rem] leading-relaxed text-mist">
              Higher indicates a greater proportion of responses judged to
              provide equivalent standards of care across languages.
            </p>
          </div>

          <div className="xl:pt-16">
            <p className="text-lg leading-relaxed text-bone/90">
              Cross-language consistency differed significantly by model,
              suggesting that the language used to express the same underlying
              mental health concern can shape the standard of support a user
              receives.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Qualitative insight */}
      <Reveal>
        <div className="mt-20 border-t border-line pt-12">
          <FindingLabel index="Qualitative" />
          <h3 className="mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
            Same structure, different voices.
          </h3>

          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {VOICES.map((voice) => (
              <div key={voice.language} className="border-t border-line pt-5">
                <h4 className="font-display text-lg font-semibold">
                  {voice.language}
                </h4>
                <p
                  className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.08em]"
                  style={{ color: ACCENT }}
                >
                  {voice.register}
                </p>
                <ul className="mt-5 space-y-2">
                  {voice.traits.map((trait) => (
                    <li
                      key={trait}
                      className="text-[0.88rem] leading-relaxed text-mist"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-4xl border-l-2 pl-6 font-display text-xl font-semibold leading-snug md:text-2xl"
            style={{ borderColor: ACCENT }}
          >
            Cultural adaptation in tone did not necessarily translate into
            equally specific pathways to professional support.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

function FindingLabel({ index }: { index: string }) {
  return (
    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mist">
      {index}
    </p>
  );
}

/* ---- 05 Takeaway ------------------------------------------------ */

function Takeaway() {
  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className={SHELL}>
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em]">
            <span className="h-px w-6 bg-line" aria-hidden />
            <span style={{ color: ACCENT }}>Why it matters</span>
          </p>
          <h2 className="mt-7 max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl">
            Fluent does not necessarily mean equitable.
          </h2>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-mist">
            Across models, responses were often readable and supportive, yet
            meaningful disparities remained in cultural fit, resource
            localization, professional guidance, and cross-language consistency.
          </p>
        </Reveal>

        <Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {IMPLICATIONS.map((item) => (
              <div key={item.label} className="border-t border-line pt-5">
                <h3
                  className="font-mono text-[0.62rem] uppercase tracking-[0.18em]"
                  style={{ color: ACCENT }}
                >
                  {item.label}
                </h3>
                <p className="mt-4 font-display text-[1.05rem] font-semibold leading-snug">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
