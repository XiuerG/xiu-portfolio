"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/**
 * Custom cursor ring that trails the mouse with spring smoothing and swells
 * over interactive elements (links, buttons, the pixel cat). Uses
 * mix-blend-mode: multiply so it reads as a warm terracotta outline on the
 * cream ground. Respects prefers-reduced-motion and hides on touch / small
 * screens (see `.cursor-ring` in globals.css).
 */
export function CursorFollower() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "cat">(
    "default",
  );

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 260, mass: 0.5 };
  const followerX = useSpring(mouseX, springConfig);
  const followerY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    if (reduce) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isCat =
        target.closest('button[aria-label*="pixel cat"]') ||
        target.closest(".cat-trigger");
      if (isCat) {
        setHoverState("cat");
        return;
      }

      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]") ||
        window.getComputedStyle(target).cursor === "pointer";

      setHoverState(isClickable ? "pointer" : "default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [reduce, mouseX, mouseY]);

  if (!mounted || reduce) return null;

  const variants = {
    default: {
      width: 34,
      height: 34,
      backgroundColor: "rgba(189, 90, 60, 0)",
      borderColor: "#bd5a3c",
    },
    pointer: {
      width: 66,
      height: 66,
      backgroundColor: "rgba(189, 90, 60, 0.12)",
      borderColor: "#bd5a3c",
    },
    cat: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(189, 90, 60, 0.18)",
      borderColor: "#bd5a3c",
    },
  };

  return (
    <motion.div
      className="cursor-ring hidden md:block"
      style={{
        x: followerX,
        y: followerY,
        translateX: "-50%",
        translateY: "-50%",
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        borderRadius: "50%",
        borderWidth: 1.5,
        borderStyle: "solid",
        mixBlendMode: "multiply",
      }}
      animate={hoverState}
      variants={variants}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
    />
  );
}
