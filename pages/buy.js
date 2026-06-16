import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/header'
import { useWallet } from '../components/WalletProvider'
import { addTransaction, updateTransaction } from '../lib/txHistory'
import TransactionHistory from '../components/TransactionHistory'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const DEFAULT_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 105432.12, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3821.45, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'tether', name: 'Tether', symbol: 'USDT', price: 1.0, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 652.3, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 178.92, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 2.34, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.234, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.78, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
]

const ETH_PRICE = 3821.45

const styles = {
  page: `min-h-screen bg-[#17171A]`,
  container: `max-w-6xl mx-auto px-4 py-8`,
  grid: `grid grid-cols-1 lg:grid-cols-5 gap-8`,
  mainPanel: `lg:col-span-3`,
  sidePanel: `lg:col-span-2 space-y-6`,
  title: `text-2xl font-bold text-white mb-2`,
  subtitle: `text-gray-500 text-sm mb-8`,
  card: `bg-[#222531] rounded-2xl p-6 border border-gray-800/50`,
  label: `text-gray-400 text-sm mb-2 block`,
  input: `w-full bg-[#171924] text-white p-3.5 rounded-xl outline-none border border-gray-700 focus:border-[#6188FF] transition-colors text-sm`,
  coinGrid: `grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6`,
  coinItem: `flex items-center gap-2.5 p-3 rounded-xl cursor-pointer transition-all border`,
  coinItemActive: `bg-[#6188FF]/10 border-[#6188FF]/40`,
  coinItemInactive: `bg-[#222531]/60 border-gray-800/30 hover:border-gray-600/50`,
  coinImg: `w-7 h-7 rounded-full`,
  coinName: `text-white text-sm font-semibold`,
  coinSymbol: `text-gray-500 text-xs`,
  coinPrice: `text-gray-400 text-xs`,
  quickAmounts: `grid grid-cols-4 gap-2 mt-3`,
  quickBtn: `py-2 rounded-lg text-xs font-semibold bg-[#222531] text-gray-300 border border-gray-700 hover:border-[#6188FF]/50 hover:text-white transition-all cursor-pointer`,
  buyBtn: `w-full py-4 rounded-xl font-bold text-base transition-all cursor-pointer mt-4`,
  buyBtnReady: `bg-[#16c784] text-white hover:bg-[#15b876]`,
  buyBtnDisabled: `bg-[#222531] text-gray-600 cursor-not-allowed`,
  buyBtnWallet: `bg-[#6188FF] text-white hover:bg-[#5178e8]`,
  summary: `space-y-3 mt-5 p-4 bg-[#171924] rounded-xl`,
  summaryRow: `flex items-center justify-between text-sm`,
  summaryLabel: `text-gray-500`,
  summaryValue: `text-white font-semibold`,
  ethPrice: `text-[#6188FF]`,
  walletWarning: `bg-[#ea3943]/10 border border-[#ea3943]/30 rounded-xl p-4 text-center`,
  walletWarningText: `text-[#ea3943] text-sm`,
  balanceRow: `flex items-center justify-between mb-4 p-3 bg-[#171924] rounded-xl`,
  balanceLabel: `text-gray-500 text-xs`,
  balanceValue: `text-white text-sm font-semibold`,
  networkBadge: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#16c784]/10 text-[#16c784] border border-[#16c784]/30`,
  networkDot: `w-1.5 h-1.5 rounded-full bg-[#16c784]`,
}

