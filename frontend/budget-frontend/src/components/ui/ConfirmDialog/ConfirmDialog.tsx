import { type ReactNode } from 'react'
import Button from '../Button'
import { useTranslation } from '@/i18n'

type ConfirmDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  if (!isOpen) return null
  const resolvedConfirmText = confirmText ?? t('confirm')
  const resolvedCancelText = cancelText ?? t('cancel')

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-slate-100">{title}</h2>

        <div className="mb-6 text-slate-300">
          {message}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
          >
            {resolvedCancelText}
          </Button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 font-medium text-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]}`}
          >
            {isLoading ? t('processing') : resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
