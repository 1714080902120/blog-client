import { TOKEN_KEY } from "../../constant";
import { DeleteArticleRes } from "../../types";
import { genUrl, getTokenFromCookie } from "../utils";

export default defineEventHandler(async (event) => {
  const url = genUrl("/user/del_article");

  const { id } = getQuery(event);

  const res: DeleteArticleRes = await $fetch(url, {
    method: "DELETE",
    params: {
      id,
    },
    headers: {
      ...getHeaders(event),
      [TOKEN_KEY]: getTokenFromCookie(event),
    } as Record<string, string>,
  });

  return res

});
