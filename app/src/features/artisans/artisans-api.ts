import { apiRequest } from '@/lib/api'
import { artisans as mockArtisans, categories as mockCategories } from '@/data/mockData'
import type { Artisan, ArtisanCategory, ArtisanReview, SearchArtisansParams } from '@/types/artisan'

type DataMode = 'demo' | 'api'

const mockReviews: ArtisanReview[] = [
  { id: '1', artisanId: '1', customerName: 'Sarah M.', rating: 5, comment: 'Excellent work! Very professional and punctual.', date: '2026-02-15' },
  { id: '2', artisanId: '1', customerName: 'Michael R.', rating: 5, comment: 'Highly recommend. Great attention to detail.', date: '2026-01-28' },
  { id: '3', artisanId: '1', customerName: 'Emily K.', rating: 4, comment: 'Good service, would hire again.', date: '2026-01-10' },
]

function getDataMode(): DataMode {
  return import.meta.env.VITE_DATA_MODE === 'api' ? 'api' : 'demo'
}

function parseLowPrice(value: string): number {
  const cleaned = value.replace(/\s/g, '')
  const match = cleaned.match(/\$(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function byPriceTier(artisan: Artisan, tier: SearchArtisansParams['priceTier']): boolean {
  if (!tier) {
    return true
  }

  const low = parseLowPrice(artisan.priceRange)

  if (tier === 'low') {
    return low <= 45
  }

  if (tier === 'medium') {
    return low > 45 && low <= 60
  }

  return low > 60
}

function filterArtisans(source: Artisan[], categories: ArtisanCategory[], filters: SearchArtisansParams): Artisan[] {
  const normalizedQuery = filters.query?.trim().toLowerCase() ?? ''
  const normalizedLocation = filters.location?.trim().toLowerCase() ?? ''
  const categoryName = filters.categoryId
    ? categories.find((category) => category.id === filters.categoryId)?.name
    : ''

  return source.filter((artisan) => {
    if (normalizedQuery) {
      const matchesQuery =
        artisan.name.toLowerCase().includes(normalizedQuery) ||
        artisan.category.toLowerCase().includes(normalizedQuery) ||
        artisan.services.some((service) => service.toLowerCase().includes(normalizedQuery))

      if (!matchesQuery) {
        return false
      }
    }

    if (categoryName && artisan.category !== categoryName) {
      return false
    }

    if (normalizedLocation && !artisan.location.toLowerCase().includes(normalizedLocation)) {
      return false
    }

    if (filters.minRating && artisan.rating < filters.minRating) {
      return false
    }

    return byPriceTier(artisan, filters.priceTier)
  })
}

export async function listCategories(): Promise<ArtisanCategory[]> {
  if (getDataMode() === 'demo') {
    return mockCategories as ArtisanCategory[]
  }

  return apiRequest<ArtisanCategory[]>('/categories', { method: 'GET' })
}

export async function listArtisans(filters: SearchArtisansParams): Promise<Artisan[]> {
  if (getDataMode() === 'demo') {
    const categories = await listCategories()
    return filterArtisans(mockArtisans as Artisan[], categories, filters)
  }

  const params = new URLSearchParams()

  if (filters.query) params.set('query', filters.query)
  if (filters.categoryId) params.set('category', filters.categoryId)
  if (filters.location) params.set('location', filters.location)
  if (filters.minRating) params.set('minRating', String(filters.minRating))
  if (filters.priceTier) params.set('priceTier', filters.priceTier)

  const queryString = params.toString()
  return apiRequest<Artisan[]>(`/artisans${queryString ? `?${queryString}` : ''}`, { method: 'GET' })
}

export async function getArtisanById(id: string): Promise<Artisan | null> {
  if (getDataMode() === 'demo') {
    return (mockArtisans as Artisan[]).find((artisan) => artisan.id === id) ?? null
  }

  try {
    return await apiRequest<Artisan>(`/artisans/${id}`, { method: 'GET' })
  } catch {
    return null
  }
}

export async function getArtisanReviews(id: string): Promise<ArtisanReview[]> {
  if (getDataMode() === 'demo') {
    return mockReviews.filter((review) => review.artisanId === id)
  }

  return apiRequest<ArtisanReview[]>(`/artisans/${id}/reviews`, { method: 'GET' })
}
