import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const styles = {
  container: `bg-[#171924] rounded-2xl p-6 border border-gray-800/50`,
  title: `text-lg font-bold text-white mb-1`,
  subtitle: `text-gray-500 text-sm mb-4`,
  list: `space-y-1.5`,
  item: `flex items-center justify-between p-3 bg-[#222531]/40 rounded-xl cursor-pointer hover:bg-[#2a2d3a] hover:border-[#6188FF]/30 border border-transparent transition-all`,
  name: `text-white text-sm font-semibold`,
  symbol: `text-gray-500 text-xs uppercase`,
  price: `text-white text-sm font-semibold`,
  coinIcon: `w-6 h-6 rounded-full flex-shrink-0`,
  itemLeft: `flex items-center gap-2.5 min-w-0`,
  empty: `text-gray-500 text-center py-6 text-sm`,
}

const RecentViewed = () => {
  const [recent, setRecent] = useState([])
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyViewed')
      if (stored) setRecent(JSON.parse(stored))
    } catch {}
  }, [])

  if (recent.length === 0) return null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recently Viewed</h2>
      <p className={styles.subtitle}>Your browsing history</p>
      <div className={styles.list}>
        {recent.slice(0, 5).map((coin, i) => (
          <div
            key={i}
            className={styles.item}
            onClick={() => router.push(`/currencies/info?coin=${coin.name}&symbol=${coin.symbol}&price=${coin.price}`)}
          >
            <div className={styles.itemLeft}>
              {coin.image && <img src={coin.image} alt={coin.name} className={styles.coinIcon} />}
              <div>
                <p className={styles.name}>{coin.name}</p>
                <p className={styles.symbol}>{coin.symbol?.toUpperCase()}</p>
              </div>
            </div>
            <p className={styles.price}>${Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentViewed
