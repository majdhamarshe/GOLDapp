import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import useGoldPrices from '../../hooks/useGoldPrices'

export default function GoldPriceCards() {
  const { data, loading, error, refresh } = useGoldPrices()
  const change = data?.changePercent || 0
  const TrendIcon = change < 0 ? TrendingDown : TrendingUp

  if (loading && !data) {
    return <div className="price-message">جاري تحديث أسعار الذهب العالمية…</div>
  }

  if (error && !data) {
    return <div className="price-message price-error"><p>{error}</p><button type="button" onClick={() => void refresh()}><RefreshCw /> إعادة المحاولة</button></div>
  }

  return (
    <>
      <div className="stats-grid">
        {data.prices.map(item => (
          <article className="stat-card" key={item.karat}>
            <TrendIcon />
            <span>عيار {item.karat}</span>
            <strong>{item.price.toFixed(3)} د.أ / غم</strong>
            <small className={change < 0 ? 'danger' : 'success'}>{change > 0 ? '+' : ''}{change.toFixed(2)}%</small>
          </article>
        ))}
      </div>
      <div className="gold-price-meta">
        <span>{data.stale ? 'آخر سعر محفوظ' : 'سعر السوق العالمي'}</span>
        <time dateTime={data.timestamp}>آخر تحديث: {new Date(data.timestamp).toLocaleString('ar-JO')}</time>
        <span className="auto-update-status">تحديث تلقائي كل 8 ساعات</span>
        <button type="button" onClick={() => void refresh()}><RefreshCw /> تحديث</button>
      </div>
    </>
  )
}
