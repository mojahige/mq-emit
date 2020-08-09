import './matchMedia.mock'
import manager from '../src/manager'

describe('manager', (): void => {
  describe('manager.register', (): void => {
    test('The same mediaQueryList is returned', (): void => {
      const mediaQueryString = '(min-width: 768px)'
      const handler = () => void 0

      expect(
        JSON.stringify(manager.register({ mediaQueryString, handler }))
      ).toEqual(JSON.stringify(window.matchMedia(mediaQueryString)))
    })
  })
})
