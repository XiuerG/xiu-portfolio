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
        <Reveal>
          <h2 className="font-display text-[clamp(30px,3.6vw,44px)] font-bold tracking-tight">
            About
          </h2>
        </Reveal>

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
