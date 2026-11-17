"use client";

import { useRef, useState } from "react";
import type { CategorySlide } from "@/lib/types";
import { clamp, pad2 } from "@/lib/motion";
import { useFrame } from "@/hooks/useFrame";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./CategorySwap.module.css";

/** "We design packaging for Bread / Snacks / ..." with the page taking each category's colour. */
export default function CategorySwap({ slides }: { slides: CategorySlide[] }) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const pinned = !useReducedMotion();

  useFrame(
    () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const i = Math.min(slides.length - 1, Math.floor(clamp(-r.top / span, 0, 0.999) * slides.length));
      setIndex((prev) => (prev === i ? prev : i));
    },
    pinned
  );

  const slide = slides[index];
  const pos = (i: number) => (i === index ? styles.on : i < index ? styles.was : undefined);

  return (
    <section
      ref={ref}
      className={`${styles.swap} ${pinned ? "" : styles.static}`}
      style={{ "--sbg": slide.background, "--sfg": slide.color, height: pinned ? `${100 + slides.length * 60}vh` : undefined } as React.CSSProperties}
      aria-label="Categories we design for"
    >
      <div className={styles.pin}>
        <div className={styles.text}>
          <p className="cap">Tatva creates</p>
          <div className={styles.words}>
            {slides.map((s, i) => (
              <span key={s.word} className={pos(i)}>
                {s.word}
              </span>
            ))}
          </div>
          <p className={`cap ${styles.count}`}>
            {slide.caption} &middot; {pad2(index + 1)} / {pad2(slides.length)}
          </p>
        </div>
        <div className={styles.photo} aria-hidden="true">
          {slides.map((s, i) => (
            <i key={s.word} className={i === index ? styles.on : undefined} style={{ backgroundImage: `url(${s.image})` }} />
          ))}
        </div>
      </div>
    </section>
  );
}
