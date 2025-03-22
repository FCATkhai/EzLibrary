import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import LoginView from '@/views/LoginView.vue'
import SachDetailView from '@/views/SachDetailView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            layout: AppLayout
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {
            layout: BlankLayout
        }
    },
    {
        path: '/sach/:maSach',
        name: 'sachDetail',
        component: SachDetailView,
        meta: {
            layout: AppLayout
        }
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
