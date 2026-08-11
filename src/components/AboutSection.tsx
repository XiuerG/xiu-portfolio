import { Reveal } from "@/components/motion/Reveal";

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
  "With a growing focus on digital health, I work across mental health, dementia caregiving, and accessibility. My approach combines qualitative HCI research, interaction design, and front-end developing to examine how technologies can be made more usable, inclusive, and accountable to the people they support.",
];

/**
 * About — laid out as a code block (`About { … }`): a short tagline over the
 * educational background on the left, the fuller description on the right.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 border-t border-line px-6 py-24 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <Reveal>
            <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight">
              About
            </h2>
          </Reveal>
          
          {/* Prototype Round Avatar Frame */}
          <Reveal delay={0.05}>
            <div className="relative group/avatar select-none">
              <div className="h-28 w-28 md:h-36 md:w-36 rounded-full border border-dashed border-line bg-raised/20 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-accent/40 hover:bg-raised/40 hover:shadow-[0_8px_24px_rgba(224,118,77,0.06)]">
                <svg
                  className="h-11 w-11 md:h-14 md:w-14 text-mist/30 transition-colors duration-300 group-hover:text-accent/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              
              {/* Optional tiny indicator tag */}
              <div className="absolute top-full right-0 mt-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-wider text-accent bg-ground border border-accent/20 px-2 py-0.5 rounded shadow">
                  Avatar
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — tagline over background */}
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-12">
              <p className="text-xl font-medium leading-snug text-bone md:text-2xl">
                {tagline}
              </p>
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Education
                </h3>
                <ul className="mt-4 space-y-4">
                  {background.map((b) => (
                    <li key={b.degree}>
                      <p className="font-display text-[17px] font-semibold leading-snug">
                        {b.org}
                      </p>
                      <p className="mt-0.5 font-display text-[15px] font-medium leading-snug text-bone/75">
                        {b.degree}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Right — detailed description, centered against the left column */}
          <Reveal delay={0.08} className="flex flex-col justify-center">
            <div className="space-y-5">
              {detail.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-mist">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
