import { http } from './http'

export type ForgotPasswordData = {
  email: string
}

export type ResetPasswordData = {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export type MessageResponse = {
  message: string
}

export async function sendPasswordResetLink(data: ForgotPasswordData): Promise<MessageResponse> {
  return http.post<MessageResponse>('/forgot-password', data)
}

export async function resetPassword(data: ResetPasswordData): Promise<MessageResponse> {
  return http.post<MessageResponse>('/reset-password', data)
}
