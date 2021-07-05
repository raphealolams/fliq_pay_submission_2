import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/session.service";

const ADMIN_ROLES = ["admin", "agent"];
const USER_ROLES = ["user"];
export const requiresUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");
  if (!user || !USER_ROLES.includes(user.role)) {
    return res.status(401).send({
      status: false,
      code: 401,
      message: "Unauthorized",
      data: {},
    });
  }

  return next();
};

export const requiresAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");

  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return res.status(401).send({
      status: false,
      code: 401,
      message: "Unauthorized",
      data: {},
    });
  }

  return next();
};

export const requiresBoth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = get(req, "user");
  const both = USER_ROLES.concat(ADMIN_ROLES);
  if (!user || !both.includes(user.role)) {
    return res.status(401).send({
      status: false,
      code: 401,
      message: "Unauthorized",
      data: {},
    });
  }

  return next();
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 * @author verifies the jwt token
 * @author Add the new access token to the response header
 */
export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);
  if (decoded) {
    // @ts-ignore
    req.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);

      const { decoded } = decode(newAccessToken);

      // @ts-ignore
      req.user = decoded;
    }

    return next();
  }

  return next();
};
