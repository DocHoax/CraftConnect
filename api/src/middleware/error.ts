import type { NextFunction, Request, Response } from 'express'

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode =
    typeof error === 'object'
    && error !== null
    && 'statusCode' in error
    && typeof (error as { statusCode?: number }).statusCode === 'number'
      ? (error as { statusCode: number }).statusCode
      : 500

  const message =
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && typeof (error as { message?: string }).message === 'string'
      ? (error as { message: string }).message
      : 'Internal server error'

  res.status(statusCode).json({
    message,
  })
}
