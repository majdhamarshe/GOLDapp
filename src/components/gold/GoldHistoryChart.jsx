import { useMemo, useState } from 'react'
import useGoldHistory from '../../hooks/useGoldHistory'

const chartWidth = 900
const chartHeight = 320
const padding = { top: 24, right: 28, bottom: 50, left: 68 }
const karats = [24, 22, 21, 18]

export default function GoldHistoryChart() {
  const { data, error } = useGoldHistory()
  const [karat, setKarat] = useState(24)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const chart = useMemo(() => {
    if (!data?.points?.length) return null
    const values = data.points.map(point => point.price24 * (karat / 24))
    const minimum = Math.min(...values)
    const maximum = Math.max(...values)
    const range = maximum - minimum || 1
    const innerWidth = chartWidth - padding.left - padding.right
    const innerHeight = chartHeight - padding.top - padding.bottom
    const coordinates = values.map((value, index) => ({
      x: padding.left + (index / Math.max(values.length - 1, 1)) * innerWidth,
      y: padding.top + ((maximum - value) / range) * innerHeight,
      value,
      date: data.points[index].date,
    }))
    return { coordinates, minimum, maximum, polyline: coordinates.map(point => `${point.x},${point.y}`).join(' ') }
  }, [data, karat])

  function handlePointerMove(event) {
    if (!chart) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * chartWidth
    const closest = chart.coordinates.reduce((current, point) => (
      Math.abs(point.x - pointerX) < Math.abs(current.x - pointerX) ? point : current
    ))
    setHoveredPoint(closest)
  }

  return (
    <section className="history-card" aria-labelledby="history-title">
      <div className="history-heading">
        <div><span>آخر 30 يوماً</span><h2 id="history-title">حركة سعر الذهب</h2></div>
        <div className="karat-tabs" aria-label="اختيار العيار">
          {karats.map(item => <button className={item === karat ? 'active' : ''} type="button" key={item} onClick={() => { setKarat(item); setHoveredPoint(null) }}>عيار {item}</button>)}
        </div>
      </div>

      {error && <div className="price-message price-error">{error}</div>}
      {!error && !chart && <div className="price-message">جاري تحميل حركة السوق…</div>}
      {chart && (
        <div className="chart-scroll">
          <svg className="gold-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-labelledby="gold-chart-title" onPointerMove={handlePointerMove} onPointerLeave={() => setHoveredPoint(null)}>
            <title id="gold-chart-title">مخطط سعر الذهب عيار {karat} خلال آخر 30 يوماً</title>
            {[0, 1, 2, 3, 4].map(line => {
              const y = padding.top + (line / 4) * (chartHeight - padding.top - padding.bottom)
              const value = chart.maximum - (line / 4) * (chart.maximum - chart.minimum)
              return <g key={line}><line x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} className="chart-grid-line" /><text x={padding.left - 10} y={y + 4} textAnchor="end">{value.toFixed(2)}</text></g>
            })}
            <polyline points={chart.polyline} className="gold-chart-line" />
            {chart.coordinates.map(point => (
              <circle key={point.date} cx={point.x} cy={point.y} r={hoveredPoint?.date === point.date ? 7 : 4} className="gold-chart-point" />
            ))}
            {hoveredPoint && (() => {
              const tooltipWidth = 190
              const tooltipHeight = 64
              const x = Math.min(Math.max(hoveredPoint.x - tooltipWidth / 2, 8), chartWidth - tooltipWidth - 8)
              const y = hoveredPoint.y > 100 ? hoveredPoint.y - tooltipHeight - 16 : hoveredPoint.y + 16
              return <foreignObject x={x} y={y} width={tooltipWidth} height={tooltipHeight} pointerEvents="none"><div className="chart-tooltip" dir="rtl"><span>{new Date(hoveredPoint.date).toLocaleDateString('ar-JO', { weekday: 'short', day: 'numeric', month: 'long' })}</span><strong>{hoveredPoint.value.toFixed(3)} د.أ / غم — عيار {karat}</strong></div></foreignObject>
            })()}
            {[0, Math.floor(chart.coordinates.length / 2), chart.coordinates.length - 1].map(index => {
              const point = chart.coordinates[index]
              return <text key={point.date} x={point.x} y={chartHeight - 16} textAnchor="middle">{new Date(point.date).toLocaleDateString('ar-JO', { day: 'numeric', month: 'short' })}</text>
            })}
          </svg>
        </div>
      )}
      <p className="chart-caption">السعر بالدينار الأردني لكل غرام. مرّر المؤشر على النقاط لعرض القيمة اليومية.</p>
    </section>
  )
}
