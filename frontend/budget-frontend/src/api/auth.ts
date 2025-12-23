import { http } from './http'

export type User = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  theme: 'light' | 'dark'
  currency: 'EUR' | 'USD' | 'GBP'
  date_format: 'd-m-Y' | 'Y-m-d' | 'm/d/Y'
  language: 'nl' | 'en'
}

export type RegisterData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export type LoginData = {
  email: string
  password: string
  remember?: boolean
}

export type AuthResponse = {
  user: User
  token: string
  message: string
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return http.post<AuthResponse>('/register', data)
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return http.post<AuthResponse>('/login', data)
}

export async function logout(): Promise<void> {
  await http.post('/logout')
}

export async function getCurrentUser(): Promise<User> {
  const response = await http.get<{ user: User }>('/user')
  return response.user
}

export async function sendVerificationEmail(): Promise<void> {
  await http.post('/email/verification-notification')
}

export async function checkVerificationStatus(): Promise<boolean> {
  const response = await http.get<{ verified: boolean }>('/email/verification-status')
  return response.verified
}
