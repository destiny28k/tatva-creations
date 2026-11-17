"use client";

import { useEffect, useState } from "react";
import { STUDIO_NAME } from "@/lib/content";
import { hasIntroPlayed, markIntroPlayed } from "@/lib/navigation";
import styles from "./Intro.module.css";

/** The studio name alone on white, then it fades to reveal the wall. Plays once per visit. */
export default function Intro() {
  const [show] = useState(() => !hasIntroPlayed());
  useEffect(() => markIntroPlayed(), []);
  if (!show) return null;
  return (
    <div className={styles.intro} aria-hidden="true">
      <b>{STUDIO_NAME}</b>
    </div>
  );
}
