import { useState } from 'react'
import Modal, { ModalButton } from './Modal'
import { useWallet } from './WalletProvider'

const walletOptions = [
  {
    name: 'MetaMask',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#F6851B" fillOpacity="0.1" />
        <path d="M26.2 7L17.8 13.2l1.6-5.9L26.2 7zM5.8 7l8.3 6.2-1.5-6L5.8 7zM27.4 12.2l-2.6 4.1 5.6 1.5 1.6-5.4-4.6-.2zM4.6 12.2l4.6-.2-1.6 5.4 5.6-1.5-2.6-4.1H4.6zM16 19.7l-2-3.1 2.2.1.1 3zM16 19.7l2-3.1-2.2.1-.1 3z" fill="#E2761B" />
        <path d="M20.7 16.6l-2.1 3.1 7.2 2 2-6.6-7.1 1.5zM11.3 16.6l-2.1 3.1 7.2 2-2-6.6H9.4zM16 23.8l-2.5-2 2.2-.1.3 2.1zM24 21.8l-7.2-2 .6-.7 3.6.7 3-1.2-2.7-3.5.3 6.7zM8 21.8l7.2-2-.6-.7-3.6.7-3-1.2 2.7-3.5-.3 6.7z" fill="#E4761B" />
        <path d="M16.5 21.8l-2.5-2 2.2-.1.3 2.1zM23.6 19.7l-7.2-2-.6-.8 8.4-2.4 1.9 4.1-2.5 1.1zM8.4 19.7l7.2-2 .6-.8-8.4-2.4-1.9 4.1 2.5 1.1z" fill="#E4761B" />
        <path d="M16.5 11.2l-.1 3.6-2.1-.8-.5-2.8 2.7 0zM15.5 11.2l-.1 3.6 2.1-.8.5-2.8h-2.5zM22 12.5l-2.5 4.2 6 .3-1.2-4.5-2.3 0zM10 12.5l2.3 0-1.2 4.5 6-.3-2.5-4.2-4.6 0z" fill="#D7BC1D" />
        <path d="M9.4 24.7l2.5-1.2-2.2-1.7-.3 2.9zM22.6 23.5l-2.5-1.2.3-2.9-2.2 1.7 4.4.4z" fill="#D7BC1D" />
      </svg>
    ),
    description: 'Connect using browser extension',
    connectorId: 'injected',
  },
  {
    name: 'WalletConnect',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#3B99FC" fillOpacity="0.1" />
        <path d="M11.4 13c-2.7-2-2.7-5.1 0-7.1 2.7-2 7.1-2 9.8 0l.3.2c1.4 1 1.4 2.6 0 3.6-.7.5-1.5.5-2.2 0-.5-.4-.5-.9 0-1.3l.3-.2c1.5-.9 4.2-.9 5.7 0 1.5.9 1.5 2.4 0 3.3l-.3.2c-.7.5-1.5.5-2.2 0l-.3-.2c-1.4-1-3.7-1-5.1 0l-.3.2c-.7.5-1.5.5-2.2 0l.3-.2zM7.7 16.7c-2.7-2-2.7-5.1 0-7.1 2.7-2 7.1-2 9.8 0l.3.2c1.4 1 1.4 2.6 0 3.6-.7.5-1.5.5-2.2 0-.5-.4-.5-.9 0-1.3l.3-.2c1.5-.9 4.2-.9 5.7 0 1.5.9 1.5 2.4 0 3.3l-.3.2c-.7.5-1.5.5-2.2 0l-.3-.2c-1.4-1-3.7-1-5.1 0l-.3.2c-.7.5-1.5.5-2.2 0l.3-.2z" fill="#3B99FC" />
        <path d="M14.5 20.5c-1.2-.7-1.2-1.8 0-2.5l.5-.3c.6-.3 1.5-.3 2.1 0l.5.3c1.2.7 1.2 1.8 0 2.5l-.5.3c-.6.3-1.5.3-2.1 0l-.5-.3zM7.7 24c-2.7-2-2.7-5.1 0-7.1 2.7-2 7.1-2 9.8 0l.3.2c1.4 1 1.4 2.6 0 3.6-.7.5-1.5.5-2.2 0-.5-.4-.5-.9 0-1.3l.3-.2c1.5-.9 4.2-.9 5.7 0 1.5.9 1.5 2.4 0 3.3l-.3.2c-.7.5-1.5.5-2.2 0l-.3-.2c-1.4-1-3.7-1-5.1 0l-.3.2c-.7.5-1.5.5-2.2 0l.3-.2z" fill="#3B99FC" />
      </svg>
    ),
    description: 'Scan QR code with mobile wallet',
    connectorId: 'walletconnect',
  },
  {
    name: 'Coinbase Wallet',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#0052FF" fillOpacity="0.1" />
        <circle cx="16" cy="16" r="8" fill="#0052FF" fillOpacity="0.2" />
        <path d="M16 10c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6zm0 9c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3z" fill="#0052FF" />
      </svg>
    ),
    description: 'Connect using Coinbase Wallet',
    connectorId: 'injected',
  },
]

