import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function FadeInUp({ children, delay = 0, duration = 0.5, className = '' }) {
  const { pathname } = useLocation()

  return (
    <motion.div
      key={pathname}
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default FadeInUp