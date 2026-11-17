"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./ImageTrail.module.css";

/**
 * Moving the mouse leaves a trail of photos that pop in and fade.
 * On touch screens there is no hover, so the trail draws itself while the section is on screen, and taps add more.
 */
export default function ImageTrail({ images }: { images: string[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const last = useRef({ x: -999, y: -999 });
  const count = useRef(0);
  const fine = useFinePointer();
  const enabled = !useReducedMotion();
  const hint = enabled ? (fine ? "Move your mouse" : "Tap anywhere") : "";

  const spawn = (x: number, y: number) => {
    const layer = layerRef.current;
    if (!layer || !images.length || !layer.animate) return;
    const n = count.current++;
    const base = layer.clientWidth < 600 ? 104 : 150;
    const size = base + (n % 3) * (base * 0.22);
    const rot = ((n * 37) % 24) - 12;
    const el = document.createElement("div");
    el.className = styles.image;
    el.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;background-image:url(${images[n % images.length]})`;
    layer.appendChild(el);
    const r = `rotate(${rot}deg) `;
    const anim = el.animate(
      [
        { opacity: 0, transform: `${r}scale(.5)` },
        { opacity: 1, transform: `${r}scale(1)`, offset: 0.18 },
        { opacity: 1, transform: `${r}scale(1)`, offset: 0.62 },
        { opacity: 0, transform: `${r}scale(.82)` },
      ],
      { duration: 1400, easing: "ease-out" }
    );
    anim.onfinish = () => el.remove();
    anim.oncancel = () => el.remove();
  };

  // Touch screens: an automatic trail that loops around the headline while the section is visible.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || fine || !enabled) return;
    let timer = 0;
    let step = 0;
    const tick = () => {
      const w = section.clientWidth;
      const h = section.clientHeight;
      const a = step++ * 0.9;
      spawn(w / 2 + Math.cos(a) * w * 0.32, h / 2 + Math.sin(a * 1.3) * h * 0.3);
    };
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(tick, 520);
    });
    io.observe(section);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
    // spawn only reads refs and the images list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fine, enabled]);

  const at = (e: React.PointerEvent) => {
    const r = sectionRef.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };

  return (
    <section
      ref={sectionRef}
      className={styles.trail}
      aria-label="Good packaging leaves a trail"
      onPointerMove={(e) => {
        if (!enabled || e.pointerType !== "mouse") return;
        const [x, y] = at(e);
        if (Math.hypot(x - last.current.x, y - last.current.y) > 95) {
          last.current = { x, y };
          spawn(x, y);
        }
      }}
      onPointerDown={(e) => {
        if (!enabled || e.pointerType === "mouse") return;
        const [x, y] = at(e);
        spawn(x, y);
      }}
    >
      <div ref={layerRef} className={styles.layer} />
      <h2>
        Good packaging
        <br />
        leaves a trail.
      </h2>
      <p className={`cap ${styles.hint}`}>{hint}</p>
    </section>
  );
}
