export type UserRole = 'customer' | 'artisan' | 'admin' | null

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export interface LoginPayload {
  email: string
  password: string
  role?: Exclude<UserRole, null>
}

export interface SignUpPayload {
  fullName: string
  email: string
  phone: string
  address: string
  password: string
  accountType: Exclude<UserRole, null | 'admin'>
  category?: string
  experience?: string
  serviceDescription?: string
}

export interface AuthResponse {
  user: User
}
