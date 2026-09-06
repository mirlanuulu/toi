"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";

const PETAL_COUNT = 14;

/** Медленно опускающиеся золотые лепестки — лёгкий декор поверх всей страницы. */
export default function Petals() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const petals = root.querySelectorAll<HTMLElement>("[data-petal]");
    const tweens = Array.from(petals).map((petal, i) => {
      const startX = gsap.utils.random(0, 100);
      const drift = gsap.utils.random(-12, 12);
      const duration = gsap.utils.random(14, 26);
      const scale = gsap.utils.random(0.75, 1.6);

      gsap.set(petal, { left: `${startX}vw`, top: "-8vh", opacity: 0, scale });

      return gsap.to(petal, {
        keyframes: {
          "0%": { yPercent: 0, opacity: 0 },
          "12%": { opacity: 0.55 },
          "88%": { opacity: 0.35 },
          "100%": { yPercent: 1400, opacity: 0 },
        },
        x: `${drift}vw`,
        rotate: gsap.utils.random(-180, 180),
        duration,
        delay: i * gsap.utils.random(0.8, 2.2),
        repeat: -1,
        ease: "none",
      });
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
    >
      {Array.from({ length: PETAL_COUNT }).map((_, i) => (
        <span
          key={i}
          data-petal
          className="absolute h-4 w-3 rounded-[100%_0_100%_0] bg-[var(--color-gold)] opacity-0"
        />
      ))}
    </div>
  );
}
