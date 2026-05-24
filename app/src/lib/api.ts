const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | object | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { headers, body, ...rest } = options

  const requestHeaders = new Headers(headers)
  let requestBody: BodyInit | undefined

  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof Blob)) {
    requestHeaders.set('Content-Type', 'application/json')
    requestBody = JSON.stringify(body)
  } else if (body != null) {
    requestBody = body
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: requestHeaders,
    body: requestBody,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : 'Request failed'

    throw new ApiError(message, response.status)
  }

  return payload as T
}
