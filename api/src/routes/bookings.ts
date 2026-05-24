import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { fromClientStatus, toClientStatus } from '../types/mappers'
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

const createBookingSchema = z.object({
  customerId: z.string().min(1),
  artisanId: z.string().min(1),
  service: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
  notes: z.string().optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
})

router.use(requireAuth)

router.get('/', asyncHandler(async (req, res) => {
  const authReq = req as unknown as AuthenticatedRequest
  const customerId = typeof req.query.customerId === 'string' ? req.query.customerId : undefined
  const artisanId = typeof req.query.artisanId === 'string' ? req.query.artisanId : undefined

  const where = {
    ...(customerId ? { customerId } : {}),
    ...(artisanId ? { artisanId } : {}),
  }

  if (authReq.authUser.role === 'CUSTOMER') {
    Object.assign(where, { customerId: authReq.authUser.id })
  }

  if (authReq.authUser.role === 'ARTISAN') {
    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: authReq.authUser.id },
      select: { id: true },
    })

    if (!profile) {
      return res.json([])
    }

    Object.assign(where, { artisanId: profile.id })
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      artisan: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(bookings.map((booking: (typeof bookings)[number]) => ({
    id: booking.id,
    customerId: booking.customerId,
    artisanId: booking.artisanId,
    artisanName: booking.artisan.user.name,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    location: booking.location,
    notes: booking.notes ?? undefined,
    status: toClientStatus(booking.status),
    price: booking.price,
  })))
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const authReq = req as unknown as AuthenticatedRequest
  const bookingId = String(req.params.id)
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      artisan: {
        include: {
          user: true,
        },
      },
    },
  }) as Prisma.BookingGetPayload<{
    include: {
      artisan: {
        include: {
          user: true
        }
      }
    }
  }> | null

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  if (authReq.authUser.role === 'CUSTOMER' && booking.customerId !== authReq.authUser.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  if (authReq.authUser.role === 'ARTISAN') {
    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: authReq.authUser.id },
      select: { id: true },
    })

    if (!profile || booking.artisanId !== profile.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
  }

  return res.json({
    id: booking.id,
    customerId: booking.customerId,
    artisanId: booking.artisanId,
    artisanName: booking.artisan.user.name,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    location: booking.location,
    notes: booking.notes ?? undefined,
    status: toClientStatus(booking.status),
    price: booking.price,
  })
}))

router.post('/', asyncHandler(async (req, res) => {
  const authReq = req as AuthenticatedRequest

  if (authReq.authUser.role !== 'CUSTOMER' && authReq.authUser.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const parseResult = createBookingSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid booking payload' })
  }

  const payload = parseResult.data

  if (authReq.authUser.role === 'CUSTOMER' && payload.customerId !== authReq.authUser.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const artisan = await prisma.artisanProfile.findUnique({
    where: { id: payload.artisanId },
    include: { user: true },
  })

  if (!artisan) {
    return res.status(404).json({ message: 'Artisan not found' })
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: payload.customerId,
      artisanId: payload.artisanId,
      service: payload.service,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      notes: payload.notes,
      price: artisan.priceMin,
    },
    include: {
      artisan: {
        include: {
          user: true,
        },
      },
    },
  })

  return res.status(201).json({
    id: booking.id,
    customerId: booking.customerId,
    artisanId: booking.artisanId,
    artisanName: booking.artisan.user.name,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    location: booking.location,
    notes: booking.notes ?? undefined,
    status: toClientStatus(booking.status),
    price: booking.price,
  })
}))

router.patch('/:id/status', asyncHandler(async (req, res) => {
  const authReq = req as unknown as AuthenticatedRequest
  const bookingId = String(req.params.id)
  const parseResult = updateStatusSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid status payload' })
  }

  const status = fromClientStatus(parseResult.data.status)
  if (!status) {
    return res.status(400).json({ message: 'Invalid status payload' })
  }

  const existing = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      artisanId: true,
      status: true,
    },
  })

  if (!existing) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  if (authReq.authUser.role === 'CUSTOMER') {
    if (existing.customerId !== authReq.authUser.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const allowed = status === 'CANCELLED' && (existing.status === 'PENDING' || existing.status === 'CONFIRMED')
    if (!allowed) {
      return res.status(400).json({ message: 'Invalid status transition for customer' })
    }
  }

  if (authReq.authUser.role === 'ARTISAN') {
    const profile = await prisma.artisanProfile.findUnique({
      where: { userId: authReq.authUser.id },
      select: { id: true },
    })

    if (!profile || existing.artisanId !== profile.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const artisanAllowed =
      (status === 'CONFIRMED' && existing.status === 'PENDING')
      || (status === 'CANCELLED' && (existing.status === 'PENDING' || existing.status === 'CONFIRMED'))
      || (status === 'COMPLETED' && existing.status === 'CONFIRMED')

    if (!artisanAllowed) {
      return res.status(400).json({ message: 'Invalid status transition for artisan' })
    }
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      artisan: {
        include: {
          user: true,
        },
      },
    },
  }).catch(() => null) as Prisma.BookingGetPayload<{
    include: {
      artisan: {
        include: {
          user: true
        }
      }
    }
  }> | null

  if (!updated) {
    return res.status(404).json({ message: 'Booking not found' })
  }

  return res.json({
    id: updated.id,
    customerId: updated.customerId,
    artisanId: updated.artisanId,
    artisanName: updated.artisan.user.name,
    service: updated.service,
    date: updated.date,
    time: updated.time,
    location: updated.location,
    notes: updated.notes ?? undefined,
    status: toClientStatus(updated.status),
    price: updated.price,
  })
}))

export default router
