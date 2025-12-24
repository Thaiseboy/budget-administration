import { useAuth } from '@/contexts'
import { translations, type TranslationKey, type Language } from './translations'

export function useTranslation() {
  const { user } = useAuth()
  const language: Language = (user?.language as Language) || 'nl'
  const locale = language === 'nl' ? 'nl-NL' : 'en-US'

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    const template = translations[language][key] || key
    if (!vars) return template
    return template.replace(/\{(\w+)\}/g, (_, token) => String(vars[token] ?? `{${token}}`))
  }

  return { t, language, locale }
}
