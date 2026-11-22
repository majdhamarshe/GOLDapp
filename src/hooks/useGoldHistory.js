import { useEffect, useState } from 'react'
import api from '../services/api'

export default function useGoldHistory() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const request = window.setTimeout(async () => {
      try {
        const response = await api.get('/gold-history')
        if (active) setData(response.data)
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'تعذر تحميل مخطط الأسعار.')
      }
    }, 0)

    return () => {
      active = false
      window.clearTimeout(request)
    }
  }, [])

  return { data, error }
}
