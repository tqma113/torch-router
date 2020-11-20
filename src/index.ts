import { pathToRegexp } from 'path-to-regexp'
import type { Key, Path } from 'path-to-regexp'

export type DraftRoute<T> = {
  keys?: Key[]
  regexp?: RegExp
  path: Path
  module: T
}

export interface Route<T> {
  keys: Key[]
  regexp: RegExp
  path: Path
  module: T
}

export interface Params {
  [propName: string]: string
}

export interface Matches<T> {
  path: Path
  params: Params
  module: T
}

export type Router<T> = (path: string) => Matches<T> | null

export function createRouter<T>(routes: DraftRoute<T>[]): Router<T> {
  const finalRoutes: Route<T>[] = routes.map(createRoute)
  const routeLength: number = finalRoutes.length
  const router: Router<T> = (pathname = '') => {
    const finalPathname = cleanPath(pathname)
    for (let i = 0; i < routeLength; i++) {
      const route: Route<T> = finalRoutes[i]
      const strMatches: RegExpExecArray | null = route.regexp.exec(
        finalPathname
      )
      if (!strMatches) {
        continue
      }
      const params: Params = getParams(strMatches, route.keys)

      return {
        path: route.path,
        params,
        module: route.module,
      }
    }
    return null
  }

  return router
}

function createRoute<T>(route: DraftRoute<T>): Route<T> {
  let finalRoute: DraftRoute<T> = Object.assign({}, route)
  finalRoute.keys = []
  let keys: Key[] = finalRoute.keys
  let regexp = pathToRegexp(finalRoute.path, keys)
  let intactRoute: Route<T> = Object.assign({ keys, regexp }, finalRoute)
  return intactRoute
}

function getParams(matches: RegExpExecArray, keys: Key[]): Params {
  let params: Params = {}
  for (let i = 1, len = matches.length; i < len; i++) {
    let key = keys[i - 1]
    if (key) {
      if (typeof matches[i] === 'string') {
        params[key.name] = decodeURIComponent(matches[i])
      } else {
        params[key.name] = matches[i]
      }
    }
  }
  return params
}

function cleanPath(path: string): string {
  return path.replace(/\/\//g, '/')
}
