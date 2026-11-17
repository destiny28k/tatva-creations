import Image from "next/image";
import { CLIENTS, STATS } from "@/lib/content";
import StatsCounter from "./StatsCounter";
import styles from "./Proof.module.css";

/** Client logos and headline numbers. */
export default function Proof() {
  return (
    <section className={`wrap ${styles.proof}`} aria-label="Clients and numbers">
      <p className={`cap ${styles.label}`} data-reveal="">Trusted by</p>
      <div className={styles.logos} data-reveal="">
        {CLIENTS.map((c) => (
          <span key={c.name} className={styles.logo} title={c.name}>
            <Image src={c.logo} alt={c.name} width={c.width} height={c.height} sizes="(max-width: 600px) 110px, 190px" draggable={false} />
          </span>
        ))}
      </div>
      <StatsCounter className={styles.stats} statClass={styles.stat} stats={STATS} />
    </section>
  );
}
