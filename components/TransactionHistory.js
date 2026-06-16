import { useState, useEffect } from 'react'
import { getAllTransactions, clearAllTransactions } from '../lib/txHistory'
import Toast from './Toast'
import ConfirmModal from './ConfirmModal'

const styles = {
  container: `bg-[#171924] rounded-2xl p-6 border border-gray-800/50`,
  header: `flex items-center justify-between mb-5`,
  title: `text-xl font-bold text-white`,
  subtitle: `text-gray-500 text-sm mt-0.5`,
  clearBtn: `text-xs text-gray-500 hover:text-[#ea3943] cursor-pointer transition-colors`,
  tabs: `flex gap-2 mb-5`,
  tab: `px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all`,
  tabActive: `bg-[#6188FF] text-white`,
  tabInactive: `bg-[#222531] text-gray-400 hover:text-white`,
  list: `space-y-2.5`,
  item: `flex items-center gap-4 p-4 bg-[#222531]/60 rounded-xl border border-gray-800/30 hover:border-gray-700/50 transition-all`,
  iconWrap: `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`,
  iconBuy: `bg-[#16c784]/15 text-[#16c784]`,
  iconSend: `bg-[#6188FF]/15 text-[#6188FF]`,
  iconTransfer: `bg-[#f0b90b]/15 text-[#f0b90b]`,
  info: `flex-1 min-w-0`,
  typeLabel: `text-white text-sm font-semibold`,
  detail: `text-gray-500 text-xs mt-0.5 truncate`,
  right: `text-right flex-shrink-0`,
  amount: `text-white text-sm font-bold`,
  amountUsd: `text-gray-500 text-xs`,
  status: `text-xs font-medium mt-1`,
  statusPending: `text-[#f0b90b]`,
  statusConfirmed: `text-[#16c784]`,
  statusFailed: `text-[#ea3943]`,
  time: `text-gray-600 text-xs mt-0.5`,
  hashLink: `text-[#6188FF] text-xs hover:underline cursor-pointer`,
  empty: `text-gray-500 text-center py-12 text-sm`,
  emptyIcon: `text-4xl mb-3`,
  statsRow: `grid grid-cols-3 gap-3 mb-5`,
  statCard: `bg-[#222531]/40 rounded-xl p-3 text-center border border-gray-800/30`,
  statValue: `text-white text-lg font-bold`,
  statLabel: `text-gray-500 text-xs mt-0.5`,
}

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'buy', label: 'Buys' },
  { id: 'send', label: 'Sends' },
]

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`
  return d.toLocaleDateString()
}

function formatAmount(num) {
  if (!num && num !== 0) return '0'
  if (num < 0.001) return '<0.001'
  if (num < 1) return num.toFixed(4)
  return num.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

const TransactionHistory = ({ compact = false }) => {
  const [txs, setTxs] = useState([])
  const [filter, setFilter] = useState('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

  useEffect(() => {
    setTxs(getAllTransactions())
    const interval = setInterval(() => {
      setTxs(getAllTransactions())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filtered = filter === 'all' ? txs : txs.filter((t) => t.type === filter)
  const confirmedTxs = txs.filter((t) => t.status === 'confirmed')
  const totalSpent = confirmedTxs
    .filter((t) => t.type === 'buy')
    .reduce((sum, t) => sum + (t.amountUsd || 0), 0)
  const totalSent = confirmedTxs
    .filter((t) => t.type === 'send')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const handleClear = () => {
    clearAllTransactions()
    setTxs([])
    setShowClearConfirm(false)
    setToast({ visible: true, message: 'Transaction history cleared', type: 'success' })
  }

  const getIconClass = (type) => {
    switch (type) {
      case 'buy': return styles.iconBuy
      case 'send': return styles.iconSend
      default: return styles.iconTransfer
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'buy':
        return (
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='12' y1='19' x2='12' y2='5' /><polyline points='5 12 12 5 19 12' />
          </svg>
        )
      case 'send':
        return (
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <line x1='12' y1='5' x2='12' y2='19' /><polyline points='19 12 12 19 5 12' />
          </svg>
        )
      default:
        return (
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <polyline points='17 1 21 5 17 9' /><path d='M3 11V9a4 4 0 0 1 4-4h14' /><polyline points='7 23 3 19 7 15' /><path d='M21 13v2a4 4 0 0 1-4 4H3' />
          </svg>
        )
    }
  }

  const openExplorer = (hash) => {
    if (hash) {
      window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank')
    }
  }

  if (compact) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Transaction History</h2>
        {txs.length === 0 ? (
          <p className={styles.empty}>No transactions yet</p>
        ) : (
          <div className={styles.list}>
            {txs.slice(0, 5).map((tx) => (
              <div key={tx.id} className={styles.item}>
                <div className={`${styles.iconWrap} ${getIconClass(tx.type)}`}>
                  {getIcon(tx.type)}
                </div>
                <div className={styles.info}>
                  <p className={styles.typeLabel}>
                    {tx.type === 'buy' ? 'Bought' : tx.type === 'send' ? 'Sent' : 'Transferred'} {tx.coinSymbol?.toUpperCase()}
                  </p>
                  <p className={styles.detail}>{formatAmount(tx.amount)} {tx.coinSymbol?.toUpperCase()}</p>
                </div>
                <div className={styles.right}>
                  <p className={styles.amount}>{formatAmount(tx.amount)} {tx.coinSymbol?.toUpperCase()}</p>
                  {tx.amountUsd > 0 && <p className={styles.amountUsd}>${tx.amountUsd.toFixed(2)}</p>}
                  <p className={`${styles.status} ${tx.status === 'confirmed' ? styles.statusConfirmed : tx.status === 'failed' ? styles.statusFailed : styles.statusPending}`}>
                    {tx.status === 'confirmed' ? 'Confirmed' : tx.status === 'failed' ? 'Failed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Transaction History</h2>
          <p className={styles.subtitle}>All your on-chain activity</p>
        </div>
        {txs.length > 0 && (
          <button className={styles.clearBtn} onClick={() => setShowClearConfirm(true)}>
            Clear all
          </button>
        )}
      </div>

      {/* Stats */}
      {txs.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{confirmedTxs.length}</p>
            <p className={styles.statLabel}>Confirmed</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>${totalSpent.toFixed(2)}</p>
            <p className={styles.statLabel}>Total Bought</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statValue}>{formatAmount(totalSent)} ETH</p>
            <p className={styles.statLabel}>Total Sent</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${filter === tab.id ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p>{txs.length === 0 ? 'No transactions yet' : `No ${filter} transactions`}</p>
          <p className='text-xs text-gray-600 mt-1'>
            {txs.length === 0 ? 'Buy or send crypto to see your history here' : 'Try a different filter'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((tx) => (
            <div key={tx.id} className={styles.item}>
              <div className={`${styles.iconWrap} ${getIconClass(tx.type)}`}>
                {getIcon(tx.type)}
              </div>
              <div className={styles.info}>
                <p className={styles.typeLabel}>
                  {tx.type === 'buy' ? 'Bought' : tx.type === 'send' ? 'Sent' : 'Transferred'} {tx.coinSymbol?.toUpperCase()}
                </p>
                <p className={styles.detail}>
                  {tx.fromAddress && `${tx.fromAddress.slice(0, 8)}...${tx.fromAddress.slice(-6)}`}
                  {tx.toAddress && ` → ${tx.toAddress.slice(0, 8)}...${tx.toAddress.slice(-6)}`}
                </p>
                {tx.txHash && (
                  <span className={styles.hashLink} onClick={() => openExplorer(tx.txHash)}>
                    {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)} ↗
                  </span>
                )}
                <p className={styles.time}>{formatTime(tx.timestamp)}</p>
              </div>
              <div className={styles.right}>
                <p className={styles.amount}>{formatAmount(tx.amount)} {tx.coinSymbol?.toUpperCase()}</p>
                {tx.amountUsd > 0 && <p className={styles.amountUsd}>≈ ${tx.amountUsd.toFixed(2)}</p>}
                <p className={`${styles.status} ${tx.status === 'confirmed' ? styles.statusConfirmed : tx.status === 'failed' ? styles.statusFailed : styles.statusPending}`}>
                  {tx.status === 'confirmed' ? '✓ Confirmed' : tx.status === 'failed' ? '✗ Failed' : '◎ Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title='Clear Transaction History'
        description='This will remove all transaction records from your browser. This action cannot be undone.'
        confirmText='Clear All'
        variant='danger'
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

export default TransactionHistory
