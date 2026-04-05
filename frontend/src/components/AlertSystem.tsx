import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AlertSystemProps {
  alerts: any[]
  onClearAlerts: () => void
}

export function AlertSystem({ alerts, onClearAlerts }: AlertSystemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const alertTypes = {
    critical: {
      color: 'bg-red-500',
      icon: '🚨',
      sound: '🔊'
    },
    warning: {
      color: 'bg-yellow-500',
      icon: '⚠️',
      sound: '🔔'
    },
    info: {
      color: 'bg-blue-500',
      icon: 'ℹ️',
      sound: '📢'
    },
    success: {
      color: 'bg-green-500',
      icon: '✅',
      sound: '🎉'
    }
  }

  const sampleAlerts = [
    {
      id: 1,
      type: 'critical',
      title: 'High-Risk Attack Detected',
      message: 'Multiple DDoS attempts detected from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 30000),
      acknowledged: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'False Positive Rate High',
      message: 'False positive rate has exceeded 5% threshold',
      timestamp: new Date(Date.now() - 120000),
      acknowledged: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Simulation Started',
      message: 'IDS simulation has been initiated',
      timestamp: new Date(Date.now() - 300000),
      acknowledged: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Attack Blocked',
      message: 'Port scanning attack successfully blocked',
      timestamp: new Date(Date.now() - 60000),
      acknowledged: true
    }
  ]

  const playAlertSound = (type: string) => {
    if (!soundEnabled) return
    
    // Create audio context for different alert sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Different frequencies for different alert types
    const frequencies = {
      critical: 800,
      warning: 600,
      info: 400,
      success: 500
    }
    
    oscillator.frequency.setValueAtTime(frequencies[type as keyof typeof frequencies] || 500, audioContext.currentTime)
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  useEffect(() => {
    // Play sound for new alerts
    if (alerts.length > 0) {
      const latestAlert = alerts[alerts.length - 1]
      playAlertSound(latestAlert.type)
    }
  }, [alerts])

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const getAlertType = (type: string) => {
    return alertTypes[type as keyof typeof alertTypes] || alertTypes.info
  }

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {unacknowledgedCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unacknowledgedCount}
              </div>
            )}
          </div>
          <span className="font-medium text-sm">Alerts</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {alerts.length} total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSoundEnabled(!soundEnabled)
            }}
            className={`text-sm ${soundEnabled ? 'text-green-600' : 'text-gray-400'}`}
            title={soundEnabled ? 'Sound enabled' : 'Sound disabled'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <span className="text-gray-400">▼</span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No alerts
                </div>
              ) : (
                alerts.map((alert) => {
                  const alertType = getAlertType(alert.type)
                  
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.acknowledged 
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                          : 'bg-white dark:bg-gray-800 border-l-4'
                      }`}
                      style={{ borderLeftColor: alertType.color.replace('bg-', '#') }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{alertType.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              {!alert.acknowledged && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {formatTime(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!alert.acknowledged && (
                            <button
                              onClick={() => {
                                // Acknowledge alert
                                alert.acknowledged = true
                              }}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                            >
                              Ack
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>

            {alerts.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {unacknowledgedCount} unacknowledged alerts
                  </span>
                  <button
                    onClick={onClearAlerts}
                    className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

















