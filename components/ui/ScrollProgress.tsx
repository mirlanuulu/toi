"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsapConfig";

/** Тонкая золотая линия прогресса чтения вверху экрана. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const bar = barRef.current;
    if (!bar) return;

    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-transparent"
    >
      <div ref={barRef} className="h-full w-full bg-[var(--color-gold)]" />
    </div>
  );
}
