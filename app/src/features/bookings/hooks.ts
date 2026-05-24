import { useEffect, useState } from 'react'
import { getBookingById, listAllBookings, listArtisanBookings, listCustomerBookings } from './bookings-api'
import type { Booking } from '@/types/booking'

interface AsyncState<T> {
  data: T
  isLoading: boolean
  error: string
}

export function useCustomerBookings(customerId: string | undefined) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [state, setState] = useState<AsyncState<Booking[]>>({
    data: [],
    isLoading: true,
    error: '',
  })

  const refresh = () => {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    if (!customerId) {
      setState({ data: [], isLoading: false, error: '' })
      return
    }

    let isMounted = true
    setState((currentState) => ({ ...currentState, isLoading: true, error: '' }))

    const loadBookings = async () => {
      try {
        const data = await listCustomerBookings(customerId)
        if (isMounted) {
          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load bookings',
          })
        }
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [customerId, refreshKey])

  return {
    ...state,
    refresh,
  }
}

export function useBookingDetails(bookingId: string | undefined) {
  const [state, setState] = useState<AsyncState<Booking | null>>({
    data: null,
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    if (!bookingId) {
      setState({ data: null, isLoading: false, error: 'Invalid booking ID' })
      return
    }

    let isMounted = true
    setState((currentState) => ({ ...currentState, isLoading: true, error: '' }))

    const loadBooking = async () => {
      try {
        const data = await getBookingById(bookingId)
        if (isMounted) {
          if (!data) {
            setState({ data: null, isLoading: false, error: 'Booking not found' })
            return
          }

          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load booking',
          })
        }
      }
    }

    void loadBooking()

    return () => {
      isMounted = false
    }
  }, [bookingId])

  return state
}

export function useArtisanBookings(artisanId: string | undefined) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [state, setState] = useState<AsyncState<Booking[]>>({
    data: [],
    isLoading: true,
    error: '',
  })

  const refresh = () => {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    if (!artisanId) {
      setState({ data: [], isLoading: false, error: '' })
      return
    }

    let isMounted = true
    setState((currentState) => ({ ...currentState, isLoading: true, error: '' }))

    const loadBookings = async () => {
      try {
        const data = await listArtisanBookings(artisanId)
        if (isMounted) {
          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load artisan bookings',
          })
        }
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [artisanId, refreshKey])

  return {
    ...state,
    refresh,
  }
}

export function useAllBookings() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [state, setState] = useState<AsyncState<Booking[]>>({
    data: [],
    isLoading: true,
    error: '',
  })

  const refresh = () => {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  useEffect(() => {
    let isMounted = true
    setState((currentState) => ({ ...currentState, isLoading: true, error: '' }))

    const loadBookings = async () => {
      try {
        const data = await listAllBookings()
        if (isMounted) {
          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load bookings',
          })
        }
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  return {
    ...state,
    refresh,
  }
}
