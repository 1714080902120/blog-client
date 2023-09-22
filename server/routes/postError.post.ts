import { INTERAL_ERROR_RETURN } from "~/constant";
import { genUrl, transformIntoFormData } from "../utils";
import { sendEmail } from "../mail";

const { SELF_EMAIL } = process.env;

// TODO 搞一个后台管理,以及一个表用来存储反馈信息
export default defineEventHandler(async (event) => {
  const { email, msg } = await readBody(event);

  try {
    const url = genUrl("/set_feedback");

    const formData = transformIntoFormData({ email, msg, state: 0, id: '' });

    const res = await $fetch(url, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    sendEmail({
      email: SELF_EMAIL as string,
      title: "有人反馈了问题",
      msg: `用户: ${email} 向你反馈了问题,请前往后台查看`,
    });

    return res;
  } catch (error) {
    console.error('something went wrong when post feedback', error);
    return INTERAL_ERROR_RETURN;
  }
});
