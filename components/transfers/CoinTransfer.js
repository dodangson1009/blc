import React, { useState } from 'react'
import Toast from '../Toast'
import ConfirmModal from '../ConfirmModal'

export default function CoinTransfer() {
    const [receiver, setReceiver] = useState('')
    const [amount, setAmount] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

    const handleTransfer = () => {
        setShowConfirm(true)
    }

    const confirmTransfer = () => {
        setShowConfirm(false)
        setToast({ visible: true, message: 'Transfer features are temporarily unavailable', type: 'info' })
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <input
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[#6188FF]/50 transition-colors"
                    placeholder="Select Token"
                />
                <p className="text-xs text-gray-500">Show Balance:</p>
                <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[#6188FF]/50 transition-colors"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500">To:</p>
                <input
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm outline-none focus:border-[#6188FF]/50 transition-colors"
                    placeholder="Address"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                />
            </div>
            <button
                onClick={handleTransfer}
                className="w-full px-5 py-3 bg-[#6188FF] text-white rounded-xl text-sm font-semibold hover:bg-[#5178e8] transition-colors"
            >
                Transfer
            </button>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmTransfer}
                title="Confirm Transfer"
                description="Transfer features are temporarily unavailable. This feature will be available soon."
                confirmText="Understood"
                variant="info"
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
