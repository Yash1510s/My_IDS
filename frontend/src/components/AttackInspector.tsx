import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AttackInspectorProps {
  attackTypes: any[]
  onClose: () => void
}

export function AttackInspector({ attackTypes, onClose }: AttackInspectorProps) {
  const [selectedAttack, setSelectedAttack] = useState(null)
  const [packetDetails, setPacketDetails] = useState(null)
  const [attackEvolution, setAttackEvolution] = useState([])

  const attackTypesData = [
    {
      id: 'port-scan',
      name: 'Port Scanning',
      description: 'Systematic scanning of network ports to identify open services',
      severity: 'Medium',
      frequency: 45,
      techniques: ['TCP SYN scan', 'UDP scan', 'Stealth scan'],
      indicators: ['Multiple connection attempts', 'Sequential port access', 'Unusual timing patterns'],
      mitigation: ['Rate limiting', 'Port knocking', 'Honeypots']
    },
    {
      id: 'ddos',
      name: 'DDoS Attack',
      description: 'Distributed Denial of Service attack overwhelming target resources',
      severity: 'High',
      frequency: 25,
      techniques: ['Volume-based', 'Protocol-based', 'Application-layer'],
      indicators: ['Traffic spikes', 'Resource exhaustion', 'Service unavailability'],
      mitigation: ['Traffic filtering', 'Load balancing', 'CDN protection']
    },
    {
      id: 'botnet',
      name: 'Botnet Activity',
      description: 'Network of compromised devices controlled by attackers',
      severity: 'High',
      frequency: 15,
      techniques: ['Command & Control', 'Data exfiltration', 'Lateral movement'],
      indicators: ['Unusual network patterns', 'Encrypted communications', 'Bulk data transfers'],
      mitigation: ['Network segmentation', 'Behavioral analysis', 'Threat intelligence']
    },
    {
      id: 'malware',
      name: 'Malware Distribution',
      description: 'Malicious software designed to damage or gain unauthorized access',
      severity: 'Critical',
      frequency: 10,
      techniques: ['Phishing', 'Drive-by downloads', 'Social engineering'],
      indicators: ['Suspicious file downloads', 'Unusual process behavior', 'Network anomalies'],
      mitigation: ['Endpoint protection', 'Email filtering', 'User training']
    }
  ]

  const packetFeatures = {
    duration: 0.0234,
    protocol: 'TCP',
    service: 'HTTP',
    flag: 'SF',
    sourceBytes: 1024,
    destinationBytes: 2048,
    land: 0,
    wrongFragment: 0,
    urgent: 0,
    hot: 0,
    numFailedLogins: 0,
    loggedIn: 1,
    numCompromised: 0,
    rootShell: 0,
    suAttempted: 0,
    numRoot: 0,
    numFileCreations: 0,
    numShells: 0,
    numAccessFiles: 0,
    numOutboundCmds: 0,
    isHostLogin: 0,
    isGuestLogin: 0,
    count: 1,
    srvCount: 1,
    serrorRate: 0.0,
    srvSerrorRate: 0.0,
    rerrorRate: 0.0,
    srvRerrorRate: 0.0,
    sameSrvRate: 1.0,
    diffSrvRate: 0.0,
    srvDiffHostRate: 0.0,
    dstHostCount: 1,
    dstHostSrvCount: 1,
    dstHostSameSrvRate: 1.0,
    dstHostDiffSrvRate: 0.0,
    dstHostSameSrcPortRate: 1.0,
    dstHostSerrorRate: 0.0,
    dstHostSrvSerrorRate: 0.0,
    dstHostRerrorRate: 0.0,
    dstHostSrvRerrorRate: 0.0
  }

  useEffect(() => {
    // Simulate attack evolution over time
    const evolution = []
    for (let i = 0; i < 20; i++) {
      evolution.push({
        time: i * 5,
        intensity: Math.random() * 100,
        sophistication: Math.random() * 100,
        stealth: Math.random() * 100
      })
    }
    setAttackEvolution(evolution)
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Attack Inspector & Packet Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-3 gap-4">
            {/* Attack Types List */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-2">Attack Types</h3>
              {attackTypesData.map((attack) => (
                <motion.div
                  key={attack.id}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedAttack?.id === attack.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedAttack(attack)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{attack.name}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      attack.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      attack.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {attack.severity}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {attack.frequency}% frequency
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Attack Details */}
            <div className="space-y-4">
              {selectedAttack ? (
                <>
                  <div>
                    <h3 className="font-semibold mb-2">{selectedAttack.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {selectedAttack.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Techniques:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedAttack.techniques.map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm">Indicators:</h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                          {selectedAttack.indicators.map((indicator, index) => (
                            <li key={index}>• {indicator}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm">Mitigation:</h4>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                          {selectedAttack.mitigation.map((mit, index) => (
                            <li key={index}>• {mit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Select an attack type to view details
                </div>
              )}
            </div>

            {/* Packet Analysis */}
            <div className="space-y-4">
              <h3 className="font-semibold">Packet Analysis</h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Current Packet Features</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-mono">{packetFeatures.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol:</span>
                    <span className="font-mono">{packetFeatures.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-mono">{packetFeatures.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Source Bytes:</span>
                    <span className="font-mono">{packetFeatures.sourceBytes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination Bytes:</span>
                    <span className="font-mono">{packetFeatures.destinationBytes}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Attack Evolution</h4>
                <div className="space-y-2">
                  {attackEvolution.slice(-5).map((point, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>t+{point.time}s:</span>
                      <div className="flex gap-2">
                        <span className="text-red-600">I:{point.intensity.toFixed(0)}</span>
                        <span className="text-blue-600">S:{point.sophistication.toFixed(0)}</span>
                        <span className="text-green-600">St:{point.stealth.toFixed(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Threat Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Risk Level:</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded">High</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Confidence:</span>
                    <span className="font-mono">94.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Response Time:</span>
                    <span className="font-mono">12ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

















