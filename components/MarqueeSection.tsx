import { content } from "@/lib/content";

const PHRASE = `${content.groomName} & ${content.brideName} ✦ ${content.eventDateDisplay} ✦ `;

export default function MarqueeSection() {
  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-[var(--color-gold-soft)] py-6"
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, i) => (
          <span
            key={i}
            className="marquee-text px-4 font-serif text-3xl italic text-transparent sm:text-4xl"
          >
            {PHRASE.repeat(4)}
          </span>
        ))}
      </div>
    </section>
  );
}
