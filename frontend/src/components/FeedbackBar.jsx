import { useState } from 'react'
import { submitFeedback } from '../services/api'

export default function FeedbackBar({ taskId }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleRate = async (rating) => {
    setSelected(rating)
    try {
      if (taskId) await submitFeedback(taskId, rating)
    } catch (_) { /* offline – still show UI */ }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
        ✅ Thanks for the feedback!
      </div>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-1">
      <span className="text-xs text-gray-500 mr-1">Rate:</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => handleRate(n)}
          className={`text-lg transition-transform hover:scale-125
            ${selected && n <= selected ? 'text-yellow-400' : 'text-gray-600'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
