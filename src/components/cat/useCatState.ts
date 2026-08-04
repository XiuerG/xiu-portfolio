"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Cat state machine (DESIGN_SPEC §5.6).
 *
 *  idle     ~90% of the time: curled asleep, only a tail flick.
 *  stirred  while the page is scrolling: half-woken; settles back to idle.
 *  hover    desktop pointer over the cat: opens its eyes, a warm line.
 *  active   clicked: sits up, dialog opens.
 *  talking  a reply is streaming: stays awake and focused.
 *
 * `active`/`talking` are owned by whether the dialog is open / busy, so they
 * win over scroll/hover. Reduced-motion freezes frame animation elsewhere.
 */

export type CatState = "idle" | "stirred" | "hover" | "active" | "talking";

const MOBILE_QUERY = "(max-width: 767px)";

export function useCatState() {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [stirred, setStirred] = useState(false);

  const stirTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scrolling stirs the cat; it settles back after a quiet beat.
  useEffect(() => {
    const onScroll = () => {
      setStirred(true);
      if (stirTimer.current) clearTimeout(stirTimer.current);
      stirTimer.current = setTimeout(() => setStirred(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stirTimer.current) clearTimeout(stirTimer.current);
    };
  }, []);

  // Resolve the single visible state by priority.
  let state: CatState = "idle";
  if (open) state = busy ? "talking" : "active";
  else if (hovering && !isMobile) state = "hover";
  else if (stirred) state = "stirred";

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  return {
    state,
    open,
    busy,
    isMobile,
    reduce: !!reduce,
    setBusy,
    setHovering,
    openDialog,
    closeDialog,
  };
}
