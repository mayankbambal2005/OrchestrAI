import { useRef, useState, useCallback } from 'react'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/ws/task'

export function useWebSocket() {
  const wsRef       = useRef(null)
  const [agentLog,    setAgentLog]    = useState([])
  const [finalResult, setFinalResult] = useState(null)
  const [isLoading,   setIsLoading]   = useState(false)
  const [error,       setError]       = useState(null)

  const sendTask = useCallback((task) => {
    // Reset state
    setAgentLog([])
    setFinalResult(null)
    setError(null)
    setIsLoading(true)

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify({ task }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'final') {
        setFinalResult(data.result)
        setIsLoading(false)
      } else if (data.type === 'error') {
        setError(data.message)
        setIsLoading(false)
      } else if (data.agent) {
        // Live agent status update
        setAgentLog((prev) => [
          ...prev,
          { ...data, timestamp: new Date().toLocaleTimeString() },
        ])
      }
    }

    ws.onerror = () => {
      setError('Connection error. Is the backend running?')
      setIsLoading(false)
    }

    ws.onclose = () => {
      setIsLoading(false)
    }
  }, [])

  const cancel = useCallback(() => {
    wsRef.current?.close()
    setIsLoading(false)
  }, [])

  return { sendTask, cancel, agentLog, finalResult, isLoading, error }
}
