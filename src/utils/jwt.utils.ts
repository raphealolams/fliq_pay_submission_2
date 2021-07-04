import jwt from "jsonwebtoken";
import config from "../config";

const privateKey = config.jwtConfig.privateKey

export function sign(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, 'privateKey', options);
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, 'privateKey');
    return { valid: true, expired: false, decoded };
  } catch (error) {
    console.log(error)

    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}