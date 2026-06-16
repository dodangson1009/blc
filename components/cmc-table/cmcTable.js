import { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { CoinMarketContext } from '../../context/context'
import CMCtableHeader from './cmcTableHeader'
import CMCtableRow from './cmcTableRow'

const styles = {
  controls: `flex items-center gap-3 mb-4 flex-wrap`,
  filterBtn: `px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors`,
  filterBtnActive: `bg-[#6188FF] text-white`,
  filterBtnInactive: `bg-[#222531] text-gray-300 hover:bg-[#2a2d3a]`,
  sortBtn: `px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors flex items-center gap-1`,
  searchInput: `bg-[#171924] text-white px-3 py-1.5 rounded-lg text-sm outline-none border border-gray-700 focus:border-[#6188FF] transition-colors w-full sm:w-64`,
  resultCount: `text-gray-400 text-sm ml-auto`,
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'gainers', label: 'Top Gainers' },
  { id: 'losers', label: 'Top Losers' },
]

const SORT_OPTIONS = [
  { id: 'market_cap', label: 'Market Cap' },
  { id: 'price', label: 'Price' },
  { id: 'volume', label: 'Volume' },
  { id: 'change_24h', label: '24h Change' },
]

const CMCtable = () => {
  let { getTopTenCoins, isMockData } = useContext(CoinMarketContext)
  let [coinData, setCoinData] = useState(null)
  let [loading, setLoading] = useState(true)
  let [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('market_cap')
  const [sortDesc, setSortDesc] = useState(true)
  const [filter, setFilter] = useState('all')
  const [tableSearch, setTableSearch] = useState('')

  useEffect(() => {
    setData()
  }, [])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc)
    } else {
      setSortBy(field)
      setSortDesc(true)
    }
  }

  const displayData = useMemo(() => {
    if (!coinData) return null
    let result = [...coinData]

    const searchQ = tableSearch.trim().toLowerCase()
    if (searchQ) {
      result = result.filter(coin =>
        coin.name.toLowerCase().includes(searchQ) ||
        coin.symbol.toLowerCase().includes(searchQ)
      )
    }

    if (filter === 'gainers') {
      result = result.filter(coin => coin.quote.USD.percent_change_24h > 0)
    } else if (filter === 'losers') {
      result = result.filter(coin => coin.quote.USD.percent_change_24h < 0)
    }

    result.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case 'price':
          aVal = a.quote.USD.price
          bVal = b.quote.USD.price
          break
        case 'volume':
          aVal = a.quote.USD.volume_24h
          bVal = b.quote.USD.volume_24h
          break
        case 'change_24h':
          aVal = a.quote.USD.percent_change_24h
          bVal = b.quote.USD.percent_change_24h
          break
        case 'market_cap':
        default:
          aVal = a.quote.USD.market_cap
          bVal = b.quote.USD.market_cap
          break
      }
      return sortDesc ? (bVal - aVal) : (aVal - bVal)
    })

    return result
  }, [coinData, tableSearch, sortBy, sortDesc, filter])

  const setData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      let apiResponse = await getTopTenCoins()
      setCoinData(Array.isArray(apiResponse) ? apiResponse : [])
    } catch (e) {
      console.error(e.message)
      setError('Failed to load coin data')
    } finally {
      setLoading(false)
    }
  }, [getTopTenCoins])

  if (loading) {
    return (
      <div className='text-white font-bold'>
        <div className='mx-auto max-w-screen-2xl px-4'>
          <div className='space-y-3'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='h-14 bg-[#222531] rounded-lg animate-pulse' />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-white font-bold'>
        <div className='mx-auto max-w-screen-2xl'>
          <div className='bg-[#222531] rounded-lg p-8 text-center'>
            <p className='text-[#ea3943] text-lg'>{error}</p>
            <button onClick={() => setData()} className='mt-4 px-4 py-2 bg-[#6188FF] rounded-lg hover:opacity-80'>Retry</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='text-white font-bold'>
      <div className='mx-auto max-w-screen-2xl px-4'>
        <div className={styles.controls}>
          {FILTERS.map((f) => (
            <button key={f.id} className={`${styles.filterBtn} ${filter === f.id ? styles.filterBtnActive : styles.filterBtnInactive}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
          <div className='w-px h-6 bg-gray-700 mx-2' />
          {SORT_OPTIONS.map((s) => (
            <button key={s.id} className={`${styles.sortBtn} ${sortBy === s.id ? 'text-[#6188FF]' : 'text-gray-400 hover:text-white'}`} onClick={() => handleSort(s.id)}>
              {s.label}{sortBy === s.id && <span className='text-xs'>{sortDesc ? '↓' : '↑'}</span>}
            </button>
          ))}
          <input className={styles.searchInput} placeholder='Filter coins...' value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} />
          {displayData && <span className={styles.resultCount}>{displayData.length} coin{displayData.length !== 1 ? 's' : ''}</span>}
        </div>
        {isMockData && (
          <div className='bg-[#f0b90b]/10 border border-[#f0b90b]/30 rounded-lg px-4 py-2 mb-4 text-[#f0b90b] text-sm text-center'>
            ⚠️ Displaying test data — no live API connection. Prices are not real-time.
          </div>
        )}
        <div className='overflow-x-auto -mx-4 px-4'>
        <table className='w-full min-w-[800px]'>
          <CMCtableHeader onSort={handleSort} sortBy={sortBy} sortDesc={sortDesc} />
          {displayData ? (
            displayData.length > 0 ? (
              displayData.map((coin, index) => (
                <CMCtableRow key={coin.id || index} coinId={coin.id} starNum={coin.cmc_rank} coinName={coin.name} coinSymbol={coin.symbol} coinIcon={coin.image} hRate={coin.quote.USD.percent_change_24h} dRate={coin.quote.USD.percent_change_7d} hRateIsIncrement={coin.quote.USD.percent_change_24h >= 0} price={coin.quote.USD.price} marketCapValue={coin.quote.USD.market_cap} volumeCryptoValue={coin.quote.USD.volume_24h} volumeValue={coin.total_supply} circulatingSupply={coin.circulating_supply} />
              ))
            ) : (
              <tbody><tr><td colSpan={10} className='text-center text-gray-400 py-10'>No coins found matching your criteria.</td></tr></tbody>
            )
          ) : null}
        </table>
        </div>
      </div>
    </div>
  )
}

export default CMCtable
