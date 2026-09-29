"use client";

import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";

/**
 * Reveals an element once it approaches the viewport (PRD 6.2 "Scroll reveal").
 *
 * The animation itself lives in CSS (`.reveal` in globals.css) so this hook
 * only toggles a class — it never writes layout properties directly, which
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
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer support: fall back to simply showing the content.
    if (typeof IntersectionObserver === "undefined") {
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

  // Reduced motion bypasses the observer entirely — content is simply visible.
  const isRevealed = prefersReducedMotion || isVisible;

  return [ref, isRevealed];
}

export default useReveal;
