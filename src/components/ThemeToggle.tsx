"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    let initialTheme: "dark" | "light" = "dark";
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      initialTheme = "light";
    }
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  // Prevent layout shift during hydration by rendering a layout-matched placeholder
  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full border border-line bg-raised/60 shrink-0" />
    );
  }

  const isLight = theme === "light";

  return (
    <div
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className="relative flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border border-line bg-raised/60 p-1 select-none transition-colors hover:border-mist"
    >
      {/* Sliding Knob background highlight */}
      <motion.div
        className="absolute h-6 w-6 rounded-full bg-bone shadow-sm"
        animate={{ x: isLight ? 0 : 32 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />

      {/* Sun Icon (Left) */}
      <div
        className={`relative z-10 flex h-6 w-6 items-center justify-center transition-colors duration-200 ${
          isLight ? "text-ground" : "text-mist hover:text-bone"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </div>

      {/* Moon Icon (Right) */}
      <div
        className={`relative z-10 ml-auto flex h-6 w-6 items-center justify-center transition-colors duration-200 ${
          !isLight ? "text-ground" : "text-mist hover:text-bone"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </div>
  );
}
