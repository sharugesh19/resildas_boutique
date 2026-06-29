import React from 'react'
import { motion } from 'framer-motion'

const variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * FadeInUp — wraps any content with a scroll-triggered fade + slide up.
 *
 * Props:
 *   delay     {number}  — stagger delay in seconds (default 0)
 *   duration  {number}  — animation duration in seconds (default 0.5)
 *   className {string}  — optional class on the wrapper div
 *   children  {node}
 *
 * Usage:
 *   <FadeInUp delay={0.1}>
 *     <YourComponent />
 *   </FadeInUp>
 */
function FadeInUp({ children, delay = 0, duration = 0.5, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInUp