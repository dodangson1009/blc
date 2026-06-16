import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Search from '../assets/svg/search'
import { useWallet } from './WalletProvider'
import FaucetModal from './FaucetModal'
import WalletConnectModal from './WalletConnectModal'
import ConfirmModal from './ConfirmModal'

const NAV_ITEMS = [
  { label: 'Cryptocurrencies', href: '/', icon: '📊' },
  { label: 'Buy', href: '/buy', icon: '💰' },
  { label: 'Send', href: '/send', icon: '📤' },
  { label: 'Transfer', href: '/transfer', icon: '🔄' },
  { label: 'Watchlist', href: '/watchlist', icon: '⭐' },
  { label: 'History', href: '/history', icon: '📋' },
]

const QUICK_ACTIONS = [
  { label: 'Buy', href: '/buy', icon: '💰', color: 'bg-[#16c784]/10 text-[#16c784]' },
  { label: 'Send', href: '/send', icon: '📤', color: 'bg-[#6188FF]/10 text-[#6188FF]' },
  { label: 'History', href: '/history', icon: '📋', color: 'bg-[#f0b90b]/10 text-[#f0b90b]' },
]

const styles = {
  // Header bar
  header: `bg-[#0e0e12]/95 backdrop-blur-2xl text-white h-[60px] flex items-center w-full px-4 lg:px-6 border-b border-white/[0.04] sticky top-0 z-40`,
  headerInner: `flex items-center justify-between w-full max-w-[1400px] mx-auto`,

  // Logo
  logo: `flex items-center gap-2.5 cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity`,

  // Desktop Nav
  nav: `hidden lg:flex items-center gap-1 ml-16`,
  navLink: `relative px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 tracking-wide`,
  navLinkActive: `text-white bg-[#6188FF]/[0.12] border border-[#6188FF]/[0.2]`,
  navLinkInactive: `text-[#8a8f98] hover:text-white hover:bg-white/[0.06]`,
  navActiveDot: `absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-[#6188FF]`,

  // Right Section
  rightSection: `flex items-center gap-2.5`,

  // Faucet
  faucetBtn: `px-3 py-[7px] rounded-lg text-[12px] font-medium bg-[#f0b90b]/[0.08] text-[#f0b90b] border border-[#f0b90b]/[0.15] cursor-pointer hover:bg-[#f0b90b]/[0.15] hover:border-[#f0b90b]/[0.25] transition-all duration-200 hidden sm:flex items-center gap-1.5`,

  // Wallet Button
  walletPill: `flex items-center gap-2 px-3 py-[7px] rounded-xl cursor-pointer transition-all duration-200 border`,
  walletPillConnected: `bg-[#16c784]/[0.06] border-[#16c784]/[0.15] hover:bg-[#16c784]/[0.1] hover:border-[#16c784]/[0.25]`,
  walletPillDisconnected: `bg-[#6188FF]/[0.08] border-[#6188FF]/[0.15] hover:bg-[#6188FF]/[0.15] hover:border-[#6188FF]/[0.25]`,
  walletDot: `w-[6px] h-[6px] rounded-full`,
  walletDotOn: `bg-[#16c784] shadow-[0_0_6px_rgba(22,199,132,0.5)]`,
  walletDotOff: `bg-gray-500`,
  walletAddress: `text-[11px] font-mono tracking-tight`,
  walletBalance: `text-[11px] font-semibold`,

  // Search
  searchContainer: `relative hidden md:flex items-center`,
  searchInput: `bg-white/[0.03] text-white text-[13px] pl-8 pr-3 py-[7px] rounded-xl outline-none border border-white/[0.06] focus:border-[#6188FF]/[0.3] focus:bg-white/[0.05] transition-all duration-200 w-full max-w-[200px] lg:max-w-[240px] placeholder:text-[#4a4f5a]`,
  searchIcon: `absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4a4f5a]`,
  searchResults: `absolute top-full left-0 right-0 mt-2 bg-[#1a1d2e] rounded-xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden z-50 max-h-80 overflow-y-auto`,
  searchResultItem: `flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] cursor-pointer transition-colors`,
  searchResultName: `text-white text-[13px] font-medium`,
  searchResultSymbol: `text-[#5a5f6a] text-[11px]`,

  // Hamburger
  hamburger: `lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg hover:bg-white/[0.05] cursor-pointer transition-colors relative`,
  hamburgerLine: `w-[18px] h-[1.5px] bg-[#8a8f98] rounded-full transition-all duration-300 absolute`,

  // Mobile Drawer
  mobileOverlay: `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300`,
  mobilePanel: `fixed top-0 left-0 bottom-0 w-[300px] max-w-[85vw] bg-[#0e0e12] border-r border-white/[0.04] z-50 flex flex-col transition-transform duration-300 ease-out shadow-2xl`,
  mobilePanelHidden: `-translate-x-full`,
  mobilePanelVisible: `translate-x-0`,
  mobileTopBar: `flex items-center justify-between px-5 py-4 border-b border-white/[0.04]`,
  mobileLogoText: `text-white font-bold text-[15px] flex items-center gap-2`,
  mobileCloseBtn: `w-8 h-8 flex items-center justify-center rounded-lg text-[#5a5f6a] hover:text-white hover:bg-white/[0.06] transition-all`,
  mobileWalletCard: `mx-4 mt-4 p-4 rounded-2xl border border-white/[0.04] relative overflow-hidden`,
  mobileWalletCardBg: `absolute inset-0 bg-gradient-to-br from-[#6188FF]/[0.06] via-transparent to-[#16c784]/[0.03]`,
  mobileWalletCardInner: `relative z-10`,
  mobileWalletAddress: `text-white text-[13px] font-mono mb-1`,
  mobileWalletAddressFull: `text-[#4a4f5a] text-[10px] mb-3 break-all font-mono leading-relaxed`,
  mobileBalanceRow: `flex items-center justify-between`,
  mobileBalanceLabel: `text-[#5a5f6a] text-[11px]`,
  mobileBalanceValue: `text-white text-[17px] font-bold`,
  mobileNetworkPill: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#16c784]/[0.08] text-[#16c784] border border-[#16c784]/[0.15]`,
  mobileNetworkDot: `w-[5px] h-[5px] rounded-full bg-[#16c784] animate-pulse`,
  mobileNavSection: `px-4 py-3`,
  mobileNavLabel: `text-[#3a3f4a] text-[10px] font-bold uppercase tracking-[0.12em] px-3 mb-2`,
  mobileNavLink: `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all duration-200`,
  mobileNavLinkActive: `text-white bg-[#6188FF]/[0.12] border border-[#6188FF]/[0.2]`,
  mobileNavLinkInactive: `text-[#6a6f7a] hover:text-white hover:bg-white/[0.05]`,
  mobileNavIcon: `text-[16px]`,
  mobileQuickActions: `flex gap-2 px-4 mb-4`,
  mobileQuickBtn: `flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.04] transition-all hover:border-white/[0.08] cursor-pointer`,
  mobileQuickBtnLabel: `text-[11px] font-semibold`,
  mobileFooter: `mt-auto px-4 py-4 border-t border-white/[0.04]`,
  mobileConnectBtn: `w-full py-3 rounded-xl font-semibold text-[13px] transition-all`,
  mobileConnectBtnDisconnected: `bg-[#6188FF] text-white hover:bg-[#5178e8]`,
  mobileConnectBtnConnected: `bg-[#16c784]/[0.1] text-[#16c784] border border-[#16c784]/[0.15] hover:bg-[#16c784]/[0.18]`,
  mobileTxInfo: `text-center text-[#4a4f5a] text-[11px] mt-2`,
  wrongNetworkBanner: `bg-[#ea3943] text-white text-center py-2 text-[13px] font-semibold`,
  switchBtn: `ml-2 underline cursor-pointer hover:opacity-80`,
}

