import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { clearSessionCookie, getSessionUserId, setSessionCookie } from '../lib/session'
import { toClientRole } from '../types/mappers'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  accountType: z.enum(['customer', 'artisan']),
  category: z.string().optional(),
  experience: z.string().optional(),
  serviceDescription: z.string().optional(),
})

router.get('/me', asyncHandler(async (req, res) => {
  const userId = getSessionUserId(req)
  if (!userId) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toClientRole(user.role),
    },
  })
}))

router.post('/login', asyncHandler(async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid login payload' })
  }

  const { email, password } = parseResult.data
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  let isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  // One-time compatibility path for old seeded plaintext passwords.
  if (!isPasswordValid && user.passwordHash === password) {
    const upgradedHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: upgradedHash },
    })
    isPasswordValid = true
  }

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  setSessionCookie(res, user.id)

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toClientRole(user.role),
    },
  })
}))

router.post('/register', asyncHandler(async (req, res) => {
  const parseResult = registerSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({ message: 'Invalid registration payload' })
  }

  const payload = parseResult.data
  const existing = await prisma.user.findUnique({ where: { email: payload.email } })

  if (existing) {
    return res.status(409).json({ message: 'Email already in use' })
  }

  const role = payload.accountType === 'artisan' ? 'ARTISAN' : 'CUSTOMER'
  const passwordHash = await bcrypt.hash(payload.password, 10)

  const user = await prisma.user.create({
    data: {
      name: payload.fullName,
      email: payload.email,
      passwordHash,
      role,
    },
  })

  if (role === 'ARTISAN') {
    const category = payload.category
      ? await prisma.category.findUnique({ where: { id: payload.category } })
      : await prisma.category.findFirst()

    if (category) {
      await prisma.artisanProfile.create({
        data: {
          userId: user.id,
          categoryId: category.id,
          location: 'Downtown',
          priceMin: 45,
          priceMax: 80,
          experience: payload.experience ? Number(payload.experience) || 0 : 0,
          image: '/images/artisan-1.jpg',
          description: payload.serviceDescription || 'New artisan profile',
          verified: false,
          services: ['General Service'],
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        },
      })
    }
  }

  setSessionCookie(res, user.id)

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: toClientRole(user.role),
    },
  })
}))

router.post('/logout', (_req, res) => {
  clearSessionCookie(res)
  return res.status(204).send()
})

export default router
