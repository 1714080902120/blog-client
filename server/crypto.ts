import {
  randomFillSync,
  scryptSync,
  createCipheriv,
  createDecipheriv,
} from "crypto";

const { SECRET_KEY } = process.env;


const algorithm = "aes-192-cbc";
const password = SECRET_KEY as string;
const iv = Buffer.alloc(16, 0);
const key = scryptSync(password, "salt", 24);


export function encrypt(data: string) {
  try {

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.log(error);
    throw new Error("encrypt error");
  }
}

export function decrypt(data: string) {
  try {
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted
  } catch (error) {
    console.log(error);
    throw new Error("encrypt error");
  }
}
