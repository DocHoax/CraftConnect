import type { User } from '@/types/auth'

const USER_STORAGE_KEY = 'abs_user'

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}
