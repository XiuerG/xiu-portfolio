"use client";

import Link from "next/link";
import { projects } from "@/lib/projects";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Selected Work — full-bleed project banners (reference: sophiemchen.com).
 * Each project is a saturated, accent-lit color band: bold title + one-line
 * story on the left, floating product imagery on the right. CoReLink layers
 * two screenshots with offset float phases; other projects float their cover.
 * Routing to each case study (/work/[slug]) is unchanged.
 */
export function WorkIndex() {
  return (
    <section id="work">
      {projects.map((p, i) => (
        <article
          key={p.slug}
          className="relative overflow-hidden border-t border-line"
          style={{
            background: `radial-gradient(110% 130% at ${
              i % 2 ? "88%" : "12%"
            } 0%, ${p.accent}59 0%, ${p.accent}1f 48%, transparent 78%), var(--color-raised)`,
          }}
        >
          <div className="mx-auto grid min-h-[72vh] max-w-[1200px] items-center gap-12 px-6 py-24 md:grid-cols-[0.82fr_1.18fr] md:gap-14 md:px-10">
            <Reveal>
              <div>
                <p className="m-0 font-display text-xs font-semibold uppercase tracking-[0.16em] text-mist">
                  {p.domain} · {p.year}
                </p>
                <h3 className="mt-4 font-display text-[clamp(34px,4.6vw,64px)] font-bold leading-[1.02] tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mt-5 max-w-[46ch] text-[16.5px] leading-[1.65] text-mist">
                  {p.summary}
                </p>
                <Link
                  href={`/work/${p.slug}`}
                  className="mt-9 inline-block rounded-full bg-bone px-7 py-3 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.05]"
                >
                  View Case Study
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              {p.slug === "corelink" ? (
                /* One clear focal point, one supporting peek — not two
                   competing screenshots. The matched-resources card (richest,
                   most legible content) leads, full size and crisp, in
                   front; the intake conversation trails behind as a smaller
                   hint of where the flow starts, only its corner tucked
                   under the hero card. */
                <div className="relative mx-auto aspect-[7/5] w-full max-w-[620px]">
                  {/* The whole intake screen — nav, conversation and the case
                      file building on the right — reads as the real product. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/corelink/banner-back.png"
                    alt="CoReLink case intake — the CHW's notes, CoReLink's follow-up question, and the case file building alongside"
                    className="float-a absolute left-0 top-0 z-[1] w-[84%] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                  />
                  {/* A tall detail card in front — the verified matches. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/corelink/banner-front.png"
                    alt="CoReLink verified resource matches, ready to add to the plan"
                    className="float-b absolute bottom-0 right-0 z-[2] w-[46%] rounded-xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
                  />
                </div>
              ) : p.cover.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.cover.src}
                  alt={p.cover.alt}
                  className="float-a w-full rounded-xl border border-white/10 shadow-[0_36px_90px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div
                  role="img"
                  aria-label={p.cover.alt}
                  className="float-a flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-white/10 p-6 text-center font-display text-xs font-semibold uppercase tracking-[0.14em] text-bone/70"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent}52, ${p.accent}1a)`,
                  }}
                >
                  {p.cover.alt}
                </div>
              )}
            </Reveal>
          </div>
        </article>
      ))}
    </section>
  );
}
