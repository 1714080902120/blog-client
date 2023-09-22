import { SearchUserData } from "~/types";
import { genUrl, transformIntoFormData } from "../utils";
import { sendEmail } from "../mail";
import { encrypt } from "../crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { pwd, email } = body;

  try {
    // 第一步先校验是否存在这个邮箱
    const checkRes: SearchUserData = await $fetch(genUrl("/user/search_user"), {
      method: "POST",
      body: transformIntoFormData({ keyword: email }),
    });

    if (!checkRes.success) {
      checkRes.msg = "查询不到对应邮箱地址，请确认是否有误";
      return checkRes;
    }
  } catch (error) {
    console.error("something went wrong when search email", error);
    return {
      succcess: false,
      rt: "Fail",
      data: "Fail",
      msg: "内部错误",
    };
  }

  try {
    const { origin } = getHeaders(event);

    const link = `${origin}/resetPwd?email=${email}&pwd=${encrypt(pwd)}`;
    const msg = `
      <div style="padding-top: 20px;">
        请点击以下链接：<a style="text-decoration: underline;" href="${link}">🍉点我~</a>
        <br/>
        <div>如果无法点击，请手动复制以下链接到浏览器中（切勿暴露给别人）：
          <br/>
          <span>${link}</span>
        </div>
      </div>
    `;
    const sendRes = await sendEmail({ email, title: "🍁修改密码", msg });

    return {
      success: true,
      rt: "Success",
      data: sendRes,
      msg: "邮件已发送至您的邮箱~",
    };
  } catch (error) {
    return {
      succcess: false,
      rt: "Fail",
      data: "Fail",
      msg: error || "内部错误",
    };
  }
});
