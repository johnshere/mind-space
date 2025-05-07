// /src/utils/nprogress.ts
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'linear',
  speed: 100,
  showSpinner: false,
  trickleSpeed: 300,
  minimum: 0.1,
  parent: 'body'
})

export const nprogress = NProgress
