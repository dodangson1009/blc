import Image from 'next/image'
import { useRouter } from 'next/router'
import btc from '../assets/btc.png'
import eth from '../assets/eth.png'
import usdc from '../assets/usdc.png'
import usdt from '../assets/usdt.png'
import xrp from '../assets/xrp.png'
import cardano from '../assets/cardano.png'
import tera from '../assets/tera.png'
import solana from '../assets/solana.png'
import avalanche from '../assets/avalanche.png'
import bnb from '../assets/bnb.png'

const styles = {
  coinNameRow: 'flex items-center',
  buyButton: `bg-[#16c784]/15 text-[#16c784] px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#16c784]/25 transition-all border border-[#16c784]/20`,
}

const ICON_MAP = {
  'Bitcoin': btc,
  'Ethereum': eth,
  'Tether': usdt,
  'BNB': bnb,
  'USD Coin': usdc,
  'XRP': xrp,
  'Cardano': cardano,
  'Terra': tera,
  'Solana': solana,
  'Avalanche': avalanche,
}

const CoinNameRow = ({ name, icon, clicked }) => {
  const router = useRouter()

  const handleBuy = (e) => {
    e.stopPropagation()
    const coinId = name?.toLowerCase() || 'bitcoin'
    router.push(`/buy?coin=${coinId}`)
  }

  const getIcon = () => {
    const localIcon = ICON_MAP[name]
    if (localIcon) {
      return <Image src={localIcon} className='rounded-full' width={20} height={20} alt='' />
    }
    // Fallback: use the API-provided icon URL
    if (icon) {
      return <img src={icon} className='w-5 h-5 rounded-full' alt='' unoptimized />
    }
    // Last fallback: show first 2 letters of name
    return (
      <div className='w-5 h-5 rounded-full bg-[#6188FF]/20 flex items-center justify-center text-[#6188FF] text-[10px] font-bold'>
        {(name || '?').slice(0, 2)}
      </div>
    )
  }

  return (
    <div className={styles.coinNameRow}>
      <div className='mr-3 flex items-center' onClick={clicked}>
        <div className='mr-2'>{getIcon()}</div>
        {name}
      </div>

      <span className={styles.buyButton} onClick={handleBuy}>
        Buy
      </span>
    </div>
  )
}

export default CoinNameRow
