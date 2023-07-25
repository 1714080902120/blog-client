import { genUrl } from "../utils";
import { decrypt } from "../crypto";

export default defineEventHandler(async (event) => {
  const { context } = event;
  const { article_id, author_id } = getQuery(event)
  const url = genUrl("/md");
  const md = await $fetch(url, {
    method: "get",
    params: {
      file_path: `${decrypt(author_id as string)}/${article_id}.md`,
    },
  });
  return md;
});
