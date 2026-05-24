import { apiRequest } from '@/lib/api'
import type { AuthResponse, LoginPayload, SignUpPayload, User } from '@/types/auth'
import { clearStoredUser, getStoredUser, setStoredUser } from './auth-storage'

type AuthMode = 'demo' | 'api'

function getAuthMode(): AuthMode {
  return import.meta.env.VITE_AUTH_MODE === 'api' ? 'api' : 'demo'
}

function buildDemoUser(email: string, role: NonNullable<User['role']>, fullName?: string): User {
  return {
    id: '1',
    name: fullName ?? (role === 'customer' ? 'John Doe' : role === 'artisan' ? 'Maria Johnson' : 'Admin User'),
    email,
    role,
    avatar: role === 'artisan' ? '/images/artisan-1.jpg' : undefined,
  }
}

async function simulateDelay(duration = 500): Promise<void> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

export async function getCurrentUser(): Promise<User | null> {
  if (getAuthMode() === 'demo') {
    await simulateDelay(150)
    return getStoredUser()
  }

  const response = await apiRequest<AuthResponse>('/auth/me', {
    method: 'GET',
  })

  return response.user
}

export async function loginRequest(payload: LoginPayload): Promise<User> {
  if (getAuthMode() === 'demo') {
    await simulateDelay(700)

    if (!payload.email || !payload.password || !payload.role) {
      throw new Error('Please enter both email and password')
    }

    const user = buildDemoUser(payload.email, payload.role)
    setStoredUser(user)
    return user
  }

  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  })

  return response.user
}

export async function signUpRequest(payload: SignUpPayload): Promise<User> {
  if (getAuthMode() === 'demo') {
    await simulateDelay(900)

    const user = buildDemoUser(payload.email, payload.accountType, payload.fullName)
    setStoredUser(user)
    return user
  }

  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  })

  return response.user
}

export async function logoutRequest(): Promise<void> {
  if (getAuthMode() === 'demo') {
    clearStoredUser()
    return
  }

  await apiRequest<void>('/auth/logout', {
    method: 'POST',
  })
}

export function getConfiguredAuthMode(): AuthMode {
  return getAuthMode()
}
