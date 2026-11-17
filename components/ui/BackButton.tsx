"use client";

import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { cameFromSite } from "@/lib/navigation";
import pill from "./Pill.module.css";

/** Returns to where the visitor came from inside the site, or to the home page on a direct visit. */
const BackButton = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(function BackButton({ children }, ref) {
  const router = useRouter();
  return (
    <button
      ref={ref}
      type="button"
      className={`${pill.pill} ${pill.back}`}
      onClick={() => (cameFromSite() ? router.back() : router.push("/"))}
    >
      {children}
    </button>
  );
});

export default BackButton;
