import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const styles = {
  hero: `bg-[#171924] rounded-2xl p-6 md:p-8 mb-6 border border-gray-800/50`,
  topRow: `flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6`,
  coinIdentity: `flex items-center gap-4`,
  coinIcon: `rounded-full border-2 border-gray-700`,
  coinNameBlock: `flex flex-col`,
  coinName: `text-2xl md:text-3xl font-bold text-white leading-tight`,
  coinSymbol: `text-gray-400 text-sm font-medium uppercase tracking-wide`,
  rankBadge: `inline-flex items-center px-3 py-1 rounded-full bg-[#6188FF]/10 border border-[#6188FF]/30 text-[#6188FF] text-xs font-bold mt-1 w-fit`,
  actions: `flex items-center gap-2 flex-wrap`,
  actionBtn: `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer`,
  watchlistActive: `bg-[#16c784]/15 text-[#16c784] border border-[#16c784]/30`,
  watchlistInactive: `bg-[#222531] text-gray-300 border border-gray-700 hover:border-[#6188FF]/50 hover:text-white`,
  shareBtn: `bg-[#222531] text-gray-300 border border-gray-700 hover:border-[#6188FF]/50 hover:text-white`,
  buyBtn: `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer bg-[#16c784] text-white hover:bg-[#15b876]`,
  priceBlock: `mb-6`,
  price: `text-3xl md:text-4xl font-bold text-white tracking-tight`,
  priceChangeBadge: `inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ml-3`,
  positive: `bg-[#16c784]/10 text-[#16c784]`,
  negative: `bg-[#ea3943]/10 text-[#ea3943]`,
  changeSubtext: `text-gray-500 text-xs mt-1 ml-3`,
  networkRow: `flex items-center gap-3 text-sm text-gray-400 mb-4 flex-wrap`,
  networkBadge: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#222531] border border-gray-700 text-gray-300 text-xs`,
  networkDot: `w-2 h-2 rounded-full bg-[#6188FF]`,
  contractRow: `inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#222531] border border-gray-700 text-gray-300 text-xs cursor-pointer hover:border-[#6188FF]/50 transition-colors`,
  contractAddress: `font-mono max-w-[180px] truncate`,
  copyIcon: `text-gray-500 hover:text-[#6188FF]`,
  statsGrid: `grid grid-cols-2 md:grid-cols-4 gap-3`,
  statCard: `bg-[#222531]/60 rounded-xl p-4 border border-gray-800/30 hover:border-gray-700/50 transition-colors`,
  statLabel: `text-gray-500 text-xs font-medium mb-1`,
  statValue: `text-white text-sm md:text-base font-bold`,
  statGreen: `text-[#16c784]`,
  statRed: `text-[#ea3943]`,
}

const HeroSection = ({ coinData }) => {
  const [watchlisted, setWatchlisted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      return list.some((item) => {
        if (typeof item === 'string') return item === coinData?.id
        return item.id === coinData?.id
      })
    } catch { return false }
  })

  if (!coinData) return null

  const { market_data: md, links } = coinData
  const priceChange24h = md?.price_change_percentage_24h || 0
  const priceChange1h = md?.price_change_percentage_1h_in_currency?.usd || 0
  const isPositive = priceChange24h >= 0

  const toggleWatchlist = () => {
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      if (watchlisted) {
        // Remove by id (handle both old string format and new object format)
        localStorage.setItem('watchlist', JSON.stringify(
          list.filter((item) => {
            if (typeof item === 'string') return item !== coinData.id
            return item.id !== coinData.id
          })
        ))
      } else {
        // Store full coin object for watchlist page to display
        const coinObj = {
          id: coinData.id,
          name: coinData.name,
          symbol: coinData.symbol,
          price: md?.current_price?.usd || 0,
          image: coinData.image?.small || coinData.image?.large || '',
          marketCapRank: coinData.market_cap_rank,
        }
        localStorage.setItem('watchlist', JSON.stringify([...list, coinObj]))
      }
      setWatchlisted(!watchlisted)
    } catch {}
  }

  const copyContract = () => {
    if (coinData.contract_address) {
      navigator.clipboard.writeText(coinData.contract_address)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${coinData.name} (${coinData.symbol?.toUpperCase()})`, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className={styles.hero}>
      <div className={styles.topRow}>
        <div className={styles.coinIdentity}>
          {coinData.image?.large && (
            <Image src={coinData.image.large} width={56} height={56} className={styles.coinIcon} alt={coinData.name} unoptimized />
          )}
          <div className={styles.coinNameBlock}>
            <div className='flex items-center gap-3'>
              <h1 className={styles.coinName}>{coinData.name}</h1>
              <span className={styles.coinSymbol}>{coinData.symbol?.toUpperCase()}</span>
            </div>
            {coinData.market_cap_rank && (
              <span className={styles.rankBadge}>Rank #{coinData.market_cap_rank}</span>
            )}
          </div>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${watchlisted ? styles.watchlistActive : styles.watchlistInactive}`} onClick={toggleWatchlist}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill={watchlisted ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' /></svg>
            {watchlisted ? 'Watching' : 'Watchlist'}
          </button>
          <Link href={`/buy?coin=${coinData.id}`} className={styles.buyBtn}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='12' y1='19' x2='12' y2='5' /><polyline points='5 12 12 5 19 12' />
            </svg>
            Buy
          </Link>
          <button className={`${styles.actionBtn} ${styles.shareBtn}`} onClick={handleShare}>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><circle cx='18' cy='5' r='3' /><circle cx='6' cy='12' r='3' /><circle cx='18' cy='19' r='3' /><line x1='8.59' y1='13.51' x2='15.42' y2='17.49' /><line x1='15.41' y1='6.51' x2='8.59' y2='10.49' /></svg>
            Share
          </button>
        </div>
      </div>

      <div className={styles.networkRow}>
        <div className={styles.networkBadge}>
          <span className={styles.networkDot} />
          {coinData.categories?.[0] || 'Blockchain'}
        </div>
        {coinData.contract_address && (
          <div className={styles.contractRow} onClick={copyContract}>
            <span className={styles.contractAddress}>{coinData.contract_address}</span>
            <svg className={styles.copyIcon} width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'><rect x='9' y='9' width='13' height='13' rx='2' ry='2' /><path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' /></svg>
          </div>
        )}
      </div>

      <div className={styles.priceBlock}>
        <span className={styles.price}>${md?.current_price?.usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span className={`${styles.priceChangeBadge} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(priceChange24h).toFixed(2)}%
        </span>
        <span className={styles.changeSubtext}>
          1H: <span className={priceChange1h >= 0 ? 'text-[#16c784]' : 'text-[#ea3943]'}>{priceChange1h >= 0 ? '+' : ''}{priceChange1h.toFixed(2)}%</span>
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Market Cap</p>
          <p className={styles.statValue}>${md?.market_cap?.usd ? (md.market_cap.usd / 1e9).toFixed(2) + 'B' : 'N/A'}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>24H Volume</p>
          <p className={styles.statValue}>${md?.total_volume?.usd ? (md.total_volume.usd / 1e9).toFixed(2) + 'B' : 'N/A'}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>FDV</p>
          <p className={styles.statValue}>${md?.fully_diluted_valuation?.usd ? (md.fully_diluted_valuation.usd / 1e9).toFixed(2) + 'B' : 'N/A'}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Circulating Supply</p>
          <p className={styles.statValue}>{md?.circulating_supply ? (md.circulating_supply / 1e6).toFixed(2) + 'M' : 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
