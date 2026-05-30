import { ref } from 'vue'

const isAuthenticated = ref<boolean>(false)

export function useAuth() {
  function login() {
    isAuthenticated.value = true
  }
  function logout() {
    isAuthenticated.value = false
  }
  return { isAuthenticated, login, logout }
}
