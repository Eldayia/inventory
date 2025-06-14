import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import des composants de pages
import Home from './views/Home.vue'
import PageView from './views/PageView.vue'

// Configuration du routeur
const routes = [
  { path: '/', component: Home },
  { path: '/page/:id', component: PageView, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')