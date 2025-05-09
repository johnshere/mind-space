import { type App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordSingleViewWithChildren } from 'vue-router'
import { useGuards } from './guards'

const routes = [] as RouteRecordSingleViewWithChildren[]

const error = (message: string) => {
  throw new Error(message)
}

const views = import.meta.glob<View>('@/views/**/index.vue', { eager: true })
const pathReg = /\/src\/views(\/.*)\/index\.vue/
const getFolders = (path: string) => {
  return pathReg.exec(path)?.[1].split('/').filter(Boolean) ?? []
}
const getName = (path: string) => {
  return getFolders(path).join('-')
}
const components = Object.values(views).map((v) => v.default)
const isPageReg = /\/index\.vue$/
for (const component of components) {
  const { title, match, __file: filePath } = component
  if (!isPageReg.test(filePath)) continue
  if (title === undefined || title === null) {
    error(`the title of view page(${filePath}) can not be empty`)
    break
  }
  const name = getName(filePath)
  const folders = getFolders(filePath)
  const route = {
    path: folders.concat().pop() + (match || ''),
    name,
    component: component,
    meta: { title },
    children: [] as RouteRecordSingleViewWithChildren[]
  }
  if (folders.length > 1) {
    const parent = routes.find((r) => name.startsWith(r.name as string))
    parent?.children.push(route)
  } else {
    route.path = `/${route.path}`
    routes.push(route)
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
