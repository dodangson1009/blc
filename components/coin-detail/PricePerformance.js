const styles = {
  container: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-1`,
  subtitle: `text-gray-500 text-sm mb-6`,
  grid: `grid grid-cols-2 md:grid-cols-3 gap-3`,
  card: `bg-[#222531]/40 rounded-xl p-4 border border-gray-800/30`,
  cardLabel: `text-gray-500 text-xs font-medium mb-2`,
  cardValue: `text-white text-sm font-bold`,
  badge: `inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold mt-2`,
  positive: `bg-[#16c784]/10 text-[#16c784]`,
  negative: `bg-[#ea3943]/10 text-[#ea3943]`,
  neutral: `bg-gray-700/30 text-gray-400`,
  bar: `mt-2 h-1 rounded-full bg-[#2a2d3a] overflow-hidden`,
  barFill: `h-full rounded-full transition-all`,
}

const periods = [
  { key: '1h', label: '1H', field: 'price_change_percentage_1h_in_currency', isNested: true },
  { key: '24h', label: '24H', field: 'price_change_percentage_24h' },
  { key: '7d', label: '7D', field: 'price_change_percentage_7d' },
  { key: '30d', label: '30D', field: 'price_change_percentage_30d' },
  { key: '90d', label: '90D', field: 'price_change_percentage_90d' },
  { key: '1y', label: '1Y', field: 'price_change_percentage_1y' },
]

const PricePerformance = ({ coinData }) => {
  if (!coinData?.market_data) return null
  const md = coinData.market_data

  const hasAnyData = periods.some(p => {
    if (p.isNested) return md[p.field]?.usd != null
    return md[p.field] != null
  })

  if (!hasAnyData) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Price Performance</h2>
      <p className={styles.subtitle}>How {coinData.name} has performed over different time periods</p>
      <div className={styles.grid}>
        {periods.map(({ key, label, field, isNested }) => {
          const value = isNested ? md[field]?.usd : md[field]
          if (value == null) return null
          const isPositive = value >= 0
          const absVal = Math.abs(value)
          const barWidth = Math.min(absVal / 3, 100)

          return (
            <div key={key} className={styles.card}>
              <p className={styles.cardLabel}>{label}</p>
              <p className={`${styles.cardValue} ${isPositive ? 'text-[#16c784]' : 'text-[#ea3943]'}`}>
                {isPositive ? '+' : ''}{value.toFixed(2)}%
              </p>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${barWidth}%`,
                    background: isPositive ? '#16c784' : '#ea3943',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PricePerformance
