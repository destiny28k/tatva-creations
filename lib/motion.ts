// One shared animation loop for the whole site, so every animated section reads the
// same scroll position and speed and the browser runs a single requestAnimationFrame.

export type ScrollState = {
  /** Page scroll position in px. */
  y: number;
  /** Raw scroll speed this frame, px per second. */
  v: number;
  /** Smoothed scroll speed, px per second. */
  vel: number;
};

export type FrameCallback = (t: number, dt: number, scroll: ScrollState) => void;

const subscribers = new Set<FrameCallback>();
const scroll: ScrollState = { y: 0, v: 0, vel: 0 };
let running = false;
let last = 0;
let lastY = 0;

function loop(t: number) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0);
  last = t;
  const y = window.scrollY;
  scroll.v = dt ? (y - lastY) / dt : 0;
  lastY = y;
  scroll.y = y;
  scroll.vel += (scroll.v - scroll.vel) * Math.min(1, dt * 8);
  subscribers.forEach((fn) => fn(t, dt, scroll));
  if (subscribers.size) requestAnimationFrame(loop);
  else running = false;
}

export function subscribeFrame(fn: FrameCallback): () => void {
  subscribers.add(fn);
  if (!running) {
    running = true;
    last = performance.now();
    lastY = window.scrollY;
    requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
  };
}

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
