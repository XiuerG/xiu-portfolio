"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Role positionings the hero types through, one after another. */
const ROLES = [
  "HCI Researcher",
  "UX Researcher",
  "Interaction Designer",
  "Front-End Developer",
];

/**
 * Typewriter role line for the hero — types a role, holds, deletes, and moves
 * to the next (ddaniel.dev-style). Reduced-motion users get a static first
 * role with no animation.
 */
export function TypingRole() {
  const reduce = useReducedMotion();
  const [text, setText] = useState("");

  useEffect(() => {
    if (reduce) {
      setText(ROLES[0]);
      return;
    }
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = ROLES[phrase];
      if (!deleting) {
        char += 1;
        setText(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1700); // hold on the full word
          return;
        }
        timer = setTimeout(tick, 65);
      } else {
        char -= 1;
        setText(current.slice(0, char));
        if (char === 0) {
          deleting = false;
          phrase = (phrase + 1) % ROLES.length;
          timer = setTimeout(tick, 350);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };

    timer = setTimeout(tick, 450);
    return () => clearTimeout(timer);
  }, [reduce]);

  return (
    <span className="font-mono text-[clamp(17px,2.6vw,30px)] font-semibold uppercase tracking-[0.12em] text-accent">
      {text}
      <span
        className="ml-0.5 inline-block w-[0.55ch] -translate-y-[1px] align-baseline"
        style={{ animation: reduce ? "none" : "blink 1s step-end infinite" }}
        aria-hidden
      >
        |
      </span>
    </span>
  );
}
