/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly MODE: string
  readonly APP_VERSION: string
  readonly APP_NAME: string
  readonly API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: (
    path: string,
    config: object
  ) => Record<string, () => Promise<{ default: any }>>
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

// interface Window {
//     [key: string]: any
// }
