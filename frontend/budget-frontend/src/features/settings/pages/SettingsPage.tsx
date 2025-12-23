import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '@/contexts'
import { Card, Button, ConfirmDialog } from '@/components/ui'
import { FormField } from '@/components/form'
import { updateProfile, updatePassword, updatePreferences, deleteAccount } from '@/api'
import { useTranslation } from '@/i18n'
import AppLayout from '@/layouts/AppLayout'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, refreshUser, logout } = useAuth()
  const toast = useToast()
  const { t } = useTranslation()

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const [preferencesData, setPreferencesData] = useState({
    theme: user?.theme || 'dark' as const,
    currency: user?.currency || 'EUR' as const,
    date_format: user?.date_format || 'd-m-Y' as const,
    language: user?.language || 'nl' as const,
  })

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      await updateProfile(profileData)
      await refreshUser()
      toast.success(t('profileUpdatedSuccessfully'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('failedToUpdateProfile'))
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error(t('passwordsDoNotMatch'))
      return
    }

    setIsUpdatingPassword(true)

    try {
      await updatePassword(passwordData)
      toast.success(t('passwordUpdatedSuccessfully'))
      setPasswordData({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('failedToUpdatePassword'))
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  async function handlePreferencesSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingPreferences(true)

    try {
      await updatePreferences(preferencesData)
      await refreshUser()
      toast.success(t('preferencesUpdatedSuccessfully'))
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('failedToUpdatePreferences'))
    } finally {
      setIsUpdatingPreferences(false)
    }
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      toast.error(t('password'))
      return
    }

    setIsDeletingAccount(true)

    try {
      await deleteAccount({ password: deletePassword })
      toast.success(t('accountDeletedSuccessfully'))
      await logout()
      navigate('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('failedToDeleteAccount'))
    } finally {
      setIsDeletingAccount(false)
      setShowDeleteDialog(false)
      setDeletePassword('')
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100">{t('settings')}</h1>

        {/* Profile Settings */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">{t('profileInformation')}</h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <FormField
                label={t('name')}
                type="text"
                id="name"
                value={profileData.name}
                onChange={(value) =>
                  setProfileData((prev) => ({ ...prev, name: value }))
                }
                required
              />

              <FormField
                label={t('email')}
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
                  {isUpdatingProfile ? t('saving') : t('saveChanges')}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">{t('preferences')}</h2>

            <form onSubmit={handlePreferencesSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('theme')}
                </label>
                <select
                  value={preferencesData.theme}
                  onChange={(e) =>
                    setPreferencesData((prev) => ({
                      ...prev,
                      theme: e.target.value as 'light' | 'dark',
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="dark">{t('dark')}</option>
                  <option value="light">{t('light')}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('currency')}
                </label>
                <select
                  value={preferencesData.currency}
                  onChange={(e) =>
                    setPreferencesData((prev) => ({
                      ...prev,
                      currency: e.target.value as 'EUR' | 'USD' | 'GBP',
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="EUR">{t('currencyEuro')}</option>
                  <option value="USD">{t('currencyUsd')}</option>
                  <option value="GBP">{t('currencyGbp')}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('dateFormat')}
                </label>
                <select
                  value={preferencesData.date_format}
                  onChange={(e) =>
                    setPreferencesData((prev) => ({
                      ...prev,
                      date_format: e.target.value as 'd-m-Y' | 'Y-m-d' | 'm/d/Y',
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="d-m-Y">DD-MM-YYYY (31-12-2025)</option>
                  <option value="Y-m-d">YYYY-MM-DD (2025-12-31)</option>
                  <option value="m/d/Y">MM/DD/YYYY (12/31/2025)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t('language')}
                </label>
                <select
                  value={preferencesData.language}
                  onChange={(e) =>
                    setPreferencesData((prev) => ({
                      ...prev,
                      language: e.target.value as 'nl' | 'en',
                    }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="nl">{t('nederlands')}</option>
                  <option value="en">{t('english')}</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingPreferences}
                >
                  {isUpdatingPreferences ? t('saving') : t('savePreferences')}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Password Settings */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">{t('changePassword')}</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <FormField
                label={t('currentPassword')}
                type="password"
                id="current_password"
                value={passwordData.current_password}
                onChange={(value) =>
                  setPasswordData((prev) => ({ ...prev, current_password: value }))
                }
                required
              />

              <FormField
                label={t('newPassword')}
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
                label={t('confirmPassword')}
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
                  {isUpdatingPassword ? t('updating') : t('updatePassword')}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Delete Account */}
        <Card>
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-red-400">{t('dangerZone')}</h2>
            <p className="mb-4 text-sm text-slate-400">
              {t('deleteAccountWarning')}
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="rounded-lg border border-red-600 bg-red-600/10 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-600/20"
            >
              {t('deleteAccount')}
            </button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false)
          setDeletePassword('')
        }}
        onConfirm={handleDeleteAccount}
        title={t('deleteAccount')}
        message={
          <div className="space-y-4">
            <p>
              {t('deleteAccountConfirm')}
            </p>
            <FormField
              label={t('enterPasswordToConfirm')}
              type="password"
              id="delete_password"
              value={deletePassword}
              onChange={(value) => setDeletePassword(value)}
              required
            />
          </div>
        }
        confirmText={t('deleteAccount')}
        cancelText={t('cancel')}
        variant="danger"
        isLoading={isDeletingAccount}
      />
    </AppLayout>
  )
}
