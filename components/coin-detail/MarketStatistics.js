const styles = {
  container: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-1`,
  subtitle: `text-gray-500 text-sm mb-6`,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-3`,
  row: `flex items-center justify-between py-3 border-b border-gray-800/40 last:border-0 px-2 -mx-2 rounded-lg hover:bg-[#222531]/30 transition-colors`,
  label: `text-gray-400 text-sm`,
  value: `text-white text-sm font-semibold`,
}

const formatNumber = (num, prefix = '$') => {
  if (!num && num !== 0) return null
  if (num >= 1e12) return prefix + (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return prefix + (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return prefix + (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return prefix + (num / 1e3).toFixed(2) + 'K'
  return prefix + num.toLocaleString()
}

const formatSupply = (num) => {
  if (!num && num !== 0) return null
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toLocaleString()
}

const MarketStatistics = ({ coinData }) => {
  if (!coinData?.market_data) return null
  const md = coinData.market_data
  const symbol = coinData.symbol?.toUpperCase() || ''

  const circPct = md.circulating_supply && md.max_supply
    ? ((md.circulating_supply / md.max_supply) * 100).toFixed(1)
    : null

  const supplyRows = [
    { label: 'Circulating Supply', value: formatSupply(md.circulating_supply), suffix: symbol },
    { label: 'Total Supply', value: formatSupply(md.total_supply), suffix: symbol },
    md.max_supply && { label: 'Max Supply', value: formatSupply(md.max_supply), suffix: symbol },
    circPct && { label: 'Supply Used', value: circPct + '%', isBar: true },
  ].filter(Boolean)

  const marketRows = [
    { label: 'Market Cap', value: formatNumber(md.market_cap?.usd) },
    { label: 'Fully Diluted Valuation', value: formatNumber(md.fully_diluted_valuation?.usd) },
    { label: '24H Trading Volume', value: formatNumber(md.total_volume?.usd) },
  ].filter(r => r.value)

  const priceRows = [
    { label: 'Current Price', value: formatNumber(md.current_price?.usd) },
    { label: '24H High', value: formatNumber(md.high_24h?.usd), color: 'text-[#16c784]' },
    { label: '24H Low', value: formatNumber(md.low_24h?.usd), color: 'text-[#ea3943]' },
  ].filter(r => r.value)

  const athAtlRows = [
    { label: 'All-Time High', value: formatNumber(md.ath?.usd), sub: md.ath_change_percentage?.usd ? `${md.ath_change_percentage.usd.toFixed(2)}% from ATH` : null, date: md.ath_date?.usd },
    { label: 'All-Time Low', value: formatNumber(md.atl?.usd), sub: md.atl_change_percentage?.usd ? `${md.atl_change_percentage.usd.toFixed(2)}% from ATL` : null, date: md.atl_date?.usd },
  ].filter(r => r.value)

  const hasAnyData = marketRows.length > 0 || supplyRows.length > 0 || priceRows.length > 0
  if (!hasAnyData) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Market Statistics</h2>
      <p className={styles.subtitle}>Key metrics for {coinData.name}</p>

      {priceRows.length > 0 && (
        <div className='mb-5'>
          {priceRows.map((r, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.label}>{r.label}</span>
              <span className={`${styles.value} ${r.color || ''}`}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {marketRows.length > 0 && (
        <div className='mb-5'>
          {marketRows.map((r, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.label}>{r.label}</span>
              <span className={styles.value}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      {supplyRows.length > 0 && (
        <div className='mb-5'>
          {supplyRows.map((r, i) => (
            r.isBar ? (
              <div key={i} className='px-2 -mx-2 py-2'>
                <div className='flex justify-between mb-1'>
                  <span className={styles.label}>{r.label}</span>
                  <span className={styles.value}>{r.value}</span>
                </div>
                <div className='h-1.5 rounded-full bg-[#2a2d3a] overflow-hidden'>
                  <div className='h-full rounded-full bg-[#6188FF]' style={{ width: `${r.value}` }} />
                </div>
              </div>
            ) : (
              <div key={i} className={styles.row}>
                <span className={styles.label}>{r.label}</span>
                <span className={styles.value}>{r.value} {r.suffix}</span>
              </div>
            )
          ))}
        </div>
      )}

      {athAtlRows.length > 0 && (
        <div>
          {athAtlRows.map((r, i) => (
            <div key={i}>
              <div className={styles.row}>
                <span className={styles.label}>{r.label}</span>
                <span className={styles.value}>{r.value}</span>
              </div>
              {r.sub && <p className='text-xs text-gray-500 text-right px-2 -mt-2 mb-1'>{r.sub}</p>}
              {r.date && <p className='text-xs text-gray-600 text-right px-2 mb-2'>Date: {new Date(r.date).toLocaleDateString()}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarketStatistics
