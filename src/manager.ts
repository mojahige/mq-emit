export type Handler = (
  mediaQueryList: MediaQueryList | MediaQueryListEvent
) => void

export type MediaQueryString = string

type Handlers = Handler[]

type RegisterData = {
  mediaQueryString: MediaQueryString
  mediaQueryList: MediaQueryList
  handlers: Handlers
}

type RegisterPayload = {
  mediaQueryString: MediaQueryString
  handler: Handler
}

type RegisterResult = MediaQueryList | undefined

type ManageMap = Map<string, RegisterData>

const map: ManageMap = new Map()

function handleChange(event: MediaQueryListEvent): void {
  const handlers = map.get(event.media)?.handlers

  if (handlers != null) {
    handlers.forEach((handler) => handler(event))
  }
}

function registerInitialData(
  mediaQueryString: MediaQueryString,
  mediaQueryList: MediaQueryList
): RegisterData {
  const data = {
    mediaQueryString,
    mediaQueryList,
    handlers: [],
  }

  map.set(mediaQueryList.media, data)

  return data
}

const manager = {
  register({ mediaQueryString, handler }: RegisterPayload): RegisterResult {
    const newMediaQueryList = window.matchMedia(mediaQueryString)
    const { mediaQueryList, handlers } =
      map.get(newMediaQueryList.media) ??
      registerInitialData(mediaQueryString, newMediaQueryList)

    handlers.push(handler)
    mediaQueryList.addEventListener('change', handleChange)

    return mediaQueryList
  },

  unregister({ mediaQueryString, handler }: RegisterPayload): void {
    const registerData = map.get(window.matchMedia(mediaQueryString).media)

    if (!registerData) {
      return
    }

    const { mediaQueryList, handlers } = registerData
    const handlerIndex = handlers.indexOf(handler)

    if (handlerIndex > -1) {
      handlers.splice(handlerIndex)
    }

    mediaQueryList.removeEventListener('change', handleChange)
  },
}

export default manager
