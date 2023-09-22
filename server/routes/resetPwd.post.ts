import {
  genPic,
  genUrl,
  setTokenToCookie,
  transformIntoFormData,
} from "../utils";

import { TOKEN_KEY, UPLOAD_USER_IMG } from "constant/index";
import { GetUserDataSuccess, GetUserMsg, RtData } from "../../types";
import { decrypt } from "../crypto";

export default defineEventHandler(async (event) => {
  const { email, pwd } = await readBody(event);

  try {
    const url = genUrl("/user/reset_pwd");

    const formData = transformIntoFormData({
      email,
      pwd: decrypt(pwd),
    });

    const res = await $fetch.raw(url, {
      method: "post",
      body: formData,
      headers: formData.getHeaders(),
    });
    const rawData = res._data as RtData<"Fail" | null>;
    if (!rawData.success) {
      return {
        ...rawData,
        msg: "修改密码失败...请确认密码是否符合规则",
      };
    } else {
      return {
        success: true,
        rt: 'ResetPwdSuccess',
        msg: '修改密码成功~',
        token: res.headers.get(TOKEN_KEY) as string
      }
    }
  } catch (error) {
    console.error("something went wrong when reset pwd", error);
    return {
      success: false,
      rt: "Fail",
      data: "Fail",
      msg: "内部错误",
    };
  }
});
