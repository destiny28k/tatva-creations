import Image from "next/image";
import Link from "next/link";
import { STUDIO_FULL_NAME } from "@/lib/content";
import pill from "@/components/ui/Pill.module.css";
import styles from "./SiteHeader.module.css";

/** Sits over the hero wall. data-no-drag keeps clicks here from dragging the wall. */
export default function SiteHeader() {
  return (
    <header className={styles.top} data-no-drag="">
      <div className={styles.inner}>
        <a className={styles.logo} href="#wall" aria-label={`${STUDIO_FULL_NAME}, back to top`}>
          <Image src="/tatva/logo.png" alt={STUDIO_FULL_NAME} width={1045} height={305} sizes="160px" priority draggable={false} />
        </a>
        <nav className={styles.nav} aria-label="Main">
          <a href="#index">Work</a>
          <Link href="/work" scroll={false}>All products</Link>
          <a href="#studio">About</a>
          <a href="#services">Services</a>
        </nav>
        <a className={`${pill.pill} ${styles.cta}`} href="#brief">Start a project</a>
      </div>
    </header>
  );
}
