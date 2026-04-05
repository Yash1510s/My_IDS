import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function KeyboardShortcuts() {
  const [isVisible, setIsVisible] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const shortcuts = [
    {
      key: 'Space',
      description: 'Start/Stop simulation',
      category: 'Simulation'
    },
    {
      key: 'R',
      description: 'Reset simulation',
      category: 'Simulation'
    },
    {
      key: 'F11',
      description: 'Toggle fullscreen',
      category: 'View'
    },
    {
      key: 'Ctrl + T',
      description: 'Open tutorial',
      category: 'Help'
    },
    {
      key: 'Ctrl + A',
      description: 'Open analytics',
      category: 'Analysis'
    },
    {
      key: 'Ctrl + N',
      description: 'Open network topology',
      category: 'View'
    },
    {
      key: 'Ctrl + E',
      description: 'Open export panel',
      category: 'Data'
    },
    {
      key: 'Ctrl + H',
      description: 'Show keyboard shortcuts',
      category: 'Help'
    },
    {
      key: 'Esc',
      description: 'Close current panel',
      category: 'Navigation'
    },
    {
      key: 'Ctrl + S',
      description: 'Save current configuration',
      category: 'Data'
    }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help panel
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault()
        setShowHelp(true)
      }
      
      // Close panels with Escape
      if (e.key === 'Escape') {
        setShowHelp(false)
        setIsVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories = [...new Set(shortcuts.map(s => s.category))]

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
        onClick={() => setShowHelp(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Keyboard Shortcuts (Ctrl+H)"
      >
        ⌨️
      </motion.button>

      {/* Help Panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                {categories.map((category) => (
                  <div key={category} className="mb-6">
                    <h3 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts
                        .filter(shortcut => shortcut.category === category)
                        .map((shortcut, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="text-sm">{shortcut.description}</span>
                            <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded font-mono">
                              {shortcut.key}
                            </kbd>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    💡 Pro Tips
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Use Space to quickly start/stop simulations during presentations</li>
                    <li>• Press R to reset and start fresh experiments</li>
                    <li>• Ctrl+A opens analytics for detailed performance analysis</li>
                    <li>• F11 for fullscreen mode provides immersive experience</li>
                    <li>• Esc key closes any open panel or dialog</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications for Shortcuts */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <span>⌨️</span>
              <span className="text-sm">Keyboard shortcuts active</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

















