import { useState } from 'react'
import { useAuth, useToast } from '@/contexts'
import { sendVerificationEmail } from '@/api'
import { useTranslation } from '@/i18n'

export default function EmailVerificationBanner() {
  const { user } = useAuth()
  const toast = useToast()
  const { t } = useTranslation()
  const [isSending, setIsSending] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if user is verified or dismissed
  if (!user || user.email_verified_at || isDismissed) {
    return null
  }

  async function handleResendEmail() {
    setIsSending(true)
    try {
      await sendVerificationEmail()
      toast.success(t('verificationEmailSent'))
    } catch (error) {
      toast.error(t('verificationEmailFailed'))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="border-b border-amber-700 bg-amber-500/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-200">
              {t('verifyEmailTitle')}
            </p>
            <p className="text-xs text-amber-300/80">
              {t('verifyEmailDescription', { email: user.email })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResendEmail}
            disabled={isSending}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-amber-200 transition-colors hover:bg-amber-500/20 disabled:opacity-50"
          >
            {isSending ? t('sending') : t('resendEmail')}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="rounded-md p-1 text-amber-300/60 transition-colors hover:bg-amber-500/20 hover:text-amber-200"
            aria-label={t('dismiss')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
