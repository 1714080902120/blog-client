import {
  genPic,
  genUrl,
  setTokenToCookie,
  transformIntoFormData,
} from "../utils";
import { readBody } from "h3";

import { TOKEN_KEY, UPLOAD_USER_IMG } from "constant/index";
import { GetUserMsg, GetUserDataSuccess } from "../../types";

export default defineEventHandler(async (event) => {
  const url = genUrl("/user/register");

  const body = await readBody(event);
  const { name, pwd, email, desc, pic = "" } = body;

  const formData = transformIntoFormData({
    name,
    pwd,
    email,
    desc,
    phone: "",
    pic,
  });

  try {
    const res = await $fetch.raw(url, {
      method: "post",
      body: formData,
      headers: formData.getHeaders(),
    });

    const rawData = res?._data as GetUserMsg;
    if (rawData?.success) {
      rawData.msg = `注册成功~`;
      const data = (rawData?.data as GetUserDataSuccess)?.Success;
      data?.user_id && (data.user_id = "-");
      data.pic = await genPic(UPLOAD_USER_IMG, data.pic);

      setTokenToCookie(event, res.headers.get(TOKEN_KEY) as string);
    }

    return rawData;
  } catch (error) {
    console.error('something went wrong when register', error);
    return {
      success: false,
      data: 'Fail',
      rt: 'Fail',
      msg: '内部错误'
    }
  }
});
