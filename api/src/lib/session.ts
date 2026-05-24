import type { Request, Response } from 'express'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'cc_session'

export function setSessionCookie(res: Response, userId: string): void {
  res.cookie(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME)
}

export function getSessionUserId(req: Request): string | null {
  const value = req.cookies?.[SESSION_COOKIE_NAME]
  return typeof value === 'string' && value.length > 0 ? value : null
}
