// Thin wrapper around localStorage so the rest of the app never has to
// worry about storage being unavailable (private browsing, quota, etc).

export function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (err) {
    console.warn(`Could not read "${key}" from storage`, err)
    return fallback
  }
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Could not save "${key}" to storage`, err)
  }
}
