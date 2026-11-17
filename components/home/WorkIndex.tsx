"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { getSpecs } from "@/lib/specs";
import { useFrame } from "@/hooks/useFrame";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import pill from "@/components/ui/Pill.module.css";
import styles from "./WorkIndex.module.css";

/** The list of projects. Rows expand for details; on desktop a pack photo follows the mouse. */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const previewOn = fine && !reduced;
  const [preview, setPreview] = useState<{ show: boolean; image: string }>({ show: false, image: "" });
  const previewEl = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useFrame(
    (_t, dt) => {
      const p = pos.current;
      const k = Math.min(1, dt * 14);
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      if (previewEl.current) previewEl.current.style.translate = `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`;
    },
    previewOn
  );

  const onMove = (e: React.PointerEvent) => {
    if (!previewOn) return;
    const entry = (e.target as Element).closest<HTMLDetailsElement>("details[data-image]");
    if (e.pointerType === "mouse" && entry && !entry.open) {
      const p = pos.current;
      p.tx = e.clientX;
      p.ty = e.clientY;
      if (!preview.show) {
        p.x = p.tx;
        p.y = p.ty;
      }
      const image = entry.dataset.image!;
      if (!preview.show || preview.image !== image) setPreview({ show: true, image });
    } else if (preview.show) {
      setPreview((v) => ({ ...v, show: false }));
    }
  };

  return (
    <section className={`wrap ${styles.index}`} id="index" aria-label="Work index">
      <div className={`cap ${styles.head}`} data-reveal="">
        <span>Project</span>
        <span>Service</span>
        <span>Format</span>
        <span>Client</span>
      </div>
      <div onPointerMove={onMove} onPointerLeave={() => preview.show && setPreview((v) => ({ ...v, show: false }))}>
        {projects.map((p) => (
          <details
            key={p.slug}
            className={styles.entry}
            data-image={p.images[0]}
            data-reveal=""
            style={{ "--bd": p.accent } as React.CSSProperties}
          >
            <summary>
              <b>{p.name}</b>
              <span>{p.category}</span>
              <span>{p.format}</span>
              <span>{p.client}</span>
            </summary>
            <div className={styles.more}>
              <p>{p.summary}</p>
              <dl>
                {getSpecs(p).map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </details>
        ))}
      </div>
      <p className={styles.all}>
        <Link className={pill.pill} href="/work" scroll={false}>
          View all products
        </Link>
      </p>

      {previewOn &&
        createPortal(
          <div
            ref={previewEl}
            className={`${styles.preview} ${preview.show ? styles.show : ""}`}
            style={preview.image ? { backgroundImage: `url(${preview.image})` } : undefined}
            aria-hidden="true"
          />,
          document.body
        )}
    </section>
  );
}
