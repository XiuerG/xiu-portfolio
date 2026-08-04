"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { getCardProject } from "@/lib/profile";

/**
 * Preview card (DESIGN_SPEC §6.2) — the project's "evidence", surfaced AFTER
 * the cat's words. It's the homepage design system in miniature (Newsreader
 * italic title, mono metadata, cold accent), reusing projects.ts as the single
 * source of truth. It floats in slowly (§6.2): a lazy fade + rise, never a pop.
 */

export function PreviewCard({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const project = getCardProject(slug);
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mt-1 max-w-[88%]"
    >
      <Link
        href={`/work/${project.slug}`}
        className="group block overflow-hidden rounded-xl border border-line bg-raised/70 transition-colors hover:border-accent"
      >
        <div
          role="img"
          aria-label={project.cover.alt}
          className="aspect-[16/9] w-full"
          style={{
            background: `linear-gradient(135deg, ${project.accent}33, ${project.accent}10)`,
          }}
        />
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">
            {project.year} · {project.role}
          </p>
          <p className="mt-1 font-display text-xl font-semibold leading-tight text-bone">
            {project.title}
          </p>
          <p className="mt-1.5 line-clamp-2 text-sm text-mist">{project.summary}</p>
          <span className="mt-2 inline-block font-mono text-xs text-accent transition-transform duration-300 group-hover:translate-x-0.5">
            See it →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
