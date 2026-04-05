export function Stats({ stats }) {
  const items = [
    { label: 'Packets Scanned', value: stats.scanned },
    { label: 'Benign Traffic Passed', value: stats.benignPassed },
    { label: 'Attacks Detected & Blocked', value: stats.attacksBlocked },
    { label: 'Attacks Slipped Through', value: stats.attacksSlipped },
  ]

  return (
    <aside className="space-y-3 rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className="text-sm font-medium text-gray-300">Statistics</h2>
      <div className="grid gap-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-md bg-black/10 px-3 py-2 dark:bg-black/20">
            <span className="text-sm text-gray-600 dark:text-gray-400">{it.label}</span>
            <span className="text-lg font-semibold tabular-nums">{it.value}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}


