import { useState } from 'react'
import Modal, { ModalButton } from './Modal'
import { SEPOLIA_FAUCETS } from '../lib/constants'

const styles = {
  networkBadge: 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16c784]/10 border border-[#16c784]/30 text-[#16c784] text-xs font-semibold mb-4',
  networkDot: 'w-2 h-2 rounded-full bg-[#16c784] animate-pulse',
  warning: 'bg-[#f0b90b]/10 border border-[#f0b90b]/20 rounded-xl p-3 mb-5',
  warningText: 'text-[#f0b90b] text-xs leading-relaxed',
  faucetList: 'space-y-2.5',
  faucetItem: `
    flex items-center justify-between p-4 rounded-xl
    bg-white/[0.03] border border-white/[0.06]
    hover:bg-white/[0.06] hover:border-[#6188FF]/30
    transition-all duration-200 cursor-pointer group
  `,
  faucetName: 'text-white font-semibold text-sm',
  faucetDesc: 'text-gray-500 text-xs mt-0.5',
  faucetArrow: 'text-gray-600 group-hover:text-[#6188FF] transition-colors duration-200',
}

const FaucetModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Get Testnet ETH"
      subtitle="Get free Sepolia ETH from these faucets"
      size="sm"
      footer={
        <ModalButton variant="secondary" onClick={onClose} className="w-full">
          Close
        </ModalButton>
      }
    >
      <div className={styles.networkBadge}>
        <span className={styles.networkDot} />
        Sepolia Testnet
      </div>

      <div className={styles.warning}>
        <p className={styles.warningText}>
          ⚠️ These are testnet tokens with no real value. Never send real ETH to testnet addresses.
        </p>
      </div>

      <div className={styles.faucetList}>
        {SEPOLIA_FAUCETS.map((faucet, i) => (
          <a
            key={i}
            href={faucet.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.faucetItem}
          >
            <div>
              <p className={styles.faucetName}>{faucet.name}</p>
              <p className={styles.faucetDesc}>Free Sepolia ETH for testing</p>
            </div>
            <div className={styles.faucetArrow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </Modal>
  )
}

export default FaucetModal
