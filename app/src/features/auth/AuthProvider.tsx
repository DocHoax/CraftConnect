import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getConfiguredAuthMode, getCurrentUser, loginRequest, logoutRequest, signUpRequest } from './auth-api'
import type { LoginPayload, SignUpPayload, User } from '@/types/auth'

interface AuthContextValue {
  authMode: 'demo' | 'api'
  user: User | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<User>
  signUp: (payload: SignUpPayload) => Promise<User>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    setIsLoading(true)
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshSession()
  }, [refreshSession])

  const login = useCallback(async (payload: LoginPayload) => {
    const authenticatedUser = await loginRequest(payload)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const signUp = useCallback(async (payload: SignUpPayload) => {
    const authenticatedUser = await signUpRequest(payload)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    authMode: getConfiguredAuthMode(),
    user,
    isLoading,
    login,
    signUp,
    logout,
    refreshSession,
  }), [isLoading, login, logout, refreshSession, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
