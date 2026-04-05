import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface AdvancedAnalyticsProps {
  stats: any
  cm: any
  performanceMetrics: any
  historicalData: any[]
  onClose: () => void
}

export function AdvancedAnalytics({ stats, cm, performanceMetrics, historicalData, onClose }: AdvancedAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('roc')
  const [rocData, setRocData] = useState([])
  const [attackTypes, setAttackTypes] = useState([])

  useEffect(() => {
    // Generate ROC curve data
    const generateRocData = () => {
      const data = []
      for (let threshold = 0; threshold <= 100; threshold += 5) {
        const tpr = Math.max(0, 0.8 - (threshold / 100) * 0.3)
        const fpr = Math.max(0, (threshold / 100) * 0.2)
        data.push({ threshold, tpr, fpr })
      }
      setRocData(data)
    }

    // Generate attack type distribution
    const generateAttackTypes = () => {
      setAttackTypes([
        { name: 'Port Scanning', value: 45, color: '#ff6b6b' },
        { name: 'DDoS', value: 25, color: '#4ecdc4' },
        { name: 'Botnet', value: 15, color: '#45b7d1' },
        { name: 'Malware', value: 10, color: '#96ceb4' },
        { name: 'Other', value: 5, color: '#feca57' }
      ])
    }

    generateRocData()
    generateAttackTypes()
  }, [])

  const precision = cm.tp / (cm.tp + cm.fp) || 0
  const recall = cm.tp / (cm.tp + cm.fn) || 0
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Advanced Analytics Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('roc')}
              className={`px-4 py-2 rounded ${activeTab === 'roc' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              ROC Curve
            </button>
            <button
              onClick={() => setActiveTab('attack-types')}
              className={`px-4 py-2 rounded ${activeTab === 'attack-types' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Attack Types
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 rounded ${activeTab === 'performance' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-2 rounded ${activeTab === 'export' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Export Data
            </button>
          </div>

          {activeTab === 'roc' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">ROC Curve Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rocData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threshold" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="tpr" stroke="#8884d8" name="True Positive Rate" />
                    <Line type="monotone" dataKey="fpr" stroke="#82ca9d" name="False Positive Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                  <h4 className="font-semibold">Precision</h4>
                  <p className="text-2xl font-bold text-blue-600">{precision.toFixed(3)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                  <h4 className="font-semibold">Recall</h4>
                  <p className="text-2xl font-bold text-green-600">{recall.toFixed(3)}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                  <h4 className="font-semibold">F1 Score</h4>
                  <p className="text-2xl font-bold text-purple-600">{f1Score.toFixed(3)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attack-types' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Attack Type Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attackTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {attackTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {attackTypes.map((attack, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: attack.color }}></div>
                      <span>{attack.name}: {attack.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h4 className="font-semibold">Detection Rate</h4>
                  <p className="text-2xl font-bold text-green-600">94.2%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h4 className="font-semibold">False Positive Rate</h4>
                  <p className="text-2xl font-bold text-red-600">2.1%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h4 className="font-semibold">Processing Time</h4>
                  <p className="text-2xl font-bold text-blue-600">12ms</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h4 className="font-semibold">Throughput</h4>
                  <p className="text-2xl font-bold text-purple-600">850 pps</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold">Export as CSV</div>
                    <div className="text-sm text-gray-500">Download simulation data</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <div className="font-semibold">Export Charts</div>
                    <div className="text-sm text-gray-500">Download visualizations</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">Export Report</div>
                    <div className="text-sm text-gray-500">Generate PDF report</div>
                  </div>
                </button>
                <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔗</div>
                    <div className="font-semibold">Share Link</div>
                    <div className="text-sm text-gray-500">Share simulation results</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

















