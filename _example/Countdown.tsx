import { useEffect, useState } from "react";

export function Countdown({ targetIso }: { targetIso: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1000);

  const cells: Array<[number, string, string]> = [
    [days, "Días", "bg-butter"],
    [hours, "Horas", "bg-mint"],
    [mins, "Min", "bg-lilac-soft/60"],
    [secs, "Seg", "bg-peach"],
  ];

  return (
    <div className="confetti-bg rounded-[2.5rem] border-b-4 border-soft-pink bg-white p-7 text-center shadow-xl shadow-soft-pink/20">
      <h3 className="mb-6 font-display text-lg text-ink-soft">
        Faltan...
      </h3>
      <div className="flex justify-center gap-3">
        {cells.map(([val, label, bg]) => (
          <div key={label} className="flex flex-col items-center">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg} font-display text-2xl text-ink shadow-inner`}
            >
              {String(val).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-tight text-ink-soft">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
