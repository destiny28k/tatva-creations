"use client";

import { useEffect, useRef } from "react";
import type { Stat } from "@/lib/types";
import { prefersReducedMotion } from "@/lib/motion";

type Props = { stats: Stat[]; className: string; statClass: string };

/** Numbers count up once when they scroll into view. The final value is already in the HTML. */
export default function StatsCounter({ stats, className, statClass }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const frames: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        root.querySelectorAll<HTMLElement>("b[data-count]").forEach((b) => {
          const end = Number(b.dataset.count);
          const suffix = b.dataset.suffix ?? "";
          const t0 = performance.now();
          const step = (t: number) => {
            const k = Math.min(1, (t - t0) / 1400);
            b.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suffix;
            if (k < 1) frames.push(requestAnimationFrame(step));
          };
          frames.push(requestAnimationFrame(step));
        });
      },
      { threshold: 0.5 }
    );
    io.observe(root);
    return () => {
      io.disconnect();
      frames.forEach(cancelAnimationFrame);
    };
  }, []);

  return (
    <div ref={ref} className={className} data-reveal="">
      {stats.map((s) => (
        <div key={s.label} className={statClass}>
          <b data-count={s.value} data-suffix={s.suffix}>
            {s.value}
            {s.suffix}
          </b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
