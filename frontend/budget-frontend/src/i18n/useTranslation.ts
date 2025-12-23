import { useAuth } from '@/contexts'
import { translations, type TranslationKey, type Language } from './translations'

export function useTranslation() {
  const { user } = useAuth()
  const language: Language = (user?.language as Language) || 'nl'

  function t(key: TranslationKey): string {
    return translations[language][key] || key
  }

  return { t, language }
}
