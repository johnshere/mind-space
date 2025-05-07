import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { createPinia } from 'pinia'

console.log(import.meta.env)

const app = createApp(App)
app.use(createPinia())
setupRouter(app)

app.mount('#app')
