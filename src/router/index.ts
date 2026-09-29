import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/Home.vue'),
    },
    {
      path: '/user/login',
      name: 'login',
      component: () => import('@/views/user/Login.vue'),
      meta: { needLogin: false },
    },
    {
      path: '/demo/items',
      name: 'demoItems',
      component: () => import('@/views/demo/ItemDemo.vue'),
    },
    {
      path: '/demo/order',
      name: 'demoOrder',
      component: () => import('@/views/demo/OrderDemo.vue'),
      meta: { needLogin: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.needLogin !== true) {
    return true
  }
  const userStore = useUserStore()
  if (userStore.isLogin()) {
    return true
  }
  return {
    path: '/user/login',
    query: { redirect: to.fullPath },
  }
})

export default router
