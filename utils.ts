import { TOKEN_KEY } from "@/constant/index";
import { setCookie, getCookie, deleteCookie } from "h3";
import type { H3Event } from "h3";
import FormData from "form-data";
import { getFile } from "./cos";

const { API_BASE, COS_DOMAIN } = process.env;

export function genUrl(relativePath: string) {
  return `${API_BASE}/${relativePath}`;
}

export function setTokenToCookie(event: H3Event, token: string) {
  try {
    setCookie(event, TOKEN_KEY, token, {
      maxAge: 24 * 60 * 60,
      httpOnly: true,
    });
  } catch (error) {
    console.error("set token to cookie fail", error);
  }
}

export function getTokenFromCookie(event: H3Event) {
  return getCookie(event, TOKEN_KEY);
}

export function removeCookie(event: H3Event) {
  deleteCookie(event, TOKEN_KEY);
}

export function transformIntoFormData(body: Record<string, any>) {
  const formData = new FormData();
  for (const key in body) {
    const element = body[key];
    formData.append(key, `${element}`);
  }
  return formData;
}

export async function genPic(type: 0 | 1 | 2, filename: string) {
  if (!filename) return "";
  return await getFile({ type, filename });
}

const mdImgUrlRegexp = /\!\[.*?\]\((.*?)\)/g;

export function getImageUrlFromMdImg(
  content: string
): Array<{ originUrl: string | null; filename: string | null }> {
  const matches = content.matchAll(mdImgUrlRegexp) || [];

  return [...matches].map((item) => {
    const originUrl = item[1];
    const filename = originUrl ? getMdArticleImgName(originUrl) : null;
    return {
      originUrl,
      filename,
    };
  });
}

// 调整最新路径
const imageUrlRegExp = new RegExp(
  `https:\/\/${COS_DOMAIN}\/article_img\/(.*?\.\w+)`
);

export function getMdArticleImgName(content: string): string | null {
  const match = content.match(imageUrlRegExp) || [];
  return match[1];
}
