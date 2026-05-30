import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import UserView from '@/views/UserView.vue'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import DashboardLayout from '@/views/DashboardLayout.vue'
import DashboardHome from '@/views/DashboardHome.vue'
import DashboardBilling from '@/views/DashboardBilling.vue'
import { useAuth } from '@/composables/useAuth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },

  // Redirección estática (compatibilidad)
  { path: '/inicio', redirect: { name: 'home' } },

  // Ruta básica
  { path: '/about', name: 'about', component: AboutView },

  // Ruta dinámica con props y ejemplo de alias
  {
    path: '/user/:id',
    name: 'user',
    component: UserView,
    props: true,
    alias: ['/usuario/:id'], // alias opcional
  },

  // Rutas anidadas (layout + children)
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard-home', component: DashboardHome },
      { path: 'billing', name: 'dashboard-billing', component: DashboardBilling },
    ],
  },

  // Login
  { path: '/login', name: 'login', component: LoginView },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard global: exige auth en rutas con meta.requiresAuth
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach((to, _from) => {
  const { isAuthenticated } = useAuth()
  if (to.matched.some((r) => r.meta?.requiresAuth) && !isAuthenticated.value) {
    // redirección programática con objeto nombrado
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // continúa
  return true
})

export default router
