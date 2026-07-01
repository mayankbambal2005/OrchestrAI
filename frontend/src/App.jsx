import { useState, useRef, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useWebSocket } from './hooks/useWebSocket'
import ChatInterface from './components/ChatInterface'
import AgentPanel    from './components/AgentPanel'
import TaskHistory   from './components/TaskHistory'
import LoginPage     from './pages/LoginPage'
import SignupPage    from './pages/SignupPage'
import AdminDashboard from './pages/AdminDashboard'

function UserApp() {
  const { user, logout } = useAuth()
  const { sendTask, cancel, agentLog, finalResult, isLoading, error } = useWebSocket()
  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [activeTab, setActiveTab] = useState('agents')
  const addedRef = useRef(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (finalResult && !addedRef.current) {
      addedRef.current = true
      setMessages(prev => [...prev, {
        role: 'ai',
        text: finalResult.answer,
        plan: finalResult.plan,
        explanation: finalResult.explanation,
        taskId: finalResult.task_id,
      }])
    }
  }, [finalResult])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    addedRef.current = false
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    sendTask(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#080810]">
      <aside className="w-64 border-r border-white/10 flex flex-col p-4 shrink-0">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm">🧠</div>
          <div>
            <p className="font-bold text-white text-sm leading-none">OrchestrAI</p>
            <p className="text-slate-600 text-xs">Multi-Agent System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 mb-4">
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-xs">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-600">User</p>
          </div>
          <button onClick={logout} className="text-slate-600 hover:text-red-400 transition-colors text-xs">✕</button>
        </div>
        <button onClick={() => { setMessages([]); setInput('') }}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold mb-4 hover:opacity-90 transition-opacity">
          + New Chat
        </button>
        <div className="flex bg-white/[0.04] border border-white/10 rounded-xl p-1 mb-4">
          {[{id:'agents',label:'🤖 Agents'},{id:'history',label:'📚 History'}].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all ${activeTab === t.id ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTab === 'agents'
            ? <AgentPanel agentLog={agentLog} isLoading={isLoading} />
            : <TaskHistory onSelect={(t) => {
                setMessages(prev => [...prev,
                  { role: 'user', text: `[History] ${t.task}` },
                  { role: 'ai', text: t.result?.answer || 'No answer.', plan: t.result?.plan }
                ])
                setActiveTab('agents')
              }} />}
        </div>
      </aside>
      <main className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 shrink-0">
          <div>
            <p className="text-sm font-bold text-white">Chat</p>
            <p className="text-xs text-slate-600">{isLoading ? 'Agents working…' : 'Ready'}</p>
          </div>
          {isLoading && <button onClick={cancel} className="text-xs text-red-400 hover:text-red-300">✕ Cancel</button>}
        </header>
        {error && <div className="mx-4 mt-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400">⚠️ {error}</div>}
        <ChatInterface messages={messages} isLoading={isLoading} />
        <div className="px-4 pb-4 pt-2 border-t border-white/10 shrink-0">
          <div className="flex items-end gap-3 bg-white/[0.04] border border-white/10 rounded-2xl p-3">
            <textarea ref={inputRef} rows={1} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }}}
              placeholder="Ask OrchestrAI anything…"
              className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder-slate-600 max-h-36 leading-relaxed"
            />
            <button onClick={handleSubmit} disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
              {isLoading ? '…' : '↑ Send'}
            </button>
          </div>
          <p className="text-center text-slate-700 text-xs mt-2">Shift+Enter for new line · Enter to send</p>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const { user } = useAuth()
  const [page, setPage] = useState('login')

  if (user) {
    return user.role === 'admin' ? <AdminDashboard /> : <UserApp />
  }

  return page === 'login'
    ? <LoginPage  onGoSignup={() => setPage('signup')} />
    : <SignupPage onGoLogin={() => setPage('login')} />
}
