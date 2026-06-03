'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

interface CloudMaskProps {
  isVisible: boolean
}

export function CloudMask({ isVisible }: CloudMaskProps) {
  // Generate a set of clouds that will cover the screen and then part asynchronously
  const clouds = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => {
      const isLeftSide = i < 9
      return {
        id: i,
        width: 300 + Math.random() * 200, // Large enough to overlap
        height: 200 + Math.random() * 150,
        top: `${(i % 6) * 20 - 10}%`,
        left: isLeftSide ? `${Math.random() * 40}%` : `${60 + Math.random() * 40}%`,
        exitX: isLeftSide ? '-150%' : '150%',
        exitY: `${(Math.random() - 0.5) * 40}%`,
        duration: 1.4 + Math.random() * 0.8,
        delay: Math.random() * 0.5,
        rotation: (Math.random() - 0.5) * 20,
      }
    })
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          exit={{ opacity: 0, transition: { delay: 1.8 } }}
        >
          {/* Background filler to ensure total opacity at start */}
          <motion.div
            className="absolute inset-0 bg-white"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* Individual clouds parting asynchronously */}
          {clouds.map((c) => (
            <motion.div
              key={c.id}
              className="absolute bg-white rounded-full shadow-[0_0_80px_white]"
              style={{
                width: `${c.width}px`,
                height: `${c.height}px`,
                top: c.top,
                left: c.left,
                rotate: c.rotation,
                x: '-50%',
                y: '-50%',
              }}
              initial={{ scale: 1, opacity: 1 }}
              exit={{
                x: c.exitX,
                y: c.exitY,
                scale: 1.1,
                opacity: 0.8,
              }}
              transition={{
                duration: c.duration,
                ease: [0.4, 0, 0.2, 1], // Sharp but smooth reveal
                delay: c.delay,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
