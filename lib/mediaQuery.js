"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Stable no-op subscribe for values that cannot change after first read. */
const noopSubscribe = () => () => {};

/**
 * Subscribes to a CSS media query via `useSyncExternalStore`.
 *
 * `matchMedia` is an external store, so reading it inside an effect and calling
 * setState is the pattern React 19 discourages. This keeps the value reactive
 * while letting React own the rendering, and guarantees the server snapshot is
 * explicit so SSR markup stays deterministic.
 *
 * @param {string} query  e.g. "(max-width: 767px)"
 * @param {boolean} serverFallback  value assumed during SSR
 */
export function useMediaQuery(query, serverFallback = false) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  const getServerSnapshot = useCallback(() => serverFallback, [serverFallback]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

let deviceCapabilityCache = null;

/**
 * One-time read of device capability hints. These cannot change during a
 * session, so the value is cached and read through `useSyncExternalStore`
 * without subscribing to anything.
 */
export function useDeviceCapability() {
  const getSnapshot = useCallback(() => {
    if (deviceCapabilityCache !== null) return deviceCapabilityCache;

    const saveData = Boolean(navigator.connection?.saveData);
    const lowCoreCount = (navigator.hardwareConcurrency || 8) <= 4;
    const lowMemory = (navigator.deviceMemory || 8) <= 4;

    deviceCapabilityCache = saveData || lowCoreCount || lowMemory ? "low" : "high";
    return deviceCapabilityCache;
  }, []);

  return useSyncExternalStore(noopSubscribe, getSnapshot, () => "high");
}

let webglCache = null;

/**
 * Detects WebGL support once. Kept behind `useSyncExternalStore` so the hero
 * can decide between the live scene and the static poster without setState in
 * an effect, and without probing the GPU on every render.
 */
export function useWebGLSupport() {
  const getSnapshot = useCallback(() => {
    if (webglCache !== null) return webglCache;

    try {
      const canvas = document.createElement("canvas");
      webglCache = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") || canvas.getContext("webgl")),
      );
    } catch {
      webglCache = false;
    }
    return webglCache;
  }, []);

  return useSyncExternalStore(noopSubscribe, getSnapshot, () => false);
}

export { noopSubscribe };
