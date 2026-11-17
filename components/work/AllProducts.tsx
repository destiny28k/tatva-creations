"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/types";
import { STUDIO_NAME } from "@/lib/content";
import { setFlight } from "@/lib/navigation";
import { useOverlay } from "@/hooks/useOverlay";
import BackButton from "@/components/ui/BackButton";
import ProtectedImage from "@/components/ui/ProtectedImage";
import pill from "@/components/ui/Pill.module.css";
import styles from "./AllProducts.module.css";

type Props = {
  projects: Project[];
  /** "overlay" when opened from inside the site, "page" for a direct visit to /work. */
  variant: "overlay" | "page";
};

/** Every product with all four photos, filterable by category. Images are watermarked. */
export default function AllProducts({ projects, variant }: Props) {
  const router = useRouter();
  const isOverlay = variant === "overlay";
  const backRef = useRef<HTMLButtonElement>(null);
  const [category, setCategory] = useState("All");

  useOverlay(isOverlay, backRef);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const shown = projects.filter((p) => category === "All" || p.category === category);

  const open = (p: Project, n: number, tile: HTMLElement) => {
    setFlight({ rect: tile.getBoundingClientRect(), image: p.images[n], view: n });
    router.push(`/work/${p.slug}`, { scroll: false });
  };

  return (
    <div
      className={`${styles.all} ${isOverlay ? styles.overlay : ""}`}
      role={isOverlay ? "dialog" : undefined}
      aria-modal={isOverlay || undefined}
      aria-labelledby="all-title"
    >
      {isOverlay ? (
        <button ref={backRef} type="button" className={`${pill.pill} ${pill.back}`} onClick={() => router.back()}>
          Back to home
        </button>
      ) : (
        <BackButton ref={backRef}>Back to home</BackButton>
      )}
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.head}>
          <p className={`cap ${styles.crumb}`}>Work / All products</p>
          <h1 id="all-title">All products</h1>
          <p className={styles.notice}>
            &copy; {STUDIO_NAME}. Every design on this page is protected by copyright. Images are watermarked and may not be copied,
            downloaded or reproduced without written permission.
          </p>
          <div className={styles.filters} role="group" aria-label="Filter by category">
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={c === category} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.groups}>
          {shown.map((p) => (
            <section key={p.slug} className={styles.group}>
              <header>
                <h2>{p.name}</h2>
                <span className="cap">
                  {p.category} · {p.format}
                </span>
              </header>
              <div className={styles.grid}>
                {p.images.map((src, n) => (
                  <ProtectedImage
                    key={src}
                    src={src}
                    label={`${p.name}, image ${n + 1}. Open project`}
                    onOpen={(e) => open(p, n, e.currentTarget)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
