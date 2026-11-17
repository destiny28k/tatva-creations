"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { clamp, pad2 } from "@/lib/motion";
import { useFrame } from "@/hooks/useFrame";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import styles from "./FlatToFinished.module.css";

export type FoldStep = { title: string; text: string };

type Props = {
  steps: FoldStep[];
  /** Photo of the real finished piece, shown at the end. */
  photo: string;
  photoCaption: string;
  photoHref: string;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Eased progress of the part of the scroll between a and b. */
const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a), 0, 1));

/** How far each part has moved for a given scroll progress p (0 to 1). */
function phases(p: number) {
  return {
    art: seg(p, 0.1, 0.28), // the print appears on the flat sheet
    fb: seg(p, 0.28, 0.48), // back panel folds up
    fw: seg(p, 0.44, 0.62), // wings fold in
    fl: seg(p, 0.56, 0.7), // front lip folds up
    cam: seg(p, 0.62, 0.8), // the view turns to face the display
    ph: seg(p, 0.84, 0.96), // the real piece fades in
  };
}
const stepFor = (p: number) => (p < 0.28 ? 0 : p < 0.48 ? 1 : p < 0.7 ? 2 : 3);

/**
 * Paper engineering, shown in motion: a flat die-cut sheet with fold lines gets printed,
 * folds into a counter display as the page scrolls, then hands over to a photo of the real piece.
 */
export default function FlatToFinished({ steps, photo, photoCaption, photoHref }: Props) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(3);
  const [photoLive, setPhotoLive] = useState(false);

  useFrame(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const r = section.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    const p = span > 0 ? clamp(-r.top / span, 0, 1) : 0;
    Object.entries(phases(p)).forEach(([k, v]) => stage.style.setProperty(`--${k}`, v.toFixed(4)));
    const s = stepFor(p);
    setStep((prev) => (prev === s ? prev : s));
    const live = p > 0.9;
    setPhotoLive((prev) => (prev === live ? prev : live));
  }, !reduced);

  // Without motion: show the assembled display, no pinning.
  const restVars = { "--art": 1, "--fb": 1, "--fw": 1, "--fl": 1, "--cam": 1, "--ph": 0 } as React.CSSProperties;

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${reduced ? styles.static : styles.pinned}`}
      id="paper-engineering"
      aria-label="Paper engineering: from a flat sheet to a finished display"
    >
      <div className={styles.pin}>
        <div className={styles.text}>
          <p className="cap">Paper engineering</p>
          <h2>Flat to finished.</h2>
          <p className={styles.lead}>
            Every standee, pop-up and counter display starts as one flat, die-cut sheet. Scroll to watch it become a display that stands on its own.
          </p>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.title} className={i === step ? styles.on : undefined}>
                <span className={styles.n}>{pad2(i + 1)}</span>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div ref={stageRef} className={styles.stage} style={reduced ? restVars : undefined}>
          <div className={styles.model} aria-hidden="true">
            <div className={styles.table}>
              <div className={styles.shadow} />
              <div className={`${styles.panel} ${styles.base}`}>
                <div className={`${styles.face} ${styles.board}`} />
                <div className={`${styles.face} ${styles.art}`}>
                  <span className={styles.slot} />
                  <span className={styles.slot} />
                </div>
                <div className={`${styles.face} ${styles.cut}`} />
                <span className={`${styles.fold} ${styles.foldTop}`} />
                <span className={`${styles.fold} ${styles.foldBottom}`} />
                <span className={styles.tag}>Base</span>

                <div className={`${styles.panel} ${styles.back}`}>
                  <div className={`${styles.face} ${styles.board}`} />
                  <div className={`${styles.face} ${styles.art}`}>
                    <small>Introducing</small>
                    <strong>New launch</strong>
                    <em>Paper engineered by Tatva</em>
                  </div>
                  <div className={`${styles.face} ${styles.cut}`} />
                  <span className={`${styles.fold} ${styles.foldLeft}`} style={{ top: "36%" }} />
                  <span className={`${styles.fold} ${styles.foldRight}`} style={{ top: "36%" }} />
                  <span className={styles.tag}>Header panel</span>

                  <div className={`${styles.panel} ${styles.wing} ${styles.wingL}`}>
                    <div className={`${styles.face} ${styles.board}`} />
                    <div className={`${styles.face} ${styles.art}`} />
                    <div className={`${styles.face} ${styles.cut}`} />
                    <span className={styles.tag}>Wing</span>
                  </div>
                  <div className={`${styles.panel} ${styles.wing} ${styles.wingR}`}>
                    <div className={`${styles.face} ${styles.board}`} />
                    <div className={`${styles.face} ${styles.art}`} />
                    <div className={`${styles.face} ${styles.cut}`} />
                    <span className={styles.tag}>Wing</span>
                  </div>
                </div>

                <div className={`${styles.panel} ${styles.lip}`}>
                  <div className={`${styles.face} ${styles.board}`} />
                  <div className={`${styles.face} ${styles.art}`}>Pick one up</div>
                  <div className={`${styles.face} ${styles.cut}`} />
                  <span className={styles.tag}>Lip</span>
                </div>
              </div>
            </div>
          </div>

          {!reduced && (
            <div className={`${styles.photo} ${photoLive ? styles.live : ""}`}>
              <div className={styles.img} style={{ backgroundImage: `url(${photo})` }} role="img" aria-label={photoCaption} data-protect="" />
              <p className="cap">
                The real thing: {photoCaption} &middot;{" "}
                <Link href={photoHref} scroll={false} tabIndex={photoLive ? undefined : -1}>
                  See the project
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
