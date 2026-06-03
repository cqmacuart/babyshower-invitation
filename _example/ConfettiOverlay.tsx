import { useEffect } from "react";
import confetti from "canvas-confetti";

export function ConfettiOverlay({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return;
    const colors = ["#C9A8E0", "#F6C6D0", "#BFE3D4", "#FEC8D8", "#FFF6BD"];

    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.2, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.8, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 35,
        origin: { x: 0.5, y: 0.3 },
        colors,
      });
    };

    burst();
    const t1 = setTimeout(burst, 800);
    const t2 = setTimeout(burst, 1800);
    const t3 = setTimeout(burst, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${(i * 12 + 5) % 100}%`,
            animation: `balloon-rise ${6 + (i % 4)}s linear ${i * 0.6}s infinite`,
            filter: "drop-shadow(0 4px 12px rgba(201,168,224,0.3))",
          }}
        >
          {["🎈", "🎀", "🍼", "🧸", "⭐", "🎉"][i % 6]}
        </div>
      ))}
    </div>
  );
}
