const AGENT_META = {
  'Planner Agent':   { color: 'bg-purple-500',  icon: '🗺️' },
  'Research Agent':  { color: 'bg-blue-500',    icon: '🔍' },
  'Execution Agent': { color: 'bg-green-500',   icon: '⚙️' },
  'Critic Agent':    { color: 'bg-orange-500',  icon: '🧐' },
  'Memory Agent':    { color: 'bg-pink-500',    icon: '🧠' },
  'Orchestrator':    { color: 'bg-gray-500',    icon: '🎯' },
}

export default function AgentPanel({ agentLog, isLoading }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h2 className="font-bold text-white">Agent Activity</h2>
        {isLoading && (
          <span className="ml-auto flex items-center gap-1 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Agent status cards */}
      <div className="space-y-2 overflow-y-auto flex-1">
        {agentLog.length === 0 && !isLoading && (
          <p className="text-gray-600 text-sm text-center mt-8">
            Agent activity will appear here when a task runs.
          </p>
        )}

        {agentLog.map((entry, i) => {
          const meta = AGENT_META[entry.agent] || { color: 'bg-gray-600', icon: '🔧' }
          const isLast = i === agentLog.length - 1

          return (
            <div
              key={i}
              className={`glass rounded-xl p-3 flex gap-3 items-start transition-all
                ${isLast && isLoading ? 'border-violet-500/50 bg-violet-500/5' : ''}`}
            >
              <span className="text-lg leading-none mt-0.5">{meta.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${meta.color}`}>
                    {entry.agent}
                  </span>
                  <span className="text-gray-600 text-xs ml-auto">{entry.timestamp}</span>
                </div>
                <p className={`text-xs ${isLast && isLoading ? 'text-green-400' : 'text-gray-400'}`}>
                  {isLast && isLoading && (
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />
                  )}
                  {entry.detail}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Agent legend */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-600 text-xs mb-2 font-semibold uppercase tracking-wider">Agents</p>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(AGENT_META).slice(0, 5).map(([name, meta]) => (
            <div key={name} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-1.5 h-1.5 rounded-full ${meta.color}`} />
              {name.replace(' Agent', '')}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
