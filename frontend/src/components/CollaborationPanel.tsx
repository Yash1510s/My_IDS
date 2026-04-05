import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CollaborationPanelProps {
  data: {
    users: any[]
    messages: any[]
  }
  onUpdate: (data: any) => void
}

export function CollaborationPanel({ data, onUpdate }: CollaborationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState({
    id: 'user1',
    name: 'You',
    avatar: '👤',
    color: '#3b82f6'
  })
  const [sessionId, setSessionId] = useState('demo-session')
  const [showJoinDialog, setShowJoinDialog] = useState(false)

  const users = [
    { id: 'user1', name: 'You', avatar: '👤', color: '#3b82f6', status: 'online' },
    { id: 'user2', name: 'Alice', avatar: '👩', color: '#10b981', status: 'online' },
    { id: 'user3', name: 'Bob', avatar: '👨', color: '#f59e0b', status: 'away' },
    { id: 'user4', name: 'Carol', avatar: '👩‍💻', color: '#8b5cf6', status: 'offline' }
  ]

  const messages = [
    {
      id: 1,
      userId: 'user2',
      text: 'The DDoS attack simulation is showing interesting patterns!',
      timestamp: new Date(Date.now() - 300000),
      type: 'message'
    },
    {
      id: 2,
      userId: 'user3',
      text: 'I noticed the false positive rate is higher than expected',
      timestamp: new Date(Date.now() - 180000),
      type: 'message'
    },
    {
      id: 3,
      userId: 'system',
      text: 'Bob joined the simulation',
      timestamp: new Date(Date.now() - 120000),
      type: 'system'
    },
    {
      id: 4,
      userId: 'user4',
      text: 'Can we export the results for analysis?',
      timestamp: new Date(Date.now() - 60000),
      type: 'message'
    }
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        userId: currentUser.id,
        text: newMessage,
        timestamp: new Date(),
        type: 'message'
      }
      
      onUpdate({
        ...data,
        messages: [...data.messages, message]
      })
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else if (e.key === 'Enter' && e.shiftKey) {
      // Allow Shift+Enter for new lines
      return
    }
  }

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId) || currentUser
  }

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium text-sm">Collaboration</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {users.filter(u => u.status === 'online').length} online
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowJoinDialog(true)
            }}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            title="Join with friends"
          >
            Join
          </button>
        </div>
        <div className="flex items-center gap-1">
          {users.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {user.avatar}
            </div>
          ))}
          {users.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs">
              +{users.length - 3}
            </div>
          )}
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
            <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
              {messages.map((message) => {
                const user = getUserById(message.userId)
                const isSystem = message.type === 'system'
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${isSystem ? 'justify-center' : ''}`}
                  >
                    {!isSystem && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.avatar}
                      </div>
                    )}
                    <div className={`flex-1 ${isSystem ? 'text-center' : ''}`}>
                      {!isSystem && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{user.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`text-sm ${
                        isSystem 
                          ? 'text-gray-500 dark:text-gray-400 italic' 
                          : 'bg-gray-100 dark:bg-gray-700 p-2 rounded'
                      }`}>
                        {message.text}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Dialog */}
      {showJoinDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Join Collaboration Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Session ID</label>
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter session ID"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Share this session ID with your friends to join the same chat
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How to invite friends:</h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Share the session ID: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{sessionId}</code></li>
                  <li>2. Tell them to enter the same session ID</li>
                  <li>3. Start chatting together!</li>
                </ol>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowJoinDialog(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowJoinDialog(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Join Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
