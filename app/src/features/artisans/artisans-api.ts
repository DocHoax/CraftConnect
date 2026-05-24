import { apiRequest } from '@/lib/api'
import type { Artisan, ArtisanCategory, ArtisanReview, SearchArtisansParams } from '@/types/artisan'

export async function listCategories(): Promise<ArtisanCategory[]> {
  return apiRequest<ArtisanCategory[]>('/categories', { method: 'GET' })
}

export async function listArtisans(filters: SearchArtisansParams): Promise<Artisan[]> {
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
  try {
    return await apiRequest<Artisan>(`/artisans/${id}`, { method: 'GET' })
  } catch {
    return null
  }
}

export async function getArtisanReviews(id: string): Promise<ArtisanReview[]> {
  return apiRequest<ArtisanReview[]>(`/artisans/${id}/reviews`, { method: 'GET' })
}
