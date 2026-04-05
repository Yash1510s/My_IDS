import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Packet } from './Packet'

const PACKET_SPEED_MS = 5000
const SPAWN_INTERVAL_MS = 600

function createPacket() {
  const isAttack = Math.random() < 0.35
  return {
    id: Math.random().toString(36).slice(2),
    isAttack,
    createdAt: performance.now(),
  }
}

export function SimulationArea({ isRunning, adversarial, packetRate, attackRatio, threshold, hardened, onStats }) {
  const [packets, setPackets] = useState([])
  const timerRef = useRef(null)
  const areaRef = useRef(null)
  const [idsFlash, setIdsFlash] = useState(null)

  // Helper to call backend for prediction/ground truth
  async function requestPrediction(isAdversarial) {
    try {
      const baseUrl = import.meta.env.PROD ? '/_backend' : 'http://localhost:5000'
      const url = isAdversarial ? `${baseUrl}/predict_adversarial` : `${baseUrl}/predict`
      const method = isAdversarial ? 'POST' : 'GET'
      const body = isAdversarial ? JSON.stringify({ features: generatePacketFeatures() }) : undefined
      
      const res = await fetch(url, {
        method,
        headers: isAdversarial ? { 'Content-Type': 'application/json' } : undefined,
        body
      })
      const json = await res.json()
      
      if (json.error) {
        throw new Error(json.error)
      }
      
      // Expecting { prediction: 0|1, actual_label: 0|1, confidence: number }
      return { 
        prediction: Number(json.prediction), 
        actual: Number(json.actual_label),
        confidence: Number(json.confidence) || 0.5
      }
    } catch (e) {
      console.warn('Backend not available, using simulation:', e)
      // Fallback if backend unavailable
      const actual = Math.random() < attackRatio / 100 ? 1 : 0
      // Simulate a simple classifier affected by adversarial toggle
      const baseScore = actual ? 0.8 : 0.2
      const advShift = isAdversarial && actual ? -0.3 : 0
      const score = baseScore + advShift + (Math.random() - 0.5) * 0.2
      const prediction = score >= threshold / 100 ? 1 : 0
      return { 
        prediction, 
        actual,
        confidence: Math.random() * 0.4 + 0.6
      }
    }
  }

  // Generate packet features for adversarial attacks
  function generatePacketFeatures() {
    return Array.from({ length: 41 }, () => Math.random())
  }

  useEffect(() => {
    if (!isRunning) return
    const intervalMs = Math.max(250, Math.round(1000 / Math.max(0.5, packetRate)))
    timerRef.current = setInterval(() => {
      const id = Math.random().toString(36).slice(2)
      const newPacket = {
        id,
        y: Math.random() * 280 + 20,
        createdAt: performance.now(),
        actual: null,
        predicted: null,
      }
      setPackets((prev) => [...prev, newPacket])
      // Kick off backend decision immediately so visuals can know disguise
      requestPrediction(adversarial).then((res) => {
        setPackets((prev) => {
          const updated = prev.map((p) => (p.id === id ? { ...p, actual: res.actual, predicted: res.prediction } : p))
          return updated
        })
      })
    }, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [isRunning, packetRate, adversarial, threshold, attackRatio])

  // clear packets when simulation stops
  useEffect(() => {
    if (!isRunning) setPackets([])
  }, [isRunning])

  const handleReachIDS = (id) => {
    const p = packets.find((x) => x.id === id)
    if (!p) return
    // If backend result not ready yet, mark as reached and wait
    if (p.predicted == null || p.actual == null) {
      p._reached = true
      return
    }
    const prediction = p.predicted // 1=attack, 0=benign
    const actual = p.actual // 1=attack, 0=benign
    const allowed = prediction === 0

    if (actual === 1) {
      if (allowed) {
        setIdsFlash('green')
        onStats({ scanned: 1, attacksSlipped: 1, cm: { fn: 1 } })
      } else {
        setIdsFlash('red')
        onStats({ scanned: 1, attacksBlocked: 1, cm: { tp: 1 } })
        setPackets((prev) => prev.filter((x) => x.id !== id))
        return
      }
    } else {
      if (allowed) {
        setIdsFlash('green')
        onStats({ scanned: 1, benignPassed: 1, cm: { tn: 1 } })
      } else {
        setIdsFlash('red')
        onStats({ scanned: 1, cm: { fp: 1 } })
        setPackets((prev) => prev.filter((x) => x.id !== id))
        return
      }
    }
    // reset flash shortly after
    setTimeout(() => setIdsFlash(null), 180)
  }

  const containerWidth = areaRef.current?.clientWidth || 0

  return (
    <div ref={areaRef} className="relative h-[360px] overflow-hidden rounded-lg border border-black/10 bg-gradient-to-b from-gray-50 to-white dark:border-white/10 dark:from-gray-800/60 dark:to-gray-900">
      {/* Source area */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/10 px-2 py-1 text-xs text-gray-600 dark:bg-black/30 dark:text-gray-300">Source</div>

      {/* IDS node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`rounded-xl border px-6 py-3 text-center shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-colors duration-150 ${idsFlash === 'green' ? 'border-emerald-400/60 bg-emerald-500/20' : idsFlash === 'red' ? 'border-rose-400/60 bg-rose-500/20' : 'border-indigo-400/30 bg-indigo-500/10 dark:bg-indigo-500/20'}`}>
          <div className="text-sm font-medium">IDS</div>
          <div className="text-xs text-gray-600 dark:text-gray-300">Model Inference</div>
        </div>
      </div>

      {/* Destination area */}
      <div className="pointer-events-none absolute right-3 bottom-3 rounded-md bg-black/10 px-2 py-1 text-xs text-gray-600 dark:bg-black/30 dark:text-gray-300">Destination</div>

      {/* Packets */}
      <AnimatePresence initial={false}>
        {packets.map((p) => {
          const y = p.y
          const disguised = adversarial && p.actual === 1
          return (
            <Packet
              key={p.id}
              id={p.id}
              isAttack={p.actual === 1}
              disguised={disguised}
              y={y}
              containerWidth={containerWidth}
              onReachIDS={handleReachIDS}
              onExit={(id) => setPackets((prev) => prev.filter((x) => x.id !== id))}
            />
          )
        })}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute left-3 bottom-3 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" /> Benign ✓</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500" /> Attack ⚠️</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full ring-2 ring-fuchsia-400" /> Disguised (Adversarial)</span>
      </div>
    </div>
  )
}


