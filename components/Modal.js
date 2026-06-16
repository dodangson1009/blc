import { useState, useEffect, useRef, useCallback } from 'react'

const styles = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300',
  backdrop: 'absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300',
  container: 'relative z-10 w-full transition-all duration-300 transform',
  content: `
    relative rounded-2xl border border-white/[0.08] shadow-2xl
    bg-[rgba(15,23,42,0.92)] backdrop-blur-xl
    max-h-[90vh] overflow-y-auto overflow-x-hidden
  `,
  header: 'flex items-center justify-between px-6 pt-6 pb-2',
  title: 'text-lg font-bold text-white',
  subtitle: 'text-sm text-gray-400 mt-0.5',
  closeBtn: `
    w-8 h-8 flex items-center justify-center rounded-lg
    text-gray-400 hover:text-white hover:bg-white/10
    transition-all duration-200 cursor-pointer
  `,
  body: 'px-6 py-4',
  footer: 'flex items-center justify-end gap-3 px-6 pb-6 pt-2',
  // Size variants
  sm: 'max-w-[400px]',
  md: 'max-w-[600px]',
  lg: 'max-w-[900px]',
  // Animation states
  overlayEnter: 'opacity-0',
  overlayVisible: 'opacity-100',
  containerEnter: 'opacity-0 scale-95 translate-y-2',
  containerVisible: 'opacity-100 scale-100 translate-y-0',
}

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  className = '',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseBtn = true,
}) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const contentRef = useRef(null)
  const previousActiveElement = useRef(null)
  const closeTimerRef = useRef(null)

  // Animate in on mount, animate out on close
  useEffect(() => {
    if (isOpen) {
      // Ensure initial hidden state renders before transitioning to visible
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setMounted(true)
          setVisible(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    } else if (mounted) {
      // Start exit animation (only if currently mounted)
      setVisible(false)
      // Remove from DOM after transition completes
      closeTimerRef.current = setTimeout(() => {
        setMounted(false)
      }, 300) // matches duration-300
      return () => clearTimeout(closeTimerRef.current)
    }
  }, [isOpen])

  // ESC to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEsc && onClose) {
        e.stopPropagation()
        onClose()
      }
    },
    [closeOnEsc, onClose]
  )

  // Focus trap
  const handleFocusTrap = useCallback(
    (e) => {
      if (e.key !== 'Tab' || !contentRef.current) return
      const focusable = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    []
  )

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keydown', handleFocusTrap)
      document.body.style.overflow = 'hidden'
      // Focus the modal content
      setTimeout(() => {
        contentRef.current?.focus()
      }, 50)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleFocusTrap)
      document.body.style.overflow = ''
      // Restore focus
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, handleKeyDown, handleFocusTrap])

  if (!isOpen && !mounted) return null

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : styles.overlayEnter}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={subtitle ? 'modal-subtitle' : undefined}
    >
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${visible ? styles.overlayVisible : styles.overlayEnter}`}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Container */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`${styles.container} ${styles[size]} ${visible ? styles.containerVisible : styles.containerEnter} ${className}`}
      >
        <div className={styles.content}>
          {/* Header */}
          {(title || showCloseBtn) && (
            <div className={styles.header}>
              <div>
                {title && (
                  <h2 id="modal-title" className={styles.title}>
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p id="modal-subtitle" className={styles.subtitle}>
                    {subtitle}
                  </p>
                )}
              </div>
              {showCloseBtn && (
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          {children && <div className={styles.body}>{children}</div>}

          {/* Footer */}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </div>
    </div>
  )
}

// Footer button components
const ModalButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const variants = {
    primary: 'bg-[#6188FF] text-white hover:bg-[#5178e8] active:scale-[0.98]',
    secondary: 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 active:scale-[0.98]',
    danger: 'bg-[#ea3943] text-white hover:bg-[#d63340] active:scale-[0.98]',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2.5 rounded-xl text-sm font-semibold
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export { Modal, ModalButton }
export default Modal
