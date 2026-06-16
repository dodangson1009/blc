import Header from '../components/header'
import { useState, useCallback, useEffect } from 'react'
import { useWallet } from '../components/WalletProvider'
import { addTransaction, updateTransaction } from '../lib/txHistory'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'

const styles = {
  page: `min-h-screen bg-[#17171A]`,
  container: `max-w-2xl mx-auto p-10`,
  title: `text-2xl font-bold text-white mb-8`,
  card: `bg-[#222531] rounded-2xl p-6 border border-gray-800/50`,
  label: `text-gray-400 text-sm mb-2 block`,
  input: `w-full bg-[#171924] text-white p-3.5 rounded-xl outline-none border border-gray-700 focus:border-[#6188FF] transition-colors text-sm mb-4`,
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
}

export default function SendPage() {
  const wallet = useWallet()
  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState('')
  const [sending, setSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [ethBalance, setEthBalance] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

  const fetchBalance = useCallback(async () => {
    if (!wallet?.account || typeof window === 'undefined' || !window.ethereum) return
    try {
      const bal = await window.ethereum.request({ method: 'eth_getBalance', params: [wallet.account, 'latest'] })
      setEthBalance(parseInt(bal, 16) / 1e18)
    } catch { setEthBalance(null) }
  }, [wallet?.account])

  useEffect(() => {
    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [fetchBalance])

  const isValidAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr)
  const ethAmount = parseFloat(amount) || 0

  const handleSend = () => {
    if (!wallet?.account) {
      setToast({ visible: true, message: 'Please connect your wallet first', type: 'error' })
      return
    }
    if (!amount || ethAmount <= 0) {
      setToast({ visible: true, message: 'Please enter a valid amount', type: 'error' })
      return
    }
    if (!receiver || !isValidAddress(receiver)) {
      setToast({ visible: true, message: 'Please enter a valid recipient address (0x...)', type: 'error' })
      return
    }
    if (ethBalance !== null && ethAmount > ethBalance) {
      setToast({ visible: true, message: 'Insufficient ETH balance', type: 'error' })
      return
    }
    setShowConfirm(true)
  }

  const confirmSend = async () => {
    setShowConfirm(false)
    setSending(true)

    const txRecord = addTransaction({
      type: 'send',
      coinName: 'Ethereum',
      coinSymbol: 'ETH',
      amount: ethAmount,
      amountUsd: null,
      fromAddress: wallet.account,
      toAddress: receiver,
      txHash: null,
      priceAtTime: null,
    })

    try {
      const ethWei = '0x' + Math.floor(ethAmount * 1e18).toString(16)
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from: wallet.account, to: receiver, value: ethWei, gas: '0x5208' }],
      })

      updateTransaction(txRecord.id, { txHash, status: 'pending' })
      setToast({ visible: true, message: `Sent! TX: ${txHash.slice(0, 10)}...`, type: 'success' })

      let attempts = 0
      const poll = setInterval(async () => {
        attempts++
        try {
          const receipt = await window.ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] })
          if (receipt) {
            clearInterval(poll)
            updateTransaction(txRecord.id, { status: receipt.status ? 'confirmed' : 'failed' })
            setToast({ visible: true, message: receipt.status ? 'Transaction confirmed!' : 'Transaction failed', type: receipt.status ? 'success' : 'error' })
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
      const msg = err?.message || 'Transaction failed'
      setToast({ visible: true, message: msg.includes('rejected') ? 'Transaction rejected' : `Error: ${msg}`, type: 'error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.title}>📤 Send ETH</h1>
        <div className={styles.card}>
          {!wallet?.account ? (
            <div className={styles.walletWarning}>
              <p className={styles.walletWarningText}>Connect your MetaMask wallet to send ETH</p>
            </div>
          ) : (
            <>
              <div className={styles.balanceRow}>
                <div>
                  <p className={styles.balanceLabel}>Your Balance</p>
                  <p className={styles.balanceValue}>{ethBalance !== null ? `${ethBalance.toFixed(4)} ETH` : 'Loading...'}</p>
                </div>
                <div className={styles.networkBadge}>
                  <span className={styles.networkDot} /> Sepolia
                </div>
              </div>

              <label className={styles.label}>Amount (ETH)</label>
              <input className={styles.input} type='number' step='0.0001' min='0' placeholder='0.00' value={amount} onChange={(e) => setAmount(e.target.value)} />

              <label className={styles.label}>Recipient Address</label>
              <input className={styles.input} placeholder='0x...' value={receiver} onChange={(e) => setReceiver(e.target.value)} />

              {ethAmount > 0 && (
                <div className={styles.summary}>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>Sending</span><span className={styles.summaryValue}>{ethAmount} ETH</span></div>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>To</span><span className={styles.summaryValue}>{receiver ? `${receiver.slice(0, 8)}...${receiver.slice(-6)}` : '—'}</span></div>
                  <div className={styles.summaryRow}><span className={styles.summaryLabel}>Network Fee</span><span className={styles.summaryValue}>~0.000021 ETH</span></div>
                </div>
              )}

              <button className={`${styles.button} ${(!amount || !receiver || sending) ? styles.disabled : ''}`} onClick={handleSend} disabled={sending || !amount || !receiver}>
                {sending ? 'Sending...' : `Send ${ethAmount || ''} ETH`}
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={confirmSend} title='Confirm Send' description={`Send ${ethAmount} ETH to ${receiver.slice(0, 10)}...${receiver.slice(-6)}?`} confirmText='Confirm Send' />
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  )
}
