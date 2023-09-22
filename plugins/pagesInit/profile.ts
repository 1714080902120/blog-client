import { getCookie, getQuery } from "h3";
import {
  PROFILE_ARTICLE_LIST,
  PROFILE_ARTICLE_EDIT,
  TOKEN_KEY,
  INTERAL_ERROR_RETURN,
} from "constant";
import { GET_ARTICLE_DETAIL, GET_MD, GET_USER_ARTICLES } from "constant/fetchUrl";
import { ArticleDetail, route } from "types";
const profilePageRegExp = /\/profile\/([A-Za-z0-9-]+)/;

const pageInitDict: Record<string, (opts: Record<string, any>) => void> = {
  [PROFILE_ARTICLE_EDIT]: initArticleEditPage,
  [PROFILE_ARTICLE_LIST]: initDefaultPage,
};

export function initProfile(path: string): route {
  return {
    isMatched: path.includes("/profile"),
    fn: async (nuxtApp: any) => {
      const token = getCookie(nuxtApp.ssrContext.event, TOKEN_KEY);

      if (token) {
        const pageNameMatch = path.match(profilePageRegExp);

        let pageName = PROFILE_ARTICLE_LIST;
        if (pageNameMatch && pageNameMatch[1]) {
          pageName = pageNameMatch[1];
        }

        const fn = pageInitDict[pageName] || initDefaultPage;
        await fn({ token, event: nuxtApp?.ssrContext?.event });
      } else {
        const { useGlobalState } = await import("store/state");
        useGlobalState().setIsNotAuth(true);
      }
    },
  };
}

// 初始化各人中心页面
async function initDefaultPage(opts: Record<string, any>) {
  const { token } = opts || {};
  const { useUserMsg } = await import("store/user");
  const userMsg = useUserMsg();
  const instance = userMsg.getTargetArticlesList(true);
  const res = await $fetch(GET_USER_ARTICLES, {
    method: "POST",
    body: {
      all: true,
      id: -1,
      pageNo: instance.pageNo,
      limit: instance.limit,
      isPublish: true,
      token,
    },
  });

  userMsg.setArticles(res);
}

// 初始化编辑页面
async function initArticleEditPage(opts: Record<string, any>) {
  const { event, token } = opts || {};
  const { id = "" } = getQuery(event);

  try {
    const res = await $fetch(GET_ARTICLE_DETAIL, {
      method: "get",
      params: {
        id,
        needEncrypt: false
      },
    });

    if (res?.success) {
      const { useUserMsg } = await import('store/user')
      const userMsg = useUserMsg();
      const data = res?.data?.Success || {};

      const { author_id = '' } = data as ArticleDetail;

      const content = await $fetch(GET_MD, {
        method: 'GET',
        params: {
          article_id: id,
          author_id,
          needDecrypt: false,
        }
      })
      
      userMsg.updateEditFormData({ ...(data as Record<string, string>), content })

    } else {
      return INTERAL_ERROR_RETURN;
    }
  } catch (error) {
    console.error("someting went wrong when get user editing article", error);
    return INTERAL_ERROR_RETURN;
  }
}
