"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { ThemeToggle } from "@/components/ThemeToggle";

const menuLinks = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * SiteNav — name on the left; "Work With Me" pill + hamburger on the right.
 * The hamburger opens a full-screen overlay menu: big display links that
 * stagger in, email at the bottom. Esc or any link closes it; body scroll is
 * locked while open.
 *
 * The overlay stays mounted and is toggled with CSS transitions (opacity +
 * pointer-events) — exit animations driven by React unmounting can freeze
 * mid-flight when a route change lands in the same frame.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Full-screen overlay menu — painted under the bar so the ✕ stays visible. */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 flex flex-col justify-between bg-ground/95 px-6 pb-10 pt-32 backdrop-blur-xl transition-opacity duration-300 md:px-10 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Site menu">
          <ul className="mx-auto flex max-w-[1200px] flex-col gap-2">
            {menuLinks.map((l, i) => (
              <li
                key={l.href}
                className={`border-b border-line transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 70}ms` : "0ms" }}
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-baseline gap-6 py-5"
                >
                  <span className="font-mono text-sm text-mist tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(36px,7vw,64px)] font-bold leading-none transition-colors duration-300 group-hover:text-accent">
                    {l.label}
                  </span>
                  <span
                    className="ml-auto translate-x-2 font-display text-2xl text-mist opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`mx-auto flex w-full max-w-[1200px] flex-col gap-1 font-display text-sm text-mist transition-opacity duration-500 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: open ? "380ms" : "0ms" }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.16em]">
            Say hi
          </span>
          <a
            href="mailto:gxe.melody@gmail.com"
            tabIndex={open ? 0 : -1}
            className="w-fit text-bone transition-colors hover:text-accent"
          >
            gxe.melody@gmail.com
          </a>
        </div>
      </div>

      {/* Bar */}
      <div className="relative bg-ground/70 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-sm font-bold uppercase tracking-[0.14em]"
          >
            <Magnetic>Xiuer&nbsp;Gu</Magnetic>
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-block rounded-full bg-bone px-5 py-2 font-display text-sm font-semibold text-ground transition-transform duration-300 hover:scale-[1.05]"
            >
              Work With Me
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/60 transition-colors hover:border-mist"
            >
              <span
                className={`absolute h-[2px] w-5 rounded-full bg-bone transition-transform duration-300 ${
                  open ? "rotate-45" : "-translate-y-[3.5px]"
                }`}
                aria-hidden
              />
              <span
                className={`absolute h-[2px] w-5 rounded-full bg-bone transition-transform duration-300 ${
                  open ? "-rotate-45" : "translate-y-[3.5px]"
                }`}
                aria-hidden
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
