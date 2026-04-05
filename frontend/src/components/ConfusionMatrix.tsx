export function ConfusionMatrix({ cm }) {
  return (
    <aside className="rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Confusion Matrix</h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Top-Left: TP */}
        <div className="rounded-md border border-emerald-400/50 bg-emerald-500/15 p-3">
          <div className="text-sm font-medium text-emerald-500">Attacks Caught</div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400">Was it an attack and we blocked it? Yes.</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{cm.tp}</div>
        </div>

        {/* Top-Right: FP */}
        <div className="rounded-md border border-amber-400/50 bg-amber-500/15 p-3">
          <div className="text-sm font-medium text-amber-600">False Alarms</div>
          <div className="text-[11px] text-gray-700 dark:text-gray-400">Was it safe traffic but we blocked it? Yes.</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{cm.fp}</div>
        </div>

        {/* Bottom-Left: TN */}
        <div className="rounded-md border border-emerald-400/40 bg-emerald-500/10 p-3">
          <div className="text-sm font-medium text-emerald-500">Safe Traffic Passed</div>
          <div className="text-[11px] text-gray-600 dark:text-gray-400">Was it safe traffic and we allowed it? Yes.</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{cm.tn}</div>
        </div>

        {/* Bottom-Right: FN */}
        <div className="rounded-md border border-rose-400/60 bg-rose-500/15 p-3">
          <div className="text-sm font-medium text-rose-500">Attacks Missed</div>
          <div className="text-[11px] text-gray-700 dark:text-gray-400">Was it an attack but we allowed it? Yes.</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{cm.fn}</div>
        </div>
      </div>
    </aside>
  )
}