const Header = () => {
  const router = useRouter()
  const [showFaucet, setShowFaucet] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [menuAnimReady, setMenuAnimReady] = useState(false)
  const searchRef = useRef(null)
  const wallet = useWallet()

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => setMenuAnimReady(true))
    } else {
      setMenuAnimReady(false)
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
  }, [router.pathname])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }
    setSearchLoading(true)
    const controller = new AbortController()
    const fetchResults = async () => {
      try {
        const res = await fetch('/api/getTopTen', { signal: controller.signal })
        const data = await res.json()
        const coins = data?.data?.data || []
        const q = searchQuery.toLowerCase()
        const filtered = coins.filter(
          (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
        )
        setSearchResults(filtered.slice(0, 8))
      } catch {
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }
    const timer = setTimeout(fetchResults, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [searchQuery])

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleWalletClick = () => {
    if (wallet?.status === 'connected') {
      setShowDisconnectConfirm(true)
    } else {
      setShowWalletModal(true)
    }
  }

  const handleSearchSelect = (coin) => {
    setSearchQuery('')
    setShowSearch(false)
    router.push(`/currencies/info?coin=${coin.name}&symbol=${coin.symbol}&price=${coin.quote?.USD?.price || 0}`)
  }

  const handleMobileWallet = () => {
    setMobileOpen(false)
    handleWalletClick()
  }

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname.startsWith(href)
  }

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {wallet?.status === 'wrong-network' && (
        <div className={styles.wrongNetworkBanner}>
          ⚠️ You are on the wrong network.
          <span className={styles.switchBtn} onClick={wallet.switchToSepolia}>Switch to Sepolia</span>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span style={{ lineHeight: 0 }}>
              <Image
                alt="Logo"
                src="https://s2.coinmarketcap.com/static/cloud/img/coinmarketcap_white_1.svg"
                width={130}
                height={28}
                unoptimized
              />
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : styles.navLinkInactive}`}
              >
                <span>
                  {item.label}
                  {isActive(item.href) && <span className={styles.navActiveDot} />}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className={styles.rightSection}>
            {/* Faucet */}
            <button className={styles.faucetBtn} onClick={() => setShowFaucet(true)}>
              🚰 Faucet
            </button>

            {/* Wallet Button */}
            <button
              className={`${styles.walletPill} ${wallet?.status === 'connected' ? styles.walletPillConnected : styles.walletPillDisconnected}`}
              onClick={handleWalletClick}
              disabled={wallet?.isConnecting}
            >
              <span className={`${styles.walletDot} ${wallet?.status === 'connected' ? styles.walletDotOn : styles.walletDotOff}`} />
              <div className="flex flex-col items-start">
                {wallet?.status === 'connected' ? (
                  <>
                    <span className={`${styles.walletAddress} text-[#16c784]`}>{formatAddress(wallet.account)}</span>
                    {wallet.balance && <span className={`${styles.walletBalance} text-white`}>{wallet.balance} ETH</span>}
                  </>
                ) : (
                  <span className="text-[11px] font-semibold text-white">
                    {wallet?.isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                )}
              </div>
            </button>

            {/* Search */}
            <div className={styles.searchContainer} ref={searchRef}>
              <div className={styles.searchIcon}>
                <Search />
              </div>
              <input
                className={styles.searchInput}
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true) }}
                onFocus={() => searchQuery && setShowSearch(true)}
              />
              {showSearch && searchQuery.trim() && (
                <div className={styles.searchResults}>
                  {searchResults.length > 0 ? (
                    searchResults.map((coin) => (
                      <div key={coin.id} className={styles.searchResultItem} onClick={() => handleSearchSelect(coin)}>
                        {coin.image && <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" unoptimized />}
                        <div>
                          <p className={styles.searchResultName}>{coin.name}</p>
                          <p className={styles.searchResultSymbol}>{coin.symbol?.toUpperCase()}</p>
                        </div>
                        <span className="ml-auto text-[10px] text-[#4a4f5a]">#{coin.cmc_rank}</span>
                      </div>
                    ))
                  ) : !searchLoading ? (
                    <div className="px-4 py-5 text-center text-[#5a5f6a] text-[13px]">No coins found</div>
                  ) : (
                    <div className="px-4 py-5 text-center text-[#5a5f6a] text-[13px]">Searching...</div>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span className={`${styles.hamburgerLine} ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : '-translate-y-[3.5px]'}`} />
              <span className={`${styles.hamburgerLine} ${mobileOpen ? 'opacity-0 scale-0' : 'translate-y-[1.5px]'}`} />
              <span className={`${styles.hamburgerLine} ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : 'translate-y-[8.5px]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className={`${styles.mobileOverlay} ${menuAnimReady ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer Panel */}
      {mobileOpen && (
        <div className={`${styles.mobilePanel} ${menuAnimReady ? styles.mobilePanelVisible : styles.mobilePanelHidden}`}>
          <div className={styles.mobileTopBar}>
            <span className={styles.mobileLogoText}>
              <span className="text-[17px]">🪙</span>
              CMC Wallet
            </span>
            <button className={styles.mobileCloseBtn} onClick={() => setMobileOpen(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Wallet Card */}
          <div className={`${styles.mobileWalletCard} bg-[#14161f]`}>
            <div className={styles.mobileWalletCardBg} />
            <div className={styles.mobileWalletCardInner}>
              {wallet?.status === 'connected' ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={styles.mobileWalletAddress}>{formatAddress(wallet.account)}</span>
                    <span className={styles.mobileNetworkPill}>
                      <span className={styles.mobileNetworkDot} /> Sepolia
                    </span>
                  </div>
                  <p className={styles.mobileWalletAddressFull}>{wallet.account}</p>
                  <div className={styles.mobileBalanceRow}>
                    <div>
                      <p className={styles.mobileBalanceLabel}>ETH Balance</p>
                      <p className={styles.mobileBalanceValue}>{wallet.balance ? `${wallet.balance} ETH` : 'Loading...'}</p>
                    </div>
                    <div className="text-right">
                      <p className={styles.mobileBalanceLabel}>Transactions</p>
                      <p className="text-white text-[17px] font-bold">{wallet.txCount}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-[#6a6f7a] text-[13px] mb-0.5">No wallet connected</p>
                  <p className="text-[#3a3f4a] text-[11px]">Connect MetaMask to start</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.mobileQuickActions}>
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.href} href={action.href} className={styles.mobileQuickBtn} onClick={() => setMobileOpen(false)}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[15px] ${action.color}`}>
                  {action.icon}
                </div>
                <span className={`${styles.mobileQuickBtnLabel} text-[#8a8f98]`}>{action.label}</span>
              </Link>
            ))}
          </div>

          {/* Navigation */}
          <div className={styles.mobileNavSection}>
            <p className={styles.mobileNavLabel}>Navigation</p>
            <nav className="flex flex-col gap-[1px]">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.mobileNavLinkActive : styles.mobileNavLinkInactive}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className={styles.mobileNavIcon}>{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6188FF]" />}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className={styles.mobileFooter}>
            <button
              className={`${styles.mobileConnectBtn} ${wallet?.status === 'connected' ? styles.mobileConnectBtnConnected : styles.mobileConnectBtnDisconnected}`}
              onClick={handleMobileWallet}
            >
              {wallet?.isConnecting ? 'Connecting...' : wallet?.status === 'connected' ? `Connected • ${formatAddress(wallet.account)}` : 'Connect MetaMask'}
            </button>
            {wallet?.status === 'connected' && wallet.txCount > 0 && (
              <p className={styles.mobileTxInfo}>{wallet.txCount} transaction{wallet.txCount !== 1 ? 's' : ''} recorded</p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <FaucetModal isOpen={showFaucet} onClose={() => setShowFaucet(false)} />
      <WalletConnectModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
      <ConfirmModal
        isOpen={showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(false)}
        onConfirm={() => wallet?.disconnect()}
        title="Disconnect Wallet"
        description="Are you sure you want to disconnect your wallet?"
        confirmText="Disconnect"
        variant="danger"
      />
    </>
  )
}

export default Header
