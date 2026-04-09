import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export function SectionReveal({ children, className = '', once = true, margin = '-10% 0px -10% 0px' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
