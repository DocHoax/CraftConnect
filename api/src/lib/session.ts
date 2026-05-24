import type { Request, Response } from 'express'
import type { CookieOptions } from 'express'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'cc_session'

function getCookieOptions(): CookieOptions {
  const sameSite = process.env.SESSION_COOKIE_SAME_SITE || 'lax'

  return {
    httpOnly: true,
    sameSite: sameSite === 'none' ? 'none' : sameSite === 'strict' ? 'strict' : 'lax',
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: '/',
  }
}

export function setSessionCookie(res: Response, userId: string): void {
  res.cookie(SESSION_COOKIE_NAME, userId, getCookieOptions())
}

export function clearSessionCookie(res: Response): void {
  const { maxAge: _maxAge, ...clearOptions } = getCookieOptions()
  res.clearCookie(SESSION_COOKIE_NAME, clearOptions)
}

export function getSessionUserId(req: Request): string | null {
  const value = req.cookies?.[SESSION_COOKIE_NAME]
  return typeof value === 'string' && value.length > 0 ? value : null
}