const BuyPage = () => {
  const router = useRouter()
  const wallet = useWallet()
  const [coins, setCoins] = useState(DEFAULT_COINS)
  const [selectedCoinId, setSelectedCoinId] = useState(DEFAULT_COINS[0].id)

  // Pre-select coin from URL query param
  useEffect(() => {
    const queryCoin = router.query.coin
    if (queryCoin) {
      setSelectedCoinId(queryCoin)
    }
  }, [router.query.coin])
  const [usdAmount, setUsdAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [ethBalance, setEthBalance] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

  const selectedCoin = coins.find((c) => c.id === selectedCoinId) || coins[0]

  const usdValue = parseFloat(usdAmount) || 0
  const ethAmount = usdValue > 0 ? (usdValue / ETH_PRICE).toFixed(6) : '0'
  const coinAmount = usdValue > 0 && selectedCoin.price > 0 ? (usdValue / selectedCoin.price).toFixed(6) : '0'

  const fetchBalance = useCallback(async () => {
    if (!wallet?.account || typeof window === 'undefined' || !window.ethereum) return
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [wallet.account, 'latest'],
      })
      setEthBalance(parseInt(balance, 16) / 1e18)
    } catch {
      setEthBalance(null)
    }
  }, [wallet?.account])

  useEffect(() => {
    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [fetchBalance])

  // Fetch live prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/getTopTen')
        const json = await res.json()
        const apiCoins = json?.data?.data || []
        if (apiCoins.length > 0) {
          setCoins((prev) =>
            prev.map((bc) => {
              const live = apiCoins.find(
                (c) => c.id === bc.id || c.symbol?.toLowerCase() === bc.symbol.toLowerCase()
              )
              return live
                ? { ...bc, price: live.quote?.USD?.price || bc.price, image: live.image || bc.image }
                : bc
            })
          )
        }
      } catch {
        // Use default prices
      }
    }
    fetchPrices()
  }, [])

  const handleBuy = () => {
    if (!wallet?.account) {
      setToast({ visible: true, message: 'Please connect your wallet first', type: 'error' })
      return
    }
    if (!usdValue || usdValue <= 0) {
      setToast({ visible: true, message: 'Please enter a valid amount', type: 'error' })
      return
    }
    if (ethBalance !== null && parseFloat(ethAmount) > ethBalance) {
      setToast({ visible: true, message: 'Insufficient ETH balance', type: 'error' })
      return
    }
    setShowConfirm(true)
  }

  const confirmBuy = async () => {
    setShowConfirm(false)
    setSending(true)

    const txRecord = addTransaction({
      type: 'buy',
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      amount: parseFloat(coinAmount),
      amountUsd: usdValue,
      fromAddress: wallet.account,
      toAddress: null,
      txHash: null,
      priceAtTime: selectedCoin.price,
    })

    try {
      const ethWei = '0x' + Math.floor(parseFloat(ethAmount) * 1e18).toString(16)
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.account,
            to: wallet.account,
            value: ethWei,
            gas: '0x5208',
          },
        ],
      })

      updateTransaction(txRecord.id, { txHash, status: 'pending' })
      setToast({ visible: true, message: `Buy transaction submitted! TX: ${txHash.slice(0, 10)}...`, type: 'success' })

      // Poll for confirmation
      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          })
          if (receipt) {
            clearInterval(poll)
            updateTransaction(txRecord.id, {
              status: receipt.status ? 'confirmed' : 'failed',
            })
            setToast({
              visible: true,
              message: receipt.status ? 'Transaction confirmed!' : 'Transaction failed',
              type: receipt.status ? 'success' : 'error',
            })
          }
        } catch {}
        if (attempts > 30) clearInterval(poll)
      }, 3000)

      setUsdAmount('')
      fetchBalance()
    } catch (err) {
      updateTransaction(txRecord.id, { status: 'failed' })
      const msg = err?.message || 'Transaction failed'
      if (msg.includes('rejected') || msg.includes('denied')) {
        setToast({ visible: true, message: 'Transaction was rejected by user', type: 'info' })
      } else {
        setToast({ visible: true, message: `Error: ${msg}`, type: 'error' })
      }
    } finally {
      setSending(false)
    }
  }

  const quickAmounts = [10, 25, 50, 100]

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>Buy Cryptocurrency</h1>
        <p className={styles.subtitle}>Purchase crypto instantly using ETH via MetaMask</p>

        <div className={styles.grid}>
          {/* Left: Buy Form */}
          <div className={styles.mainPanel}>
            <div className={styles.card}>
              {!wallet?.account ? (
                <div className={styles.walletWarning}>
                  <p className={styles.walletWarningText}>
                    Connect your MetaMask wallet to start buying
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles.balanceRow}>
                    <div>
                      <p className={styles.balanceLabel}>Your Balance</p>
                      <p className={styles.balanceValue}>
                        {ethBalance !== null ? `${ethBalance.toFixed(4)} ETH` : 'Loading...'}
                      </p>
                    </div>
                    <div className={styles.networkBadge}>
                      <span className={styles.networkDot} />
                      Sepolia
                    </div>
                  </div>

                  <label className={styles.label}>Select Coin</label>
                  <div className={styles.coinGrid}>
                    {coins.map((coin) => (
                      <div
                        key={coin.id}
                        className={`${styles.coinItem} ${selectedCoinId === coin.id ? styles.coinItemActive : styles.coinItemInactive}`}
                        onClick={() => setSelectedCoinId(coin.id)}
                      >
                        <img src={coin.image} alt={coin.name} className={styles.coinImg} unoptimized />
                        <div>
                          <p className={styles.coinName}>{coin.symbol}</p>
                          <p className={styles.coinPrice}>${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label className={styles.label}>Amount (USD)</label>
                  <div className='relative'>
                    <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold'>$</span>
                    <input
                      className={`${styles.input} pl-8`}
                      type='number'
                      min='1'
                      step='0.01'
                      placeholder='0.00'
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(e.target.value)}
                    />
                  </div>

                  <div className={styles.quickAmounts}>
                    {quickAmounts.map((amt) => (
                      <button key={amt} className={styles.quickBtn} onClick={() => setUsdAmount(String(amt))}>
                        ${amt}
                      </button>
                    ))}
                  </div>

                  {usdValue > 0 && (
                    <div className={styles.summary}>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>You Pay</span>
                        <span className={styles.summaryValue}>${usdValue.toFixed(2)} USD</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>ETH Cost</span>
                        <span className={styles.ethPrice}>{ethAmount} ETH</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>You Receive</span>
                        <span className={styles.summaryValue}>{coinAmount} {selectedCoin.symbol}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Network Fee</span>
                        <span className={styles.summaryValue}>~0.000021 ETH</span>
                      </div>
                    </div>
                  )}

                  <button
                    className={`${styles.buyBtn} ${
                      sending ? styles.buyBtnDisabled : usdValue > 0 ? styles.buyBtnReady : styles.buyBtnWallet
                    }`}
                    onClick={handleBuy}
                    disabled={sending || !usdValue}
                  >
                    {sending
                      ? 'Processing...'
                      : usdValue > 0
                      ? `Buy ${selectedCoin.symbol} for $${usdValue.toFixed(2)}`
                      : 'Enter amount to buy'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className={styles.sidePanel}>
            <TransactionHistory compact />
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmBuy}
        title='Confirm Purchase'
        description={`You are about to buy ${coinAmount} ${selectedCoin.symbol} for ${ethAmount} ETH (~$${usdValue.toFixed(2)}). Please confirm in your MetaMask wallet.`}
        confirmText='Confirm Buy'
        variant='primary'
      />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  )
}

export default BuyPage
