/** Тройная стрелка вниз — подсказка, что ниже есть продолжение. */
export default function ScrollCue({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`scroll-cue flex flex-col items-center ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 12"
          className="scroll-cue-chevron -mt-[10px] h-[21px] w-[42px] first:mt-0"
          style={{ animationDelay: `${i * 0.18}s` }}
        >
          <path
            d="M2 2 L12 10 L22 2"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
