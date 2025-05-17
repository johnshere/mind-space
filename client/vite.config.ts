import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VitePWA } from 'vite-plugin-pwa'
import environment from 'vite-plugin-environment'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import packageJson from './package.json' assert { type: 'json' }
import { titleCase } from './src/libs/case'

export default defineConfig(() => {
  const base = `/${packageJson.name}`
  return {
    base,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~/': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true
        }
      }),
      vueJsx(),
      VueDevTools(),
      environment(
        {
          APP_TITLE: titleCase(packageJson.name),
          APP_NAME: packageJson.name,
          APP_VERSION: packageJson.version
        },
        { defineOn: 'import.meta.env' }
      ),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: titleCase(packageJson.name),
          short_name: titleCase(packageJson.name),
          description: titleCase(packageJson.description),
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  }
})
