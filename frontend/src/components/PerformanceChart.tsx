import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'

export function PerformanceChart({ data }) {
  return (
    <div className="rounded-lg border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
      <h2 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Performance Over Time</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="time" stroke="currentColor" tick={{ fill: 'currentColor' }} />
            <YAxis stroke="currentColor" tick={{ fill: 'currentColor' }} allowDecimals={false} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} labelStyle={{ color: '#cbd5e1' }} />
            <Legend />
            <Line type="monotone" dataKey="detected" name="Attacks Detected" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="slipped" name="Attacks Slipped Through" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


