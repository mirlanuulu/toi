export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-10 bg-[var(--color-gold)]" />
      <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)]" />
      <span className="h-px w-10 bg-[var(--color-gold)]" />
    </div>
  );
}
