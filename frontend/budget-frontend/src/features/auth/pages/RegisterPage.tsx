import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '@/contexts'
import { Card } from '@/components/ui'
import { FormField } from '@/components/form'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await register(formData)
      toast.success('Account created successfully!')
      navigate('/transactions')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-slate-100">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Name"
              type="text"
              id="name"
              value={formData.name}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, name: value }))
              }
              required
            />

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
              label="Password"
              type="password"
              id="password"
              value={formData.password}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, password: value }))
              }
              required
            />

            <FormField
              label="Confirm Password"
              type="password"
              id="password_confirmation"
              value={formData.password_confirmation}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  password_confirmation: value,
                }))
              }
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-slate-100 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
