import { GET_ARTICLE, SEARCH } from "@/constant/fetchUrl";

export async function getArticles(params = {}) {
  const { page_no, limit, all = true, id = -1 } = params as any
  return await $fetch(GET_ARTICLE, {
    method: "get",
    params: {
      all,
      id,
      limit,
      page_no,
    },
  });
}

export async function searchArticles(params = {}) {
  const { condition, page_no, limit, all = true } = params as any
  return await $fetch(SEARCH, {
    method: "get",
    // TODO 待调整接口支持分页
    // params: {
    //   all,
    //   limit,
    //   page_no,
    // },
    params: {
      condition,
    }
  });
}

export function reqFnForIndex (isFromSearch = false) {
  return isFromSearch ? searchArticles : getArticles
}
