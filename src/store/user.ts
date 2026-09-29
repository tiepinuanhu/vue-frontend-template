import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = reactive({
      userId: '',
      userName: '',
    })
    const token = ref('')

    function setToken(value: string) {
      token.value = value
    }

    function setUserProfile(data: { userId?: string | number; userName?: string }) {
      if (data.userId != null) {
        user.userId = String(data.userId)
      }
      if (data.userName != null) {
        user.userName = data.userName
      }
    }

    function clearLogin() {
      token.value = ''
      user.userId = ''
      user.userName = ''
    }

    function logout() {
      clearLogin()
    }

    function isLogin() {
      return token.value !== ''
    }

    return {
      user,
      token,
      setToken,
      setUserProfile,
      clearLogin,
      logout,
      isLogin,
    }
  },
  { persist: true },
)
