import { useEffect, useRef } from 'react'
import FeedbackBar from './FeedbackBar'
import ExplainPanel from './ExplainPanel'

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xl bg-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function AiBubble({ message }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-2xl glass rounded-2xl rounded-tl-sm px-4 py-3">
        {/* Avatar row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🧠</span>
          <span className="text-xs font-semibold text-violet-400">OrchestrAI</span>
        </div>
        <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{message.text}</p>
        <ExplainPanel plan={message.plan} explanation={message.explanation} />
        <FeedbackBar taskId={message.taskId} />
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span className="text-xs text-violet-400 mr-2">Agents working</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatInterface({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && (
        <div className="text-center mt-16 space-y-3">
          <div className="text-5xl">🧠</div>
          <h2 className="text-xl font-bold text-white">OrchestrAI</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Ask me anything complex. A team of AI agents will plan, research, execute and
            critique the answer — together.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              'Explain quantum computing simply',
              'How do I start a startup?',
              'Write a Python sorting algorithm',
              'What causes inflation?',
            ].map((eg) => (
              <span key={eg} className="glass rounded-full px-3 py-1 text-xs text-gray-400">
                {eg}
              </span>
            ))}
          </div>
        </div>
      )}

      {messages.map((msg, i) =>
        msg.role === 'user'
          ? <UserBubble key={i} text={msg.text} />
          : <AiBubble  key={i} message={msg} />
      )}

      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
