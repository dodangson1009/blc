import { useEffect, useState } from 'react'

const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
}

const styles = {
  container: `
    fixed bottom-6 right-6 z-[100] flex flex-col gap-2
    pointer-events-none
  `,
  toast: `
    pointer-events-auto flex items-center gap-3 px-5 py-3.5
    rounded-xl shadow-2xl text-white text-sm font-medium
    border border-white/[0.06]
    transition-all duration-300 transform
    backdrop-blur-xl
  `,
  success: 'bg-[#16c784]/90 border-[#16c784]/30',
  error: 'bg-[#ea3943]/90 border-[#ea3943]/30',
  info: 'bg-[#6188FF]/90 border-[#6188FF]/30',
  show: 'translate-y-0 opacity-100 scale-100',
  hide: 'translate-y-4 opacity-0 scale-95',
  icon: 'flex-shrink-0',
  message: 'flex-1',
  closeBtn: `
    flex-shrink-0 w-6 h-6 flex items-center justify-center
    rounded-md text-white/50 hover:text-white hover:bg-white/10
    transition-all duration-150 cursor-pointer
  `,
}

const Toast = ({ message, type = 'info', visible, onClose }) => {
  const [shouldRender, setShouldRender] = useState(false)
  const [animClass, setAnimClass] = useState(styles.hide)

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimClass(styles.show)
        })
      })
      const timer = setTimeout(() => {
        if (onClose) onClose()
      }, 4000)
      return () => clearTimeout(timer)
    } else {
      setAnimClass(styles.hide)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!shouldRender) return null

  return (
    <div className={styles.container}>
      <div className={`${styles.toast} ${styles[type] || styles.info} ${animClass}`}>
        <span className={styles.icon}>{icons[type] || icons.info}</span>
        <span className={styles.message}>{message}</span>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Toast
