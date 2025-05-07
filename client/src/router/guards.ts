import { nprogress } from '@/libs/nprogress'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores'
const whiteList = ['/login']
export const useGuards = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const isLogin = !!useUserStore().Authorization
    const isWhite = whiteList.some((item) => to.path.includes(item))
    if (!(isLogin || isWhite)) {
      try {
        await useUserStore().getAuthorization()
        await useUserStore().fetchUserInfo()
      } catch (error) {
        console.log(error)
      }
    }
    nprogress.start()
    next()
  })
  router.afterEach((to) => {
    nprogress.done()
    document.title = (to.meta.title as string) || import.meta.env.APP_NAME
  })
  router.onError((error) => {
    nprogress.done()
    console.error(error)
  })
}
