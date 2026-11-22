import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'

export default function useGoldPrices() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/gold-prices')
      setData(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'تعذر تحديث أسعار الذهب حالياً.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialRequest = window.setTimeout(() => void refresh(), 0)
    const interval = window.setInterval(() => void refresh(), 5 * 60 * 1000)
    return () => {
      window.clearTimeout(initialRequest)
      window.clearInterval(interval)
    }
  }, [refresh])

  return { data, loading, error, refresh }
}
