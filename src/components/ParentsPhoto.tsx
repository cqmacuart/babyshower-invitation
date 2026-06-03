'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface ParentsPhotoProps {
  parentA: string
  parentB: string
}

export function ParentsPhoto({ parentA, parentB }: ParentsPhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex justify-center py-8 px-4"
    >
      <motion.div
        whileHover={{ scale: 1.04, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white p-4 pb-12 shadow-lg relative"
        style={{ rotate: '-2deg', maxWidth: '280px', width: '100%' }}
      >
        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
          <Image
            src="/images/parents.jpg"
            alt={`${parentA} y ${parentB}`}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        </div>
        <p
          className="text-center mt-3 text-sm"
          style={{ fontFamily: 'var(--font-serif)', color: '#4A3F6B' }}
        >
          {parentA} &amp; {parentB}
        </p>
      </motion.div>
    </motion.div>
  )
}
