export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware for login page
  if (to.path === '/login') return

  const { isAuthenticated, canAccess } = useAuth()

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Redirect to dashboard if accessing an unauthorized route
  if (!canAccess(to.path)) {
    return navigateTo('/')
  }
})
