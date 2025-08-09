const KEY = 'ftc_v1'

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
