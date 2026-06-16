import Header from '../../components/header'
import HeroSection from '../../components/coin-detail/HeroSection'
import PriceChart from '../../components/coin-detail/PriceChart'
import PricePerformance from '../../components/coin-detail/PricePerformance'
import MarketStatistics from '../../components/coin-detail/MarketStatistics'
import AboutCoin from '../../components/coin-detail/AboutCoin'
import ContractInfo from '../../components/coin-detail/ContractInfo'
import SimilarCoins from '../../components/coin-detail/SimilarCoins'
import RecentViewed from '../../components/coin-detail/RecentViewed'
import { HeroSkeleton, ChartSkeleton, StatsSkeleton, SidebarSkeleton } from '../../components/coin-detail/SkeletonLoader'
import { useEffect, useState } from 'react'

const COIN_ID_MAP = {
  'bitcoin': 'bitcoin', 'ethereum': 'ethereum', 'tether': 'tether',
  'binancecoin': 'binancecoin', 'usd-coin': 'usd-coin', 'ripple': 'ripple',
  'cardano': 'cardano', 'solana': 'solana', 'polkadot': 'polkadot',
  'avalanche-2': 'avalanche-2', 'dogecoin': 'dogecoin', 'tron': 'tron',
}

const styles = {
  page: `min-h-screen bg-[#0e0e12]`,
  container: `max-w-[1280px] mx-auto px-4 md:px-6 py-6 md:py-10`,
  layout: `flex flex-col lg:flex-row gap-6`,
  main: `flex-1 min-w-0`,
  sidebar: `w-full lg:w-[380px] flex-shrink-0 space-y-6`,
  error: `flex flex-col items-center justify-center min-h-[60vh] text-center`,
  errorIcon: `w-16 h-16 rounded-full bg-[#ea3943]/10 flex items-center justify-center mb-4`,
  errorTitle: `text-xl font-bold text-white mb-2`,
  errorText: `text-gray-400 text-sm mb-6`,
  retryBtn: `px-6 py-2.5 bg-[#6188FF] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity`,
}

const Currencies = () => {
  const [coinData, setCoinData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMockData, setIsMockData] = useState(false)
  const [coinId] = useState(() => {
    if (typeof window === 'undefined') return 'bitcoin'
    const urlParams = new URLSearchParams(window.location.search)
    const coinName = urlParams.get('coin')?.toLowerCase() || 'bitcoin'
    return COIN_ID_MAP[coinName] || coinName
  })

  useEffect(() => {
    if (!coinId) return
    fetchCoinData()
  }, [coinId])

  const fetchCoinData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/getCoinDetail?id=${coinId}`)
      const json = await res.json()
      setIsMockData(!!json.mock)
      if (json.data) {
        setCoinData(json.data)
        try {
          const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
          const entry = { name: json.data.name, symbol: json.data.symbol, price: json.data.market_data?.current_price?.usd, image: json.data.image?.small || json.data.image?.large || '' }
          const updated = [entry, ...recent.filter(r => r.name !== entry.name)].slice(0, 10)
          localStorage.setItem('recentlyViewed', JSON.stringify(updated))
        } catch {}
      } else {
        setError('Coin not found')
      }
    } catch (err) {
      setError('Unable to load coin information. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <HeroSkeleton />
          <div className={styles.layout}>
            <div className={styles.main}>
              <ChartSkeleton />
              <StatsSkeleton />
            </div>
            <div className={styles.sidebar}>
              <SidebarSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            <div className={styles.errorIcon}>
              <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#ea3943' strokeWidth='2'><circle cx='12' cy='12' r='10' /><line x1='12' y1='8' x2='12' y2='12' /><line x1='12' y1='16' x2='12.01' y2='16' /></svg>
            </div>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={fetchCoinData}>Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        {isMockData && (
          <div className='bg-[#f0b90b]/10 border border-[#f0b90b]/30 rounded-xl px-4 py-2.5 mb-6 text-[#f0b90b] text-sm text-center font-medium'>
            ⚠️ Displaying test data — no live API connection. Prices are not real-time.
          </div>
        )}
        <div className={styles.layout}>
          <div className={styles.main}>
            <HeroSection coinData={coinData} />
            <PriceChart coinId={coinId} />
            <PricePerformance coinData={coinData} />
            <MarketStatistics coinData={coinData} />
            <AboutCoin coinData={coinData} />
          </div>
          <div className={styles.sidebar}>
            <ContractInfo coinData={coinData} />
            <SimilarCoins coinId={coinId} />
            <RecentViewed />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Currencies
