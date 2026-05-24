import { apiRequest } from '@/lib/api'
import type { Booking, CreateBookingPayload } from '@/types/booking'

export async function listCustomerBookings(customerId: string): Promise<Booking[]> {
  const params = new URLSearchParams({ customerId })
  return apiRequest<Booking[]>(`/bookings?${params.toString()}`, {
    method: 'GET',
  })
}

export async function listArtisanBookings(artisanId: string): Promise<Booking[]> {
  const params = new URLSearchParams({ artisanId })
  return apiRequest<Booking[]>(`/bookings?${params.toString()}`, {
    method: 'GET',
  })
}

export async function listAllBookings(): Promise<Booking[]> {
  return apiRequest<Booking[]>('/bookings', {
    method: 'GET',
  })
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    return await apiRequest<Booking>(`/bookings/${bookingId}`, {
      method: 'GET',
    })
  } catch {
    return null
  }
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking | null> {
  try {
    return await apiRequest<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: { status },
    })
  } catch {
    return null
  }
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return apiRequest<Booking>('/bookings', {
    method: 'POST',
    body: payload,
  })
}
