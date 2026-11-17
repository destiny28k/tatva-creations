"use client";

import { useEffect, useRef, useState } from "react";
import type { ServiceGroup } from "@/lib/types";
import { pad2 } from "@/lib/motion";
import ServiceArt from "./ServiceArt";
import styles from "./Services.module.css";

/** Soft background behind each card's illustration, cycling through the brand colours. */
const TINTS = ["#EEF0F7", "#FDF4D6", "#FDEBDD", "#F1F3E3", "#FBE6EE", "#E8F3F5"];

/**
 * What Tatva does, in two groups (print & packaging, digital solutions).
 * Each card has a small looping illustration that plays while the grid is on screen.
 */
export default function Services({ groups }: { groups: ServiceGroup[] }) {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const group = groups[active];

  // On phones the cards are a swipeable row; track which card is in view for the counter.
  const onScroll = () => {
    const grid = gridRef.current;
    const first = grid?.firstElementChild as HTMLElement | null;
    if (!grid || !first) return;
    const step = first.offsetWidth + 12;
    setSlide(Math.min(group.items.length - 1, Math.round(grid.scrollLeft / step)));
  };
  const go = (dir: number) => {
    const grid = gridRef.current;
    const first = grid?.firstElementChild as HTMLElement | null;
    if (grid && first) grid.scrollBy({ left: dir * (first.offsetWidth + 12), behavior: "smooth" });
  };
  const switchGroup = (i: number) => {
    setActive(i);
    setSlide(0);
  };

  // Only animate the illustrations while the grid is visible.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const io = new IntersectionObserver(([e]) => grid.classList.toggle("svc-play", e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(grid);
    return () => io.disconnect();
  }, [group.id]);

  return (
    <section className={`wrap ${styles.section}`} id="services" aria-label="Services">
      <div className={styles.head}>
        <div className={styles.titles}>
          <p className="cap">What we do</p>
          <h2>From the first idea to the final delivery.</h2>
        </div>
        <div
          className={styles.switch}
          role="group"
          aria-label="Service groups"
          style={{ "--n": groups.length, "--i": active } as React.CSSProperties}
        >
          <span className={styles.thumb} aria-hidden="true" />
          {groups.map((g, i) => (
            <button key={g.id} type="button" aria-pressed={i === active} onClick={() => switchGroup(i)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} key={group.id} className={`${styles.grid} ${group.items.length === 4 ? styles.four : ""}`} onScroll={onScroll}>
        {group.items.map((s, i) => (
          <article key={s.title} className={styles.card} style={{ "--k": i, "--tint": TINTS[i % TINTS.length] } as React.CSSProperties}>
            <div className={styles.artBox}>
              <span className={styles.num}>{pad2(i + 1)}</span>
              <ServiceArt kind={s.art} />
            </div>
            <div className={styles.body}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className={styles.tags}>
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Phones only: where you are in the row, with buttons for people who don't swipe */}
      <div className={styles.swipe}>
        <span className="cap">
          {pad2(slide + 1)} / {pad2(group.items.length)} &middot; Swipe
        </span>
        <span className={styles.progress} aria-hidden="true">
          <i style={{ width: `${((slide + 1) / group.items.length) * 100}%` }} />
        </span>
        <span className={styles.arrows}>
          <button type="button" aria-label="Previous service" onClick={() => go(-1)} disabled={slide === 0}>&larr;</button>
          <button type="button" aria-label="Next service" onClick={() => go(1)} disabled={slide === group.items.length - 1}>&rarr;</button>
        </span>
      </div>
    </section>
  );
}
