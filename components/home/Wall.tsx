"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { STUDIO_NAME } from "@/lib/content";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { hasIntroPlayed, setFlight } from "@/lib/navigation";
import { useFrame } from "@/hooks/useFrame";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./Wall.module.css";

type Props = {
  /** Rows of tiles, each row shown twice so it can loop. A tile is a project and which of its photos to show. */
  rows: WallTile[][];
  /** Position of each project in the full list, used to stagger the entrance. */
  order: Record<string, number>;
  header: ReactNode;
};

export type WallTile = { project: Project; image: number };

type Row = { x: number; speed: number; half: number };
type Drag = { x: number; moved: number; tile: HTMLElement | null };

/** The hero: rows of pack shots that drift, can be dragged, react to scroll, and open a project on tap. */
export default function Wall({ rows, order, header }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mastRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowState = useRef<Row[]>(rows.map((_, r) => ({ x: r * 140, speed: (r % 2 ? -1 : 1) * (16 + r * 5), half: 1 })));
  const drag = useRef<Drag | null>(null);
  const hovering = useRef(false);
  const still = useRef(false);

  const [entrance] = useState(() => !hasIntroPlayed());
  const [dragging, setDragging] = useState(false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [pointer, setPointer] = useState({ over: false, label: "Drag" });
  const cursorEl = useRef<HTMLDivElement>(null);
  const cursorPos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const onHome = pathname === "/";
  // The custom cursor is for mouse users who allow motion, and hides while an overlay is open.
  const cursorEnabled = fine && !reduced;
  const cursorShown = cursorEnabled && pointer.over && onHome;

  const place = () => {
    rowState.current.forEach((r, i) => {
      r.x = ((r.x % r.half) + r.half) % r.half;
      const el = rowRefs.current[i];
      if (el) el.style.transform = `translate3d(${(-r.x).toFixed(1)}px,0,0)`;
    });
  };

  const open = (tile: HTMLElement, withRect: boolean) => {
    const slug = tile.dataset.slug!;
    const photo = tile.querySelector<HTMLElement>("[data-photo]");
    const view = Number(tile.dataset.view ?? 0);
    setFlight(withRect && photo ? { rect: photo.getBoundingClientRect(), image: tile.dataset.image!, view } : null);
    router.push(`/work/${slug}`, { scroll: false });
  };

  // Measure the rows, and wire up dragging.
  useEffect(() => {
    still.current = prefersReducedMotion();
    const measure = () => {
      rowState.current.forEach((r, i) => {
        r.half = Math.max(1, (rowRefs.current[i]?.scrollWidth ?? 2) / 2);
      });
      place();
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);

    const onMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      d.x = e.clientX;
      d.moved += Math.abs(dx);
      rowState.current.forEach((r) => (r.x -= dx));
    };
    const onUp = () => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      setDragging(false);
      if (d.moved < 6 && d.tile) open(d.tile, true);
    };
    const onCancel = () => {
      drag.current = null;
      setDragging(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
    // open() only uses the router, which is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_t, dt, scroll) => {
    const isStill = still.current;
    if (!isStill && !hovering.current && !drag.current && onHome) rowState.current.forEach((r) => (r.x += r.speed * dt));
    place();
    if (!isStill) {
      // Lean the wall back and speed it up as the page scrolls.
      const hero = heroRef.current;
      const hp = clamp(scroll.y / (hero?.offsetHeight || 1), 0, 1);
      if (stageRef.current) stageRef.current.style.transform = `perspective(1600px) rotateX(${(5 + hp * 11).toFixed(2)}deg) scale(${(1.06 + hp * 0.1).toFixed(3)})`;
      if (mastRef.current) mastRef.current.style.transform = `translate(-50%, calc(-50% + ${(hp * 70).toFixed(1)}px))`;
      const boost = Math.min(900, Math.abs(scroll.vel) * 0.5);
      rowState.current.forEach((r) => (r.x += Math.sign(r.speed) * boost * dt));
    }
    if (cursorEnabled && cursorEl.current) {
      const c = cursorPos.current;
      const k = Math.min(1, dt * 14);
      c.x += (c.tx - c.x) * k;
      c.y += (c.ty - c.y) * k;
      cursorEl.current.style.translate = `${c.x.toFixed(1)}px ${c.y.toFixed(1)}px`;
    }
  });

  const onPointerMove = (e: React.PointerEvent) => {
    if (!cursorEnabled || e.pointerType !== "mouse") return;
    const target = e.target as Element;
    const over = !target.closest("[data-no-drag]");
    const c = cursorPos.current;
    c.tx = e.clientX;
    c.ty = e.clientY;
    if (over && !cursorShown) {
      c.x = c.tx;
      c.y = c.ty;
    }
    const label = !drag.current && target.closest("[data-slug]") ? "View" : "Drag";
    if (over !== pointer.over || label !== pointer.label) setPointer({ over, label });
  };

  const classes = [styles.hero, entrance && styles.entrance, dragging && styles.dragging, cursorShown && styles.cursorOn].filter(Boolean).join(" ");

  return (
    <section
      ref={heroRef}
      className={classes}
      id="wall"
      aria-label="Wall of packaging work"
      onPointerDown={(e) => {
        if ((e.target as Element).closest("[data-no-drag]")) return;
        drag.current = { x: e.clientX, moved: 0, tile: (e.target as Element).closest<HTMLElement>("[data-slug]") };
        setDragging(true);
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => pointer.over && setPointer((p) => ({ ...p, over: false }))}
    >
      {header}

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerOver={(e) => {
          if (e.pointerType === "mouse" && (e.target as Element).closest("[data-slug]")) hovering.current = true;
        }}
        onPointerOut={() => (hovering.current = false)}
      >
        {rows.map((row, r) => (
          <div
            key={r}
            ref={(el) => {
              rowRefs.current[r] = el;
            }}
            className={styles.row}
            style={{ transform: `translate3d(${-r * 140}px,0,0)` }}
          >
            {[0, 1].flatMap((copy) =>
              row.map(({ project: p, image }, t) => (
                <button
                  key={`${copy}-${t}`}
                  type="button"
                  className={styles.tile}
                  data-slug={p.slug}
                  data-image={p.images[image]}
                  data-view={image}
                  data-protect=""
                  style={{ "--bd": p.backdrop, "--i": order[p.slug] + r * 2 } as React.CSSProperties}
                  tabIndex={copy ? -1 : undefined}
                  aria-hidden={copy ? true : undefined}
                  aria-label={copy ? undefined : `${p.name}, ${p.category}. Show details`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      open(e.currentTarget, false);
                    }
                  }}
                >
                  <span className={styles.photo} data-photo="">
                    <Image src={p.images[image]} alt="" fill sizes="270px" loading="eager" draggable={false} />
                  </span>
                  <span className={styles.label}>
                    {p.name} <i>&middot; {p.category}</i>
                  </span>
                </button>
              ))
            )}
          </div>
        ))}
      </div>

      <div ref={mastRef} className={styles.mast}>
        <h1>{STUDIO_NAME}</h1>
        <p className="cap">Concept &middot; Packaging &middot; Print &middot; Paper engineering &middot; Digital</p>
      </div>
      <p className={`cap ${styles.hint}`}>
        <span className={styles.mouseHint}>Drag to explore &middot; Click a project</span>
        <span className={styles.touchHint}>Swipe to explore &middot; Tap a project</span>
      </p>

      {cursorEnabled &&
        createPortal(
          <div ref={cursorEl} className={`${styles.cursor} ${cursorShown ? styles.show : ""}`} aria-hidden="true">
            {pointer.label}
          </div>,
          document.body
        )}
    </section>
  );
}
