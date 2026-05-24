export interface Artisan {
  id: string
  name: string
  category: string
  rating: number
  reviews: number
  location: string
  priceRange: string
  experience: number
  image: string
  description: string
  services: string[]
  availability: string[]
  verified: boolean
}

export interface ArtisanReview {
  id: string
  customerName: string
  artisanId: string
  rating: number
  comment: string
  date: string
}

export interface ArtisanCategory {
  id: string
  name: string
  icon: string
}

export interface SearchArtisansParams {
  query?: string
  categoryId?: string
  location?: string
  minRating?: number
  priceTier?: 'low' | 'medium' | 'high'
}
