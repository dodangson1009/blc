import { useEffect, useRef, useState } from 'react'

const timeframes = [
  { label: '1H', days: 1, timeVisible: true },
  { label: '24H', days: 1, timeVisible: false },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: 1825 },
]

const styles = {
  container: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  header: `flex items-center justify-between mb-4`,
  title: `text-lg font-bold text-white`,
  timeframeButtons: `flex gap-1.5 flex-wrap`,
  timeframeBtn: `px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all`,
  active: `bg-[#6188FF] text-white shadow-lg shadow-[#6188FF]/20`,
  inactive: `bg-[#222531] text-gray-400 hover:bg-[#2a2d3a] hover:text-white`,
  chartContainer: `w-full h-[350px] md:h-[420px] relative`,
  noData: `flex items-center justify-center h-[200px] text-gray-500 text-sm`,
}

const PriceChart = ({ coinId }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const [activeTimeframe, setActiveTimeframe] = useState(7)
  const [showTime, setShowTime] = useState(true)
  const [hasData, setHasData] = useState(true)

  useEffect(() => {
    if (!coinId) return
    loadChart()
    return () => {
      chartRef.current?.remove()
      chartRef.current = null
    }
  }, [coinId, activeTimeframe, showTime])

  const loadChart = async () => {
    try {
      const { createChart, ColorType, CrosshairMode } = await import('lightweight-charts')

      const res = await fetch(`/api/getCoinChart?id=${coinId}&days=${activeTimeframe}`)
      const json = await res.json()

      if (!json.data?.prices || json.data.prices.length === 0) {
        setHasData(false)
        return
      }

      setHasData(true)
      const chartData = json.data.prices.map(([time, price]) => ({
        time: Math.floor(time / 1000),
        value: price,
      }))

      if (chartRef.current) {
        chartRef.current.remove()
      }

      const container = chartContainerRef.current
      if (!container) return

      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#9CA3AF',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        },
        grid: {
          vertLines: { color: '#22253180' },
          horzLines: { color: '#22253180' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { color: '#6188FF40', width: 1, style: 2 },
          horzLine: { color: '#6188FF40', width: 1, style: 2 },
        },
        rightPriceScale: {
          borderColor: '#222531',
        },
        timeScale: {
          borderColor: '#222531',
          timeVisible: showTime,
        },
        width: container.clientWidth,
        height: container.clientHeight || 400,
      })

      const { AreaSeries } = await import('lightweight-charts')
      const firstPrice = chartData[0]?.value || 0
      const lastPrice = chartData[chartData.length - 1]?.value || 0
      const isPositive = lastPrice >= firstPrice

      const areaSeries = chart.addSeries(AreaSeries, {
        topColor: isPositive ? '#16c78433' : '#ea394333',
        bottomColor: isPositive ? '#16c78405' : '#ea394305',
        lineColor: isPositive ? '#16c784' : '#ea3943',
        lineWidth: 2,
      })

      areaSeries.setData(chartData)
      chart.timeScale().fitContent()
      chartRef.current = chart
    } catch (err) {
      console.error('Chart error:', err)
      setHasData(false)
    }
  }

  if (!hasData) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Price Chart</h2>
        <div className={styles.timeframeButtons}>
          {timeframes.map((tf) => (
            <button
              key={tf.label}
              className={`${styles.timeframeBtn} ${activeTimeframe === tf.days ? styles.active : styles.inactive}`}
              onClick={() => { setActiveTimeframe(tf.days); setShowTime(tf.timeVisible || false); }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartContainer} ref={chartContainerRef} />
    </div>
  )
}

export default PriceChart
