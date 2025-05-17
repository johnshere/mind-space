import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { createPinia } from 'pinia'
import '@/assets/style/global.scss'

console.log(import.meta.env)

const app = createApp(App)
app.use(createPinia())
setupRouter(app)

app.mount('#app')
