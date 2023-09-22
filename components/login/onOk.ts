import validate, { formatValidateData } from "utils/validate";
import type { RtData, FormData, OkFnType } from "@/types/index";
import { register, login, sendResetPwdEmail } from "@/request/index";

import { IS_LOGIN, IS_REGISTRY, IS_FORGET_PWD } from "constant/index";

const genFailRes = (msg: string): RtData<null> => ({
  success: false,
  rt: -1,
  data: null,
  msg,
});

const handleLogin = async (formData: FormData) => {
  const { name, pwd } = formData;
  const validateRes = validate(formatValidateData({ email: name, pwd }));
  if (validateRes) return genFailRes(validateRes);

  try {
    const res = await login({ name, pwd });
    return res;
    
  } catch (error) {
    console.error("something went wrong when register");
    return genFailRes(`内部错误`);
  }
};

const handleRegistry = async (formData: FormData) => {
  const { pwd } = formData;
  const validateRes = validate(
    formatValidateData(
      { ...formData },
      { secPwd: () => ({ other: pwd }), desc: () => ({ isNeed: false }), pic: () => ({ isNeed: false }) }
    )
  );
  if (validateRes) return genFailRes(validateRes);
  try {
    const res = await register(formData);
    return res;
  } catch (error) {
    console.error("something went wrong when register");
    return genFailRes(`内部错误`);
  }
};

const handleResetPwd = async (formData: FormData): Promise<RtData<any>> => {
  const { pwd, secPwd, email } = formData;
  const validateRes = validate(
    formatValidateData({ pwd, secPwd, email }, { secPwd: () => ({ other: pwd }) })
  );
  if (validateRes) return genFailRes(validateRes);

  try {
    const res = await sendResetPwdEmail({ email, pwd });
    return res;
  } catch (error) {
    return {
      success: false,
      data: null,
      rt: -1,
      msg: '内部错误'
    }
  }


};

export const okFnType: OkFnType = {
  [IS_LOGIN]: handleLogin,
  [IS_REGISTRY]: handleRegistry,
  [IS_FORGET_PWD]: handleResetPwd,
};
