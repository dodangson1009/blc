import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

const styles = {
  container: `bg-[#171924] rounded-2xl p-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-1`,
  subtitle: `text-gray-500 text-sm mb-4`,
  grid: `grid grid-cols-1 gap-2`,
  coinCard: `flex items-center gap-3 p-3 bg-[#222531]/40 rounded-xl cursor-pointer hover:bg-[#2a2d3a] hover:border-[#6188FF]/30 border border-transparent transition-all`,
  coinIcon: `rounded-full flex-shrink-0`,
  coinInfo: `flex-1 min-w-0`,
  coinName: `text-white text-sm font-semibold`,
  coinSymbol: `text-gray-500 text-xs uppercase`,
  coinPrice: `text-white text-sm font-semibold text-right`,
  coinChange: `text-xs font-semibold text-right`,
  positive: `text-[#16c784]`,
  negative: `text-[#ea3943]`,
  loading: `text-gray-500 text-center py-6 text-sm`,
}

const SimilarCoins = ({ coinId }) => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchSimilarCoins()
  }, [coinId])

  const fetchSimilarCoins = async () => {
    try {
      const res = await fetch('/api/getTopTen')
      const json = await res.json()
      const data = json?.data?.data || []
      const filtered = data.filter(c => c.id !== coinId).slice(0, 6)
      setCoins(filtered)
    } catch (err) {
      console.error('Failed to fetch similar coins:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className={styles.container}><p className={styles.loading}>Loading...</p></div>
  if (coins.length === 0) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>You May Also Like</h2>
      <p className={styles.subtitle}>Other popular cryptocurrencies</p>
      <div className={styles.grid}>
        {coins.map((coin) => (
          <div
            key={coin.id}
            className={styles.coinCard}
            onClick={() => router.push(`/currencies/info?coin=${coin.name}&symbol=${coin.symbol}&price=${coin.quote?.USD?.price}`)}
          >
            {coin.image && (
              <Image src={coin.image} width={32} height={32} className={styles.coinIcon} alt={coin.name} unoptimized />
            )}
            <div className={styles.coinInfo}>
              <p className={styles.coinName}>{coin.name}</p>
              <p className={styles.coinSymbol}>{coin.symbol}</p>
            </div>
            <div className='text-right'>
              <p className={styles.coinPrice}>${coin.quote?.USD?.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: coin.quote?.USD?.price < 1 ? 4 : 2 })}</p>
              <p className={`${styles.coinChange} ${(coin.quote?.USD?.percent_change_24h || 0) >= 0 ? styles.positive : styles.negative}`}>
                {(coin.quote?.USD?.percent_change_24h || 0) >= 0 ? '+' : ''}{coin.quote?.USD?.percent_change_24h?.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimilarCoins
