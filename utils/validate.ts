import { ValidateType } from "types";

const email_reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const pwd_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const TYPE_DICT = {
  email: doValidEmail,
  pwd: doValidPwd,
  secPwd: doValidSecPwd
}

function isEmpty (value: string) {
  return value.length <= 0;
}


function doValidEmail (value: string) {
  return email_reg.test(value) ? '' : `无效的邮箱地址！`
}

function doValidPwd (value: string) {
  return pwd_reg.test(value) ? '' : `密码至少八位且至少包含一个大写字母、小写字母和数字`
}

function doValidSecPwd (value: string, other: string) {
  return value === other ? '' : `两次密码不相同！`
}

export function formatValidateData (form: Record<string, any>, spec: Record<string, () => any> = {}) {
  const arr = []
  for (const type in form) {
      const value = form[type];
      const data = spec[type] ? (spec[type]()) : {};
      arr.push({ type, value, ...data })
  }
  return arr
}

export default function validate (arr: Array<{ type: ValidateType, value: string, other?: any, isNeed?: boolean }> = []): string {
  for (let i = 0; i < arr.length; i++) {
    const { type, value, other, isNeed = true } = arr[i];
    if (isNeed && isEmpty(value)) {
      return `必填项不允许为空`
    }
    const fn = TYPE_DICT[type]
    if (fn) {
      const res = fn(value, other)
      if (res) return res;
    }
  }
  return ''
}
