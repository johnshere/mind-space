import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type {
  RouteRecordRaw,
  RouteRecordSingleViewWithChildren
} from 'vue-router'
import { useGuards } from './guards'
import { camelToSnake } from '@/libs/util'

const error = (message: string) => {
  throw new Error(message)
}

const layoutFiles: any = import.meta.glob('@/components/layouts/*/index.vue', {
  eager: true
})
const layouts = [] as RouteRecordSingleViewWithChildren[]
const layoutReg = /\/src\/components\/layouts\/(.*)\/index\.vue/
for (const layoutPath in layoutFiles) {
  const $layout = layoutFiles[layoutPath].default
  if (!$layout) continue
  const name = layoutReg.exec(layoutPath)![1]
  layouts.push({
    path: $layout.path || '',
    name,
    component: $layout,
    children: []
  })
}

const views: any = import.meta.glob('@/views/**/index.vue', { eager: true })
const viewReg = /\/src\/views\/(.*)\/index\.vue/

for (const componentPath in views) {
  const $component = views[componentPath].default
  if ($component) {
    const { title, hidden, pathMatch } = $component
    if (hidden) continue
    if (title === undefined || title === null) {
      error(`the title of view page(${componentPath}) can not be empty`)
      break
    }
    const layoutName = $component.layout?.toLowerCase() || 'main'
    const layout = layouts.find(
      (l) => (l.name as string).toLowerCase() === layoutName
    )!
    const layoutChildren = layout.children

    let paths = viewReg.exec(componentPath)![1].split('/')
    paths = paths.map((p) => camelToSnake(p, '-'))
    if (paths.concat().shift()?.toLowerCase() === layout.path.toLowerCase())
      paths.shift()
    layoutChildren.push({
      path: paths.join('/') + (pathMatch || ''),
      name: layoutName + '-' + paths.join('-'),
      component: $component,
      meta: { title }
    })
  }
}

const Root: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  component: layouts.find((lay) => lay.name === 'Empty')!.component,
  children: layouts
}

export const routes = [Root]

export const setupRouter = async (app: App) => {
  const base = import.meta.env.BASE_URL
  const router = createRouter({ history: createWebHistory(base), routes })

  useGuards(router)
  app.use(router)
}
