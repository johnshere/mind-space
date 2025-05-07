import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>({
    userId: '',
    userName: ''
  })
  const Authorization = ref('')
  const getAuthorization = async () => {
    // const res = await getToken()
    // if (!res?.success) return
    // let token = res.data as string | null
    // if (!token && import.meta.env.DEV) {
    //   token = decodeURIComponent(location.href.split('&Auth=').pop() || '')
    // }
    // if (token) {
    //   Authorization.value = token
    // } else {
    //   console.warn('Authorization is empty')
    // }
  }
  const clearAuthorization = () => (Authorization.value = '')
  const fetchUserInfo = async () => {
    // const res = await getUserInfo()
    // if (!res?.success) return
    // userInfo.value = res.data
  }
  return {
    Authorization,
    getAuthorization,
    clearAuthorization,
    userInfo,
    fetchUserInfo
  }
})
