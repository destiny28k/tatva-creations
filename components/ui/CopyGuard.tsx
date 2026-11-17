"use client";

import { useEffect } from "react";

/** Blocks the right-click menu and dragging on images marked with data-protect. */
export default function CopyGuard() {
  useEffect(() => {
    const onMenu = (e: MouseEvent) => {
      if ((e.target as Element).closest?.("[data-protect]")) e.preventDefault();
    };
    const onDrag = (e: DragEvent) => {
      if ((e.target as Element).closest?.("img, [data-protect]")) e.preventDefault();
    };
    document.addEventListener("contextmenu", onMenu);
    document.addEventListener("dragstart", onDrag);
    return () => {
      document.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("dragstart", onDrag);
    };
  }, []);
  return null;
}
