import { useState, useContext } from 'react'
import Modal, { ModalButton } from './Modal'
import { CoinMarketContext } from '../context/context'

const styles = {
  swapIcon: `
    flex items-center justify-center w-10 h-10 rounded-full
    bg-white/[0.05] border border-white/[0.08] mx-auto -my-1
    relative z-10 hover:bg-[#6188FF]/10 hover:border-[#6188FF]/30
    transition-all duration-200 cursor-pointer rotate-0 hover:rotate-180
  `,
  tokenSelect: `
    w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08]
    text-white text-sm outline-none cursor-pointer appearance-none
    focus:border-[#6188FF]/50 transition-colors duration-200
    hover:border-white/15
    [&>option]:bg-[#0f172a] [&>option]:text-white
  `,
  amountInput: `
    w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08]
    text-white text-lg font-semibold outline-none
    focus:border-[#6188FF]/50 transition-colors duration-200
    placeholder:text-gray-600
  `,
  tokenGroup: 'space-y-2',
  tokenLabel: 'text-xs text-gray-500 font-medium uppercase tracking-wider',
  rateInfo: 'text-center text-xs text-gray-500 py-1',
}

const SwapCryptoModal = () => {
  const {
    openBuyCryptoModal,
    setOpenBuyCryptoModal,
    mint,
    coins,
    loadingCoins,
    amount,
    setAmount,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
  } = useContext(CoinMarketContext)

  const [swapping, setSwapping] = useState(false)

  const handleClose = () => {
    setOpenBuyCryptoModal(false)
    setAmount(0)
    setFromToken('')
    setToToken('')
  }

  const handleSwap = async () => {
    setSwapping(true)
    try {
      await mint()
      handleClose()
    } catch (err) {
      console.error('Swap failed:', err)
    } finally {
      setSwapping(false)
    }
  }

  return (
    <Modal
      isOpen={openBuyCryptoModal}
      onClose={handleClose}
      title="Swap Tokens"
      subtitle="Exchange tokens on testnet"
      size="sm"
      footer={
        <div className="flex gap-3 w-full">
          <ModalButton variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </ModalButton>
          <ModalButton
            variant="primary"
            onClick={handleSwap}
            disabled={!fromToken || !toToken || !amount || swapping}
            className="flex-1"
          >
            {swapping ? 'Swapping...' : 'Swap'}
          </ModalButton>
        </div>
      }
    >
      <div className="space-y-4">
        <div className={styles.tokenGroup}>
          <label className={styles.tokenLabel}>From</label>
          <select
            className={styles.tokenSelect}
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="">Select token</option>
            {coins && coins.map((coin) => (
              <option key={coin.id} value={coin.attributes.name}>
                {coin.attributes.name}
              </option>
            ))}
            <option value="ETH">ETH</option>
          </select>
        </div>

        <div className={styles.swapIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6188FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        <div className={styles.tokenGroup}>
          <label className={styles.tokenLabel}>To</label>
          <select
            className={styles.tokenSelect}
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          >
            <option value="">Select token</option>
            {coins && coins.map((coin) => (
              <option key={coin.id} value={coin.attributes.name}>
                {coin.attributes.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tokenGroup}>
          <label className={styles.tokenLabel}>Amount</label>
          <input
            type="number"
            className={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <p className={styles.rateInfo}>Swaps are executed on testnet with no real value</p>
      </div>
    </Modal>
  )
}

export default SwapCryptoModal
