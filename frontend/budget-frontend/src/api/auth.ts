import { http } from './http'

export type User = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
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
  const response = await http.post<AuthResponse>('/register', data)
  return response.data
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await http.post<AuthResponse>('/login', data)
  return response.data
}

export async function logout(): Promise<void> {
  await http.post('/logout')
}

export async function getCurrentUser(): Promise<User> {
  const response = await http.get<{ user: User }>('/user')
  return response.data.user
}

export async function sendVerificationEmail(): Promise<void> {
  await http.post('/email/verification-notification')
}

export async function checkVerificationStatus(): Promise<boolean> {
  const response = await http.get<{ verified: boolean }>('/email/verification-status')
  return response.data.verified
}
