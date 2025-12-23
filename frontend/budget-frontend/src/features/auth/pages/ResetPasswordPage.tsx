import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/contexts'
import { Card, Button } from '@/components/ui'
import { FormField } from '@/components/form'
import { resetPassword } from '@/api'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const toast = useToast()
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
      toast.error('Passwords do not match')
      return
    }

    if (!token) {
      toast.error('Invalid reset token')
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
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="mb-2 text-2xl font-bold text-slate-100">
            Reset your password
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value }))
              }
              required
            />

            <FormField
              label="New Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              required
              description="Minimum 8 characters"
            />

            <FormField
              label="Confirm Password"
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
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
