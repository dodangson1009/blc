import Header from '../components/header'
import { useState, useCallback, useEffect } from 'react'
import { useWallet } from '../components/WalletProvider'
import { addTransaction, updateTransaction } from '../lib/txHistory'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import { daiAddress, usdcAddress, dogeAddress, linkAddress } from '../lib/constants'

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, address: null },
  { symbol: 'DAI', name: 'Dai', decimals: 18, address: daiAddress },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, address: usdcAddress },
  { symbol: 'DOGE', name: 'Dogecoin', decimals: 18, address: dogeAddress },
  { symbol: 'LINK', name: 'Chainlink', decimals: 18, address: linkAddress },
]

const styles = {
  page: `min-h-screen bg-[#17171A]`,
  container: `max-w-2xl mx-auto p-10`,
  title: `text-2xl font-bold text-white mb-8`,
  card: `bg-[#222531] rounded-2xl p-6 border border-gray-800/50`,
  label: `text-gray-400 text-sm mb-2 block`,
  input: `w-full bg-[#171924] text-white p-3.5 rounded-xl outline-none border border-gray-700 focus:border-[#6188FF] transition-colors text-sm mb-4`,
  select: `w-full bg-[#171924] text-white p-3.5 rounded-xl outline-none border border-gray-700 focus:border-[#6188FF] transition-colors text-sm mb-4 appearance-none cursor-pointer`,
  button: `w-full bg-[#6188FF] text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-4 text-sm`,
  disabled: `opacity-50 cursor-not-allowed`,
  walletWarning: `bg-[#ea3943]/10 border border-[#ea3943]/30 rounded-xl p-4 text-center mb-4`,
  walletWarningText: `text-[#ea3943] text-sm`,
  balanceRow: `flex items-center justify-between mb-4 p-3 bg-[#171924] rounded-xl`,
  balanceLabel: `text-gray-500 text-xs`,
  balanceValue: `text-white text-sm font-semibold`,
  networkBadge: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#16c784]/10 text-[#16c784] border border-[#16c784]/30`,
  networkDot: `w-1.5 h-1.5 rounded-full bg-[#16c784]`,
  summary: `space-y-2 mt-4 p-4 bg-[#171924] rounded-xl text-sm`,
  summaryRow: `flex justify-between`,
  summaryLabel: `text-gray-500`,
  summaryValue: `text-white font-semibold`,
  warning: `bg-[#f0b90b]/10 border border-[#f0b90b]/20 rounded-lg px-3 py-2 text-[#f0b90b] text-xs mb-4`,
}

