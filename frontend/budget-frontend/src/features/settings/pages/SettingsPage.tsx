import { useState } from 'react'
import { useAuth, useToast } from '@/contexts'
import { Card, Button } from '@/components/ui'
import { FormField } from '@/components/form'
import { updateProfile, updatePassword } from '@/api'
import AppLayout from '@/layouts/AppLayout'

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const toast = useToast()

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      await updateProfile(profileData)
      await refreshUser()
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    setIsUpdatingPassword(true)

    try {
      await updatePassword(passwordData)
      toast.success('Password updated successfully')
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>

        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">Profile Information</h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <FormField
                label="Name"
                type="text"
                id="name"
                value={profileData.name}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, name: value }))
                }
                required
              />

              <FormField
                label="Email"
                type="email"
                id="email"
                value={profileData.email}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, email: value }))
                }
                required
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">Change Password</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField
                label="Current Password"
                type="password"
                id="current_password"
                value={passwordData.current_password}
                onChange={(value) =>
                  setPasswordData((prev) => ({ ...prev, current_password: value }))
                }
                required
              />

              <FormField
                label="New Password"
                type="password"
                id="password"
                value={passwordData.password}
                onChange={(value) =>
                  setPasswordData((prev) => ({ ...prev, password: value }))
                }
                required
                description="Minimum 8 characters"
              />

              <FormField
                label="Confirm New Password"
                type="password"
                id="password_confirmation"
                value={passwordData.password_confirmation}
                onChange={(value) =>
                  setPasswordData((prev) => ({ ...prev, password_confirmation: value }))
                }
                required
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
