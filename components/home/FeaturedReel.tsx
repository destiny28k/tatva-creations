"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { clamp, pad2, prefersReducedMotion } from "@/lib/motion";
import { setFlight } from "@/lib/navigation";
import { useFrame } from "@/hooks/useFrame";
import ProtectedImage from "@/components/ui/ProtectedImage";
import styles from "./FeaturedReel.module.css";

/** Six large projects that travel sideways while the page scrolls down. */
export default function FeaturedReel({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);
  const travel = useRef(0);
  const [pinned, setPinned] = useState(false);

  // Pin only on wide screens with motion allowed; size the section so the sideways travel fits the scroll.
  useEffect(() => {
    const layout = () => {
      const pin = !prefersReducedMotion() && window.innerWidth >= 860;
      setPinned(pin);
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      if (pin) {
        travel.current = Math.max(0, track.scrollWidth - window.innerWidth);
        section.style.height = `${window.innerHeight + travel.current}px`;
      } else {
        section.style.height = "";
        track.style.transform = "";
      }
    };
    layout();
    // Measure again once the pinned layout has applied.
    const raf = requestAnimationFrame(layout);
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    document.fonts?.ready.then(layout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
    };
  }, []);

  useFrame(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const t = travel.current;
      const p = t ? clamp(-section.getBoundingClientRect().top / t, 0, 1) : 0;
      track.style.transform = `translate3d(${(-p * t).toFixed(1)}px,0,0)`;
      if (barRef.current) barRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      if (countRef.current) countRef.current.textContent = `${pad2(Math.round(p * (projects.length - 1)) + 1)} / ${pad2(projects.length)}`;
    },
    pinned
  );

  const open = (p: Project, imageEl: Element | null) => {
    setFlight(imageEl ? { rect: imageEl.getBoundingClientRect(), image: p.images[0], view: 0 } : null);
    router.push(`/work/${p.slug}`, { scroll: false });
  };

  return (
    <section ref={sectionRef} className={`${styles.reel} ${pinned ? "" : styles.native}`} aria-label="Featured work">
      <div className={styles.pin}>
        <div className={`wrap ${styles.head}`}>
          <p className="cap">Featured work</p>
          <p ref={countRef} className={`cap ${styles.counter}`}>
            01 / {pad2(projects.length)}
          </p>
        </div>
        <div ref={trackRef} className={styles.track}>
          {projects.map((p, i) => (
            <article key={p.slug} className={styles.item}>
              <ProtectedImage
                src={p.images[0]}
                label={`${p.name}. Open project`}
                className={styles.image}
                onOpen={(e) => open(p, e.currentTarget)}
              />
              <div className={styles.text}>
                <p className="cap">
                  {pad2(i + 1)} / {pad2(projects.length)} · {p.category}
                </p>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <button
                  type="button"
                  className={styles.link}
                  onClick={(e) => open(p, e.currentTarget.closest("article")?.querySelector("[data-protect]") ?? null)}
                >
                  View project
                </button>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.bar}>
          <i ref={barRef} />
        </div>
      </div>
    </section>
  );
}
