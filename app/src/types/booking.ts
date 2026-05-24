export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  customerId: string
  artisanId: string
  artisanName: string
  service: string
  date: string
  time: string
  location: string
  status: BookingStatus
  price: number
  notes?: string
}

export interface CreateBookingPayload {
  customerId: string
  artisanId: string
  artisanName: string
  service: string
  date: string
  time: string
  location: string
  notes?: string
}
