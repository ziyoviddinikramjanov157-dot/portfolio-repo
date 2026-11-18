import { motion } from 'motion/react'

export default function Reveal({ as = 'div', delay = 0, className, children }) {
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={{ y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
