"use client";

import { useEffect, useRef } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { useFrame } from "@/hooks/useFrame";
import styles from "./Marquee.module.css";

/** Huge words that move with the scroll, reverse when scrolling up and lean with speed. */
export default function Marquee({ words }: { words: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const state = useRef({ x: 0, dir: -1 });
  const still = useRef(true);

  useEffect(() => {
    still.current = prefersReducedMotion();
  }, []);

  useFrame((_t, dt, scroll) => {
    const track = trackRef.current;
    if (still.current || !track) return;
    const s = state.current;
    if (scroll.v > 5) s.dir = -1;
    else if (scroll.v < -5) s.dir = 1;
    const half = track.scrollWidth / 2 || 1;
    s.x += s.dir * (50 + Math.abs(scroll.vel) * 0.6) * dt;
    s.x %= half;
    if (s.x > 0) s.x -= half;
    track.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0) skewX(${clamp(scroll.vel * 0.01, -7, 7).toFixed(2)}deg)`;
  });

  return (
    <div className={styles.vm} aria-hidden="true">
      <div ref={trackRef} className={styles.track}>
        {[...words, ...words].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}
