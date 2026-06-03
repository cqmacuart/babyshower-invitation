'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useMemo } from 'react'

export function CloudsBackground() {
  const { scrollYProgress } = useScroll()

  // Parallax offsets for different layers
  const drift1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const drift2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const drift3 = useTransform(scrollYProgress, [0, 1], [0, -50])

  // Generate random configurations for background clouds to avoid "the line" look
  const backgroundClouds = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      top: `${Math.random() * 100}%`,
      duration: 60 + Math.random() * 120,
      opacity: 0.15 + Math.random() * 0.25,
      size: 140 + Math.random() * 120,
      delay: Math.random() * -180, // Negative delay to start at different points in the animation
    }))
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden overflow-y-hidden">
      {/* Layer 1: Far background - chaotic infinite drift (Left to Right) + Scroll Parallax */}
      <motion.div style={{ y: drift1 }} className="absolute inset-0">
        {backgroundClouds.map((c, i) => (
          <InfiniteCloud key={i} {...c} />
        ))}
      </motion.div>

      {/* Layer 2: Middle background - subtle bobbing + Scroll Parallax */}
      <motion.div style={{ y: drift2 }} className="absolute inset-0">
        <FloatingCloud className="absolute top-[15%] -left-12 w-44 opacity-60" delay={0} />
        <FloatingCloud className="absolute top-[40%] -right-16 w-60 opacity-40" delay={-4} />
        <FloatingCloud className="absolute top-[65%] left-1/4 w-48 opacity-50" delay={-8} />
        <FloatingCloud className="absolute top-[90%] right-[10%] w-40 opacity-45" delay={-12} />
      </motion.div>

      {/* Layer 3: Interactive/Foreground - sparkles + Scroll Parallax */}
      <motion.div style={{ y: drift3 }} className="absolute inset-0">
        <Sparkles />
      </motion.div>
    </div>
  )
}

function InfiniteCloud({
  top,
  duration,
  opacity,
  size,
  delay,
}: {
  top: string
  duration: number
  opacity: number
  size: number
  delay: number
}) {
  return (
    <motion.div
      className="absolute"
      style={{ top, opacity, width: size }}
      initial={{ x: '-120%' }}
      animate={{ x: '110vw' }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
    >
      <PremiumCloudSVG />
    </motion.div>
  )
}

function FloatingCloud({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        x: [0, 50, 0],
        y: [0, -25, 0],
        rotate: [-1.5, 1.5, -1.5],
      }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <PremiumCloudSVG />
    </motion.div>
  )
}

function PremiumCloudSVG() {
  return (
    <svg viewBox="0 0 200 100" fill="white" className="drop-shadow-sm">
      <defs>
        <radialGradient id="cloudGrad" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#FFF1F2" />
        </radialGradient>
      </defs>
      <path
        d="M25,60 C25,40 45,35 60,35 C65,20 85,15 105,25 C120,15 145,20 155,40 C175,40 185,60 170,75 C160,85 140,85 125,80 C110,90 80,90 65,80 C45,85 25,80 25,60 Z"
        fill="url(#cloudGrad)"
      />
    </svg>
  )
}

function Sparkles() {
  const points = [
    { top: '15%', left: '12%', delay: 0 },
    { top: '32%', right: '15%', delay: 1.5 },
    { top: '55%', left: '20%', delay: 0.8 },
    { top: '78%', right: '12%', delay: 2.5 },
    { top: '92%', left: '45%', delay: 1.9 },
    { top: '22%', right: '35%', delay: 3.2 },
    { top: '65%', left: '75%', delay: 0.2 },
  ]

  return (
    <>
      {points.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-butter/60 blur-[1px]"
          style={{ top: p.top, left: (p as any).left, right: (p as any).right }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  )
}
