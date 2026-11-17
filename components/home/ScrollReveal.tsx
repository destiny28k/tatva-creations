"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Fades in every element marked data-reveal as it scrolls into view, staggered by its
 * position among its siblings. Without motion the page simply shows everything.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    document.documentElement.setAttribute("data-motion", "");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => {
      const index = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
      io.observe(el);
    });
    // Safety net: never leave content hidden.
    const timer = window.setTimeout(() => els.forEach((el) => el.classList.add("in")), 9000);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
