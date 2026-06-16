import Image from 'next/image'
import More from '../../assets/svg/more'
import CoinNameRow from '../coinNameRow'
import Rate from './rate'
import { useRouter } from 'next/router'
import { useMemo, useState, useCallback } from 'react'

const styles = {
  tableRow: `text-white border-b border-gray-800 text-[0.93rem]`,
  starBtn: `cursor-pointer transition-all hover:scale-110`,
}

const GRAPH_IMAGES = [
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/52.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/825.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/5426.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/7129.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3957.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/328.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/2416.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1765.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/2099.svg',
  'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/7653.svg',
]

const CMCtableRow = ({
  coinId,
  starNum,
  coinName,
  coinIcon,
  coinSymbol = '---',
  price = '----',
  hRate = '---',
  dRate = '---',
  hRateIsIncrement,
  marketCapValue = '---',
  volumeValue = '---',
  volumeCryptoValue = '---',
  circulatingSupply = '---',
}) => {
  const router = useRouter()

  const [isWatchlisted, setIsWatchlisted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      return list.some((item) => {
        if (typeof item === 'string') return item === coinId
        return item.id === coinId
      })
    } catch { return false }
  })

  const graphImage = useMemo(() => {
    return GRAPH_IMAGES[Math.floor(Math.random() * GRAPH_IMAGES.length)]
  }, [])

  const formatNum = (num) => {
    if (typeof num === 'string') return num
    return Number(num.toFixed(2)).toLocaleString()
  }

  const viewCoinDetails = () => {
    router.push(`/currencies/info?symbol=${coinSymbol}&coin=${coinName}&price=${price}`)
  }

  const viewPrice = () => {
    router.push(`/currencies/price?symbol=${coinSymbol}&coin=${coinName}&price=${price}`)
  }

  const toggleWatchlist = useCallback((e) => {
    e.stopPropagation()
    try {
      const list = JSON.parse(localStorage.getItem('watchlist') || '[]')
      if (isWatchlisted) {
        // Remove from watchlist
        const updated = list.filter((item) => {
          if (typeof item === 'string') return item !== coinId
          return item.id !== coinId
        })
        localStorage.setItem('watchlist', JSON.stringify(updated))
        setIsWatchlisted(false)
      } else {
        // Add to watchlist with full coin data
        const coinObj = {
          id: coinId,
          name: coinName,
          symbol: coinSymbol,
          price: typeof price === 'number' ? price : parseFloat(String(price).replace(/,/g, '')) || 0,
          image: coinIcon || '',
          percentChange24h: hRate || 0,
        }
        localStorage.setItem('watchlist', JSON.stringify([...list, coinObj]))
        setIsWatchlisted(true)
      }
    } catch {}
  }, [isWatchlisted, coinId, coinName, coinSymbol, price, coinIcon, hRate])

  return (
    <tbody className={styles.tableRow}>
      <tr>
        <td>
          <span className={styles.starBtn} onClick={toggleWatchlist} title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}>
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill={isWatchlisted ? '#f0b90b' : 'none'} stroke={isWatchlisted ? '#f0b90b' : '#fff'} strokeWidth='2'>
              <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
            </svg>
          </span>
        </td>
        <td>{starNum}</td>

        {coinIcon && (
          <td className='cursor-pointer'>
            <CoinNameRow name={coinName} icon={coinIcon} clicked={viewCoinDetails} />
          </td>
        )}

        <td className='cursor-pointer' onClick={viewPrice}>
          <p>${formatNum(price)}</p>
        </td>
        <td>
          <Rate isIncrement={hRateIsIncrement} rate={`${formatNum(hRate)}%`} />
        </td>
        <td>
          <Rate isIncrement={typeof dRate === 'number' ? dRate >= 0 : hRateIsIncrement} rate={`${formatNum(dRate)}%`} />
        </td>

        <td>
          <div>
            <p>${formatNum(marketCapValue)}</p>
          </div>
        </td>

        <td>
          <div>
            <p>{formatNum(volumeValue)}</p>
            <p className='text-gray-400'>
              {formatNum(volumeCryptoValue)} {coinSymbol}
            </p>
          </div>
        </td>

        <td>
          <div>
            <p>{formatNum(circulatingSupply)}</p>
          </div>
        </td>

        <td>
          <Image src={graphImage} width={150} height={60} alt='' unoptimized />
        </td>

        <td>
          <More />
        </td>
      </tr>
    </tbody>
  )
}

export default CMCtableRow
