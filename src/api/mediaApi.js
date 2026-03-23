import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

export const fetchFeed = async ({ page = 1, perPage = 20 }) => {
  const { data } = await api.get('/api/feed', {
    params: { page, perPage },
  })

  return data
}

export const searchMedia = async ({ q, type = 'all', page = 1, perPage = 20 }) => {
  const { data } = await api.get('/api/search', {
    params: { q, type, page, perPage },
  })

  return data
}
