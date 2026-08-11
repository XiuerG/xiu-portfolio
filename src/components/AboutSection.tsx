import { Reveal } from "@/components/motion/Reveal";
import { getAssetPath } from "@/lib/utils";

const tagline =
  "My research investigates how human needs, professional practices, and social values can inform the design of responsible AI-enabled interactive systems.";

const background = [
  {
    degree: "M.S. in Information Studies",
    org: "The University of Texas at Austin",
  },
  {
    degree: "B.F.A. in Art & Technology",
    org: "The Ohio State University",
  },
];

const detail = [
  "With a growing focus on digital health, I work across mental health, dementia caregiving, and accessibility. My approach combines qualitative HCI research, interaction design, and front-end development to create systems that are empathetic, inclusive, and grounded in real-world contexts.",
];

/**
 * About section — redesigned according to "方案 02" mockup.
 * Top: "ABOUT" eyebrow, "About" heading, orange accent line, and circular avatar in top-right.
 * Content: Left column has primary research statement + secondary bio narrative.
 * Right column has hairline divider, orange "EDUCATION" label, and background list.
 * Includes subtle warm ambient glow in bottom-right background.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 border-t border-line px-6 py-24 md:px-10 md:py-28 overflow-hidden"
    >
      {/* Soft warm ambient glow in bottom-right corner */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1200px] relative z-10">
        {/* Header Row: Title & Accent line on left, Circular Avatar on right */}
        <div className="flex items-start justify-between">
          <Reveal>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                ABOUT
              </p>
              <h2 className="mt-2 font-display text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-bone">
                About
              </h2>
              <div className="mt-3 h-[2px] w-8 bg-accent rounded-full" />
            </div>
          </Reveal>

          {/* Top Right Circular Avatar */}
          <Reveal delay={0.05}>
            <div className="relative group/avatar select-none">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border border-line bg-raised/20 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-accent/40 hover:scale-105 hover:shadow-[0_8px_24px_rgba(224,118,77,0.12)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getAssetPath("/avatar.jpg")}
                  alt="Xiuer Gu"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Main Content Grid: Narrative on Left, Education on Right */}
        <div className="mt-12 grid grid-cols-1 gap-y-12 md:grid-cols-[1.3fr_0.7fr] lg:grid-cols-[1.4fr_0.6fr] md:gap-x-16 lg:gap-x-24 items-start">
          
          {/* Left Column — Primary Statement & Secondary Bio Narrative */}
          <Reveal delay={0.08}>
            <div className="space-y-8 max-w-[65ch]">
              {/* Primary Research Statement */}
              <p className="font-display text-[clamp(20px,2.2vw,28px)] font-semibold leading-[1.35] tracking-tight text-bone">
                {tagline}
              </p>
              
              {/* Secondary Bio Narrative */}
              <p className="text-[16px] md:text-[17px] leading-relaxed text-mist">
                {detail[0]}
              </p>
            </div>
          </Reveal>

          {/* Right Column — Education */}
          <Reveal delay={0.14} className="md:pt-16">
            <div className="space-y-6">
              {/* Top Hairline Divider */}
              <div className="h-[1px] w-full max-w-[240px] bg-line" />

              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  EDUCATION
                </h3>
                <ul className="mt-6 space-y-6">
                  {background.map((b) => (
                    <li key={b.degree}>
                      <p className="font-display text-[16px] md:text-[17px] font-semibold leading-snug text-bone">
                        {b.org}
                      </p>
                      <p className="mt-1 font-mono text-xs text-mist">
                        {b.degree}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
