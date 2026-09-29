"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { navSections, site } from "@/data/site";

/**
 * Fixed masthead (PRD 9 — anchor navigation, included only because it supports
 * the experience). Transparent over the hero, settling onto a solid cream
 * surface once the page scrolls.
 *
 * Below the `md` breakpoint the four anchor links cannot fit beside the
 * wordmark without overflowing, so they collapse into a disclosure panel. The
 * inline list is rendered from `md` up.
 */
export function Masthead() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panel if the viewport grows past the breakpoint that hides it,
  // otherwise the open state would linger with no visible trigger.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => {
      if (event.matches) setIsMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Escape closes the panel and returns focus to the trigger.
  const handleKeyDown = useCallback((event) => {
    if (event.key !== "Escape") return;
    setIsMenuOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Prevent the page scrolling behind the open panel.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (!isMenuOpen) return;
    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled || isMenuOpen
          ? "border-b border-espresso/10 bg-cream/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
      onKeyDown={handleKeyDown}
    >
      <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
        <a
          href="#top"
          // shrink-0 stops flexbox from crushing the wordmark on narrow
          // screens; min-h-11 keeps the tap target at 44px (PRD 8).
          className="group -ml-2 flex min-h-11 shrink-0 items-center gap-2.5 rounded-full px-2 text-espresso transition-opacity duration-300 hover:opacity-80"
          aria-label={`${site.name} — kembali ke atas`}
        >
          <Image
            src="/brand/logo-smiljan.svg"
            alt=""
            width={140}
            height={28}
            className="h-4 w-[7.5rem] md:h-5 md:w-[8.75rem]"
          />
          <span
            aria-hidden="true"
            className="hidden size-1 rounded-full bg-olive transition-transform duration-500 group-hover:scale-150 sm:block"
          />
        </a>

        {/* ------------------------------------------- desktop inline anchors */}
        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="label flex items-center gap-1 text-espresso/70 md:gap-2">
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-11 items-center rounded-full px-3 transition-colors duration-300 hover:text-espresso md:px-4"
                >
                  {section.label}
                </a>
              </li>
            ))}
            <li className="ml-1">
              <a
                href={site.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label inline-flex min-h-11 items-center rounded-full bg-espresso px-4 text-cream transition-colors duration-300 hover:bg-roasted"
              >
                Petunjuk Arah
              </a>
            </li>
          </ul>
        </nav>

        {/* ------------------------------------------------ mobile disclosure */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-espresso/25 text-espresso transition-colors duration-300 hover:border-espresso hover:bg-espresso/5 md:hidden"
        >
          <span aria-hidden="true" className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMenuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMenuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {isMenuOpen ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          className="border-t border-espresso/10 bg-cream/98 backdrop-blur-md md:hidden"
        >
          <nav aria-label="Navigasi utama (seluler)" className="shell py-3">
            <ul className="flex flex-col">
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={closeMenu}
                    className="label flex min-h-13 items-center border-b border-espresso/8 py-3 text-espresso/75 transition-colors duration-300 last:border-b-0 hover:text-espresso"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={site.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="label mt-4 flex min-h-13 items-center justify-center rounded-full bg-espresso text-cream transition-colors duration-300 hover:bg-roasted"
            >
              Petunjuk Arah
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export default Masthead;
