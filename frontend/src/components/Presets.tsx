import { useState, useEffect } from 'react'

export function Presets({ onApply }) {
  const [active, setActive] = useState('')
  const base = "rounded-md px-3 py-1.5 text-xs font-medium transition border border-black/10 bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
  const activeCls = "ring-2 ring-indigo-400 text-indigo-200 dark:text-white"

  const apply = (name, payload) => {
    setActive(name)
    onApply(payload)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-black/10 bg-black/5 p-3 dark:border-white/10 dark:bg-white/5">
      <span className="mr-2 text-xs text-gray-600 dark:text-gray-400">Presets:</span>
      <button className={`${base} ${active==='normal' ? activeCls : ''}`} onClick={() => apply('normal', { attackRatio: 0, packetRate: undefined, adversarial: false })}>Normal Traffic</button>
      <button className={`${base} ${active==='light' ? activeCls : ''}`} onClick={() => apply('light', { attackRatio: 25, packetRate: undefined, adversarial: false })}>Light Attack Scenario</button>
      <button className={`${base} ${active==='ddos' ? activeCls : ''}`} onClick={() => apply('ddos', { attackRatio: 90, packetRate: 4, adversarial: false })}>DDoS Burst</button>
      <button className={`${base} ${active==='adv' ? 'bg-indigo-600/90 text-white hover:bg-indigo-600 ring-2 ring-indigo-400' : 'bg-indigo-600/90 text-white hover:bg-indigo-600'}`} onClick={() => apply('adv', { attackRatio: 50, packetRate: undefined, adversarial: true })}>Adversarial Evasion</button>
    </div>
  )
}


