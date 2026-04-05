export function Controls({ isRunning, onStart, onStop, onReset, adversarial, onToggleAdversarial, packetRate, onChangePacketRate, attackRatio, onChangeAttackRatio, threshold, onChangeThreshold, hardened, onToggleHardened }) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
      <button
        onClick={isRunning ? onStop : onStart}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${isRunning ? 'bg-red-500/90 hover:bg-red-500' : 'bg-emerald-600/90 hover:bg-emerald-600'}`}
      >
        {isRunning ? 'Stop Simulation' : 'Start Simulation'}
      </button>

      <button
        onClick={onReset}
        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-300 dark:bg-gray-700/70 dark:hover:bg-gray-700"
      >
        Reset
      </button>

      {/* Packet Rate slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Rate</span>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.5}
          value={packetRate}
          onChange={(e) => onChangePacketRate(parseFloat(e.target.value))}
          className="h-2 w-36 cursor-pointer appearance-none rounded bg-gray-300 dark:bg-gray-600"
        />
        <span className="text-xs tabular-nums text-gray-700 dark:text-gray-300">{packetRate.toFixed(1)} pkt/s</span>
      </div>

      {/* Attack Ratio slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Attack</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={attackRatio}
          onChange={(e) => onChangeAttackRatio(parseInt(e.target.value, 10))}
          className="h-2 w-36 cursor-pointer appearance-none rounded bg-gray-300 dark:bg-gray-600"
        />
        <span className="text-xs tabular-nums text-gray-700 dark:text-gray-300">{attackRatio}%</span>
      </div>

      {/* Threshold slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">Threshold</span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={threshold}
          onChange={(e) => onChangeThreshold(parseInt(e.target.value, 10))}
          className="h-2 w-36 cursor-pointer appearance-none rounded bg-gray-300 dark:bg-gray-600"
        />
        <span className="text-xs tabular-nums text-gray-700 dark:text-gray-300">{threshold}%</span>
      </div>

      {/* Hardened IDS toggle */}
      <label className="flex cursor-pointer items-center gap-2 select-none" role="switch" aria-checked={hardened}>
        <input type="checkbox" className="peer sr-only" checked={hardened} onChange={(e) => onToggleHardened(e.target.checked)} />
        <span className="text-sm">Hardened IDS</span>
        <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition peer-checked:bg-emerald-600 dark:bg-gray-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
      </label>

      <div className="ml-auto" />

      <label className="ml-auto flex cursor-pointer items-center gap-2 select-none" role="switch" aria-checked={adversarial} tabIndex={0}>
        <input type="checkbox" className="peer sr-only" checked={adversarial} onChange={(e) => onToggleAdversarial(e.target.checked)} />
        <span className="text-sm">Launch Adversarial Attack</span>
        <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition peer-checked:bg-indigo-600 dark:bg-gray-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
      </label>
    </div>
  )
}


