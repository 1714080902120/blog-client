import {
  GET_USER_MSG,
  RESET_PWD,
} from "constant/fetchUrl";
import { TOKEN_KEY } from "constant/index";
import { getCookie, getQuery, setCookie } from "h3";
import type { H3Event } from "h3";
import {  GetUserDataSuccess, route } from "types";

import { initDetail } from "./pagesInit/articleDetail";
import { initIndex } from "./pagesInit/indexPage";
import { initProfile } from "./pagesInit/profile";

const routes = [initIndex, initDetail, initProfile, initResetPwd];


async function matchRoute(path: string, nuxtApp: any) {
  for (let i = 0; i < routes.length; i++) {
    const { isMatched, fn } = routes[i](path);
    if (isMatched) {
      return await fn(nuxtApp);
    }
  }
}


function initResetPwd(path: string): route {
  return {
    isMatched: path.includes("resetPwd"),
    fn: async (nuxtApp: any) => {
      const { email, pwd } = getQuery(nuxtApp.ssrContext.event);
      const res = await $fetch(RESET_PWD, {
        method: "post",
        body: { email, pwd },
      });
      const { useTips } = await import("store/state");
      const tips = useTips();
      tips.setTip(res.msg as string);
      if (res.success) {
        // @ts-ignore
        const token = res.token;
        setCookie(nuxtApp.ssrContext.event, TOKEN_KEY, token, {
          maxAge: 24 * 60 * 60,
        });
      }
    },
  };
}

async function getUserMsg(event: H3Event) {
  const token = getCookie(event, TOKEN_KEY);
  if (token) {
    const res = await $fetch(GET_USER_MSG, { method: "post", body: { token } });
    if (res?.success) {
      const { useUserMsg } = await import("store/user");
      const userMsg = useUserMsg();

      userMsg.setUserMsg({
        ...((res?.data as GetUserDataSuccess)?.Success || {}),
      });
    }
  }
}

async function redirectIfIsResetPwd(path: string) {
  if (path?.includes("resetPwd")) {
    const { useTips } = await import("store/state");
    const tip = useTips().tip;
    if (tip) {
      // TODO 无奈之举，待优化
      window.sessionStorage.setItem("reset_pwd_tip", tip);
    }
    window.open("/", "_self");
  }
}


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:created", async () => {

    const { ssrContext, payload } = nuxtApp;
    // determine that it is server
    if (process.server && ssrContext) {
      // no need to await
      await getUserMsg(ssrContext?.event);
      // only for index.vue
      const path = payload.path || "/";
      await matchRoute(path, nuxtApp);
    } else {
      const { useGlobalState } = await import("store/state");

      if (useGlobalState().notAuth) {
        window.open("/", "_self");
        return;
      }
      await redirectIfIsResetPwd(payload.path || "");
    }
  });
});
