import { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react'
import { SEPOLIA_CHAIN_ID, SEPOLIA_RPC_URL } from '../lib/constants'
import { getAllTransactions } from '../lib/txHistory'

const WalletContext = createContext({})

export const useWallet = () => useContext(WalletContext)

const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const [balance, setBalance] = useState(null)
  const [txCount, setTxCount] = useState(0)
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID

  const status = !account
    ? 'disconnected'
    : !isCorrectNetwork
    ? 'wrong-network'
    : 'connected'

  // Fetch ETH balance
  const fetchBalance = useCallback(async () => {
    if (!account || typeof window === 'undefined' || !window.ethereum) return
    try {
      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      })
      setBalance((parseInt(bal, 16) / 1e18).toFixed(4))
    } catch {
      setBalance(null)
    }
  }, [account])

  // Refresh transaction count from localStorage
  const refreshTxCount = useCallback(() => {
    const txs = getAllTransactions()
    setTxCount(txs.length)
  }, [])

  // Poll balance every 10s + tx count every 5s
  useEffect(() => {
    if (!account) {
      setBalance(null)
    setTxCount(0)
    return
  }
  fetchBalance()
  refreshTxCount()
  const balInterval = setInterval(fetchBalance, 10000)
  const txInterval = setInterval(refreshTxCount, 5000)
  return () => {
    clearInterval(balInterval)
    clearInterval(txInterval)
  }
  }, [account, fetchBalance, refreshTxCount])

  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet')
      return
    }

    try {
      setIsConnecting(true)
      setError(null)

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const chainIdHex = await window.ethereum.request({
        method: 'eth_chainId',
      })
      const currentChainId = parseInt(chainIdHex, 16)

      setAccount(accounts[0])
      setChainId(currentChainId)

      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        setError('Wrong network. Please switch to Sepolia testnet.')
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    setError(null)
    setBalance(null)
    setTxCount(0)
  }, [])

  const switchToSepolia = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return
    const sepoliaHex = `0x${SEPOLIA_CHAIN_ID.toString(16)}`
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: sepoliaHex }],
      })
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: sepoliaHex,
              chainName: 'Sepolia Testnet',
              nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: [SEPOLIA_RPC_URL],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          })
        } catch (addErr) {
          setError('Failed to add Sepolia network. Please add it manually.')
          return
        }
      } else {
        setError('Failed to switch network. Please switch to Sepolia manually in your wallet.')
        return
      }
    }
    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
    setChainId(parseInt(chainIdHex, 16))
    setError(null)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null)
        setChainId(null)
      } else {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    // Check if already connected
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          window.ethereum
            .request({ method: 'eth_chainId' })
            .then((chainIdHex) => {
              setChainId(parseInt(chainIdHex, 16))
            })
        }
      })
      .catch(() => {})

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const value = useMemo(() => ({
    account,
    chainId,
    status,
    isCorrectNetwork,
    isConnecting,
    error,
    balance,
    txCount,
    connect,
    disconnect,
    switchToSepolia,
    refreshTxCount,
  }), [account, chainId, status, isCorrectNetwork, isConnecting, error, balance, txCount, connect, disconnect, switchToSepolia, refreshTxCount])

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export default WalletProvider
