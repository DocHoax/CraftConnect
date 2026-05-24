import { apiRequest } from '@/lib/api'
import type { AuthResponse, LoginPayload, SignUpPayload, User } from '@/types/auth'

export async function getCurrentUser(): Promise<User | null> {
  const response = await apiRequest<AuthResponse>('/auth/me', {
    method: 'GET',
  })

  return response.user
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })

  return response.user
}

export async function signUpRequest(payload: SignUpPayload): Promise<User> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })

  return response.user
}

export async function logoutRequest(): Promise<void> {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
  })
}

export function getConfiguredAuthMode(): 'api' {
  return 'api'
}
