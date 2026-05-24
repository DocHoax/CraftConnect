import { apiRequest } from '@/lib/api'
import type { Booking, CreateBookingPayload } from '@/types/booking'

type DataMode = 'demo' | 'api'

const BOOKINGS_STORAGE_KEY = 'abs_bookings'

function getDataMode(): DataMode {
  return import.meta.env.VITE_DATA_MODE === 'api' ? 'api' : 'demo'
}

function getStoredBookings(): Booking[] {
  const rawBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY)
  if (!rawBookings) {
    return []
  }

  try {
    return JSON.parse(rawBookings) as Booking[]
  } catch {
    localStorage.removeItem(BOOKINGS_STORAGE_KEY)
    return []
  }
}

function setStoredBookings(bookings: Booking[]): void {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
}

function updateStoredBooking(bookingId: string, updater: (booking: Booking) => Booking): Booking | null {
  const bookings = getStoredBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.id === bookingId)

  if (bookingIndex === -1) {
    return null
  }

  const updatedBooking = updater(bookings[bookingIndex])
  bookings[bookingIndex] = updatedBooking
  setStoredBookings(bookings)

  return updatedBooking
}

function generateBookingId(): string {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `BK${randomPart}`
}

function estimatePriceByService(service: string): number {
  const normalized = service.toLowerCase()

  if (normalized.includes('repair') || normalized.includes('fix')) {
    return 85
  }

  if (normalized.includes('install') || normalized.includes('upgrade')) {
    return 120
  }

  return 95
}

export async function listCustomerBookings(customerId: string): Promise<Booking[]> {
  if (getDataMode() === 'demo') {
    return getStoredBookings().filter((booking) => booking.customerId === customerId)
  }

  const params = new URLSearchParams({ customerId })
  return apiRequest<Booking[]>(`/bookings?${params.toString()}`, {
    method: 'GET',
  })
}

export async function listArtisanBookings(artisanId: string): Promise<Booking[]> {
  if (getDataMode() === 'demo') {
    return getStoredBookings().filter((booking) => booking.artisanId === artisanId)
  }

  const params = new URLSearchParams({ artisanId })
  return apiRequest<Booking[]>(`/bookings?${params.toString()}`, {
    method: 'GET',
  })
}

export async function listAllBookings(): Promise<Booking[]> {
  if (getDataMode() === 'demo') {
    return getStoredBookings()
  }

  return apiRequest<Booking[]>('/bookings', {
    method: 'GET',
  })
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  if (getDataMode() === 'demo') {
    return getStoredBookings().find((booking) => booking.id === bookingId) ?? null
  }

  try {
    return await apiRequest<Booking>(`/bookings/${bookingId}`, {
      method: 'GET',
    })
  } catch {
    return null
  }
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<Booking | null> {
  if (getDataMode() === 'demo') {
    return updateStoredBooking(bookingId, (booking) => ({ ...booking, status }))
  }

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
  if (getDataMode() === 'demo') {
    const booking: Booking = {
      id: generateBookingId(),
      customerId: payload.customerId,
      artisanId: payload.artisanId,
      artisanName: payload.artisanName,
      service: payload.service,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      notes: payload.notes,
      status: 'pending',
      price: estimatePriceByService(payload.service),
    }

    const bookings = getStoredBookings()
    setStoredBookings([booking, ...bookings])

    return booking
  }

  return apiRequest<Booking>('/bookings', {
    method: 'POST',
    body: payload,
  })
}
