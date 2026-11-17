import type { Reason } from "@/lib/types";
import { pad2 } from "@/lib/motion";
import styles from "./Manifesto.module.css";

/** "Why clients love working with us" as coloured cards that stack while scrolling. */
export default function Manifesto({ reasons }: { reasons: Reason[] }) {
  return (
    <section className={`wrap ${styles.mani}`} id="why" aria-label="Why clients love working with us">
      <div className={styles.head}>
        <p className="cap">Why Tatva</p>
        <h2>Why clients love working with us.</h2>
      </div>
      <div>
        {reasons.map((r, i) => (
          <article
            key={r.title}
            className={styles.card}
            style={{ "--c": r.background, "--t": r.color, "--k": i } as React.CSSProperties}
          >
            <p className="cap">
              {pad2(i + 1)} / {pad2(reasons.length)}
            </p>
            <div>
              <h3>{r.title}</h3>
            </div>
            <p className={styles.text}>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
