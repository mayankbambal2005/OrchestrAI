import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
})

export const getHistory = () =>
  api.get('/history').then((r) => r.data.tasks)

export const submitFeedback = (task_id, rating) =>
  api.post('/feedback', { task_id, rating }).then((r) => r.data)

export default api
