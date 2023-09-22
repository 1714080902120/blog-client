import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export type SendEmailOpt = {
  email: string;
  title: string;
  msg: string;
};

const { EMAIL, EMAIL_PWD, EMAIL_SECURE, EMAIL_HOST, EMAIL_PORT } = process.env;

const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE, // use SSL
  auth: {
    user: EMAIL,
    pass: EMAIL_PWD,
  },
});

let state = true;

transporter.verify((err, success) => {
  if (success) {
    console.log("email transporter is ready");
  } else {
    state = false;
    console.error("email transporter create fail", err);
  }
});

export function sendEmail(
  sendEmailOpt: SendEmailOpt
): Promise<SMTPTransport.SentMessageInfo> {
  return new Promise((resolve, reject) => {
    if (!state) {
      reject("系统错误，无法发送邮件");
      return;
    }
    const { email, title, msg } = sendEmailOpt;
    transporter
      .sendMail({
        from: EMAIL,
        to: email,
        subject: title,
        html: msg,
        headers: {
          'Access-Control-Allow-Credentials' : 'true',
          'Access-Control-Allow-Origin':'*',
          'Access-Control-Allow-Methods':'GET',
          'Access-Control-Allow-Headers':'application/json',
          "MIME": 'text/plain'
        }
      })
      .then((res) => resolve(res))
      .catch((err) => {
        console.log(err);
        reject("系统错误，无法发送邮件");
      });
  });
}
