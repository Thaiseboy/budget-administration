import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useToast } from '@/contexts'
import { Card, Button, ConfirmDialog } from '@/components/ui'
import { FormField, FormFieldGroup } from '@/components/form'
import { updateProfile, updatePassword, updatePreferences, deleteAccount, type UpdatePreferencesData } from '@/api'
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

  const [preferencesData, setPreferencesData] = useState<UpdatePreferencesData>({
    theme: user?.theme || 'dark',
    currency: user?.currency || 'EUR',
    date_format: user?.date_format || 'd-m-Y',
    language: user?.language || 'nl',
  })

  const preferenceFieldUi = {
    labelClass: 'mb-2 block text-sm font-medium text-slate-300',
    inputClass:
      'border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
  }

  const preferenceFields = [
    {
      name: 'theme',
      label: t('theme'),
      type: 'select' as const,
      ...preferenceFieldUi,
      options: [
        { label: t('dark'), value: 'dark' },
        { label: t('light'), value: 'light' },
      ],
    },
    {
      name: 'currency',
      label: t('currency'),
      type: 'select' as const,
      ...preferenceFieldUi,
      options: [
        { label: t('currencyEuro'), value: 'EUR' },
        { label: t('currencyUsd'), value: 'USD' },
        { label: t('currencyGbp'), value: 'GBP' },
        { label: t('currencyThb'), value: 'THB' },
      ],
    },
    {
      name: 'date_format',
      label: t('dateFormat'),
      type: 'select' as const,
      ...preferenceFieldUi,
      options: [
        { label: 'DD-MM-YYYY (31-12-2025)', value: 'd-m-Y' },
        { label: 'YYYY-MM-DD (2025-12-31)', value: 'Y-m-d' },
        { label: 'MM/DD/YYYY (12/31/2025)', value: 'm/d/Y' },
      ],
    },
    {
      name: 'language',
      label: t('language'),
      type: 'select' as const,
      ...preferenceFieldUi,
      options: [
        { label: t('nederlands'), value: 'nl' },
        { label: t('english'), value: 'en' },
      ],
    },
  ]

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
              <FormFieldGroup
                fields={preferenceFields}
                formData={preferencesData}
                onFieldChange={(name, value) => {
                  setPreferencesData((prev) => ({
                    ...prev,
                    [name as keyof UpdatePreferencesData]:
                      value as UpdatePreferencesData[keyof UpdatePreferencesData],
                  }))
                }}
              />

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
                description={t('passwordMinLength')}
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
