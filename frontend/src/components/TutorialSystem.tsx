import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TutorialSystemProps {
  step: number
  onStepChange: (step: number) => void
  onClose: () => void
}

export function TutorialSystem({ step, onStepChange, onClose }: TutorialSystemProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  const tutorialSteps = [
    {
      title: "Welcome to IDS Simulation!",
      content: "This tutorial will guide you through the Intrusion Detection System simulation. You'll learn how to detect and analyze network attacks in real-time.",
      position: "center",
      action: "Let's start exploring the interface!"
    },
    {
      title: "Simulation Controls",
      content: "Use the Start/Stop button to begin the simulation. The Reset button clears all data. Try adjusting the packet rate and attack ratio to see different scenarios.",
      position: "top-left",
      action: "Try starting the simulation now!"
    },
    {
      title: "Attack Detection",
      content: "Watch the packets flow through the network. Green packets are benign, red packets are attacks. The IDS box in the middle analyzes each packet and decides whether to block or allow it.",
      position: "center",
      action: "Notice how the IDS makes decisions in real-time!"
    },
    {
      title: "Statistics Panel",
      content: "The right panel shows real-time statistics: packets scanned, attacks blocked, and attacks that slipped through. The confusion matrix shows detection accuracy.",
      position: "top-right",
      action: "Monitor these metrics during simulation!"
    },
    {
      title: "Adversarial Mode",
      content: "Enable adversarial mode to see how attackers try to evade detection. Some attacks will have glowing rings - these are adversarial examples designed to fool the IDS.",
      position: "center",
      action: "Toggle adversarial mode and watch the difference!"
    },
    {
      title: "Advanced Analytics",
      content: "Click the Analytics button to see ROC curves, attack type distributions, and performance metrics. This helps you understand the IDS effectiveness.",
      position: "center",
      action: "Explore the analytics dashboard!"
    },
    {
      title: "Network Topology",
      content: "The Network button shows a visual representation of your network infrastructure. See how traffic flows between routers, switches, and security devices.",
      position: "center",
      action: "Visualize your network architecture!"
    },
    {
      title: "Export Results",
      content: "Use the Export button to download simulation data, generate reports, or share results with your team. This is useful for analysis and documentation.",
      position: "center",
      action: "Try exporting your simulation data!"
    },
    {
      title: "Keyboard Shortcuts",
      content: "Use Space to start/stop, R to reset, F11 for fullscreen, Ctrl+T for tutorial, and Ctrl+A for analytics. These shortcuts make the interface more efficient.",
      position: "center",
      action: "Try the keyboard shortcuts!"
    },
    {
      title: "Congratulations!",
      content: "You've completed the tutorial! You now know how to use the IDS simulation effectively. Experiment with different scenarios and explore all the features.",
      position: "center",
      action: "Start experimenting with your own scenarios!"
    }
  ]

  const currentStep = tutorialSteps[step]

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      onStepChange(step + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      onStepChange(step - 1)
    }
  }

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
        return 'bottom-4 right-4'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default:
        return 'top-4 left-4'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 ${getPositionClasses(currentStep.position)}`}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{currentStep.title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentStep.content}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  💡 {currentStep.action}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {step + 1} of {tutorialSteps.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={nextStep}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {step === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / tutorialSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

















