import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProject,
  getNextProject,
  projects,
  type Project,
  type CaseBlock,
  type CaseFigure,
} from "@/lib/projects";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { getAssetPath } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Xiuer Gu`,
    description: project.summary,
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(slug);

  return (
    <article>
      <ScrollProgress />

      {/* Header */}
      <header className="px-6 pb-12 pt-40 md:px-10 md:pt-48">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist">
              {project.year} · {project.role} · {project.domain}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg text-mist">{project.summary}</p>
          </Reveal>

          {/* Key facts (rich case studies only) */}
          {project.caseStudy && (
            <Reveal delay={0.15}>
              <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8 md:grid-cols-3">
                {project.caseStudy.meta.map((m) => (
                  <div key={m.label}>
                    <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">
                      {m.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </header>

      {/* Cover / hero */}
      <Reveal className="px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Figure
            figure={project.caseStudy?.hero ?? project.cover}
            accent={project.accent}
          />
        </div>
      </Reveal>

      {project.caseStudy?.heroNote && (
        <Reveal className="px-6 md:px-10">
          <p className="mx-auto mt-16 max-w-3xl text-center font-display text-2xl font-semibold leading-snug md:text-3xl">
            {project.caseStudy.heroNote}
          </p>
        </Reveal>
      )}

      {/* Body */}
      {project.caseStudy ? (
        <RichBody project={project} />
      ) : (
        <ShortBody project={project} />
      )}

      {/* Closing CTA — "where do we go from here?" */}
      <div className="border-t border-line px-6 py-24 text-center md:px-10">
        <p className="font-display text-3xl font-bold md:text-5xl">
          Thanks for reading!
        </p>
        <p className="mt-4 text-lg text-mist">Where do we go from here?</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.05]"
          >
            Work With Me
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
    </article>
  );
}

/* ---------------------------------------------------------------- */
/* Long-form case study                                             */
/* ---------------------------------------------------------------- */

function RichBody({ project }: { project: Project }) {
  const { caseStudy, accent } = project;
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:px-0">
      {caseStudy!.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-line py-16 first:border-t-0 first:pt-0"
        >
          <Reveal>
            <h2 className="mb-10 text-center font-mono text-xs uppercase tracking-[0.24em] text-mist">
              {section.label}
            </h2>
          </Reveal>
          <div className="space-y-10">
            {section.blocks.map((block, i) => (
              <Reveal key={i}>
                <Block block={block} accent={accent} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Block({ block, accent }: { block: CaseBlock; accent: string }) {
  switch (block.kind) {
    case "prose":
      return (
        <div>
          {block.lead && (
            <p className="text-center font-display text-3xl font-bold leading-tight tracking-[-0.01em] md:text-4xl">
              {block.lead}
            </p>
          )}
          {block.body && (
            <div className={`space-y-5 ${block.lead ? "mt-6" : ""}`}>
              {block.body.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-bone/90">
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      );

    case "callout":
      return (
        <blockquote
          className="border-l-2 py-1 pl-6"
          style={{ borderColor: accent }}
        >
          <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
            {block.text}
          </p>
        </blockquote>
      );

    case "cards":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {block.items.map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-2xl border border-line bg-raised/60 px-7 pb-9 pt-8 text-center"
              style={{
                backgroundImage: `radial-gradient(85% 70% at 50% 115%, ${accent}38, transparent 72%)`,
              }}
            >
              <h3 className="font-display text-lg font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-mist">
                {item.description}
              </p>
              {/* Bright gradient bottom edge — the reference's glow-card cue. */}
              <span
                className="absolute inset-x-0 bottom-0 h-[3px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      );

    case "flow":
      return (
        <ol className="space-y-0">
          {block.steps.map((step, i) => (
            <li key={step} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs tabular-nums"
                  style={{ borderColor: accent, color: accent }}
                >
                  {i + 1}
                </span>
                {i < block.steps.length - 1 && (
                  <span className="w-px flex-1 bg-line" aria-hidden />
                )}
              </div>
              <p className="pb-8 pt-1 text-lg leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      );

    case "figure":
      return <Figure figure={block.figure} accent={accent} />;

    case "sub":
      return (
        <div className="pt-4">
          <h3 className="font-display text-xl font-semibold leading-snug md:text-2xl">
            {block.title}
          </h3>
          <div className="mt-4 space-y-5">
            {block.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-bone/90">
                {p}
              </p>
            ))}
          </div>
          {block.figure && (
            <div className="mt-8">
              <Figure figure={block.figure} accent={accent} />
            </div>
          )}
        </div>
      );

    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-relaxed">
              {block.checked ? (
                <span className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden>
                  ✓
                </span>
              ) : (
                <span
                  className="mt-3.5 h-px w-6 shrink-0"
                  style={{ background: accent }}
                  aria-hidden
                />
              )}
              {item}
            </li>
          ))}
        </ul>
      );

    case "showcase":
      return (
        <div className="relative left-1/2 w-[min(calc(100vw-3rem),76rem)] -translate-x-1/2 py-6">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            {block.step && (
              <span
                className="font-mono text-sm tabular-nums"
                style={{ color: accent }}
              >
                {block.step}
              </span>
            )}
            <h3 className="font-display text-2xl font-semibold leading-snug md:text-3xl">
              {block.title}
            </h3>
          </div>
          {block.description && (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-mist">
              {block.description}
            </p>
          )}
          {block.tags && (
            <div className="mt-5 flex flex-wrap gap-2">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-mist"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Figure figure={block.figure} accent={accent} />
          </div>
        </div>
      );

    case "demo":
      return <InteractiveDemo />;

    case "feature":
      return (
        <div className="relative left-1/2 w-[min(calc(100vw-3rem),80rem)] -translate-x-1/2 py-6">
          <div
            className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 ${
              block.flip ? "md:[&>figure]:order-first" : ""
            }`}
          >
            <div>
              {block.eyebrow && (
                <p
                  className="font-mono text-xs uppercase tracking-[0.18em]"
                  style={{ color: accent }}
                >
                  {block.eyebrow}
                </p>
              )}
              <h3 className="mt-3 font-display text-2xl font-semibold leading-snug md:text-3xl">
                {block.title}
              </h3>
              <div className="mt-4 space-y-4">
                {block.body.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-mist">
                    {p}
                  </p>
                ))}
              </div>
              {block.points && (
                <ul className="mt-6 space-y-3">
                  {block.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-[15px] leading-relaxed">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: accent }}
                        aria-hidden
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Figure figure={block.figure} accent={accent} />
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="rounded-2xl border border-line bg-raised/40 p-6 md:p-8">
          {block.title && (
            <h3 className="font-display text-xl font-semibold leading-snug">
              {block.title}
            </h3>
          )}
          {block.caption && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
              {block.caption}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-5">
            {block.figures.map((fig, i) => (
              <div key={i} className="w-[180px] max-w-[42vw] shrink-0">
                <Figure figure={fig} accent={accent} />
              </div>
            ))}
          </div>
        </div>
      );

    case "columns":
      return (
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {block.groups.map((group) => (
            <div key={group.title}>
              <h3 className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-mist">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
  }
}

/** Image slot. Renders the real image when `src` is set; otherwise a labeled
 *  placeholder block — drop images in /public and set `src` in projects.ts. */
function Figure({ figure, accent }: { figure: CaseFigure; accent: string }) {
  return (
    <figure>
      {figure.src && figure.frame === "macbook" ? (
        <MacbookFrame src={getAssetPath(figure.src)} alt={figure.alt} />
      ) : figure.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getAssetPath(figure.src)}
          alt={figure.alt}
          className="w-full rounded-lg border border-line"
        />
      ) : (
        <div
          role="img"
          aria-label={figure.alt}
          className="flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-line"
          style={{
            background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
          }}
        >
          <span className="px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-mist">
            {figure.alt}
          </span>
        </div>
      )}
      {figure.caption && (
        <figcaption className="mt-3 font-mono text-xs text-mist">
          {figure.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* A screenshot presented inside a MacBook mockup (pure CSS, crisp). */
function MacbookFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-4xl [perspective:1600px]">
      {/* Lid — bezel + screen */}
      <div
        className="relative mx-auto rounded-t-[18px] rounded-b-[6px] p-[9px] sm:p-[13px]"
        style={{
          background: "linear-gradient(160deg, #33302b, #211e1a)",
          boxShadow:
            "0 26px 60px rgba(23,20,15,0.30), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* camera */}
        <span
          className="absolute left-1/2 top-[4px] z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full sm:top-[6px]"
          style={{ background: "#57534d", boxShadow: "0 0 0 1px rgba(0,0,0,0.4)" }}
        />
        <div className="overflow-hidden rounded-[7px] bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getAssetPath(src)} alt={alt} className="block w-full" />
        </div>
      </div>

      {/* Base — hinge deck + rounded bottom lip. Wider than the lid, but
          capped at the viewport so narrow screens don't pan sideways. */}
      <div
        className="relative"
        style={{
          width: "min(116%, calc(100vw - 10px))",
          marginLeft: "calc((100% - min(116%, calc(100vw - 10px))) / 2)",
        }}
      >
        <div
          className="h-3 rounded-b-[12px] sm:h-[18px]"
          style={{
            background: "linear-gradient(#e2ddd3, #b9b3a8 62%, #a29c90)",
            boxShadow: "0 16px 26px rgba(23,20,15,0.20)",
          }}
        />
        {/* hinge notch */}
        <div
          className="absolute left-1/2 top-0 h-2 w-[15%] -translate-x-1/2 rounded-b-[9px] sm:h-2.5"
          style={{ background: "linear-gradient(#b3aca1, #948d82)" }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Short template (projects without a long-form case study)         */
/* ---------------------------------------------------------------- */

function ShortBody({ project }: { project: Project }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 md:px-0">
      <Section label="Overview">
        <p className="text-lg leading-relaxed">{project.overview}</p>
      </Section>

      <Section label="Problem">
        <p className="text-lg leading-relaxed">{project.problem}</p>
      </Section>

      <Section label="Approach">
        <StaggerGroup className="space-y-4">
          {project.approach.map((point, i) => (
            <StaggerItem key={i}>
              <p className="flex gap-4 text-lg leading-relaxed">
                <span
                  className="mt-3 h-px w-6 shrink-0"
                  style={{ background: project.accent }}
                  aria-hidden
                />
                {point}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      <Section label="Outcome">
        <StaggerGroup className="space-y-4">
          {project.outcome.map((point, i) => (
            <StaggerItem key={i}>
              <p className="text-lg leading-relaxed">{point}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-12 first:border-t-0">
      <Reveal>
        <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-mist">
          {label}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}
