import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from './config'
import { useUserStore } from '@/store/user'
import router from '@/router'

/** 与 spring-cloud-template / oj-backend 对齐的业务未登录码 */
const NOT_LOGIN_CODE = 40100

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

let handlingUnauthorized = false

function handleUnauthorized(options?: { silent?: boolean }) {
  const userStore = useUserStore()
  const hadSession = Boolean(userStore.token)
  userStore.clearLogin()

  if (!options?.silent && hadSession && !handlingUnauthorized) {
    handlingUnauthorized = true
    ElMessage.warning('登录已过期，请重新登录')
    setTimeout(() => {
      handlingUnauthorized = false
    }, 2000)
  }

  const route = router.currentRoute.value
  if (route.meta.needLogin === true && route.path !== '/user/login') {
    router.push({
      path: '/user/login',
      query: { redirect: route.fullPath },
      replace: true,
    })
  }
}

instance.interceptors.request.use((config) => {
  const token = useUserStore().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => {
    const data = response.data as { code?: number } | undefined
    if (data && data.code === NOT_LOGIN_CODE) {
      handleUnauthorized()
      return Promise.reject(data)
    }
    // 解包业务体，调用方直接拿到 { code, data, message }
    return data as typeof response.data
  },
  (error) => {
    const status = error.response?.status as number | undefined
    const data = error.response?.data as { code?: number } | undefined
    if (status === 401 || data?.code === NOT_LOGIN_CODE) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  },
)

export default instance
