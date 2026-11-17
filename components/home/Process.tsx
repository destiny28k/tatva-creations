"use client";

import { useRef, useState } from "react";
import type { ListItem } from "@/lib/types";
import { clamp } from "@/lib/motion";
import { useFrame } from "@/hooks/useFrame";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./Process.module.css";

const COLORS = ["#23356B", "#7E8C2D", "#1F7A8C", "#C2185B", "#EF7D22", "#C79A12", "#7E8C2D"];

/** The seven steps as a track whose line fills, and whose steps light up, as the section scrolls past. */
export default function Process({ steps }: { steps: ListItem[] }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(-1);

  useFrame(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight;
    // Starts filling when the track enters the lower part of the screen, done when it reaches the upper third.
    const k = clamp((vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.3), 0, 1);
    const vertical = window.innerWidth <= 900;
    fill.style.width = vertical ? "100%" : `${k * 100}%`;
    fill.style.height = vertical ? `${k * 100}%` : "100%";
    const n = Math.min(steps.length - 1, Math.floor(k * steps.length - 0.01));
    setReached((prev) => (prev === n ? prev : n));
  }, !reduced);

  const lit = reduced ? steps.length - 1 : reached;

  return (
    <section className={`wrap ${styles.section}`} id="process" aria-label="How we work">
      <div className={styles.head}>
        <p className="cap">How we work</p>
        <h2>Seven steps, one team, no hand-offs.</h2>
      </div>
      <ol ref={trackRef} className={styles.track} style={{ "--n": steps.length } as React.CSSProperties}>
        <li className={styles.rail} aria-hidden="true">
          <i ref={fillRef} style={reduced ? { width: "100%", height: "100%" } : undefined} />
        </li>
        {steps.map((s, i) => (
          <li key={s.title} className={`${styles.step} ${i <= lit ? styles.done : ""}`} style={{ "--c": COLORS[i % COLORS.length] } as React.CSSProperties}>
            <span className={styles.node}>{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
