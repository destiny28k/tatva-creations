"use client";

import type { MouseEvent } from "react";
import styles from "./ProtectedImage.module.css";

type Props = {
  src: string;
  label: string;
  className?: string;
  onOpen: (e: MouseEvent<HTMLButtonElement>) => void;
};

/** A clickable, watermarked photo that is harder to save or drag out of the page. */
export default function ProtectedImage({ src, label, className, onOpen }: Props) {
  return (
    <button
      type="button"
      className={[styles.tile, styles.watermark, className].filter(Boolean).join(" ")}
      aria-label={label}
      data-protect=""
      onClick={onOpen}
    >
      <span className={styles.img} style={{ backgroundImage: `url(${src})` }} />
    </button>
  );
}

export const watermarkClass = styles.watermark;
