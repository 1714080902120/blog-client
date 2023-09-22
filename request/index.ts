// for client

import {
  GET_ARTICLE,
  SEARCH,
  LOGIN,
  REGISTRY,
  RESET_PWD,
  DEL_ARTICLE,
  UPLOAD,
  SEND_PWD_MAIL,
  GET_USER_ARTICLES,
  SET_ARTICLE,
  SEND_EMAIL,
  POST_ERROR,
} from "constant/fetchUrl";

import type {
  FormData,
  LoginRes,
  RegistryRes,
  Article,
  DeleteArticleRes,
  SetArticleData,
} from "@/types/index";

import { useUserMsg } from "store/user";

export async function getArticles(params = {}): Promise<Article[]> {
  const { page_no, limit, all = true, id = -1 } = params as any;
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

export async function searchArticles(params = {}): Promise<Article[]> {
  const { condition, page_no, limit, all = true } = params as any;
  return await $fetch(SEARCH, {
    method: "get",
    params: {
      all,
      limit,
      page_no,
      condition,
    },
  });
}

export function reqFnForIndex(isFromSearch = false) {
  return isFromSearch ? searchArticles : getArticles;
}

export async function login(body: {
  name: string;
  pwd: string;
}): Promise<LoginRes> {
  return await $fetch(LOGIN, {
    method: "post",
    body,
  });
}

export async function register(body: FormData): Promise<RegistryRes> {
  return await $fetch(REGISTRY, {
    method: "post",
    body,
  });
}

export async function sendEmail(body: any): Promise<any> {
  return await $fetch(SEND_EMAIL, {
    method: "post",
    body,
  });
}

export async function sendResetPwdEmail(body: {
  email: string;
  pwd: string;
}): Promise<any> {
  return await $fetch(SEND_PWD_MAIL, {
    method: "post",
    body,
  });
}

export async function delArticle(id: string): Promise<DeleteArticleRes> {
  return await $fetch(DEL_ARTICLE, {
    method: "GET",
    params: {
      id,
    },
  });
}

export async function toUploadFile(body: any, headers?: any): Promise<any> {
  return await $fetch(UPLOAD, {
    method: "POST",
    body,
    headers,
  });
}

export async function getUserArticles(
  isPublish = true,
  id: string = ""
): Promise<any> {
  const userMsg = useUserMsg();
  const instance = userMsg.getTargetArticlesList(isPublish);
  const list = await $fetch(GET_USER_ARTICLES, {
    method: "POST",
    body: {
      pageNo: instance.pageNo,
      limit: instance.limit,
      id,
      all: !id,
      isPublish,
    },
  });

  if (isPublish !== userMsg.isPub) {
    userMsg.updateIsPubState(isPublish);
  }

  userMsg.setArticles(list);
}

export async function setArticle(body: any): Promise<any> {
  return await $fetch(SET_ARTICLE, {
    method: "POST",
    body,
  });
}

export async function postErrorMsg(body: any): Promise<any> {
  return await $fetch(POST_ERROR, {
    method: "POST",
    body,
  });
}
