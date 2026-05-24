import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { asyncHandler } from '../lib/async-handler'

const router = Router()

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return res.json(categories)
}))

export default router
