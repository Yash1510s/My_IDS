import { useRef } from 'react'
import { motion } from 'framer-motion'

export function Packet({ id, isAttack, disguised, y, containerWidth, onReachIDS, onExit }) {
  const reachedRef = useRef(false)

  const size = 18
  const endX = Math.max(0, (containerWidth || 0) - (size + 10))

  const baseColor = isAttack ? 'bg-rose-500' : 'bg-emerald-500'
  const icon = isAttack ? '⚠️' : '✓'

  return (
    <motion.div
      layoutId={id}
      initial={{ x: -size, y, opacity: 0.95, scale: 1 }}
      animate={{ x: endX, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 5, ease: 'linear' }}
      onUpdate={(latest) => {
        if (reachedRef.current) return
        if (latest.x == null) return
        const centerX = (containerWidth || 0) / 2
        // When the leading edge crosses the center, consider it at IDS
        if (latest.x + size / 2 >= centerX) {
          reachedRef.current = true
          onReachIDS?.(id)
        }
      }}
      onAnimationComplete={() => onExit?.(id)}
      className={`absolute grid place-items-center h-[${size}px] w-[${size}px] rounded-full text-[10px] ${baseColor} text-white shadow-lg`}
      style={{ y }}
    >
      {/* Disguise glow when adversarial for attacks */}
      {disguised && (
        <span
          className="absolute -inset-1 rounded-full ring-2 ring-fuchsia-400/80 animate-pulse"
          aria-hidden
        />
      )}
      <span className="relative z-[1] leading-none select-none">{icon}</span>
    </motion.div>
  )
}



