"use client";

import { useEffect, useRef } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { ABOUT } from "@/lib/content";
import { useFrame } from "@/hooks/useFrame";
import styles from "./Statement.module.css";

const LEAD = "We turn ideas into packaging, print and paper that people pick up.";
const TAIL = "Concept to delivery, under one roof.";

/** Studio statement that fills in word by word as it scrolls through the screen. */
export default function Statement() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);
  const lastCount = useRef(-1);
  const still = useRef(true);

  useEffect(() => {
    still.current = prefersReducedMotion();
    words.current = Array.from(headingRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]") ?? []);
  }, []);

  useFrame(() => {
    const h = headingRef.current;
    if (still.current || !h || !words.current.length) return;
    const r = h.getBoundingClientRect();
    const vh = window.innerHeight;
    const n = Math.round(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1) * words.current.length);
    if (n === lastCount.current) return;
    lastCount.current = n;
    words.current.forEach((w, i) => w.toggleAttribute("data-on", i < n));
  });

  const split = (text: string, extra?: string) =>
    text.split(" ").map((w, i) => (
      <span key={i}>
        <span data-word="" className={[styles.word, extra].filter(Boolean).join(" ")}>
          {w}
        </span>{" "}
      </span>
    ));

  return (
    <section className={`wrap ${styles.state}`} id="studio">
      <h2 ref={headingRef}>
        {split(LEAD)}
        {split(TAIL, styles.muted)}
      </h2>
      <p data-reveal="">{ABOUT}</p>
    </section>
  );
}
