export type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl"

export function getScreenSize(): ScreenSize {
  if (typeof window === "undefined") return "md" // Default for server-side rendering

  const width = window.innerWidth

  if (width < 640) return "sm"
  if (width < 768) return "md"
  if (width < 1024) return "lg"
  if (width < 1280) return "xl"
  return "2xl"
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false

  const userAgent = navigator.userAgent || navigator.vendor

  // Check common mobile patterns
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

  return mobileRegex.test(userAgent)
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false

  const userAgent = navigator.userAgent
  return /iPhone|iPad|iPod/i.test(userAgent) && !window.MSStream
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false

  const userAgent = navigator.userAgent
  return /Android/i.test(userAgent)
}

// Get safe area insets for notched devices
export function getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 }

  if (typeof window === "undefined" || !window.CSS || !CSS.supports("padding-bottom: env(safe-area-inset-bottom)")) {
    return defaultInsets
  }

  const div = document.createElement("div")
  div.style.paddingTop = "env(safe-area-inset-top)"
  div.style.paddingRight = "env(safe-area-inset-right)"
  div.style.paddingBottom = "env(safe-area-inset-bottom)"
  div.style.paddingLeft = "env(safe-area-inset-left)"
  document.body.appendChild(div)

  const computedStyle = window.getComputedStyle(div)
  const insets = {
    top: Number.parseInt(computedStyle.paddingTop || "0", 10),
    right: Number.parseInt(computedStyle.paddingRight || "0", 10),
    bottom: Number.parseInt(computedStyle.paddingBottom || "0", 10),
    left: Number.parseInt(computedStyle.paddingLeft || "0", 10),
  }

  document.body.removeChild(div)
  return insets
}
