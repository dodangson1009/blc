const STORAGE_KEY = 'cmc_transactions'
const MAX_TXS = 100

/**
 * Transaction record shape:
 * {
 *   id: string (uuid),
 *   type: 'buy' | 'send' | 'transfer' | 'swap',
 *   coinName: string,
 *   coinSymbol: string,
 *   amount: number,
 *   amountUsd: number | null,
 *   fromAddress: string,
 *   toAddress: string | null,
 *   txHash: string | null,
 *   status: 'pending' | 'confirmed' | 'failed',
 *   timestamp: number (Date.now()),
 *   network: string,
 *   priceAtTime: number | null,
 * }
 */

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function getAllTransactions() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addTransaction(tx) {
  if (typeof window === 'undefined') return null
  const record = {
    id: generateId(),
    timestamp: Date.now(),
    status: 'pending',
    network: 'Sepolia',
    ...tx,
  }
  const list = getAllTransactions()
  list.unshift(record)
  if (list.length > MAX_TXS) list.length = MAX_TXS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return record
}

export function updateTransaction(id, updates) {
  if (typeof window === 'undefined') return null
  const list = getAllTransactions()
  const idx = list.findIndex((t) => t.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list[idx]
}

export function getTransactionsByType(type) {
  return getAllTransactions().filter((t) => t.type === type)
}

export function getTransactionById(id) {
  return getAllTransactions().find((t) => t.id === id) || null
}

export function clearAllTransactions() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function getTransactionStats() {
  const txs = getAllTransactions()
  const buys = txs.filter((t) => t.type === 'buy' && t.status === 'confirmed')
  const sends = txs.filter((t) => t.type === 'send' && t.status === 'confirmed')
  const totalSpent = buys.reduce((sum, t) => sum + (t.amountUsd || 0), 0)
  return {
    total: txs.length,
    buys: buys.length,
    sends: sends.length,
    totalSpent,
  }
}
