import { genPic, genUrl, transformIntoFormData } from "../utils";
import { readBody } from "h3";

import { TOKEN_KEY, UPLOAD_USER_IMG } from "constant/index";
import { GetUserDataSuccess, GetUserMsg } from "../../types";
import { getFile } from "../cos";
import { encrypt } from "../crypto";

export default defineEventHandler(async (event) => {
  const url = genUrl("/user/user_data");

  const body = await readBody(event);

  const formData = transformIntoFormData({});

  const token = body.token;

  try {
    const res: GetUserMsg = await $fetch(url, {
      method: "post",
      body: formData,
      headers: { ...formData.getHeaders(), [TOKEN_KEY]: token },
    });

    if (res?.success) {
      const data = (res?.data as GetUserDataSuccess).Success;
      data.id = encrypt(data?.id || '');
      data.pic = await genPic(UPLOAD_USER_IMG, data.pic);
    }
    return res;
  } catch (error) {
    console.error("get user msg error", error);
    return {
      success: false,
      data: null,
      rt: "Fail",
      msg: "获取用户信息失败",
    };
  }
});
