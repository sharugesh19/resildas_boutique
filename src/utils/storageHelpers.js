/**
 * STORAGE HELPERS
 * Safe wrappers around localStorage.
 * All cart persistence goes through CartContext — these are
 * for any other small pieces of state that need to survive reload
 * (e.g. last viewed category, dismissed banners, etc.)
 */

/**
 * Safely read a JSON value from localStorage.
 * Returns `defaultValue` if the key is missing or the value is corrupt.
 */
export function getStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? defaultValue : JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * Safely write a JSON value to localStorage.
 * Returns true on success, false on failure (e.g. storage full).
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // silent
  }
}