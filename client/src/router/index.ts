import { type App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useGuards } from './guards'

const routes = [] as RouteRecordRaw[]
const findParent = (
  fn: (r: RouteRecordRaw) => boolean,
  rs?: RouteRecordRaw[]
): RouteRecordRaw | undefined => {
  rs = rs || routes
  for (const r of rs) {
    const p = findParent(fn, r.children)
    if (p) return p
    if (fn(r)) return r
  }
}

const views = import.meta.glob<View>('@/views/**/index.vue', { eager: true })
const getFolders = (path: string) =>
  /\/views(\/.*)\/index\.vue/.exec(path)?.[1]?.split('/').filter(Boolean) ?? []
const getName = (...paths: string[]) => paths.filter(Boolean).join('-')
const components = Object.values(views)
  .map((v) => v.default)
  .sort((a, b) => getFolders(a.__file).length - getFolders(b.__file).length)
for (const component of components) {
  const { title, match, __file } = component
  if (!__file.endsWith('/index.vue')) continue
  if (title === undefined || title === null) {
    throw new Error(`the title of view page(${__file}) can not be empty`)
  }
  const folders = getFolders(__file)
  const name = getName(...folders)
  const path = folders.concat().pop() ?? ''
  const route = {
    path: path + (match || ''),
    name,
    component: component,
    meta: { title },
    children: [] as RouteRecordRaw[]
  }
  if (!folders.length) {
    routes.push({ ...route, path: '/' })
  } else {
    const parent = findParent((r) => name === getName(r.name as any, path))
    parent?.children?.push(route)
  }
}

export const setupRouter = async (app: App) => {
  const base = import.meta.env.BASE_URL
  const router = createRouter({
    history: createWebHistory(base),
    routes
  })

  useGuards(router)
  app.use(router)
}
