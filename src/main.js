import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(head);
app.use(pinia)
app.use(router)
app.mount('#app')