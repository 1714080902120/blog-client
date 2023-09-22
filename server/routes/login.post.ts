import {
  genPic,
  genUrl,
  setTokenToCookie,
  transformIntoFormData,
} from "../utils";

import { TOKEN_KEY, UPLOAD_USER_IMG } from "constant/index";
import { GetUserDataSuccess, GetUserMsg } from "../../types";

export default defineEventHandler(async (event) => {
  const { name: user_key, pwd: user_pwd } = await readBody(event);
  const url = genUrl("/user/login");

  const formData = transformIntoFormData({
    user_key,
    user_pwd,
  });
  try {
    const res = await $fetch.raw(url, {
      method: "post",
      body: formData,
      headers: formData.getHeaders(),
    });
    const rawData = res?._data as GetUserMsg;
    if (rawData?.success) {
      rawData.msg = `登录成功~`
      const data = (rawData?.data as GetUserDataSuccess)?.Success;
      data?.user_id && (data.user_id = "-");
  
      data.pic = await genPic(UPLOAD_USER_IMG, data.pic);
      
      setTokenToCookie(event, res.headers.get(TOKEN_KEY) as string);
    }
  
    return rawData;
  } catch (error) {
    console.error('something went wrong when login', error)
    return {
      success: false,
      rt: 'Fail',
      data: 'Fail',
      msg: '内部错误'
    }
  }


});
