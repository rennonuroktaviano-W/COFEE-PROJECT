"use client";

import { useMediaQuery } from "@/lib/mediaQuery";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the operating-system "reduce motion" preference reactively (PRD 6.1).
 *
 * Defaults to `false` on the server so markup stays deterministic between SSR
 * and hydration; the client corrects it on first paint.
 *
 * @returns {boolean}
 */
export function usePrefersReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}

export default usePrefersReducedMotion;
