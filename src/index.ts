import manager from './manager'
import type { Handler, MediaQueryString } from './manager'

export const on = (
  mediaQueryString: MediaQueryString,
  handler: Handler
): MediaQueryList | undefined => {
  return manager.register({ mediaQueryString, handler })
}

export const off = (
  mediaQueryString: MediaQueryString,
  handler: Handler
): void => {
  return manager.unregister({ mediaQueryString, handler })
}
