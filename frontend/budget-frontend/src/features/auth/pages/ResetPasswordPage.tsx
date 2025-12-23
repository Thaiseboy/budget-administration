import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/contexts'
import { Card, Button } from '@/components/ui'
import { FormField } from '@/components/form'
import { resetPassword } from '@/api'
import { useTranslation } from '@/i18n'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  const token = searchParams.get('token') || ''
  const emailParam = searchParams.get('email') || ''

  const [formData, setFormData] = useState({
    email: emailParam,
    password: '',
    password_confirmation: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password !== formData.password_confirmation) {
      toast.error(t('passwordsDoNotMatch'))
      return
    }

    if (!token) {
      toast.error(t('invalidResetToken'))
      return
    }

    setIsLoading(true)

    try {
      await resetPassword({
        email: formData.email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })
      toast.success(t('passwordResetSuccess'))
      navigate('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('passwordResetFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            {t('resetPasswordTitle')}
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            {t('resetPasswordDescription')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label={t('email')}
              type="email"
              id="email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
              required
            />

            <FormField
              label={t('newPassword')}
              type="password"
              id="password"
              value={formData.password}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              required
              description={t('passwordMinLength')}
            />

            <FormField
              label={t('confirmPassword')}
              type="password"
              id="password_confirmation"
              value={formData.password_confirmation}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, password_confirmation: value }))
              }
              required
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t('resettingPassword') : t('resetPassword')}
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
