export const translations = {
  nl: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transacties',
    categories: 'Categorieën',
    settings: 'Instellingen',
    logout: 'Uitloggen',

    // Common
    save: 'Opslaan',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    close: 'Sluiten',
    confirm: 'Bevestigen',
    loading: 'Laden...',
    search: 'Zoeken',
    filter: 'Filteren',

    // Transactions
    newTransaction: 'Nieuwe transactie',
    editTransaction: 'Transactie bewerken',
    deleteTransaction: 'Transactie verwijderen',
    amount: 'Bedrag',
    description: 'Omschrijving',
    category: 'Categorie',
    date: 'Datum',
    type: 'Type',
    income: 'Inkomsten',
    expense: 'Uitgaven',

    // Settings
    profile: 'Profiel',
    preferences: 'Voorkeuren',
    theme: 'Thema',
    dark: 'Donker',
    light: 'Licht',
    currency: 'Valuta',
    dateFormat: 'Datumnotatie',
    language: 'Taal',
    changePassword: 'Wachtwoord wijzigen',
    dangerZone: 'Gevarenzone',
    deleteAccount: 'Account verwijderen',

    // Messages
    saveSuccess: 'Succesvol opgeslagen',
    saveError: 'Fout bij opslaan',
    deleteSuccess: 'Succesvol verwijderd',
    deleteError: 'Fout bij verwijderen',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    transactions: 'Transactions',
    categories: 'Categories',
    settings: 'Settings',
    logout: 'Logout',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',

    // Transactions
    newTransaction: 'New transaction',
    editTransaction: 'Edit transaction',
    deleteTransaction: 'Delete transaction',
    amount: 'Amount',
    description: 'Description',
    category: 'Category',
    date: 'Date',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',

    // Settings
    profile: 'Profile',
    preferences: 'Preferences',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    currency: 'Currency',
    dateFormat: 'Date format',
    language: 'Language',
    changePassword: 'Change password',
    dangerZone: 'Danger Zone',
    deleteAccount: 'Delete account',

    // Messages
    saveSuccess: 'Successfully saved',
    saveError: 'Error saving',
    deleteSuccess: 'Successfully deleted',
    deleteError: 'Error deleting',
  },
} as const

export type TranslationKey = keyof typeof translations.nl
export type Language = 'nl' | 'en'
