import { removeCookie } from "../utils";

export default defineEventHandler(async (event) => {
  removeCookie(event);
});
