import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '@/contexts'
import { useTranslation } from '@/i18n'
import { Card } from '@/components/ui'
import { FormField } from '@/components/form'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      toast.success(t('welcomeBack'))
      navigate('/transactions')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-slate-100">
            {t('signInToBudgetApp')}
          </h1>

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
              label={t('password')}
              type="password"
              id="password"
              value={formData.password}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.remember}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, remember: e.target.checked }))
                  }
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-300">
                  {t('rememberMe')}
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-slate-100 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {t('dontHaveAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              {t('createOne')}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
