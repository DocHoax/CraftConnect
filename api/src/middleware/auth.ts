import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { getSessionUserId } from '../lib/session'

type Role = 'CUSTOMER' | 'ARTISAN' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  role: Role
  name: string
}

export interface AuthenticatedRequest extends Request {
  authUser: AuthUser
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionUserId = getSessionUserId(req)

    if (!sessionUserId) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    })

    if (!user) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    ;(req as AuthenticatedRequest).authUser = {
      id: user.id,
      email: user.email,
      role: user.role as Role,
      name: user.name,
    }

    next()
  } catch (error) {
    next(error)
  }
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest

    if (!authReq.authUser) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    if (!allowedRoles.includes(authReq.authUser.role)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }

    next()
  }
}
