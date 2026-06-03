'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export function ConfettiOverlay({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return
    const colors = ['#C9A8E0', '#F6C6D0', '#BFE3D4', '#FEC8D8', '#FFF6BD']

    const burst = () => {
      // Left side
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.1, y: 0.7 },
        colors,
      })
      // Right side
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 45,
        origin: { x: 0.9, y: 0.7 },
        colors,
      })
      // Top center
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 30,
        origin: { x: 0.5, y: 0.2 },
        colors,
      })
    }

    burst()
    const timers = [
      setTimeout(burst, 800),
      setTimeout(burst, 1800),
      setTimeout(burst, 3000),
      setTimeout(burst, 4500),
      setTimeout(burst, 6000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [active])

  if (!active) return null

  const items = [
    '🎈', '🎀', '🍼', '🧸', '⭐', '🎉', '🌟', '🍼', '🩰', '🎠', '🍭', '🧸', '☁️', '🌈'
  ]

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {items.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${(i * 7.5 + 2) % 100}%`,
            animation: `balloon-rise ${5 + (i % 5)}s linear ${i * 0.4}s infinite`,
            filter: 'drop-shadow(0 4px 12px rgba(201,168,224,0.3))',
            opacity: 0.8,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  )
}
