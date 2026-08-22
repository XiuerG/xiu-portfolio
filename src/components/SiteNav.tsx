"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CV_PATH } from "@/lib/site";
import { getAssetPath } from "@/lib/utils";

type MenuLink = { href: string; label: string; external?: boolean };

const menuLinks: MenuLink[] = [
  { href: "/#about", label: "About" },
  { href: "/#research", label: "Research" },
  { href: "/#design", label: "Design & Interaction" },
  { href: "/#contact", label: "Contact" },
  { href: getAssetPath(CV_PATH), label: "CV", external: true },
];

/**
 * SiteNav — name on the left; "Download CV" pill + hamburger on the right.
 * The hamburger opens a full-screen overlay menu: big display links that
 * stagger in, email at the bottom. Esc or any link closes it; body scroll is
 * locked while open.
 *
 * The overlay stays mounted and is toggled with CSS transitions (opacity +
 * pointer-events) — exit animations driven by React unmounting can freeze
 * mid-flight when a route change lands in the same frame.
 */
export function SiteNav() {
  const pathname = usePathname();

  /**
   * Same-page section links are scrolled by hand. Routing to "/#section" while
   * already on "/" hands the scroll to the router, which lands short of the
   * target — clicking Research put you back in About. Off the homepage the
   * router still handles it, because the section has to be rendered first.
   */
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    setOpen(false);
    if (!href.startsWith("/#") || pathname !== "/") return;
    const el = document.getElementById(href.slice(2));
    if (!el) return;
    e.preventDefault();
    // scroll-margin-top on the section carries the sticky-bar offset, so read
    // it rather than hard-coding a second copy of that number here.
    const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    window.history.replaceState(null, "", href);
  };

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
                {(() => {
                  const inner = (
                    <>
                      <span className="font-mono text-sm text-mist tabular-nums">
                        {String(i).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[clamp(36px,7vw,64px)] font-bold leading-none transition-colors duration-300 group-hover:text-accent">
                        {l.label}
                      </span>
                      <span
                        className="ml-auto translate-x-2 font-display text-2xl text-mist opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        aria-hidden
                      >
                        {l.external ? "↗" : "→"}
                      </span>
                    </>
                  );
                  const cls = "group flex items-baseline gap-6 py-5";
                  return l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={(e) => scrollToSection(e, l.href)}
                      tabIndex={open ? 0 : -1}
                      className={cls}
                    >
                      {inner}
                    </Link>
                  );
                })()}
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

          {/* Inline numbered nav (desktop) — the reference's top-bar structure. */}
          <nav
            aria-label="Primary"
            className="hidden items-center lg:flex"
          >
            {menuLinks.map((l, i) => {
              const content = (
                <span className="group inline-flex items-baseline gap-1.5 font-display text-[12.5px] font-semibold uppercase tracking-[0.1em]">
                  <span className="text-accent tabular-nums">{i}.</span>
                  <span className="text-bone transition-colors group-hover:text-accent">
                    {l.label}
                  </span>
                </span>
              );
              return (
                <span key={l.href} className="flex items-center">
                  {i > 0 && (
                    <span className="mx-4 h-3 w-px bg-line" aria-hidden />
                  )}
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={(e) => scrollToSection(e, l.href)}
                    >
                      {content}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/60 transition-colors hover:border-mist lg:hidden"
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
