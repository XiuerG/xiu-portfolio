import { Reveal } from "@/components/motion/Reveal";

/**
 * Shared section opener — an eyebrow label, a display title, and an optional
 * one-line description. Keeps vertical rhythm and typography consistent across
 * the homepage sections (Projects, Publications, Experience, About).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10">
      <Reveal>
        <div>
          {eyebrow && (
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 font-display text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.05] tracking-[-0.01em]">
            {title}
          </h2>
          {description && (
            <p className="mt-4 max-w-[52ch] text-[16.5px] leading-[1.6] text-mist">
              {description}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
