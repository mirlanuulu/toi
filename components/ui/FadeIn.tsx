"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsapConfig";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Small reusable fade-up for minor, secondary elements (labels, captions).
 * Section-level entrances get their own bespoke GSAP timelines instead —
 * see components/HeroSection.tsx, DetailsSection.tsx, etc.
 */
export default function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        gsap.set(el, { opacity: 0, y: reduced ? 0 : 24 });

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: reduced ? 0.01 : 0.8,
              delay,
              ease: "power2.out",
            }),
        });

        return () => trigger.kill();
      },
    );

    return () => mm.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
