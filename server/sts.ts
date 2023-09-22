// 用前端传文件给服务器再上传的方案，这样就不需要临时签名了

// export type Action =
//   // 简单上传
//   | "name/cos:PutObject"
//   | "name/cos:PostObject"
//   // 分片上传
//   | "name/cos:InitiateMultipartUpload"
//   | "name/cos:ListMultipartUploads"
//   | "name/cos:ListParts"
//   | "name/cos:UploadPart"
//   | "name/cos:CompleteMultipartUpload";

// const STS = require("qcloud-cos-sts");

// const { COS_BUCKET, COS_REGION, COS_SECRET_ID, COS_SECRET_KEY } = process.env;

// // 配置参数
// const config = {
//   secretId: COS_SECRET_ID,
//   secretKey: COS_SECRET_KEY,
//   durationSeconds: 1800, // 密钥有效期
//   proxy: "",
//   bucket: COS_BUCKET,
//   region: COS_REGION,
//   allowPrefix: "*",
// };

// // const shortBucketName = config?.bucket?.substring(
// //   0,
// //   config.bucket.lastIndexOf("-")
// // );
// // const appId = config?.bucket?.substring(1 + config.bucket.lastIndexOf("-"));
// // const policy = {
// //   version: "2.0",
// //   statement: [
// //     {
// //       action: [
// //         // 简单上传
// //         "name/cos:PutObject",
// //         "name/cos:PostObject",
// //         // 分片上传
// //         "name/cos:InitiateMultipartUpload",
// //         "name/cos:ListMultipartUploads",
// //         "name/cos:ListParts",
// //         "name/cos:UploadPart",
// //         "name/cos:CompleteMultipartUpload",
// //       ],
// //       effect: "allow",
// //       principal: { qcs: ["*"] },
// //       resource: [
// //         "qcs::cos:" +
// //           config.region +
// //           ":uid/" +
// //           appId +
// //           ":prefix//" +
// //           appId +
// //           "/" +
// //           shortBucketName +
// //           "/" +
// //           config.allowPrefix,
// //       ],
// //     },
// //   ],
// // };

// export function getCredential(action: Action): Promise<any> {
//   const scope = [
//     {
//       action,
//       bucket: config.bucket,
//       region: config.region,
//       prefix: "*",
//     },
//   ];
//   const policy = STS.getPolicy(scope);
//   return new Promise((resolve, reject) => {
//     STS.getCredential(
//       {
//         secretId: config.secretId,
//         secretKey: config.secretKey,
//         proxy: config.proxy,
//         policy: policy,
//         durationSeconds: config.durationSeconds,
//       },
//       (err: any, credential: any) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve({
//             ExpiredTime: new Date().getTime() + config.durationSeconds * 1000,
//             credential,
//           });
//         }
//       }
//     );
//   });
// }
