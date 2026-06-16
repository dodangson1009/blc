import Modal, { ModalButton } from './Modal'

const styles = {
  icon: `
    w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4
    bg-[#ea3943]/10 border border-[#ea3943]/20
  `,
  description: 'text-gray-400 text-sm text-center mb-2',
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title=""
      showCloseBtn={false}
    >
      <div className="text-center py-2">
        <div className={styles.icon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea3943" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
        <p className={styles.description}>{description}</p>

      </div>
      <div className="flex items-center gap-3 mt-6">
        <ModalButton variant="secondary" onClick={onClose} className="flex-1">
          {cancelText}
        </ModalButton>
        <ModalButton
          variant={variant}
          onClick={() => {
            onConfirm()
            onClose()
          }}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Processing...' : confirmText}
        </ModalButton>
      </div>
    </Modal>
  )
}

export default ConfirmModal
