"use client";

import { Component, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import usePrefersReducedMotion from "@/lib/usePrefersReducedMotion";
import { useWebGLSupport } from "@/lib/mediaQuery";

/**
 * The R3F canvas is loaded only in the browser, so three.js never enters the
 * server bundle and never blocks first paint (PRD 6.3 "lazy-load the scene").
 */
const CoffeeHeroScene = dynamic(() => import("./CoffeeHeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Catches WebGL/context-creation failures so the static poster can take over
 * instead of leaving a blank hole in the hero (PRD 9 "show a fallback if the 3D
 * object fails to load").
 */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Surfaced in the console for the developer, never shown to the visitor.
    console.warn("[Smiljan] 3D scene unavailable, using static poster:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/**
 * Section 01 focal point container (PRD 6.2 "Hero 3D object").
 *
 * Resolution order:
 *   1. prefers-reduced-motion  -> static poster only
 *   2. no WebGL                -> static poster only
 *   3. scene runtime error     -> static poster (via error boundary)
 *   4. otherwise               -> poster until ready, then the live scene
 *
 * The canvas is decorative: it is hidden from assistive technology and no
 * information or CTA depends on interacting with it (PRD 6.3).
 */
export function HeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasWebGL = useWebGLSupport();
  const [isReady, setIsReady] = useState(false);

  const shouldRenderScene = hasWebGL && !prefersReducedMotion;
  const isUsingPoster = !shouldRenderScene || !isReady;

  return (
    <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
      <div className="relative aspect-square w-full">
        {/* Static poster: the fallback, and the first paint before WebGL boots. */}
        <Image
          src="/placeholders/hero-cup-poster.svg"
          alt="Ilustrasi cangkir kopi sebagai titik fokus visual bagian pembuka Smiljan"
          width={900}
          height={900}
          priority
          className={`size-full object-contain transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isUsingPoster ? "opacity-100" : "opacity-0"
          }`}
        />

        {shouldRenderScene ? (
          <SceneErrorBoundary fallback={null}>
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isReady ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            >
              <CoffeeHeroScene onReady={() => setIsReady(true)} />
            </div>
          </SceneErrorBoundary>
        ) : null}
      </div>

      {/* Explains the current state, including when the poster is in use. */}
      <p
        aria-hidden="true"
        className="label mt-6 flex items-center justify-center gap-3 text-espresso/35"
      >
        <span className="block h-px w-6 bg-current" />
        {isUsingPoster ? "Ilustrasi statis" : "Cangkir kopi — 3D interaktif"}
      </p>
    </div>
  );
}

export default HeroScene;
