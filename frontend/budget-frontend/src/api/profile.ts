import { http } from './http'
import type { User } from './auth'

export type UpdateProfileData = {
  name: string
  email: string
}

export type UpdatePasswordData = {
  current_password: string
  password: string
  password_confirmation: string
}

export type ProfileUpdateResponse = {
  user: User
  message: string
}

export type PasswordUpdateResponse = {
  message: string
}

export type DeleteAccountData = {
  password: string
}

export type DeleteAccountResponse = {
  message: string
}

export async function updateProfile(data: UpdateProfileData): Promise<ProfileUpdateResponse> {
  return http.put<ProfileUpdateResponse>('/profile', data)
}

export async function updatePassword(data: UpdatePasswordData): Promise<PasswordUpdateResponse> {
  return http.put<PasswordUpdateResponse>('/profile/password', data)
}

export async function deleteAccount(data: DeleteAccountData): Promise<DeleteAccountResponse> {
  return http.delete<DeleteAccountResponse>('/profile', { body: JSON.stringify(data) })
}
