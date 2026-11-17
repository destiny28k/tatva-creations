"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { getSpecs } from "@/lib/specs";
import { pad2, prefersReducedMotion } from "@/lib/motion";
import { clearFlight, peekFlight } from "@/lib/navigation";
import { useOverlay } from "@/hooks/useOverlay";
import BackButton from "@/components/ui/BackButton";
import { watermarkClass } from "@/components/ui/ProtectedImage";
import pill from "@/components/ui/Pill.module.css";
import styles from "./ProjectView.module.css";


type Props = {
  project: Project;
  next: Project;
  /** "overlay" when opened from inside the site, "page" for a direct visit to the URL. */
  variant: "overlay" | "page";
};

/** One project: a photo gallery on the left, the story, specs and a quote request on the right. */
export default function ProjectView({ project, next, variant }: Props) {
  const router = useRouter();
  const isOverlay = variant === "overlay";
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [view, setView] = useState(() => Math.min(isOverlay ? peekFlight()?.view ?? 0 : 0, project.images.length - 1));
  const [sent, setSent] = useState(false);

  useOverlay(isOverlay, backRef);

  // Fade the overlay in and fly the clicked image into the gallery frame.
  useLayoutEffect(() => {
    const flight = isOverlay ? peekFlight() : null;
    clearFlight();
    const root = rootRef.current;
    const frame = frameRef.current;
    if (!flight || !root || !frame || prefersReducedMotion() || !document.body.animate) return;
    root.scrollTop = 0;
    const to = frame.getBoundingClientRect();
    const from = flight.rect;
    if (!to.width || !from.width) return;
    const ghost = document.createElement("div");
    ghost.className = styles.ghost;
    ghost.style.backgroundImage = `url(${flight.image})`;
    document.body.appendChild(ghost);
    root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: "ease-out" });
    const anim = ghost.animate(
      [
        { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
        { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` },
      ],
      { duration: 560, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    );
    anim.onfinish = () => ghost.remove();
    anim.oncancel = () => ghost.remove();
    return () => ghost.remove();
  }, [isOverlay, project.slug]);

  const close = () => router.back();

  return (
    <div
      ref={rootRef}
      className={`${styles.detail} ${isOverlay ? styles.overlay : ""}`}
      role={isOverlay ? "dialog" : undefined}
      aria-modal={isOverlay || undefined}
      aria-labelledby="project-name"
    >
      {isOverlay ? (
        <button ref={backRef} type="button" className={`${pill.pill} ${pill.back}`} onClick={close}>
          Back to wall
        </button>
      ) : (
        <BackButton ref={backRef}>Back to wall</BackButton>
      )}

      <div className={styles.grid}>
        <div className={styles.show}>
          <div
            ref={frameRef}
            className={`${styles.frame} ${watermarkClass}`}
            data-protect=""
            style={{ "--bd": project.backdrop } as React.CSSProperties}
          >
            {project.images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={i === view ? project.name : ""}
                fill
                sizes="(max-width: 860px) 90vw, 55vw"
                priority={i === view}
                loading={i === view ? undefined : "eager"}
                className={i === view ? styles.active : undefined}
                draggable={false}
              />
            ))}
          </div>
          {project.images.length > 1 && (
            <>
              <div className={styles.dots} role="group" aria-label="Photos of this project">
                {project.images.map((src, i) => (
                  <button key={src} type="button" aria-label={`Photo ${i + 1}`} aria-pressed={i === view} onClick={() => setView(i)} />
                ))}
              </div>
              <p className={`cap ${styles.count}`}>
                {pad2(view + 1)} / {pad2(project.images.length)}
              </p>
            </>
          )}
        </div>

        <div className={styles.info}>
          <p className={`cap ${styles.crumb}`}>Work / {project.client}</p>
          <h1 id="project-name">{project.name}</h1>
          <div className={styles.text}>
            <p>{project.summary}</p>
            <p>{project.story}</p>
          </div>
          <dl className={styles.spec}>
            {getSpecs(project).map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className={styles.cta}>
            <p className={`cap ${styles.status}`}>
              <i />
              <span>
                {project.category} · {project.client}
              </span>
            </p>
            <h2>Want something like this?</h2>
            <p className={styles.ctaText}>Leave your email or phone and we will get back to you with ideas and a quote.</p>
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input id="quote-contact" type="text" required placeholder="Your email or phone" aria-label="Your email or phone" autoComplete="off" />
              <button type="submit">Request a quote</button>
            </form>
            {sent && <p className={styles.sent}>Thank you. On the live site this request is sent to the studio.</p>}
          </div>
          <Link className={styles.next} href={`/work/${next.slug}`} replace scroll={false}>
            <span className="cap">Next project</span>
            <b>{next.name} &rarr;</b>
          </Link>
        </div>
      </div>
    </div>
  );
}
