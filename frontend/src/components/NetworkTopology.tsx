import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface NetworkTopologyProps {
  nodes: any[]
  onClose: () => void
}

export function NetworkTopology({ nodes, onClose }: NetworkTopologyProps) {
  const [selectedNode, setSelectedNode] = useState(null)
  const [networkData, setNetworkData] = useState({
    nodes: [
      { id: 'router1', type: 'router', x: 100, y: 100, status: 'active', traffic: 85, label: 'Internet Router' },
      { id: 'switch1', type: 'switch', x: 300, y: 100, status: 'active', traffic: 60, label: 'Core Switch' },
      { id: 'ids', type: 'ids', x: 500, y: 100, status: 'active', traffic: 90, label: 'IDS System' },
      { id: 'firewall', type: 'firewall', x: 700, y: 100, status: 'active', traffic: 45, label: 'Firewall' },
      { id: 'server1', type: 'server', x: 900, y: 50, status: 'active', traffic: 30, label: 'Web Server' },
      { id: 'server2', type: 'server', x: 900, y: 150, status: 'warning', traffic: 75, label: 'Database Server' },
      { id: 'client1', type: 'client', x: 50, y: 200, status: 'active', traffic: 20, label: 'Client A' },
      { id: 'client2', type: 'client', x: 150, y: 200, status: 'active', traffic: 15, label: 'Client B' },
      { id: 'attacker', type: 'attacker', x: 50, y: 50, status: 'danger', traffic: 95, label: 'External Attacker' }
    ],
    links: [
      { from: 'router1', to: 'switch1', traffic: 85, status: 'normal' },
      { from: 'switch1', to: 'ids', traffic: 60, status: 'normal' },
      { from: 'ids', to: 'firewall', traffic: 90, status: 'warning' },
      { from: 'firewall', to: 'server1', traffic: 30, status: 'normal' },
      { from: 'firewall', to: 'server2', traffic: 75, status: 'warning' },
      { from: 'client1', to: 'router1', traffic: 20, status: 'normal' },
      { from: 'client2', to: 'router1', traffic: 15, status: 'normal' },
      { from: 'attacker', to: 'router1', traffic: 95, status: 'danger' }
    ]
  })

  const getNodeColor = (node: any) => {
    switch (node.status) {
      case 'active': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'danger': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'router': return '🌐'
      case 'switch': return '🔀'
      case 'ids': return '🛡️'
      case 'firewall': return '🔥'
      case 'server': return '🖥️'
      case 'client': return '💻'
      case 'attacker': return '⚡'
      default: return '📡'
    }
  }


  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Network Topology Visualization</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
              <div className="text-sm text-green-600 font-semibold">Active Nodes</div>
              <div className="text-lg font-bold text-green-700">7</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
              <div className="text-sm text-yellow-600 font-semibold">Warning</div>
              <div className="text-lg font-bold text-yellow-700">1</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
              <div className="text-sm text-red-600 font-semibold">Threats</div>
              <div className="text-lg font-bold text-red-700">1</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <div className="text-sm text-blue-600 font-semibold">Total Traffic</div>
              <div className="text-lg font-bold text-blue-700">485 Mbps</div>
            </div>
          </div>

          {/* Network Legend */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">Network Legend:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Active/Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Warning/High Load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Threat/Attack</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Normal Traffic</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <strong>Node Types:</strong> 🌐 Router • 🔀 Switch • 🛡️ IDS • 🔥 Firewall • 🖥️ Server • 💻 Client • ⚡ Attacker
            </div>
          </div>

          <div className="relative h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
            <svg className="w-full h-full">
              {/* Render links */}
              {networkData.links.map((link, index) => {
                const fromNode = networkData.nodes.find(n => n.id === link.from)
                const toNode = networkData.nodes.find(n => n.id === link.to)
                if (!fromNode || !toNode) return null

                const strokeColor = link.status === 'danger' ? '#ef4444' : 
                                 link.status === 'warning' ? '#f59e0b' : '#10b981'
                const strokeWidth = Math.max(1, link.traffic / 20)

                return (
                  <motion.line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={0.7}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                )
              })}

              {/* Render nodes */}
              {networkData.nodes.map((node) => (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={20}
                    fill={getNodeColor(node)}
                    stroke="#fff"
                    strokeWidth={2}
                    className="cursor-pointer hover:r-6 transition-all"
                    onClick={() => setSelectedNode(node)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white pointer-events-none"
                  >
                    {getNodeIcon(node.type)}
                  </text>
                  {/* Node Label */}
                  <text
                    x={node.x}
                    y={node.y + 35}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700 dark:fill-gray-300 pointer-events-none"
                  >
                    {node.label}
                  </text>
                  {/* Traffic Percentage */}
                  <text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400 pointer-events-none"
                  >
                    {node.traffic}%
                  </text>
                </motion.g>
              ))}

              {/* Traffic flow animation */}
              {networkData.links.map((link, index) => {
                const fromNode = networkData.nodes.find(n => n.id === link.from)
                const toNode = networkData.nodes.find(n => n.id === link.to)
                if (!fromNode || !toNode) return null

                return (
                  <motion.div
                    key={`traffic-${index}`}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                      left: fromNode.x - 4,
                      top: fromNode.y - 4,
                    }}
                    animate={{
                      x: toNode.x - fromNode.x,
                      y: toNode.y - fromNode.y,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.5
                    }}
                  />
                )
              })}
            </svg>
          </div>

          {selectedNode && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">{selectedNode.label}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {selectedNode.type}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    selectedNode.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedNode.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedNode.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Traffic:</span> {selectedNode.traffic}%
                </div>
                <div>
                  <span className="font-medium">Position:</span> ({selectedNode.x}, {selectedNode.y})
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Description:</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedNode.type === 'router' && 'Internet gateway connecting your network to the outside world'}
                  {selectedNode.type === 'switch' && 'Core network switch managing internal traffic flow'}
                  {selectedNode.type === 'ids' && 'Intrusion Detection System monitoring for threats'}
                  {selectedNode.type === 'firewall' && 'Security firewall filtering incoming/outgoing traffic'}
                  {selectedNode.type === 'server' && 'Application server hosting your services'}
                  {selectedNode.type === 'client' && 'End-user device accessing network resources'}
                  {selectedNode.type === 'attacker' && 'External threat attempting to compromise your network'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
