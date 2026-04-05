import { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from './components/ThemeToggle'
import { Controls } from './components/Controls'
import { SimulationArea } from './components/SimulationArea'
import { Stats } from './components/Stats'
import { ConfusionMatrix } from './components/ConfusionMatrix'
import { Presets } from './components/Presets'
import { PerformanceChart } from './components/PerformanceChart'
import { AdvancedAnalytics } from './components/AdvancedAnalytics'
import { NetworkTopology } from './components/NetworkTopology'
import { AttackInspector } from './components/AttackInspector'
import { TutorialSystem } from './components/TutorialSystem'
import { CollaborationPanel } from './components/CollaborationPanel'
import { ExportPanel } from './components/ExportPanel'
import { AlertSystem } from './components/AlertSystem'
import { KeyboardShortcuts } from './components/KeyboardShortcuts'

export default function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [adversarial, setAdversarial] = useState(false)
  const [packetRate, setPacketRate] = useState(2) // packets per second (default)
  const [attackRatio, setAttackRatio] = useState(35) // percent malicious
  const [stats, setStats] = useState({
    scanned: 0,
    benignPassed: 0,
    attacksBlocked: 0,
    attacksSlipped: 0,
  })
  const [cm, setCm] = useState({ tp: 0, fp: 0, tn: 0, fn: 0 })
  const [threshold, setThreshold] = useState(50)
  const [hardened, setHardened] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const chartTickRef = useRef(0)
  const statsRef = useRef({ attacksBlocked: 0, attacksSlipped: 0 })
  
  // Advanced features state
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)
  const [showNetworkTopology, setShowNetworkTopology] = useState(false)
  const [showAttackInspector, setShowAttackInspector] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [attackTypes] = useState([])
  const [networkNodes] = useState([])
  const [collaborationData, setCollaborationData] = useState({ users: [], messages: [] })
  const [tutorialStep, setTutorialStep] = useState(0)
  const [performanceMetrics] = useState({})
  const [historicalData] = useState([])

  const reset = () => {
    setIsRunning(false)
    setStats({ scanned: 0, benignPassed: 0, attacksBlocked: 0, attacksSlipped: 0 })
    setChartData([])
    chartTickRef.current = 0
  }

  const updateStats = (delta: any) => {
    setStats((s) => ({
      scanned: s.scanned + (delta.scanned ?? 0),
      benignPassed: s.benignPassed + (delta.benignPassed ?? 0),
      attacksBlocked: s.attacksBlocked + (delta.attacksBlocked ?? 0),
      attacksSlipped: s.attacksSlipped + (delta.attacksSlipped ?? 0),
    }))
    if (delta.cm) {
      setCm((c) => ({
        tp: c.tp + (delta.cm.tp ?? 0),
        fp: c.fp + (delta.cm.fp ?? 0),
        tn: c.tn + (delta.cm.tn ?? 0),
        fn: c.fn + (delta.cm.fn ?? 0),
      }))
    }
  }

  // Keep a fresh ref of stats totals for the interval callback
  useEffect(() => {
    statsRef.current = { attacksBlocked: stats.attacksBlocked, attacksSlipped: stats.attacksSlipped }
  }, [stats.attacksBlocked, stats.attacksSlipped])

  // Update chart every 2s with totals; keep last 30 points
  useEffect(() => {
    if (!isRunning) return
    const t = setInterval(() => {
      chartTickRef.current += 1
      const seconds = chartTickRef.current * 2
      setChartData((arr) => {
        const point = { time: `t+${seconds}s`, detected: statsRef.current.attacksBlocked, slipped: statsRef.current.attacksSlipped }
        const next = [...arr, point]
        return next.slice(-30)
      })
    }, 2000)
    return () => clearInterval(t)
  }, [isRunning])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        if (isRunning) setIsRunning(false)
        else setIsRunning(true)
      }
      if (e.code === 'KeyR' && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        reset()
      }
      if (e.code === 'F11') {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
      if (e.code === 'KeyT' && e.ctrlKey) {
        e.preventDefault()
        setShowTutorial(!showTutorial)
      }
      if (e.code === 'KeyA' && e.ctrlKey) {
        e.preventDefault()
        setShowAdvancedAnalytics(!showAdvancedAnalytics)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isRunning, isFullscreen, showTutorial, showAdvancedAnalytics])

  return (
    <div className={`min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">IDS Adversarial Simulation</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              Tutorial
            </button>
            <button
              onClick={() => setShowAdvancedAnalytics(!showAdvancedAnalytics)}
              className="rounded-md bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
            >
              Analytics
            </button>
            <button
              onClick={() => setShowNetworkTopology(!showNetworkTopology)}
              className="rounded-md bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
            >
              Network
            </button>
            <button
              onClick={() => setShowExport(!showExport)}
              className="rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600"
            >
              Export
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Advanced Features Panels */}
        {showTutorial && (
          <TutorialSystem 
            step={tutorialStep} 
            onStepChange={setTutorialStep}
            onClose={() => setShowTutorial(false)}
          />
        )}
        
        {showAdvancedAnalytics && (
          <AdvancedAnalytics 
            stats={stats}
            cm={cm}
            performanceMetrics={performanceMetrics}
            historicalData={historicalData}
            onClose={() => setShowAdvancedAnalytics(false)}
          />
        )}
        
        {showNetworkTopology && (
          <NetworkTopology 
            nodes={networkNodes}
            onClose={() => setShowNetworkTopology(false)}
          />
        )}
        
        {showAttackInspector && (
          <AttackInspector 
            attackTypes={attackTypes}
            onClose={() => setShowAttackInspector(false)}
          />
        )}
        
        {showExport && (
          <ExportPanel 
            stats={stats}
            cm={cm}
            chartData={chartData}
            onClose={() => setShowExport(false)}
          />
        )}

        <div className="grid gap-6 md:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Controls
              isRunning={isRunning}
              onStart={() => setIsRunning(true)}
              onStop={() => setIsRunning(false)}
              onReset={reset}
              adversarial={adversarial}
              onToggleAdversarial={(checked: boolean) => setAdversarial(checked)}
              packetRate={packetRate}
              onChangePacketRate={setPacketRate}
              attackRatio={attackRatio}
              onChangeAttackRatio={setAttackRatio}
              threshold={threshold}
              onChangeThreshold={setThreshold}
              hardened={hardened}
              onToggleHardened={setHardened}
            />
            <Presets onApply={({ attackRatio, packetRate, adversarial }: any) => {
              if (attackRatio != null) setAttackRatio(attackRatio)
              if (packetRate != null) setPacketRate(packetRate)
              if (adversarial != null) setAdversarial(adversarial)
            }} />
            <SimulationArea
              isRunning={isRunning}
              adversarial={adversarial}
              packetRate={packetRate}
              attackRatio={attackRatio}
              threshold={threshold}
              hardened={hardened}
              onStats={updateStats}
            />
            <PerformanceChart data={chartData} />
          </div>

          <div className="space-y-4">
            <Stats stats={stats} />
            <ConfusionMatrix cm={cm} />
            <AlertSystem alerts={alerts} onClearAlerts={() => setAlerts([])} />
            <CollaborationPanel 
              data={collaborationData}
              onUpdate={setCollaborationData}
            />
          </div>
        </div>
        
        <KeyboardShortcuts />
      </div>
    </div>
  )
}


