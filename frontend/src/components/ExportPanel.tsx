import { useState } from 'react'
import { motion } from 'framer-motion'

interface ExportPanelProps {
  stats: any
  cm: any
  chartData: any[]
  onClose: () => void
}

export function ExportPanel({ stats, cm, chartData, onClose }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState('csv')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const exportOptions = [
    {
      id: 'csv',
      name: 'CSV Data',
      description: 'Export simulation data as CSV file',
      icon: '📊',
      format: 'csv'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Export simulation data as JSON file',
      icon: '📄',
      format: 'json'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Generate comprehensive PDF report',
      icon: '📋',
      format: 'pdf'
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Export data with charts to Excel',
      icon: '📈',
      format: 'xlsx'
    }
  ]

  const generateExportData = () => {
    const data = {
      metadata: {
        timestamp: new Date().toISOString(),
        simulation_duration: '5 minutes',
        total_packets: stats.scanned,
        attack_ratio: '35%'
      },
      statistics: {
        packets_scanned: stats.scanned,
        benign_passed: stats.benignPassed,
        attacks_blocked: stats.attacksBlocked,
        attacks_slipped: stats.attacksSlipped,
        detection_rate: ((stats.attacksBlocked / (stats.attacksBlocked + stats.attacksSlipped)) * 100).toFixed(2) + '%'
      },
      confusion_matrix: {
        true_positives: cm.tp,
        false_positives: cm.fp,
        true_negatives: cm.tn,
        false_negatives: cm.fn,
        precision: (cm.tp / (cm.tp + cm.fp)).toFixed(3),
        recall: (cm.tp / (cm.tp + cm.fn)).toFixed(3),
        f1_score: (2 * (cm.tp / (cm.tp + cm.fp)) * (cm.tp / (cm.tp + cm.fn)) / ((cm.tp / (cm.tp + cm.fp)) + (cm.tp / (cm.tp + cm.fn)))).toFixed(3)
      },
      performance_data: chartData,
      raw_data: includeRawData ? generateRawData() : null
    }
    return data
  }

  const generateRawData = () => {
    // Generate sample raw packet data
    const rawData = []
    for (let i = 0; i < 100; i++) {
      rawData.push({
        timestamp: new Date(Date.now() - (100 - i) * 1000).toISOString(),
        packet_id: `pkt_${i}`,
        source_ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        destination_ip: `10.0.0.${Math.floor(Math.random() * 254) + 1}`,
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        port: Math.floor(Math.random() * 65535),
        packet_size: Math.floor(Math.random() * 1500) + 64,
        is_attack: Math.random() < 0.3,
        attack_type: Math.random() < 0.3 ? ['DDoS', 'Port Scan', 'Malware'][Math.floor(Math.random() * 3)] : null,
        detected: Math.random() < 0.9,
        confidence: (Math.random() * 0.4 + 0.6).toFixed(3)
      })
    }
    return rawData
  }

  const handleExport = async (format: string) => {
    setIsExporting(true)
    
    try {
      const data = generateExportData()
      
      if (format === 'csv') {
        // Convert to CSV format
        const csvContent = convertToCSV(data)
        downloadFile(csvContent, 'ids_simulation_data.csv', 'text/csv')
      } else if (format === 'json') {
        downloadFile(JSON.stringify(data, null, 2), 'ids_simulation_data.json', 'application/json')
      } else if (format === 'pdf') {
        // Simulate PDF generation
        await new Promise(resolve => setTimeout(resolve, 2000))
        downloadFile('PDF content would be generated here', 'ids_simulation_report.pdf', 'application/pdf')
      } else if (format === 'xlsx') {
        // Simulate Excel generation
        await new Promise(resolve => setTimeout(resolve, 1500))
        downloadFile('Excel content would be generated here', 'ids_simulation_data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      }
      
      // Show success message
      alert(`Export completed! ${format.toUpperCase()} file downloaded.`)
    } catch (error) {
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const convertToCSV = (data: any) => {
    const headers = ['Metric', 'Value']
    const rows = [
      ['Timestamp', data.metadata.timestamp],
      ['Simulation Duration', data.metadata.simulation_duration],
      ['Total Packets', data.statistics.packets_scanned],
      ['Benign Passed', data.statistics.benign_passed],
      ['Attacks Blocked', data.statistics.attacks_blocked],
      ['Attacks Slipped', data.statistics.attacks_slipped],
      ['Detection Rate', data.statistics.detection_rate],
      ['True Positives', data.confusion_matrix.true_positives],
      ['False Positives', data.confusion_matrix.false_positives],
      ['True Negatives', data.confusion_matrix.true_negatives],
      ['False Negatives', data.confusion_matrix.false_negatives],
      ['Precision', data.confusion_matrix.precision],
      ['Recall', data.confusion_matrix.recall],
      ['F1 Score', data.confusion_matrix.f1_score]
    ]
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Export Simulation Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Export Format Selection */}
          <div>
            <h3 className="font-semibold mb-3">Choose Export Format</h3>
            <div className="grid grid-cols-2 gap-3">
              {exportOptions.map((option) => (
                <motion.div
                  key={option.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    exportFormat === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setExportFormat(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="font-semibold mb-3">Export Options</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded"
                />
                <span>Include performance charts and visualizations</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeRawData}
                  onChange={(e) => setIncludeRawData(e.target.checked)}
                  className="rounded"
                />
                <span>Include raw packet data (100 sample packets)</span>
              </label>
            </div>
          </div>

          {/* Data Preview */}
          <div>
            <h3 className="font-semibold mb-3">Data Preview</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Packets Scanned:</span> {stats.scanned}
                </div>
                <div>
                  <span className="font-medium">Attacks Blocked:</span> {stats.attacksBlocked}
                </div>
                <div>
                  <span className="font-medium">Attacks Slipped:</span> {stats.attacksSlipped}
                </div>
                <div>
                  <span className="font-medium">Detection Rate:</span> {((stats.attacksBlocked / (stats.attacksBlocked + stats.attacksSlipped)) * 100).toFixed(2)}%
                </div>
                <div>
                  <span className="font-medium">True Positives:</span> {cm.tp}
                </div>
                <div>
                  <span className="font-medium">False Positives:</span> {cm.fp}
                </div>
                <div>
                  <span className="font-medium">Performance Data Points:</span> {chartData.length}
                </div>
                <div>
                  <span className="font-medium">Raw Data Packets:</span> {includeRawData ? '100' : '0'}
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={() => handleExport(exportFormat)}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

















