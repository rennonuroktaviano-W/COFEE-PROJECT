"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once it approaches the viewport (PRD 6.2 "Scroll reveal").
 *
 * The animation itself lives in CSS (`.reveal` in globals.css) so this hook
 * only toggles a class — it never touches layout properties directly, which
 * keeps the reveal on the compositor-friendly opacity/transform path.
 *
 * @param {{ threshold?: number, rootMargin?: string, once?: boolean }} options
 * @returns {[import('react').RefObject<HTMLElement>, boolean]}
 */
export function useReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the OS-level motion preference: show content immediately.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}

export default useReveal;
