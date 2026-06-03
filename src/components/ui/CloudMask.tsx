'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface CloudMaskProps {
  isVisible: boolean
}

export function CloudMask({ isVisible }: CloudMaskProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="cloud-clip">
                <rect x="0" y="0" width="100" height="88" />
                {/* Cloud bumps along the bottom edge */}
                <circle cx="10" cy="88" r="6" />
                <circle cx="22" cy="90" r="8" />
                <circle cx="35" cy="88" r="7" />
                <circle cx="48" cy="91" r="9" />
                <circle cx="62" cy="88" r="7" />
                <circle cx="75" cy="90" r="8" />
                <circle cx="88" cy="88" r="6" />
                <circle cx="97" cy="90" r="5" />
              </clipPath>
            </defs>
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="white"
              clipPath="url(#cloud-clip)"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
