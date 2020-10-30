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

    expect(router('/')?.module).toBe('home')
    expect(router('/about')?.module).toBe('about')
  })

  it('params', () => {
    const router = createRouter([
      {
        path: '/',
        module: 'home'
      },
      {
        path: '/about/:id',
        module: 'about'
      }
    ])

    expect(router('/')?.params).toStrictEqual({})
    expect(router('/about/123')?.params).toStrictEqual({ id: '123' })
  })
})