const styles = {
  walletGrid: 'space-y-3',
  walletCard: `
    flex items-center gap-4 p-4 rounded-xl
    bg-white/[0.03] border border-white/[0.06]
    hover:bg-white/[0.06] hover:border-[#6188FF]/30
    hover:shadow-[0_0_20px_rgba(97,136,255,0.08)]
    transition-all duration-200 cursor-pointer group
  `,
  walletCardActive: 'border-[#6188FF]/50 bg-[#6188FF]/5',
  walletIcon: `
    w-12 h-12 rounded-xl flex items-center justify-center
    bg-white/[0.05] group-hover:bg-white/[0.08]
    transition-colors duration-200
  `,
  walletName: 'text-white font-semibold text-sm',
  walletDesc: 'text-gray-500 text-xs mt-0.5',
  walletArrow: 'ml-auto text-gray-600 group-hover:text-[#6188FF] transition-colors duration-200',
  connecting: 'text-center py-8',
  connectingSpinner: 'w-10 h-10 border-2 border-[#6188FF]/20 border-t-[#6188FF] rounded-full animate-spin mx-auto mb-4',
  connectingText: 'text-gray-400 text-sm',
  errorText: 'text-[#ea3943] text-sm text-center py-4',
}

const WalletConnectModal = ({ isOpen, onClose }) => {
  const wallet = useWallet()
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async (connectorId) => {
    setConnecting(true)
    setError('')
    try {
      if (wallet?.connect) {
        await wallet.connect()
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Connection failed. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const handleClose = () => {
    setConnecting(false)
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Connect Wallet"
      subtitle="Choose your preferred wallet to connect"
      size="sm"
    >
      {connecting ? (
        <div className={styles.connecting}>
          <div className={styles.connectingSpinner} />
          <p className={styles.connectingText}>Waiting for confirmation...</p>
          <p className="text-gray-600 text-xs mt-2">Check your wallet extension</p>
        </div>
      ) : error ? (
        <div>
          <div className={styles.errorText}>{error}</div>
          <ModalButton variant="secondary" onClick={() => setError('')} className="w-full mt-4">
            Try Again
          </ModalButton>
        </div>
      ) : (
        <div className={styles.walletGrid}>
          {walletOptions.map((w) => (
            <div
              key={w.name}
              className={styles.walletCard}
              onClick={() => handleConnect(w.connectorId)}
            >
              <div className={styles.walletIcon}>{w.icon}</div>
              <div>
                <p className={styles.walletName}>{w.name}</p>
                <p className={styles.walletDesc}>{w.description}</p>
              </div>
              <div className={styles.walletArrow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  )
}

export default WalletConnectModal
