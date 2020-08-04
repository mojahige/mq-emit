export type Handler = (
  mediaQueryList: MediaQueryList | MediaQueryListEvent
) => void

export type MediaQueryString = string

type Handlers = Handler[]

type RegisterData = {
  mediaQueryList: MediaQueryList
  handlers: Handlers
}

type RegisterPayload = {
  mediaQueryString: MediaQueryString
  handler: Handler
}

type ManageMap = Map<string, RegisterData>

const map: ManageMap = new Map()

function hasData(mediaQueryString: MediaQueryString): boolean {
  return map.has(mediaQueryString)
}

function getData(mediaQueryString: MediaQueryString): RegisterData | undefined {
  return map.get(mediaQueryString)
}

function setData(
  mediaQueryString: MediaQueryString,
  registerData: RegisterData
): void {
  map.set(mediaQueryString, registerData)
}

function deleteData(mediaQueryString: MediaQueryString): void {
  map.delete(mediaQueryString)
}

function addHandler(handlers: Handlers, addHandler: Handler): void {
  handlers.push(addHandler)
}

function removeHandler(handlers: Handlers, removeHandler: Handler): void {
  handlers.splice(handlers.indexOf(removeHandler), 1)
}

function registerNewData(mediaQueryString: MediaQueryString): void {
  const mediaQueryList = window.matchMedia(mediaQueryString)
  const data: RegisterData = {
    mediaQueryList,
    handlers: [],
  }

  mediaQueryList.addEventListener('change', changeHandler)

  setData(mediaQueryString, data)
}

function fire(registerData: RegisterData) {
  registerData.handlers.forEach((handler) =>
    handler(registerData.mediaQueryList)
  )
}

function changeHandler(event: MediaQueryListEvent): void {
  Array.from(map.values())
    .filter((registerData) => registerData.mediaQueryList.media === event.media)
    .forEach((data) => fire(data))
}

function addListner(mediaQueryList: MediaQueryList) {
  mediaQueryList.addEventListener('change', changeHandler)
}

function removeListner(mediaQueryList: MediaQueryList) {
  mediaQueryList.removeEventListener('change', changeHandler)
}

const manager = {
  register({
    mediaQueryString,
    handler,
  }: RegisterPayload): MediaQueryList | undefined {
    if (!hasData(mediaQueryString)) {
      registerNewData(mediaQueryString)
    }

    const registerData = getData(mediaQueryString)

    if (!registerData) {
      return undefined
    }

    addHandler(registerData.handlers, handler)
    addListner(registerData.mediaQueryList)

    return registerData.mediaQueryList
  },

  unregister({ mediaQueryString, handler }: RegisterPayload): void {
    const registerData = getData(mediaQueryString)

    if (!registerData) {
      return
    }

    removeHandler(registerData.handlers, handler)
    removeListner(registerData.mediaQueryList)

    if (!registerData.handlers.length) {
      deleteData(mediaQueryString)
    }
  },
}

export default manager
