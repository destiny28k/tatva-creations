import { BRAND, CONTACT, STUDIO_FULL_NAME, STUDIO_NAME, TAGLINE } from "@/lib/content";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer>
      <div className={styles.mega} aria-hidden="true" data-reveal="">{STUDIO_NAME}</div>
      {/* The five colours of the Tatva bird, as on the company profile */}
      <div className={styles.stripe} aria-hidden="true">
        {Object.values(BRAND).map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <span>
          &copy; {STUDIO_FULL_NAME}, {CONTACT.location}. {TAGLINE}.
        </span>
        <span className={styles.links}>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </span>
      </div>
    </footer>
  );
}