export default function TransferPage() {
  const wallet = useWallet()
  const [token, setToken] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState('')
  const [sending, setSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [balance, setBalance] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

  const selectedToken = TOKENS.find((t) => t.symbol === token) || TOKENS[0]

  const fetchBalance = useCallback(async () => {
    if (!wallet?.account || typeof window === 'undefined' || !window.ethereum) return
    try {
      if (token === 'ETH') {
        const bal = await window.ethereum.request({ method: 'eth_getBalance', params: [wallet.account, 'latest'] })
        setBalance({ raw: parseInt(bal, 16) / 1e18, display: `${(parseInt(bal, 16) / 1e18).toFixed(4)} ETH` })
      } else if (selectedToken.address) {
        // ERC-20 balanceOf
        const data = '0x70a08231' + wallet.account.slice(2).toLowerCase().padStart(64, '0')
        const result = await window.ethereum.request({ method: 'eth_call', params: [{ to: selectedToken.address, data }, 'latest'] })
        const raw = parseInt(result, 16)
        const display = (raw / Math.pow(10, selectedToken.decimals)).toFixed(4)
        setBalance({ raw, display: `${display} ${token}` })
      }
    } catch { setBalance(null) }
  }, [wallet?.account, token, selectedToken])

  useEffect(() => {
    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [fetchBalance])

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)
  const transferAmount = parseFloat(amount) || 0

  const handleTransfer = () => {
    if (!wallet?.account) {
      setToast({ visible: true, message: 'Please connect your wallet first', type: 'error' })
      return
    }
    if (!amount || transferAmount <= 0) {
      setToast({ visible: true, message: 'Please enter a valid amount', type: 'error' })
      return
    }
    if (!receiver || !isValidAddress(receiver)) {
      setToast({ visible: true, message: 'Please enter a valid recipient address', type: 'error' })
      return
    }
    if (token !== 'ETH' && !selectedToken.address) {
      setToast({ visible: true, message: `${token} contract not deployed. Please use a supported token.`, type: 'error' })
      return
    }
    setShowConfirm(true)
  }

  const confirmTransfer = async () => {
    setShowConfirm(false)
    setSending(true)

    const txRecord = addTransaction({
      type: 'transfer',
      coinName: selectedToken.name,
      coinSymbol: token,
      amount: transferAmount,
      amountUsd: null,
      fromAddress: wallet.account,
      toAddress: receiver,
      txHash: null,
      priceAtTime: null,
    })

    try {
      let txHash
      if (token === 'ETH') {
        const ethWei = '0x' + Math.floor(transferAmount * 1e18).toString(16)
        txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{ from: wallet.account, to: receiver, value: ethWei, gas: '0x5208' }],
        })
      } else {
        // ERC-20 transfer
        const amountWei = '0x' + Math.floor(transferAmount * Math.pow(10, selectedToken.decimals)).toString(16)
        const transferData = '0xa9059cbb' + receiver.slice(2).toLowerCase().padStart(64, '0') + amountWei.slice(2).padStart(64, '0')
        txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{ from: wallet.account, to: selectedToken.address, data: transferData, gas: '0x30000' }],
        })
      }

      updateTransaction(txRecord.id, { txHash, status: 'pending' })
      setToast({ visible: true, message: `${token} transfer submitted! TX: ${txHash.slice(0, 10)}...`, type: 'success' })

      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] })
          if (receipt) {
            clearInterval(poll)
            updateTransaction(txRecord.id, { status: receipt.status ? 'confirmed' : 'failed' })
            setToast({ visible: true, message: receipt.status ? 'Transfer confirmed!' : 'Transfer failed', type: receipt.status ? 'success' : 'error' })
          }
        } catch {}
        if (attempts > 30) clearInterval(poll)
      }, 3000)

      setAmount('')
      setReceiver('')
      fetchBalance()
      wallet.refreshTxCount?.()
    } catch (err) {
      updateTransaction(txRecord.id, { status: 'failed' })
      const msg = err?.message || 'Transfer failed'
      setToast({ visible: true, message: msg.includes('rejected') ? 'Transaction rejected' : `Error: ${msg}`, type: 'error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>🔄 Transfer Crypto</h1>
        <div className={styles.card}>
          {!wallet?.account ? (
            <div className={styles.walletWarning}>
              <p className={styles.walletWarningText}>Connect your MetaMask wallet to transfer crypto</p>
            </div>
          ) : (
            <>
              <div className={styles.balanceRow}>
                <div>
                  <p className={styles.balanceLabel}>Your Balance</p>
                  <p className={styles.balanceValue}>{balance?.display || 'Loading...'}</p>
                </div>
                <div className={styles.networkBadge}>
                  <span className={styles.networkDot} /> Sepolia
                </div>
              </div>

              {token !== 'ETH' && !selectedToken.address && (
                <div className={styles.warning}>⚠️ {token} contract not deployed on Sepolia. ETH transfers are fully supported.</div>
              )}

              <label className={styles.label}>Token</label>
              <select className={styles.select} value={token} onChange={(e) => setToken(e.target.value)}>
                {TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>{t.name} ({t.symbol}){!t.address && t.symbol !== 'ETH' ? ' — not deployed' : ''}</option>
                ))}
              </select>

              <label className={styles.label}>Amount</label>
              <input className={styles.input} type='number' step='0.0001' min='0' placeholder='0.00' value={amount} onChange={(e) => setAmount(e.target.value)} />

              <label className={styles.label}>Recipient Address</label>
              <input className={styles.input} placeholder='0x...' value={receiver} onChange={(e) => setReceiver(e.target.value)} />

              {transferAmount > 0 && (
                <div className={styles.summary}>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>Sending</span><span className={styles.summaryValue}>{transferAmount} {token}</span></div>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>To</span><span className={styles.summaryValue}>{receiver ? `${receiver.slice(0, 8)}...${receiver.slice(-6)}` : '—'}</span></div>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>Network</span><span className={styles.summaryValue}>Sepolia</span></div>
                </div>
              )}

              <button className={`${styles.button} ${(!amount || !receiver || sending) ? styles.disabled : ''}`} onClick={handleTransfer} disabled={sending || !amount || !receiver}>
                {sending ? 'Transferring...' : `Transfer ${token}`}
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={confirmTransfer} title='Confirm Transfer' description={`Transfer ${transferAmount} ${token} to ${receiver.slice(0, 10)}...${receiver.slice(-6)}?`} confirmText='Confirm Transfer' />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}
