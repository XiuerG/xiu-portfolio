import { Reveal } from "@/components/motion/Reveal";

type Column = {
  heading: string;
  items: { primary: string; secondary?: string }[];
};

const columns: Column[] = [
  {
    heading: "Background",
    items: [
      {
        primary: "M.S. in Information Studies",
        secondary: "The University of Texas at Austin",
      },
      {
        primary: "B.F.A. in Art & Technology",
        secondary: "The Ohio State University",
      },
    ],
  },
  {
    heading: "Research Interests",
    items: [
      { primary: "Health HCI" },
      { primary: "Human-Centered AI for Digital Health" },
      { primary: "Accessible & Inclusive Technologies" },
    ],
  },
  {
    heading: "Approach",
    items: [
      { primary: "HCI Research" },
      { primary: "Interaction Design" },
      { primary: "Front-End Prototyping" },
    ],
  },
];

/**
 * Research Profile — a compact research-identity summary between the hero and
 * the projects. Three responsive columns (Background · Interests · Approach)
 * rather than a résumé-style education list.
 */
export function ResearchProfile() {
  return (
    <section
      id="profile"
      className="scroll-mt-24 border-t border-line px-6 py-20 md:px-10 md:py-24"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-3 md:gap-14">
        {columns.map((col, i) => (
          <Reveal key={col.heading} delay={i * 0.06}>
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {col.heading}
              </h2>
              <ul className="mt-5 space-y-4">
                {col.items.map((item) => (
                  <li key={item.primary}>
                    <p className="font-display text-[17px] font-semibold leading-snug">
                      {item.primary}
                    </p>
                    {item.secondary && (
                      <p className="mt-1 text-sm leading-relaxed text-mist">
                        {item.secondary}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
