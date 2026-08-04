"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A 2px progress hairline pinned to the top of the viewport. Scales with
 * scroll position and shifts from the cool accent to the warm ember as you
 * approach the end of the page — a quiet sense of arrival.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#d9a48c", "#bd5a3c"],
  );

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, backgroundColor, transformOrigin: "0%" }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] w-full"
    />
  );
}
