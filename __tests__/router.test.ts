import { createRouter } from '../src'

describe('router', () => {
  it('work', () => {
    const router = createRouter([
      {
        path: '/',
        module: 'home'
      },
      {
        path: '/about',
        module: 'about'
      }
    ])

    expect(router('/')).toBe('home')
    expect(router('/about')).toBe('about')
  })
})
