"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * template.tsx re-mounts on every navigation (unlike layout.tsx), which makes
 * it the natural place for a route-enter transition. Each page fades and rises
 * in. For full enter+exit choreography you'd reach for the View Transitions
 * API or an AnimatePresence wrapper around the router — see the README.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
