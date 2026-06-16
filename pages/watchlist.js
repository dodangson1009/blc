import Header from '../components/header'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const styles = {
  page: `min-h-screen bg-[#17171A]`,
  container: `max-w-4xl mx-auto p-10`,
  title: `text-2xl font-bold text-white mb-8`,
  subtitle: `text-gray-500 text-sm mb-6`,
  empty: `text-gray-400 text-center py-20`,
  emptyIcon: `text-5xl mb-3`,
  grid: `grid grid-cols-1 md:grid-cols-2 gap-4`,
  card: `flex items-center justify-between p-4 bg-[#222531] rounded-xl cursor-pointer hover:bg-[#2a2d3a] transition-all border border-gray-800/30 hover:border-gray-700/50`,
  left: `flex items-center gap-3`,
  coinImg: `w-10 h-10 rounded-full`,
  name: `text-white font-semibold`,
  symbol: `text-gray-400 text-sm`,
  right: `text-right`,
  price: `text-white font-semibold text-sm`,
  change: `text-xs mt-0.5 font-semibold`,
  positive: `text-[#16c784]`,
  negative: `text-[#ea3943]`,
  actions: `flex gap-2 mt-2`,
  actionBtn: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all`,
  buyBtn: `bg-[#16c784]/15 text-[#16c784] hover:bg-[#16c784]/25`,
  removeBtn: `bg-[#ea3943]/15 text-[#ea3943] hover:bg-[#ea3943]/25`,
  loadingBadge: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#6188FF]/10 text-[#6188FF] text-xs`,
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const router = useRouter()

  // Enrich watchlist entries with live data from API
  const enrichWithLiveData = useCallback(async (items) => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/getTopTen')
      const json = await res.json()
      const apiCoins = json?.data?.data || []

      if (apiCoins.length === 0) return items

      const enriched = items.map((item) => {
        // Find matching coin by id or symbol
        const live = apiCoins.find(
          (c) => c.id === item.id || c.symbol?.toLowerCase() === (item.symbol || '').toLowerCase()
        )
        if (live) {
          return {
            ...item,
            name: live.name || item.name,
            symbol: live.symbol || item.symbol,
            price: live.quote?.USD?.price || item.price,
            image: live.image || item.image,
            marketCapRank: live.cmc_rank || item.marketCapRank,
            percentChange24h: live.quote?.USD?.percent_change_24h || 0,
          }
        }
        return item
      })

      // Save enriched data back to localStorage
      localStorage.setItem('watchlist', JSON.stringify(enriched))
      return enriched
    } catch {
      return items
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const stored = localStorage.getItem('watchlist')
        if (stored) {
          const parsed = JSON.parse(stored)
          // Migrate old format (array of ID strings) to object format
          const migrated = parsed.map((item) => {
            if (typeof item === 'string') {
              return {
                id: item,
                name: item.charAt(0).toUpperCase() + item.slice(1),
                symbol: item.toUpperCase().slice(0, 4),
                price: 0,
                image: '',
              }
            }
            return item
          })

          setWatchlist(migrated)

          // Check if any entries need enrichment (missing price or image)
          const needsEnrichment = migrated.some((item) => !item.price || !item.image)
          if (needsEnrichment) {
            const enriched = await enrichWithLiveData(migrated)
            setWatchlist(enriched)
          } else {
            // Still refresh prices in background for freshness
            enrichWithLiveData(migrated).then(setWatchlist)
          }
        }
      } catch {}
      setLoading(false)
    }
    loadWatchlist()
  }, [enrichWithLiveData])

  const removeFromWatchlist = (coinId, e) => {
    e.stopPropagation()
    const updated = watchlist.filter((c) => c.id !== coinId)
    setWatchlist(updated)
    const cleanList = updated.map((c) => (typeof c === 'string' ? c : c.id || c))
    localStorage.setItem('watchlist', JSON.stringify(cleanList.filter(Boolean)))
  }

  const handleBuy = (coin, e) => {
    e.stopPropagation()
    router.push(`/buy?coin=${coin.id}`)
  }

  const handleRefresh = async (e) => {
    e.stopPropagation()
    const enriched = await enrichWithLiveData(watchlist)
    setWatchlist(enriched)
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <div className='flex items-center justify-between mb-2'>
          <h1 className={styles.title}>⭐ Watchlist</h1>
          {watchlist.length > 0 && (
            <button
              className={`${styles.loadingBadge} ${refreshing ? 'animate-pulse' : 'cursor-pointer hover:bg-[#6188FF]/20'}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className='w-3 h-3 border-2 border-[#6188FF] border-t-transparent rounded-full animate-spin' />
                  Updating...
                </>
              ) : (
                <>
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='23 4 23 10 17 10' />
                    <path d='M20.49 15a9 9 0 1 1-2.12-9.36L23 10' />
                  </svg>
                  Refresh prices
                </>
              )}
            </button>
          )}
        </div>
        <p className={styles.subtitle}>Your favorite cryptocurrencies — click any coin to see details</p>

        {loading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='h-20 bg-[#222531] rounded-xl animate-pulse' />
            ))}
          </div>
        ) : watchlist.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⭐</div>
            <p>Your watchlist is empty</p>
            <p className='text-sm mt-2 text-gray-600'>Click the star icon on any coin to add it here</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {watchlist.map((coin, i) => (
              <div
                key={coin.id || i}
                className={styles.card}
                onClick={() => router.push(`/currencies/info?coin=${coin.name}&symbol=${coin.symbol}&price=${coin.price}`)}
              >
                <div className={styles.left}>
                  {coin.image ? (
                    <Image src={coin.image} width={40} height={40} alt={coin.name} className={styles.coinImg} unoptimized />
                  ) : (
                    <div className={`${styles.coinImg} bg-[#6188FF]/20 flex items-center justify-center text-[#6188FF] font-bold text-sm`}>
                      {(coin.symbol || '?').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className={styles.name}>{coin.name}</p>
                    <p className={styles.symbol}>{coin.symbol?.toUpperCase()}</p>
                  </div>
                </div>
                <div className='text-right'>
                  {coin.price > 0 ? (
                    <>
                      <p className={styles.price}>${Number(coin.price).toLocaleString(undefined, { maximumFractionDigits: coin.price < 1 ? 4 : 2 })}</p>
                      {coin.percentChange24h !== undefined && coin.percentChange24h !== null && (
                        <p className={`${styles.change} ${coin.percentChange24h >= 0 ? styles.positive : styles.negative}`}>
                          {coin.percentChange24h >= 0 ? '+' : ''}{coin.percentChange24h.toFixed(2)}%
                        </p>
                      )}
                    </>
                  ) : (
                    <p className='text-gray-500 text-sm'>Loading price...</p>
                  )}
                  <div className={styles.actions}>
                    <button className={`${styles.actionBtn} ${styles.buyBtn}`} onClick={(e) => handleBuy(coin, e)}>
                      Buy
                    </button>
                    <button className={`${styles.actionBtn} ${styles.removeBtn}`} onClick={(e) => removeFromWatchlist(coin.id, e)}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
