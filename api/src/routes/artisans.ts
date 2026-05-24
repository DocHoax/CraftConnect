import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((entry: unknown) => String(entry))
}

function inPriceTier(priceMin: number, tier?: string): boolean {
  if (!tier) return true
  if (tier === 'low') return priceMin <= 45
  if (tier === 'medium') return priceMin > 45 && priceMin <= 60
  return priceMin > 60
}

router.get('/', asyncHandler(async (req, res) => {
  const query = typeof req.query.query === 'string' ? req.query.query.trim().toLowerCase() : ''
  const categoryId = typeof req.query.category === 'string' ? req.query.category : ''
  const location = typeof req.query.location === 'string' ? req.query.location.trim().toLowerCase() : ''
  const minRating = typeof req.query.minRating === 'string' ? Number(req.query.minRating) : undefined
  const priceTier = typeof req.query.priceTier === 'string' ? req.query.priceTier : undefined

  const artisans = await prisma.artisanProfile.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(minRating ? { rating: { gte: minRating } } : {}),
      ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
    },
    include: {
      user: true,
      category: true,
    },
    orderBy: { rating: 'desc' },
  })

  const filtered = artisans
    .filter((artisan) => {
      if (!query) return true

      const services = toStringArray(artisan.services).map((service: string) => service.toLowerCase())
      return (
        artisan.user.name.toLowerCase().includes(query)
        || artisan.category.name.toLowerCase().includes(query)
        || services.some((service: string) => service.includes(query))
      )
    })
    .filter((artisan) => inPriceTier(artisan.priceMin, priceTier))

  return res.json(filtered.map((artisan) => ({
    id: artisan.id,
    name: artisan.user.name,
    category: artisan.category.name,
    rating: artisan.rating,
    reviews: artisan.reviewsCount,
    location: artisan.location,
    priceRange: `$${artisan.priceMin}-${artisan.priceMax}/hr`,
    experience: artisan.experience,
    image: artisan.image,
    description: artisan.description,
    services: toStringArray(artisan.services),
    availability: toStringArray(artisan.availability),
    verified: artisan.verified,
  })))
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const artisanId = String(req.params.id)
  const artisan = await prisma.artisanProfile.findUnique({
    where: { id: artisanId },
    include: {
      user: true,
      category: true,
    },
  }) as Prisma.ArtisanProfileGetPayload<{
    include: {
      user: true
      category: true
    }
  }> | null

  if (!artisan) {
    return res.status(404).json({ message: 'Artisan not found' })
  }

  return res.json({
    id: artisan.id,
    name: artisan.user.name,
    category: artisan.category.name,
    rating: artisan.rating,
    reviews: artisan.reviewsCount,
    location: artisan.location,
    priceRange: `$${artisan.priceMin}-${artisan.priceMax}/hr`,
    experience: artisan.experience,
    image: artisan.image,
    description: artisan.description,
    services: toStringArray(artisan.services),
    availability: toStringArray(artisan.availability),
    verified: artisan.verified,
  })
}))

router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const artisanId = String(req.params.id)
  const reviews = await prisma.review.findMany({
    where: { artisanId },
    include: {
      customer: true,
    },
    orderBy: { date: 'desc' },
  }) as Prisma.ReviewGetPayload<{
    include: {
      customer: true
    }
  }>[]

  return res.json(reviews.map((review) => ({
    id: review.id,
    artisanId: review.artisanId,
    customerName: review.customer.name,
    rating: review.rating,
    comment: review.comment,
    date: review.date.toISOString().slice(0, 10),
  })))
}))

export default router
