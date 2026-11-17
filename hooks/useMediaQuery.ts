"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query. `serverValue` is used for the server render and first paint. */
export function useMediaQuery(query: string, serverValue: boolean): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}

/** True when the visitor asked for less motion. Assumed true on the server, so the first paint is static. */
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", true);

/** True for a mouse or trackpad that can hover. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)", false);
