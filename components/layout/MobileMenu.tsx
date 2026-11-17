"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, CONTACT } from "@/lib/content";
import styles from "./MobileMenu.module.css";

const LINKS = [
  { href: "/#index", label: "Work" },
  { href: "/work", label: "All products" },
  { href: "/#studio", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/#brief", label: "Contact" },
];

/**
 * On phones the header links don't fit, so a floating button opens a full-screen menu instead.
 * Hidden on larger screens, where the normal header is used.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when the page changes, and lock the page behind the open menu.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Project and product overlays have their own back button; keep the menu out of their way.
  if (pathname.startsWith("/work/")) return null;

  return (
    <>
      <button
        type="button"
        className={`${styles.button} ${open ? styles.open : ""}`}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.lines} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      <nav id="mobile-menu" className={`${styles.sheet} ${open ? styles.shown : ""}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
        <ul className={styles.links}>
          {LINKS.map((l, i) => (
            <li key={l.href} style={{ "--k": i } as React.CSSProperties}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
                <span>{String(i + 1).padStart(2, "0")}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.foot}>
          <Link className={styles.cta} href="/#brief" onClick={() => setOpen(false)}>
            Start a project &rarr;
          </Link>
          <div className={styles.contact}>
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.instagram} target="_blank" rel="noopener">Instagram</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          </div>
          <div className={styles.stripe} aria-hidden="true">
            {Object.values(BRAND).map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
