const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
const TIMEOUT_MS = 20000

if (!API_URL) console.error('VITE_API_URL is not set; API requests will fail.')

const GENERIC_MESSAGE = 'Something went wrong. Please try again.'
const NETWORK_MESSAGE = 'We could not reach our servers. Check your connection and try again.'

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors // { email: 'Enter a valid email address', ... }
  }
}

/** Status codes whose `message` is written for visitors; anything else gets a generic message. */
const shownStatus = (status) => status >= 400 && status < 500

async function request(path, { method = 'GET', body, signal } = {}) {
  if (!API_URL) throw new ApiError(GENERIC_MESSAGE)

  // Abort on the caller's signal or after TIMEOUT_MS, whichever comes first, and tell them apart.
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, TIMEOUT_MS)
  const forwardAbort = () => controller.abort()
  if (signal?.aborted) controller.abort()
  else signal?.addEventListener('abort', forwardAbort, { once: true })

  try {
    let response
    try {
      response = await fetch(`${API_URL}${path}`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })
    } catch (error) {
      if (error.name === 'AbortError' && !timedOut) throw error
      throw new ApiError(timedOut ? 'Our servers are taking too long to answer. Please try again.' : NETWORK_MESSAGE)
    }

    let json = null
    try {
      json = await response.json()
    } catch (error) {
      if (error.name === 'AbortError' && !timedOut) throw error
      // not JSON (for example a gateway error page)
    }

    if (!response.ok || !json || json.success !== true) {
      const fieldErrors = {}
      for (const item of Array.isArray(json?.error) ? json.error : []) {
        if (item?.path && item.message) fieldErrors[item.path] ??= item.message
      }
      const message = shownStatus(response.status) && typeof json?.message === 'string' ? json.message : GENERIC_MESSAGE
      throw new ApiError(message, { status: response.status, fieldErrors })
    }
    return json
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', forwardAbort)
  }
}

export const api = {
  get: (path, options) => request(path, options),
  post: (path, body, options) => request(path, { method: 'POST', body, ...options }),
}
