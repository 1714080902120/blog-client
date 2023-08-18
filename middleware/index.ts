export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') {
    return navigateTo('/page-0')
  }
})
