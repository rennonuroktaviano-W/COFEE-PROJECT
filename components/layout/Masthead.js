"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { navSections, site } from "@/data/site";

/**
 * Minimal fixed masthead (PRD 9 — anchor navigation, added only because it
 * supports the experience). Stays transparent over the hero and settles onto
 * a solid cream surface once the page scrolls, avoiding heavy glassmorphism.
 */
export function Masthead() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? "border-b border-espresso/10 bg-cream/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-espresso"
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

        <nav aria-label="Navigasi utama">
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
            <li className="ml-1 hidden sm:block">
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
      </div>
    </header>
  );
}

export default Masthead;
