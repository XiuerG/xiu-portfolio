import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

const paragraphs = [
  "I am an interdisciplinary Health HCI researcher and designer with training in Information Studies and Art & Technology.",
  "My work explores how human-centered AI and digital health technologies can better support people navigating complex, sensitive, and often inaccessible care contexts.",
  "I am particularly interested in digital mental health, caregiver support, accessible technologies, and the design and evaluation of AI-enabled health systems.",
  "My background allows me to work across research, interaction design, and front-end prototyping — from framing a problem and analyzing user needs to building systems for future evaluation.",
];

const groups: { heading: string; items: string[] }[] = [
  {
    heading: "Research Interests",
    items: ["Health HCI", "Human-Centered AI", "Digital Health", "Accessibility"],
  },
  {
    heading: "Methods",
    items: [
      "Qualitative Interviews",
      "Thematic Analysis",
      "Usability Evaluation",
      "Accessibility Evaluation",
      "Mixed-Methods Research",
    ],
  },
  {
    heading: "Tools",
    items: [
      "Figma",
      "React / Next.js",
      "Python",
      "JavaScript",
      "Unity",
      "TouchDesigner",
    ],
  },
];

/**
 * About — research positioning (not a plain designer bio), followed by three
 * compact groups: Research Interests, Methods, and Tools.
 */
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-line py-24 md:py-28">
      <SectionHeader eyebrow="About" title="About" />
      <div className="mx-auto mt-10 max-w-[1200px] px-6 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
          <Reveal>
            <div className="space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-bone/90">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-8">
              {groups.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {group.heading}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-3 py-1.5 text-sm text-bone/90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
