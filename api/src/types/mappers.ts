export function toClientRole(role: string): 'customer' | 'artisan' | 'admin' {
  switch (role) {
    case 'CUSTOMER':
      return 'customer'
    case 'ARTISAN':
      return 'artisan'
    case 'ADMIN':
      return 'admin'
    default:
      return 'customer'
  }
}

export function toClientStatus(status: string): 'pending' | 'confirmed' | 'completed' | 'cancelled' {
  switch (status) {
    case 'PENDING':
      return 'pending'
    case 'CONFIRMED':
      return 'confirmed'
    case 'COMPLETED':
      return 'completed'
    case 'CANCELLED':
      return 'cancelled'
    default:
      return 'pending'
  }
}

export function fromClientStatus(status: string): 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | null {
  switch (status) {
    case 'pending':
      return 'PENDING'
    case 'confirmed':
      return 'CONFIRMED'
    case 'completed':
      return 'COMPLETED'
    case 'cancelled':
      return 'CANCELLED'
    default:
      return null
  }
}
