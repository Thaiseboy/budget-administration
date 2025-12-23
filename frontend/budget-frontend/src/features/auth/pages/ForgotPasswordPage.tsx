import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@/contexts'
import { Card, Button } from '@/components/ui'
import { FormField } from '@/components/form'
import { sendPasswordResetLink } from '@/api'
import { useTranslation } from '@/i18n'

export default function ForgotPasswordPage() {
  const toast = useToast()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await sendPasswordResetLink({ email })
      setEmailSent(true)
      toast.success(t('resetLinkSent'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('resetLinkFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <svg
                  className="h-6 w-6 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-slate-100">
                {t('checkYourEmail')}
              </h1>
              <p className="text-slate-400">
                {t('resetLinkSentToEmail', { email })}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                {t('didntReceiveEmail')}
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="secondary"
                  className="w-full"
                >
                  {t('sendAgain')}
                </Button>
                <Link
                  to="/login"
                  className="block text-center text-sm text-slate-400 hover:text-slate-300"
                >
                  {t('backToLogin')}
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            {t('forgotPasswordTitle')}
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            {t('forgotPasswordDescription')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label={t('email')}
              type="email"
              id="email"
              value={email}
              onChange={(value) => setEmail(value)}
              required
              placeholder={t('emailPlaceholder')}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t('sending') : t('sendResetLink')}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
