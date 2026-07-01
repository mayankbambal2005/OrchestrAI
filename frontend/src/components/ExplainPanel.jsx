import { useState } from 'react'

export default function ExplainPanel({ plan, explanation }) {
  const [open, setOpen] = useState(false)

  if (!plan?.length && !explanation) return null

  return (
    <div className="mt-3 border-t border-white/10 pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
      >
        <span>{open ? '▾' : '▸'}</span>
        {open ? 'Hide' : 'Show'} reasoning
      </button>

      {open && (
        <div className="mt-2 space-y-3">
          {/* Plan steps */}
          {plan?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">📋 Plan Used</p>
              <ol className="list-decimal list-inside space-y-1">
                {plan.map((step, i) => (
                  <li key={i} className="text-xs text-gray-400">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Critic explanation */}
          {explanation && (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">🧐 Critic Review</p>
              <p className="text-xs text-gray-400 leading-relaxed">{explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
