"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { useFrame } from "@/hooks/useFrame";
import styles from "./Playground.module.css";

type Body = {
  x: number; y: number; vx: number; vy: number; a: number; va: number; s: number;
  held: boolean; ox: number; oy: number; lx: number; ly: number; lt: number;
};

/** Pack stickers floating in a box: grab one, fling it, and it bounces off the walls and the others. */
export default function Playground({ images }: { images: string[] }) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>(
    images.map((_, i) => ({ x: 0, y: 0, vx: 0, vy: 0, a: (i % 2 ? 1 : -1) * (3 + i), va: 0, s: 0, held: false, ox: 0, oy: 0, lx: 0, ly: 0, lt: 0 }))
  );
  const still = useRef(false);
  const topZ = useRef(1);
  const [visible, setVisible] = useState(false);

  const draw = (i: number) => {
    const b = bodies.current[i];
    const el = els.current[i];
    if (el) el.style.transform = `translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) rotate(${b.a.toFixed(1)}deg)`;
  };

  // Scatter the stickers, keep them inside on resize, and only animate while on screen.
  useEffect(() => {
    still.current = prefersReducedMotion();
    const arena = arenaRef.current!;
    const layout = (reset: boolean) => {
      const W = arena.clientWidth;
      const H = arena.clientHeight;
      bodies.current.forEach((b, i) => {
        b.s = els.current[i]?.offsetWidth ?? 0;
        if (reset) {
          b.x = (W - b.s) * ((i * 0.37 + 0.08) % 1);
          b.y = (H - b.s) * ((i * 0.61 + 0.15) % 1);
          b.vx = still.current ? 0 : (i % 2 ? 1 : -1) * (60 + i * 14);
          b.vy = still.current ? 0 : ((i % 3) - 1) * 70;
        }
        b.x = clamp(b.x, 0, Math.max(0, W - b.s));
        b.y = clamp(b.y, 0, Math.max(0, H - b.s));
        draw(i);
      });
    };
    layout(true);
    const onResize = () => layout(false);
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver((en) => setVisible(en[0].isIntersecting));
    io.observe(arena);
    return () => {
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  useFrame(
    (_t, dt) => {
      if (still.current || !dt) return;
      const arena = arenaRef.current;
      if (!arena) return;
      const W = arena.clientWidth;
      const H = arena.clientHeight;
      const f = Math.pow(0.45, dt);
      const list = bodies.current;
      list.forEach((b) => {
        if (b.held) return;
        b.vx *= f; b.vy *= f; b.va *= f;
        b.x += b.vx * dt; b.y += b.vy * dt; b.a += b.va * dt;
        if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.8; }
        if (b.x > W - b.s) { b.x = W - b.s; b.vx = -Math.abs(b.vx) * 0.8; }
        if (b.y < 0) { b.y = 0; b.vy = Math.abs(b.vy) * 0.8; }
        if (b.y > H - b.s) { b.y = H - b.s; b.vy = -Math.abs(b.vy) * 0.8; }
      });
      // Push overlapping stickers apart and trade some of their speed.
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          // Stickers hidden on small screens have no size and take no part.
          if (!a.s || !b.s) continue;
          const dx = b.x + b.s / 2 - (a.x + a.s / 2);
          const dy = b.y + b.s / 2 - (a.y + a.s / 2);
          const d = Math.hypot(dx, dy);
          const min = (a.s + b.s) * 0.47;
          if (d >= min || d < 0.01) continue;
          const nx = dx / d;
          const ny = dy / d;
          const over = min - d;
          const ma = a.held ? 0 : b.held ? 1 : 0.5;
          const mb = b.held ? 0 : a.held ? 1 : 0.5;
          a.x -= nx * over * ma; a.y -= ny * over * ma;
          b.x += nx * over * mb; b.y += ny * over * mb;
          const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rv < 0) {
            if (!a.held) { a.vx += rv * nx * 0.9; a.vy += rv * ny * 0.9; a.va += rv * 0.04; }
            if (!b.held) { b.vx -= rv * nx * 0.9; b.vy -= rv * ny * 0.9; b.va -= rv * 0.04; }
          }
        }
      }
      list.forEach((b, i) => !b.held && draw(i));
    },
    visible
  );

  const indexOf = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>("[data-sticker]");
    return el ? Number(el.dataset.sticker) : -1;
  };

  const onDown = (e: React.PointerEvent) => {
    const i = indexOf(e);
    if (i < 0) return;
    const b = bodies.current[i];
    const r = arenaRef.current!.getBoundingClientRect();
    b.held = true;
    b.ox = e.clientX - r.left - b.x;
    b.oy = e.clientY - r.top - b.y;
    b.lx = e.clientX; b.ly = e.clientY; b.lt = performance.now();
    b.vx = 0; b.vy = 0;
    const el = els.current[i]!;
    el.classList.add(styles.held);
    el.style.zIndex = String(++topZ.current);
    try { el.setPointerCapture(e.pointerId); } catch {}
    e.preventDefault();
  };

  const onMove = (e: React.PointerEvent) => {
    const i = indexOf(e);
    if (i < 0) return;
    const b = bodies.current[i];
    if (!b.held) return;
    const arena = arenaRef.current!;
    const r = arena.getBoundingClientRect();
    const now = performance.now();
    const ms = Math.max(8, now - b.lt);
    b.x = clamp(e.clientX - r.left - b.ox, 0, Math.max(0, arena.clientWidth - b.s));
    b.y = clamp(e.clientY - r.top - b.oy, 0, Math.max(0, arena.clientHeight - b.s));
    b.vx += (((e.clientX - b.lx) / ms) * 1000 - b.vx) * 0.5;
    b.vy += (((e.clientY - b.ly) / ms) * 1000 - b.vy) * 0.5;
    b.lx = e.clientX; b.ly = e.clientY; b.lt = now;
    draw(i);
  };

  const onUp = (e: React.PointerEvent) => {
    const i = indexOf(e);
    if (i < 0) return;
    const b = bodies.current[i];
    if (!b.held) return;
    b.held = false;
    els.current[i]?.classList.remove(styles.held);
    if (still.current || performance.now() - b.lt > 120) { b.vx = 0; b.vy = 0; }
    b.vx = clamp(b.vx, -2600, 2600);
    b.vy = clamp(b.vy, -2600, 2600);
    b.va = clamp(b.vx * 0.06, -160, 160);
  };

  return (
    <section className={styles.play} aria-label="Playground">
      <div className={`wrap ${styles.head}`}>
        <h2>Go on, throw them around.</h2>
        <p className="cap">Playground &middot; drag and fling a pack</p>
      </div>
      <div
        ref={arenaRef}
        className={styles.arena}
        aria-hidden="true"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {images.map((src, i) => (
          <div
            key={i}
            ref={(el) => {
              els.current[i] = el;
            }}
            className={styles.sticker}
            data-sticker={i}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </section>
  );
}
