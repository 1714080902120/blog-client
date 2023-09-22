import { useUserMsg } from "store/user";

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/") {
    return navigateTo("/page-0");
  } else if (to.path === "/profile") {
    if (process.client) {
      const userMsg = useUserMsg();
      if (userMsg.isLogin) {
        return navigateTo("/profile/article-list");
      } else {
        return navigateTo("/page-0");
      }
    }
  }
});
