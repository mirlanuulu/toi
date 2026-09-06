import Divider from "@/components/ui/Divider";

/**
 * Опциональная секция (см. SPEC.md, раздел 3 и 5).
 * Не подключена в app/page.tsx по умолчанию — добавить в сборку,
 * если клиенту нужна программа дня.
 */
export default function ScheduleSection() {
  const items = [
    { time: "00:00", label: "Сбор гостей" },
    { time: "00:00", label: "Той-башталуу" },
    { time: "00:00", label: "Той-бешик / поздравления" },
  ];

  return (
    <section className="flex flex-col items-center gap-8 px-6 py-24">
      <h2 className="font-serif text-2xl text-[var(--color-text)] sm:text-3xl">
        Программа дня
      </h2>
      <Divider />

      <ol className="flex w-full max-w-sm flex-col gap-5">
        {items.map((item) => (
          <li key={item.label} className="flex items-baseline gap-4">
            <span className="font-serif text-lg text-[var(--color-gold)]">{item.time}</span>
            <span className="text-[var(--color-text)]">{item.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
