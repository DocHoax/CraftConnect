import { useEffect, useState } from 'react'
import { getArtisanById, getArtisanReviews, listArtisans, listCategories } from './artisans-api'
import type { Artisan, ArtisanCategory, ArtisanReview, SearchArtisansParams } from '@/types/artisan'

interface AsyncState<T> {
  data: T
  isLoading: boolean
  error: string
}

export function useArtisanCategories() {
  const [state, setState] = useState<AsyncState<ArtisanCategory[]>>({
    data: [],
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const data = await listCategories()
        if (isMounted) {
          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load categories',
          })
        }
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  return state
}

export function useArtisanSearch(filters: SearchArtisansParams) {
  const [state, setState] = useState<AsyncState<Artisan[]>>({
    data: [],
    isLoading: true,
    error: '',
  })

  useEffect(() => {
    let isMounted = true

    setState((currentState) => ({
      data: currentState.data,
      isLoading: true,
      error: '',
    }))

    const loadArtisans = async () => {
      try {
        const data = await listArtisans(filters)
        if (isMounted) {
          setState({ data, isLoading: false, error: '' })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: [],
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unable to load artisans right now',
          })
        }
      }
    }

    void loadArtisans()

    return () => {
      isMounted = false
    }
  }, [filters])

  return state
}

export function useArtisanProfile(id: string | undefined) {
  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [reviews, setReviews] = useState<ArtisanReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setArtisan(null)
      setReviews([])
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError('')

    const loadProfile = async () => {
      try {
        const [artisanData, reviewData] = await Promise.all([
          getArtisanById(id),
          getArtisanReviews(id),
        ])

        if (!isMounted) {
          return
        }

        setArtisan(artisanData)
        setReviews(reviewData)
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Unable to load artisan profile')
          setArtisan(null)
          setReviews([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [id])

  return {
    artisan,
    reviews,
    isLoading,
    error,
  }
}
