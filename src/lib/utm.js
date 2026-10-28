const KEY = 'bma_utm'
const FIELDS = ['source', 'medium', 'campaign', 'term', 'content']

/** Remembers the first campaign the visitor arrived with for the rest of the session. Call once at start-up. */
export function captureUtm() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const params = new URLSearchParams(window.location.search)
    const utm = {}
    for (const field of FIELDS) {
      const value = params.get(`utm_${field}`)?.trim()
      if (value) utm[field] = value.slice(0, 100)
    }
    if (Object.keys(utm).length) sessionStorage.setItem(KEY, JSON.stringify(utm))
  } catch {
    // storage can be blocked; tracking is optional
  }
}

/** The stored campaign, or undefined. Only known string fields are returned, so a tampered value can't break a request. */
export function readUtm() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(KEY))
    if (!stored || typeof stored !== 'object') return undefined
    const utm = {}
    for (const field of FIELDS) {
      if (typeof stored[field] === 'string' && stored[field]) utm[field] = stored[field].slice(0, 100)
    }
    return Object.keys(utm).length ? utm : undefined
  } catch {
    return undefined
  }
}
