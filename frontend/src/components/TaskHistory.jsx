import { useEffect, useState } from 'react'
import { getHistory } from '../services/api'

export default function TaskHistory({ onSelect }) {
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false))
  }, [])

  const stars = (r) => '★'.repeat(r || 0) + '☆'.repeat(5 - (r || 0))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📚</span>
        <h2 className="font-bold text-white">Task History</h2>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {!loading && tasks.length === 0 && (
        <p className="text-gray-600 text-sm text-center mt-8">
          No tasks yet. Run your first query!
        </p>
      )}

      <div className="space-y-2 overflow-y-auto flex-1">
        {tasks.map((t, i) => (
          <button
            key={i}
            onClick={() => onSelect?.(t)}
            className="w-full text-left glass rounded-xl p-3 hover:border-violet-500/50
                       transition-all duration-150 group"
          >
            <p className="text-sm text-gray-200 truncate group-hover:text-white transition-colors">
              {t.task}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-500 text-xs">{stars(t.rating)}</span>
              <span className="text-gray-600 text-xs ml-auto">
                {t.createdAt
                  ? new Date(t.createdAt).toLocaleDateString()
                  : 'Recent'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
