"use client";

import { useEffect, type RefObject } from "react";
import { useRouter } from "next/navigation";

/**
 * Behaviour shared by the project and all-products overlays: locks page scroll,
 * moves focus into the overlay, closes on Escape and restores focus afterwards.
 */
export function useOverlay(active: boolean, focusRef: RefObject<HTMLElement | null>) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.classList.add("locked");
    focusRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("locked");
      previous?.focus?.({ preventScroll: true });
    };
  }, [active, focusRef, router]);
}
